import express from 'express';
import {engine} from 'express-handlebars';
import path from 'path';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import {createExpressLogger} from '@natlibfi/melinda-backend-commons';

import {AlephStrategy} from '@natlibfi/passport-melinda-aleph';
import {MelindaJwtStrategy, verify, cookieExtractor} from '@natlibfi/passport-melinda-jwt';

import {createAuthRouter, createStatusRouter, createMainViewRouter} from './routers/routers.js';
import {appLogger, handleAppError, handlePageNotFound} from './middlewares.js';

/*****************************************************************************/
/* START THE APP                                                             */
/*****************************************************************************/

//////////////////////////////////////////////////////////////////
// The function startApp creates server and returns it.
// The parameter is a set of environment variables

export async function startApp(configOptions) {

  const {httpPort, enableProxy, sharedLocationOptions, xServiceURL, userLibrary, ownAuthzURL, ownAuthzApiKey, alephChangePasswordApiUrl, jwtOptions} = configOptions;

  const server = await initExpress();

  return server;

  //////////////////////////////////////////////////////////////////


  //----------------------------------------------------//
  // Defining the Express server

  // Add async when you need await in route construction

  async function initExpress() {

    //---------------------------------------------------//
    // Set the application as an Express app (function)

    const app = express();
    app.enable('trust proxy', Boolean(enableProxy));
    app.use(cookieParser());

    //---------------------------------------------------//
    // Setup Alpeh authentication with passport
    passport.use(new AlephStrategy({
      xServiceURL, userLibrary,
      ownAuthzURL, ownAuthzApiKey
    }));

    passport.use(new MelindaJwtStrategy({
      ...jwtOptions,
      secretOrKey: jwtOptions.secretOrPrivateKey,
      jwtFromRequest: cookieExtractor
    }, verify));

    app.use(passport.initialize());

    //---------------------------------------------------//
    // Setup Express Handlebars view engine

    const {sharedPartialsLocation, sharedPublicLocation, sharedViewsLocation} = sharedLocationOptions;

    const handlebarsOptions = {
      extname: '.hbs',
      defaultLayout: 'default',
      layoutsDir: path.join(import.meta.dirname, 'views/layouts'),
      partialsDir: [
        {dir: path.join(import.meta.dirname, 'views/partials'), namespace: 'localPartials'},
        {dir: path.join(import.meta.dirname, sharedPartialsLocation), namespace: 'sharedPartials'}
      ],
      helpers: {
        shared(param) {
          return param.startsWith('/')
            ? `/shared${param}`
            : `sharedPartials/${param}`;
        },
        object({hash}) {
          return hash;
        },
        array() {
          return Array.from(arguments).slice(0, arguments.length - 1);
        }
      }
    };

    app.engine('.hbs', engine(handlebarsOptions));

    app.set('view engine', '.hbs');

    app.set('views', [
      path.join(import.meta.dirname, 'views'),
      path.join(import.meta.dirname, sharedViewsLocation)
    ]);


    //---------------------------------------------------//
    // Setup Express logger

    app.use(createExpressLogger());


    //---------------------------------------------------//
    // Setup Express built-in middleware function 'express.urlencoded'
    // option extended is set as false:
    //    data is parsed with querystring library

    app.use(express.urlencoded({extended: false}));


    //---------------------------------------------------//
    // Setup Express built-in middleware function 'express.json'
    //    parses requests with JSON payload

    app.use(express.json());


    //---------------------------------------------------//
    // Setup Express built-in middleware function 'express.static'
    // The directory where static assets are served from is given as argument.

    app.use('/shared', express.static(path.join(import.meta.dirname, sharedPublicLocation)));
    app.use('/scripts', express.static(path.join(import.meta.dirname, 'scripts')));
    app.use('/styles', express.static(path.join(import.meta.dirname, 'styles')));

    //---------------------------------------------------//
    // Setup Express Routers for these defined routes
    //   - require authentication to all but status route

    app.use('/', createMainViewRouter(passport));
    app.use('/status', createStatusRouter());

    app.use('/rest/auth', createAuthRouter(passport, jwtOptions, alephChangePasswordApiUrl));

    app.use('/logout', passport.authenticate('jwt', {session: false}), (req, res) => {
      res.redirect('/rest/auth/logout');
    });

    //---------------------------------------------------//
    // Setup handling for all other routes
    // When page is not found:
    //    -catch 404 and forward to error handler

    app.use(handlePageNotFound);


    //---------------------------------------------------//
    // Setup Express error handler

    app.use(handleAppError);


    //----------------------------------------------------//
    // Setup server to listen for connections on the specified port

    return app.listen(httpPort, appLogger.log('info', `Started Melinda Salasana in port ${httpPort}`));

  }
}
