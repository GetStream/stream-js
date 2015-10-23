var expect = require('expect.js');
var jwt = require('jsonwebtoken');
var qc = require('quickcheck');
var node = typeof(stream) == 'undefined';

var signing = signing || require('../../src/lib/signing');

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
  return jwt.sign( arbJSON(), arbNonEmptyString(), arbJSON() );
}

describe('Json web token validation', function() {
  var validSignature = "feedname eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG5Eb2UiLCJhY3Rpb24iOiJyZWFkIn0.dfayorXXS1rAyd97BGCNgrCodPH9X3P80DPMH5b9D_A";
  var invalidSignature = "feedname eyJhbGiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZS.dfayorXXS1rAyd97BGCNgrCodH38PH5b9D_A";

  it('should validate valid jwts', function() {
    expect( signing.isJWTSignature(validSignature) ).to.be(true);
  }); 

  it('should validate unvalid jwts', function() {
    expect( signing.isJWTSignature(invalidSignature) ).to.be(false);
  });

  if(node) {
    it('should decode valid jwts headers', function() {
      expect( qc.forAll( propertyHeaderJSON, arbJWT ) ).to.be(true);
    });  
  }
});

