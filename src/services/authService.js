export function sanitize(value) {
  return value
    .replace(/\r/gu, '')
    .replace(/%0d/gu, '')
    .replace(/%0D/gu, '')
    .replace(/\n/gu, '')
    .replace(/%0a/gu, '')
    .replace(/%0A/gu, '');
}

export function validateNewPassword(newPassword, newPasswordConfirmation) {
  const maxLength = 10;
  const minLength = 8;

  if (newPassword !== newPasswordConfirmation) {
    return {
      valid: false,
      error: 'Uusi salasana ja salasanan vahvistus eivät täsmää'
    };
  }

  if (newPassword.length > maxLength) {
    return {
      valid: false,
      error: 'Uusi salasana on liian pitkä'
    };
  }

  if (newPassword.length < minLength) {
    return {
      valid: false,
      error: 'Uusi salasana on liian lyhyt'
    };
  }

  if (/[\s\t\n\r]/.test(newPassword)) {
    return {
      valid: false,
      error: 'Uusi salasana sisältää tyhjämerkkejä, jotka eivät ole sallittuja'
    };
  }

  if (/[^_$!?,.*A-Za-zÀ-ȕ0-9_$!?,.*\-]/ug.test(newPassword)) {
    return {
      valid: false,
      error: 'Uusi salasana sisältää erikoismerkkejä, jotka eivät ole sallittuja'
    };
  }

  if (!/^[\w$?*!,\-\.\u00C4\u00E4\u00D6\u00F6\u00C5\u00E5]{8,10}$/gu.test(newPassword)) {
    return {
      valid: false,
      error: 'Uusi salasana ei ole vaatimusten mukainen'
    };
  }

  return {valid: true};
}
