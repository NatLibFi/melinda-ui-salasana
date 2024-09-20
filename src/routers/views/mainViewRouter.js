import {Router} from 'express';
import {createAuthHandler} from '../routerUtils/requestUtils/handleAuthentication.js';

//****************************************************************************//
//                                                                            //
// Main view router                                                           //
//                                                                            //
//****************************************************************************//


export function createMainViewRouter(passport) {
  const authHandler = createAuthHandler(passport);

  return new Router()
    .get('/', authHandler({failureRedirects: '/login'}), renderSalasana)
    .get('/login', authHandler({successRedirects: '/', allowUnauthorized: true}), renderLogin);


  function renderLogin(req, res) {
    const renderedView = 'loginpage';
    const localVariable = {title: 'Kirjaudu | Salasana', isLogin: true, onload: 'initialize()'};

    return res.render(renderedView, localVariable);
  }

  function renderSalasana(req, res) {
    const renderedView = 'salasana';
    const username = req.user.displayName || req.user.id || 'melinda-user';
    const localVariable = {title: 'Vaihda salasana | Salasana', username, onload: 'initialize()'};

    return res.render(renderedView, localVariable);
  }
}
