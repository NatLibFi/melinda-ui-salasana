import httpStatus from 'http-status';
import {generateAuthorizationHeader} from '@natlibfi/melinda-commons';
import {generateJwtToken} from '@natlibfi/passport-melinda-jwt';
import {Router} from 'express';
import {appLogger} from '../middlewares.js';
import {sanitaze, validatePassword} from '../services/authService.js';

export function createAuthRouter(passport, alephChangePasswordApiUrl, jwtOptions) { // eslint-disable-line no-unused-vars
  return new Router()
    .get('/verifyBasic', passport.authenticate('melinda', {session: false}), verifyBasic)
    .get('/verifyJwt', passport.authenticate('jwt', {session: false}), verifyJwt)
    .post('/', create)
    .post('/change', passport.authenticate('jwt', {session: false}), change);

  function verifyBasic(req, res) {
    appLogger.info('auth/ - verifyBasic');
    const {displayName, id, authorization} = req.user;
    const token = generateJwtToken({displayName, id, authorization}, jwtOptions);
    res.cookie('melinda', token, {httpOnly: true, SameSite: 'None', secure: process.env.NODE_ENV === "production", maxAge: 360000});
    res.status(httpStatus.OK).json(req.user);
  }

  function verifyJwt(req, res) {
    appLogger.info('auth/ - verifyJwt');
    const {displayName, id, authorization} = req.user;
    const token = generateJwtToken({displayName, id, authorization}, jwtOptions);
    res.cookie('melinda', token, {httpOnly: true, SameSite: 'None', secure: process.env.NODE_ENV === "production", maxAge: 360000});
    res.status(httpStatus.OK).json(req.user);
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

  function create(req, res) {
    appLogger.info('auth/ - create');
    const data = req.body;
    const sanitazedUser = sanitaze(data.username);
    const authToken = generateAuthorizationHeader(sanitazedUser, data.password);
    res.json({token: authToken});
  }
}