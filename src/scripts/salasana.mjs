import {changePassword} from '/scripts/callRest.mjs';
import {disableElement, enableElement} from '/shared/scripts/elements.js';
import {startProcess, stopProcess} from '/shared/scripts/progressbar.js';
import {showSnackbar} from '/shared/scripts/snackbar.js';
import {eventHandled} from '/shared/scripts/uiUtils.js';

window.initialize = function () {
  console.log('Initializing Salasana application');
  addFormHandlingEventListeners();
};

function addFormHandlingEventListeners() {
  const changePasswordForm = document.getElementById('changePasswordForm');
  changePasswordForm.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(event) {
  console.log(`Submit event for ${event.target.id}`);

  eventHandled(event);
  startProcess();

  const form = event.target;
  const submitButton = event.submitter;

  const formData = new FormData(form);

  const passwordData = {
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    newPasswordConfirmation: formData.get('newPasswordConfirmation')
  };

  disableElement(submitButton);

  try {
    const {message = false} = await changePassword(passwordData);

    if (message) {
      showSnackbar({style: 'alert', text: message});
      return;
    }

    showSnackbar({style: 'success', text: 'Melinda-tunnuksen salasana on vaihdettu onnistuneesti. Uusi salasanasi on heti voimassa.'});
    form.reset();
  } catch (error) {
    console.log('Error handling form submit :', error);
    showSnackbar({style: 'error', text: 'Virhe sivulla, yritä ladata sivu uudelleen. Jos ongelma toistuu, ota yhteyttä ylläpitoon.'});
  } finally {
    enableElement(submitButton);
    stopProcess();
  };

}
