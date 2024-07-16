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
    .get('/', authHandler({successRedirects: '/home', allowUnauthorized: true}), renderLogin)
    .get('/home', authHandler({failureRedirects: '/'}), renderSalasana);

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
}
