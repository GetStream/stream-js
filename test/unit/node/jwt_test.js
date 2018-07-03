var expect = require('expect.js')
  , jsc = require('jsverify')
  , jwt = require('jsonwebtoken')
  , signing = signing || require('../../../src/lib/signing')
  , isPlainObject = require('lodash.isplainobject');

describe('[UNIT] Json web token validation', function() {

    it('should decode valid jwts headers', function() {
      // jwt.sign() applies some validation to the json payload; plain objects is reasonable for this test
      var payload_arb = jsc.suchthat(jsc.json, (x) => isPlainObject(x));

      jsc.assertForall(payload_arb, jsc.nestring, (payload, key) =>
        signing.isJWTSignature(jwt.sign( payload, key, { algorithm: 'HS256', noTimestamp: true })) !== undefined);
    });

});
