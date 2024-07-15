import {startProcess, stopProcess} from '/shared/scripts/progressbar.js';
import {eventHandled} from '/shared/scripts/uiUtils.js';
import {showSnackbar} from '/shared/scripts/snackbar.js';
import {changePassword} from "/scripts/callRest.js";

window.initializeSalasana = function () {
  console.log('Initializing Salasana');
  addFormHandlingEventListeners();
};

function addFormHandlingEventListeners() {
  const changeForm = document.getElementById('change');
  changeForm.addEventListener('submit', changeEvent);
}

async function changeEvent(event) {
  console.log('Change submit event');
  eventHandled(event);

  const form = document.getElementById('change');
  const formData = new FormData(form);
  const submitButton = document.getElementById('formChangePasswordSubmitButton');

  startProcess();
  try {
    submitButton.setAttribute('disabled', true);
    const {message = false} = await changePassword({currentPassword: formData.get('currentPassword'), newPassword: formData.get('newPassword'), newPasswordVerify: formData.get('newPasswordVerify')});
    console.log('password event responce got');
    if (message) {
      showSnackbar({style: 'error', text: message});
      return;
    }

    document.getElementById('changePasswordOrg').value = '';
    document.getElementById('changePasswordNew').value = '';
    document.getElementById('changePasswordVerify').value = '';
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
