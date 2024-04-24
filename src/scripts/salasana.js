import {startProcess, stopProcess} from '/shared/scripts/progressbar.js';
import {eventHandled} from '/shared/scripts/uiUtils.js';
import {showSnackbar} from '/shared/scripts/snackbar.js';
import {authRequest, changePassword, verifyBasic, verifyJwt} from "/scripts/rest.js";

window.initialize = function () {
  console.log('Initializing Salasana');
  checkIfAlreadyLoggedIn();
  addFormHandlingEventListeners();
};

async function checkIfAlreadyLoggedIn() {
  try {
    const user = await verifyJwt();
    console.log('cookie found and refreshed');
    return setTab('vaihto', user.id);

  } catch (error) {
    console.log('no cookie found');
    return setTab('salasana');
  }
}

function addFormHandlingEventListeners() {
  const loginForm = document.getElementById('login');
  loginForm.addEventListener('submit', loginEvent);

  const changeForm = document.getElementById('change');
  changeForm.addEventListener('submit', changeEvent);
}

async function loginEvent(event) {
  console.log('Login submit event');
  eventHandled(event);

  const termschecked = document.querySelector('#login #acceptterms').checked;
  if (!termschecked) {
    showSnackbar({style: 'error', text: 'Tietosuojaselosteen ja evästeiden käytön hyväksyminen vaaditaan'});

    return;
  }

  const form = document.getElementById('login');
  const formData = new FormData(form);

  startProcess();
  try {
    const {token} = await authRequest({username: formData.get('username'), password: formData.get('password')});
    const user = await verifyBasic(token);
    return setTab('vaihto', user.id);
  } catch (err) {
    console.log(err);
    showSnackbar({style: 'error', text: 'Käyttäjätunnus tai salasana on väärin'});
  } finally {
    stopProcess();
  };
}

async function changeEvent(event) {
  console.log('Change submit event');
  eventHandled(event);

  const form = document.getElementById('change');
  const formData = new FormData(form);

  startProcess();
  try {
    const {message} = await changePassword({curPass: formData.get('currentPassword'), newPass: formData.get('newPassword'), newPassVerify: formData.get('newPasswordVerify')});

    if (message) {
      showSnackbar({style: 'error', text: message});
      return;
    }

    document.getElementById('change-password-org').value = '';
    document.getElementById('change-password-new').value = '';
    document.getElementById('change-password-verify').value = '';
    showSnackbar({style: 'success', text: 'Salasana on vaihdettu'});

    return;
  } catch (err) {
    console.log(err);
  } finally {
    stopProcess();
  };
}

function setTab(tab, username = undefined) {
  const vaihto = document.getElementById('vaihto');
  const salasana = document.getElementById('salasana');
  const accountMenu = document.getElementById('accountMenu');
  const usernameDiv = document.getElementById('username');

  if (tab === 'vaihto') {
    vaihto.style.display = 'inline-flex';
    salasana.style.display = 'none';
    accountMenu.style.display = 'block';
    usernameDiv.innerHTML = username;
    return;
  }

  if (tab === 'salasana') {
    salasana.style.display = 'inline-flex';
    vaihto.style.display = 'none';
    accountMenu.style.display = 'none';
    return;
  }
}