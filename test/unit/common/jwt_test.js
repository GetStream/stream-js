var expect = require('expect.js'),
  signing = signing || require('../../../src/lib/signing');

describe('[UNIT] Json web token validation', function() {
  var validSignature =
    'feedname eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG5Eb2UiLCJhY3Rpb24iOiJyZWFkIn0.dfayorXXS1rAyd97BGCNgrCodPH9X3P80DPMH5b9D_A';
  var invalidSignature =
    'feedname eyJhbGiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZS.dfayorXXS1rAyd97BGCNgrCodH38PH5b9D_A';

  it('should validate valid jwts', function() {
    expect(signing.isJWTSignature(validSignature)).to.be(true);
  });

  it('should validate unvalid jwts', function() {
    expect(signing.isJWTSignature(invalidSignature)).to.be(false);
  });
});
