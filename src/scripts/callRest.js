export function authGetBaseToken(data) {
  const url = 'rest/auth/getBaseToken';
  const body = JSON.stringify(data);
  return doRestCall({url, method: 'POST', body});
}

export function authLogin(token) {
  const url = 'rest/auth/login';
  return doRestCall({url, method: 'GET', auth: token});
}

export function authVerify() {
  const url = 'rest/auth/verify';
  return doRestCall({url, method: 'GET'});
}

export function logout() {
  const url = 'rest/auth/logout';
  return doRestCall({url, method: 'GET'});
}

export function changePassword(data) {
  const url = 'rest/auth/change';
  const body = JSON.stringify(data);
  return doRestCall({url, method: 'POST', body});
}

async function doRestCall({url = undefined, method = undefined, body = undefined, accept = undefined, contentType = undefined, auth = undefined}) {
  const headers = createHeaders(accept, contentType, auth);
  const result = await fetch(
    url,
    {
      method,
      headers,
      body,
      credentials: 'include',
      cache: 'no-store'
    }
  );

  if (headers["Accept"] === 'application/json') {
    return result.json();
  }

  return result;
}

function createHeaders(accept, contentType, auth) {
  if (auth) {
    return {
      ...accept ? {'Accept': accept} : {'Accept': 'application/json'},
      ...contentType ? {'Content-Type': contentType} : {'Content-Type': 'application/json'},
      ...auth ? {'Authorization': auth} : {}
    };
  }

  return {
    ...accept ? {'Accept': accept} : {'Accept': 'application/json'},
    ...contentType ? {'Content-Type': contentType} : {'Content-Type': 'application/json'},
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': ['Origin', 'Content-Type', 'Accept', 'Authorization', 'Set-Cookie']
  };
}
