import {Router} from 'express';
import passport from 'passport';

//****************************************************************************//
//                                                                            //
// Main view router                                                           //
//                                                                            //
//****************************************************************************//


export function createMainViewRouter() {
  return new Router(passport)
    .get('/', renderSalasana)
    .get('/home', renderHome)
    .get('/user', passport.authenticate('melinda', {session: false}), renderUser);


  function renderSalasana(req, res) {
    // const {user} = req.oidc;
    const user = {id: 'test'};
    const renderedView = 'salasana';
    const localVariable = {title: 'Salasana', username: user.id, location: {name: 'Salasana', link: '/'}, onload: 'initialize()'};

    return res.render(renderedView, localVariable);
  }


  function renderHome(req, res) {
    // const {user} = req.oidc;
    const user = {id: 'test'};

    const renderedView = 'homepage';
    const localVariable = {title: 'Etusivu | Salasana', username: user.id, location: {name: 'Etusivu', link: '/home'}};

    return res.render(renderedView, localVariable);
  }


  function renderUser(req, res) {
    // const {user} = req.oidc;
    const user = {id: 'test'};

    console.log(JSON.stringify(user));
    console.log(JSON.stringify(req.headers));

    const renderedView = 'user';
    const localVariable = {title: 'Käyttäjäprofiili | Salasana', user, username: user.id, location: {name: 'Käyttäjäprofiili', link: 'user'}};

    return res.render(renderedView, localVariable);
  }


}
