var signing = require('../../../src/lib/signing')
  , jwt = require('jsonwebtoken')
  , qc = require('quickcheck');

function propertyHeaderJSON(jwt) {
  var json = signing.isJWTSignature(jwt);
  return json !== undefined;
}

function arbJSON(depth) {
  var width = Math.floor(Math.random() * (10 - 1) + 1);

  var result = {};

  while(width--) {
    var value = qc.arbString(),
        maxDepth = Math.floor(Math.random() * (3 - 1) + 1);

    if(depth) {
      value = arbJSON(depth-1);
    } else if(depth === undefined) {
      value = arbJSON(maxDepth);
    }

    result[ qc.arbString() ] = value;
  }

  return result;
}

function arbNonEmptyString() {
  var str = qc.arbString();

  return str === '' ? arbNonEmptyString() : str;
}

function arbJWT() {
  return jwt.sign( arbJSON(), arbNonEmptyString(), { algorithm: 'HS256', noTimestamp: true });
}

module.exports = {
    propertyHeaderJSON: propertyHeaderJSON,
    arbJSON: arbJSON,
    arbNonEmptyString: arbNonEmptyString,
    arbJWT: arbJWT,
};