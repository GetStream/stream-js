var expect = require('expect.js');
var jwt = require('jsonwebtoken');
var url = require('url');
var qs = require('qs');
var qc = require('quickcheck');
var utils = require('../../src/lib/utils');
var errors = require('../../src/lib/errors');
var isNodeEnv = typeof window === 'undefined';
var stream = require('../../src/getstream');

var signing = signing || require('../../src/lib/signing');

console.log('node is set to', isNodeEnv);

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

  if(isNodeEnv) {
    it('should decode valid jwts headers', function() {
      expect( qc.forAll( propertyHeaderJSON, arbJWT ) ).to.be(true);
    });
  }
});

describe('Utility functions', function() {
  it('should validate feed id\'s', function() {
    expect(utils.validateFeedId('flat:0')).to.be.ok();
  });

  it('should throw exception while validating faulty feed id',function() {
    expect(function() {
      utils.validateFeedId('b134u92fval')
    }).to.throwError(function(e) {
      expect(e).to.be.a(errors.FeedError);
    });
  });
});

if (isNodeEnv) {
  describe('Stream Client', function() {
    var client = stream.connect('ahj2ndz7gsan', 'gthc2t9gh7pzq52f6cky8w4r4up9dr6rju9w3fjgmkv6cdvvav2ufe5fv7e2r9qy');

    it('should create email redirects', function() {
      var expectedParts = ['https://analytics.getstream.io/analytics/redirect/',
        'auth_type=jwt',
        'url=http%3A%2F%2Fgoogle.com%2F%3Fa%3Db%26c%3Dd',
        'events=%5B%7B%22foreign_ids%22%3A%5B%22tweet%3A1%22%2C%22tweet%3A2%22%2C%22tweet%3A3%22%2C%22tweet%3A4%22%2C%22tweet%3A5%22%5D%2C%22user_id%22%3A%22tommaso%22%2C%22location%22%3A%22email%22%2C%22feed_id%22%3A%22user%3Aglobal%22%7D%2C%7B%22foreign_id%22%3A%22tweet%3A1%22%2C%22label%22%3A%22click%22%2C%22position%22%3A3%2C%22user_id%22%3A%22tommaso%22%2C%22location%22%3A%22email%22%2C%22feed_id%22%3A%22user%3Aglobal%22%7D%5D',
        'api_key=ahj2ndz7gsan',
      ];
      var engagement = { 'foreign_id': 'tweet:1', 'label': 'click', 'position': 3, 'user_id': 'tommaso', 'location': 'email', 'feed_id': 'user:global' },
          impression = {'foreign_ids': ['tweet:1', 'tweet:2', 'tweet:3', 'tweet:4', 'tweet:5'], 'user_id': 'tommaso', 'location': 'email', 'feed_id': 'user:global'},
          events = [impression, engagement],
          userId = 'tommaso',
          targetUrl = 'http://google.com/?a=b&c=d';
      var redirectUrl = client.createRedirectUrl(targetUrl, userId, events);

      var queryString = qs.parse(url.parse(redirectUrl).query);
      var decoded = jwt.verify(queryString.authorization, 'gthc2t9gh7pzq52f6cky8w4r4up9dr6rju9w3fjgmkv6cdvvav2ufe5fv7e2r9qy');

      expect(decoded).to.eql({
        'resource': 'redirect_and_track',
        'action': '*',
        'user_id': userId,
      });

      for (var i = 0; i < expectedParts.length; i++) {
        expect(redirectUrl).to.contain(expectedParts[i]);
      }
    });

    it('should fail creating email redirects on invalid targets', function() {
      expect(function() {
        client.createRedirectUrl('google.com', 'tommaso', []);
      }).to.throwException(errors.MissingSchemaError);
    });

  });
}
