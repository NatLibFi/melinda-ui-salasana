import {Router} from 'express';
import {authCheck} from '../../middlewares.js';

//****************************************************************************//
//                                                                            //
// Main view router                                                           //
//                                                                            //
//****************************************************************************//


export function createMainViewRouter(passport) {
  return new Router()
    .get('/', authCheck({successRedirects: '/home', allowUnauthorized: true}, passport), renderLogin)
    .get('/home', authCheck({failureRedirects: '/'}, passport), renderSalasana);

  function renderLogin(req, res) {
    const renderedView = 'login';
    const localVariable = {title: 'Kirjaudu | Salasana', location: {name: 'Kirjaudu', link: '/'}, onload: 'initializeLogin()'};

    return res.render(renderedView, localVariable);
  }

  function renderSalasana(req, res) {
    const renderedView = 'salasana';
    const username = req.user.displayName || req.user.id || 'melinda-user';
    const localVariable = {title: 'Vaihda salasana | Salasana', username, location: {name: 'Vaihda salasana', link: '/home'}, onload: 'initializeVaihto()'};

    return res.render(renderedView, localVariable);
  }


}
