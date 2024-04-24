import {readEnvironmentVariable} from '@natlibfi/melinda-backend-commons';

export const httpPort = readEnvironmentVariable('HTTP_PORT', {defaultValue: 8080, format: v => Number(v)});

export const xServiceURL = readEnvironmentVariable('ALEPH_X_SVC_URL');
export const userLibrary = readEnvironmentVariable('ALEPH_USER_LIBRARY');
export const ownAuthzURL = readEnvironmentVariable('OWN_AUTHZ_URL');
export const ownAuthzApiKey = readEnvironmentVariable('OWN_AUTHZ_API_KEY');
export const alephChangePasswordApiUrl = readEnvironmentVariable('ALEPH_CHANGE_PASSWORD_API_URL');

export const jwtOptions = {
  secretOrPrivateKey: readEnvironmentVariable('JWT_SECRET'),
  issuer: readEnvironmentVariable('JWT_ISSUER', {defaultValue: 'melinda-test.kansalliskirjasto.fi'}),
  audience: readEnvironmentVariable('JWT_AUDIENCE', {defaultValue: 'melinda-test.kansalliskirjasto.fi'}),
  algorithms: readEnvironmentVariable('JWT_ALGORITHMS', {defaultValue: ['HS512'], format: (v) => JSON.parse(v)})
};

export const sharedLocationOptions = {
  sharedPartialsLocation: readEnvironmentVariable('SHARED_PARTIALS_LOCATION', {defaultValue: '../node_modules/@natlibfi/melinda-ui-commons/src/views/partials'}),
  sharedPublicLocation: readEnvironmentVariable('SHARED_PUBLIC_LOCATION', {defaultValue: '../node_modules/@natlibfi/melinda-ui-commons/src'}),
  sharedViewsLocation: readEnvironmentVariable('SHARED_VIEWS_LOCATION', {defaultValue: '../node_modules/@natlibfi/melinda-ui-commons/src/views'})
};

