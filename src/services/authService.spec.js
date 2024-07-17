/* Remove this file (tests.spec.js) and the folders for test fixtures (tests/testFixtures/*) if your test approach is different.
Remove all unnecessary test dependencies from package.json, also.
Packages for testing that are preinstalled and configured in this repository:
  - c8
  - chai
  - mocha
  - @babel/register
  - @natlibfi/fixugen
  - @natlibfi/fixura
*/

import {expect} from 'chai';
import fixugen from '@natlibfi/fixugen';
import {READERS} from '@natlibfi/fixura';

import {validateNewPassword} from './authService.js';

const {default: generateTests} = fixugen;

const testFixturesPath = [import.meta.dirname, '..', '..', 'testFixtures', 'auth'];

const fixuraParameters = {
  failWhenNotFound: true,
  reader: READERS.JSON
};

const mochaParameters = {};

const testsParameters = {
  callback: runTests,
  path: testFixturesPath,
  recurse: false,
  useMetadataFile: true,
  fixura: fixuraParameters,
  mocha: mochaParameters
};

generateTests(testsParameters);

/*async*/ function runTests({getFixture, method = false, expectedError = false, expectedErrorStatus = 200}) {
  const input = getFixture('input.json');
  const output = getFixture('output.json');

  try {
    if (method === 'validateNewPassword') {
      const result = validateNewPassword(input.newPassword, input.newPasswordConfirmation);
      expect(result).to.eql(output);
      return;
    }

    throw new Error('Invalid test method');
  } catch (error) {
    if (expectedError) {
      // Error match check here
      expect(error).to.be.an('error');

      if (error instanceof ApiError) { // specified error
        expect(error.payload).to.match(new RegExp(expectedError, 'u'));
        expect(error.status).to.match(new RegExp(expectedErrorStatus, 'u'));
        return;
      }

      // common error
      expect(error.message).to.match(new RegExp(expectedError, 'u'));
      return;
    }

    throw error;
  }
}
