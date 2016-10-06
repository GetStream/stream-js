var expect = require('expect.js')
  , qc = require('quickcheck')
  , qcJWT = require('../utils/jwt')
  , signing = signing || require('../../../src/lib/signing');

describe('Json web token validation', function() {

    it('should decode valid jwts headers', function() {
        expect( qc.forAll( qcJWT.propertyHeaderJSON, qcJWT.arbJWT ) ).to.be(true);
    });

});