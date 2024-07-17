import {changePassword} from '/scripts/callRest.js';
import {disableElement, enableElement} from '/shared/scripts/elements.js';
import {startProcess, stopProcess} from '/shared/scripts/progressbar.js';
import {showSnackbar} from '/shared/scripts/snackbar.js';
import {eventHandled} from '/shared/scripts/uiUtils.js';

window.initializeSalasana = function () {
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
  }

  disableElement(submitButton);

  try {
    const {message = false} = await changePassword(passwordData);

    if (message) {
      showSnackbar({style: 'alert', text: message});
      return;
    }

    showSnackbar({style: 'success', text: 'Salasana on vaihdettu'});
    form.reset();
  } catch (error) {
    console.log('Error in function submitForm :', error);
    showSnackbar({style: 'error', text: 'Sivu ei latautunut oikein, yritä ladata sivu uudelleen.'});
  } finally {
    enableElement(submitButton);
    stopProcess();
  };

}
