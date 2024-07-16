export function sanitize(value) {
  return value
    .replace(/\r/gu, '')
    .replace(/%0d/gu, '')
    .replace(/%0D/gu, '')
    .replace(/\n/gu, '')
    .replace(/%0a/gu, '')
    .replace(/%0A/gu, '');
}

export function validatePassword(password, passwordVerify) {
  const maxLength = 10;
  const minLength = 8;

  if (password !== passwordVerify) {
    return {
      valid: false,
      error: 'Uusi salasana ja salasanan vahvistus eivät täsmää'
    };
  }

  if (password.length > maxLength) {
    return {
      valid: false,
      error: 'Uusi salasana on liian pitkä'
    };
  }

  if (password.length < minLength) {
    return {
      valid: false,
      error: 'Uusi salasana on liian lyhyt'
    };
  }

  if (/[\s\t\n\r]/.test(password)) {
    return {
      valid: false,
      error: 'Uusi salasana sisältää tyhjämerkkejä, jotka eivät ole sallittuja'
    };
  }

  if (!/[_$!?,.*-]/.test(password)) {
    return {
      valid: false,
      error: 'Uusi salasana sisältää erikoismerkkejä, jotka eivät ole sallittuja'
    };
  }

  if (!/^[\w$?*!,\-\.\u00C4\u00E4\u00D6\u00F6\u00C5\u00E5]{8,10}$/gu.test(password)) {
    return {
      valid: false,
      error: 'Uusi salasana ei ole vaatimusten mukainen'
    };
  }

  return {valid: true};
}
