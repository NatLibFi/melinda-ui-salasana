import httpStatus from 'http-status';
import {Router} from 'express';
import {generateAuthorizationHeader} from '@natlibfi/melinda-commons';
import {generateJwtToken} from '@natlibfi/passport-melinda-jwt';
import {appLogger} from '../../middlewares.js';
import {sanitaze, validatePassword} from '../../services/authService.js';

export function createAuthRouter(passport, jwtOptions, alephChangePasswordApiUrl) { // eslint-disable-line no-unused-vars
  const cookieNames = {userToken: 'melinda'};
  const isInProduction = process.env.NODE_ENV === 'production';// eslint-disable-line
  // schema: h * min * sec * ms
  const cookieAgeDevelopment = 12 * 60 * 60 * 1000;
  const cookieAgeProduction = 9 * 60 * 60 * 1000;
  const tokenCookieOptions = {
    httpOnly: true,
    SameSite: 'None',
    secure: isInProduction,
    maxAge: isInProduction ? cookieAgeDevelopment : cookieAgeProduction
  };

  return new Router()
    .post('/getBaseToken', getBaseToken)
    .post('/change', passport.authenticate('jwt', {session: false}), change)
    .get('/login', passport.authenticate('melinda', {session: false}), login)
    .get('/verify', passport.authenticate('jwt', {session: false}), verify)
    .get('/logout', passport.authenticate('jwt', {session: false}), logout);

  function getBaseToken(req, res) {
    appLogger.info('auth/ - create');
    const {username, password} = req.body;
    if (!username || !password) {
      res.status(500).json({error: 'username or password malformed or missing'});
      return;
    }
    const sanitazedUser = sanitaze(username);
    const authToken = generateAuthorizationHeader(sanitazedUser, password);
    res.json({token: authToken});
  }

  async function change(req, res) {
    appLogger.info('auth/change - change');
    const {id} = req.user;
    const {curPass, newPass, newPassVerify} = req.body;
    const validationResult = validatePassword(newPass, newPassVerify);

    if (validationResult.valid === false) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: validationResult.error
      });
    }

    const result = await changePassword(id, curPass, newPass);
    appLogger.debug(result);
    appLogger.debug(JSON.stringify(result));
    // const result = {status: 'ok'};
    res.status(httpStatus.OK).json(result);

    async function changePassword(id, curPass, newPass) {
      const fetchOptions = {
        method: 'POST',
        body: JSON.stringify({
          username: id,
          password: curPass,
          new_password: newPass
        }),
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        credentials: 'include'
      };

      const result = await fetch(alephChangePasswordApiUrl, fetchOptions);
      appLogger.info(result.status);
      return {};
    }
  }

  function login(req, res) {
    appLogger.info('auth/ - verifyBasic');
    const jwtToken = generateJwtToken(req.user, jwtOptions);
    res.cookie(cookieNames.userToken, jwtToken, tokenCookieOptions);
    res.status(httpStatus.OK).json(req.user);
  }

  function verify(req, res) {
    appLogger.info('auth/ - verifyJwt');
    const jwtToken = generateJwtToken(req.user, jwtOptions);
    res.cookie(cookieNames.userToken, jwtToken, tokenCookieOptions);
    res.status(httpStatus.OK).json(req.user);
  }

  function logout(req, res) {
    Object.keys(cookieNames).forEach(cookieKey => {
      const cookieName = cookieNames[cookieKey];
      res.clearCookie(cookieName);
    });
    res.redirect('/');
  }
}
