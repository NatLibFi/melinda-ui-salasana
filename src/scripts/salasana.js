import {startProcess, stopProcess} from '/shared/scripts/progressbar.js';
import {eventHandled} from '/shared/scripts/uiUtils.js';
import {showSnackbar} from '/shared/scripts/snackbar.js';
import {changePassword} from "/scripts/callRest.js";

window.initializeVaihto = function () {
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
