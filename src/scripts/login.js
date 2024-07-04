import {authGetBaseToken, authLogin} from '/scripts/callRest.js';
import {startProcess, stopProcess} from '/shared/scripts/progressbar.js';
import {eventHandled} from '/shared/scripts/uiUtils.js';
import {showSnackbar} from '/shared/scripts/snackbar.js';

window.initializeLogin = function () {
  console.log('Initializing Login');

  //disable back button
  const goBackButton = document.getElementById('goBack');
  if (goBackButton) {goBackButton.style.display = 'none';}

  addFormHandlingEventListeners();
};

function addFormHandlingEventListeners() {
  const loginForm = document.getElementById('login');
  loginForm.addEventListener('submit', loginEvent);
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
    const {token} = await authGetBaseToken({username: formData.get('username'), password: formData.get('password')});
    const resp = await authLogin(token);
    location.reload();
  } catch (err) {
    console.log(err);
    showSnackbar({style: 'error', text: 'Käyttäjätunnus tai salasana on väärin'});
  } finally {
    stopProcess();
  };
}