var expect = require('expect.js')
  , qc = require('quickcheck')
  , qcJWT = require('../utils/jwt')
  , signing = signing || require('../../../src/lib/signing');

describe('[UNIT] Json web token validation', function() {

    this.timeout(10000);

    it('should decode valid jwts headers', function() {
        expect( qc.forAll( qcJWT.propertyHeaderJSON, qcJWT.arbJWT ) ).to.be(true);
    });

});