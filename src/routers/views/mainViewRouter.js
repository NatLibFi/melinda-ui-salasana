import {Router} from 'express';

//****************************************************************************//
//                                                                            //
// Main view router                                                           //
//                                                                            //
//****************************************************************************//


export function createMainViewRouter(passport) {
  return new Router()
    .get('/', authCheck({successRedirects: '/home', allowUnauthorized: true}), renderLogin)
    .get('/home', authCheck({failureRedirects: '/'}), renderSalasana);

  function renderLogin(req, res) {
    const renderedView = 'login';
    const localVariable = {title: 'Kirjaudu | Salasana', location: {name: 'Kirjaudu', link: '/'}, onload: 'initializeLogin()'};

    return res.render(renderedView, localVariable);
  }

  function renderSalasana(req, res) {
    const renderedView = 'salasana';
    const username = req.user.displayName || req.user.id || 'melinda-user';
    const localVariable = {title: 'Vaihda salasana | Salasana', username, location: {name: 'Vaihda salasana', link: '/home'}, onload: 'initializeSalasana()'};

    return res.render(renderedView, localVariable);
  }

  /**
   * Authentication check using JWT strategy and handle redirection based on the result
   *
   * @param {object} [params={}]
   * @param {string} [params.failureRedirects] - url path to redirect to when error or no userdata after authentication
   * @param {string} [params.successRedirects] - url path to redirect to when authentication is successfull and accepted
   * @param {boolean} [params.allowUnauthorized=false] - option to give not logged in users access to, used for example with /login making sure authorized users dont get access to login again
   * @returns {Function} - middleware function to handle auth and reroroute
   *
   * @example
   * // Use without any redirection options, unauth unauthorized sends unauthorized response
   * app.get('/', authCheck(), (req, res) => {
   *     res.sendStatus(HttpStatus.OK);
   * });
   *
   * @example
   * // Redirect to /login if authentication fails
   * app.get('/', authCheck({ failureRedirect: '/login' }), (req, res) => {
   *     res.sendStatus(HttpStatus.OK);
   * });
   *
   * @example
   * // Redirect to /dashboard if authentication succeeds
   * app.get('/', authCheck({ successRedirect: '/dashboard' }), (req, res) => {
   *     res.sendStatus(HttpStatus.OK);
   * });
   *
   * @example
   * // Redirect to /login if authentication fails, and to /dashboard if authentication succeeds
   * app.get('/', authCheck({ failureRedirect: '/login', successRedirect: '/dashboard' }), (req, res) => {
   *     res.sendStatus(HttpStatus.OK);
   * });
   *
   */
  function authCheck(params = {}) {
    const {failureRedirects, successRedirects, allowUnauthorized = false} = params;
    return (req, res, next) => {
      passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err || !user) {
          if (failureRedirects) {
            return res.redirect(failureRedirects);
          }
          if (allowUnauthorized) {
            return next();
          }
          return res.status(401).send('Unauthorized');
        }

        //make sure useradata is included in req
        req.user = user;

        if (successRedirects) {
          return res.redirect(successRedirects);
        }

        return next();
      })(req, res, next);
    };
  }
}
