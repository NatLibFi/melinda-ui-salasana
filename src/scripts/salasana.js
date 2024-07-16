import {startProcess, stopProcess} from '/shared/scripts/progressbar.js';
import {eventHandled} from '/shared/scripts/uiUtils.js';
import {showSnackbar} from '/shared/scripts/snackbar.js';
import {changePassword} from "/scripts/callRest.js";

window.initializeSalasana = function () {
  console.log('Initializing Salasana');
  addFormHandlingEventListeners();
};

function addFormHandlingEventListeners() {
  const changeForm = document.getElementById('changePasswordForm');
  changeForm.addEventListener('submit', changeEvent);
}

async function changeEvent(event) {
  console.log('Change submit event');
  eventHandled(event);

  const form = document.getElementById('changePasswordForm');
  const formData = new FormData(form);
  const submitButton = document.getElementById('submitChangePassword');

  startProcess();
  try {
    submitButton.setAttribute('disabled', true);
    const {message = false} = await changePassword({currentPassword: formData.get('currentPassword'), newPassword: formData.get('newPassword'), newPasswordVerified: formData.get('newPasswordVerified')});
    console.log('password event responce got');
    if (message) {
      showSnackbar({style: 'alert', text: message});
      return;
    }

    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('newPasswordVerified').value = '';
    showSnackbar({style: 'success', text: 'Salasana on vaihdettu'});

    return;
  } catch (err) {
    showSnackbar({style: 'error', text: 'Sivu ei latautunut oikein, ole hyvä ja lataa sivu uudelleen.'});
    console.log(err);
  } finally {
    submitButton.removeAttribute('disabled');
    stopProcess();
  };
}
