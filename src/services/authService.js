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
      error: 'Salasanat eivät täsmää'
    };
  }

  if (password.length > maxLength) {
    return {
      valid: false,
      error: `Salasanan pituus ei saa ylittää ${maxLength} merkkiä`
    };
  }

  if (password.length < minLength) {
    return {
      valid: false,
      error: `Salasanan pituus pitää ylittää ${minLength} merkkiä`
    };
  }

  if (!/^[\w$?*!,\-\.\u00C4\u00E4\u00D6\u00F6\u00C5\u00E5]{8,10}$/gu.test(password)) {
    return {
      valid: false,
      error: `Salasanassa ei ole ohjeen mukainen`
    };
  }

  return {valid: true};
}
