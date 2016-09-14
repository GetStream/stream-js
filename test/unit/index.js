var expect = require('expect.js')
  , jwt = require('jsonwebtoken')
  , url = require('url')
  , qs = require('qs')
  , qc = require('quickcheck')
  , utils = require('../../src/lib/utils')
  , errors = require('../../src/lib/errors')
  , signing = signing || require('../../src/lib/signing')
  , https = require('https')
  , stream = require('../../src/getstream')
  , request = require('request')
  , nock = require('nock');

var isNodeEnv = typeof window === 'undefined';

console.log('node is set to', isNodeEnv);

// Setup fake API endpoints

// nock.recorder.rec();

var nockApi = nock('https://api.getstream.io:443', { "encodedQueryParams" : true });

// End setup

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

var client
  , user1;

function beforeEachBrowser() {
  client = stream.connect('ahj2ndz7gsan');

  if (self.localRun){
    client.baseUrl = 'http://localhost:8000/api/';
    client.fayeUrl = 'http://localhost:9999/faye/';
  }

  user1 = client.feed('user', '11', 'YHEtoaiaB03gBR9px6vX4HCRVKk');
}

function beforeEachNode() {
  client = stream.connect('ahj2ndz7gsan', 'gthc2t9gh7pzq52f6cky8w4r4up9dr6rju9w3fjgmkv6cdvvav2ufe5fv7e2r9qy');
  user1 = client.feed('user', '11');
}

var before = (isNodeEnv) ? beforeEachNode : beforeEachBrowser;


describe('Stream Feed', function() {
  client = stream.connect('ahj2ndz7gsan');

  beforeEach(before);
  
  afterEach(function() {});

  nockApi
    // Get activities
    .get('/api/v1.0/feed/user/11/')
    .query({"limit":"1","api_key":"ahj2ndz7gsan","location":"unspecified"})
    .reply(200, {"duration":"16ms","next":"/api/v1.0/feed/user/11/?id_lt=ddd6cae2-b849-11e5-8080-8000244b4595&api_key=ahj2ndz7gsan&limit=1&location=unspecified&offset=0","results":[{"actor":"many2","foreign_id":null,"id":"ddd6cae2-b849-11e5-8080-8000244b4595","object":"1","origin":null,"target":null,"time":"2016-01-11T09:58:29.863000","to":["flat:remotefeed2"],"verb":"tweet"}]}, { });

  it('#get', function (done) {
    user1.get({'limit': 1}, function(error, response, body) {
      expect(response.statusCode).to.eql(200);
      expect(body['results'][0]['id']).to.be.a('string');
      
      if (isNodeEnv) {
         var userAgent = response.req._headers['x-stream-client'];
         expect(userAgent.indexOf('stream-javascript-client')).to.eql(0);
      }

      done();
    });
  });
});

describe('Stream Client', function() {
  var activityCopyLimit = 20;
  var follows = [
    {'source': 'flat:1', 'target': 'user:1'},
    {'source': 'flat:1', 'target': 'user:2'},
    {'source': 'flat:1', 'target': 'user:3'}
  ];

  beforeEach(before);

  if (isNodeEnv) {
    client = stream.connect('ahj2ndz7gsan', 'gthc2t9gh7pzq52f6cky8w4r4up9dr6rju9w3fjgmkv6cdvvav2ufe5fv7e2r9qy');

    nockApi
      // Follow Many
      .post('/api/v1.0/follow_many/', follows)
      .query({ "activity_copy_limit": activityCopyLimit })
      .reply(201, {"duration":"13ms"}, { });

    it('#followMany activity_copy_limit', function(done) {
      client.followMany(follows, activityCopyLimit, function(error, response, body) {
          expect(error).to.be(null);

          done();
      });
    });

    nockApi
      // Follow Many
      .post('/api/v1.0/follow_many/', follows)
      .reply(201, {"duration":"13ms"}, { });

    it('#followMany', function(done) {
      client.followMany(follows, function(error, response, body) {
        expect(error).to.be(null);
        done();
      });
    });

    it('#updateActivities', function() {
      expect(function() {
        client.updateActivities('A-String-Thing');
      }).to.throwException(function(e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('#updateActivity', function() {
      var activity = {
        'verb': 'do',
        'actor': 'user:1',
        'object': 'object:1'
      };

      client.updateActivity([activity]);
    });

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

    it('should follow redirect urls', function(done) {
      var events = []
        , userId = 'tommaso'
        , targetUrl = 'http://google.com/?a=b&c=d';

      var redirectUrl = client.createRedirectUrl(targetUrl, userId, events);

      request(redirectUrl, function(err, response) {
        if (err) { 
          done(err); 
        } else if (response.statusCode !== 200) {
          done('Expecting a status code of 200 but got ' + response.statusCode);
        } else if (response.request.uri.hostname.indexOf('google') === -1) {
          done('Did not follow redirect to google');
        } else {
          done();        
        }
      });
    });

    it('should fail creating email redirects on invalid targets', function() {
      expect(function() {
        client.createRedirectUrl('google.com', 'tommaso', []);
      }).to.throwException(errors.MissingSchemaError);
    });

    it('getReadOnlyToken', function() {
      var token = client.getReadOnlyToken('user', 'test');

      expect(token).not.to.be(undefined);

      var feedId = 'usertest';
      var expected = signing.JWTScopeToken(client.apiSecret, '*', 'read', { feedId: feedId, expireTokens: client.expireTokens });

      expect(token).to.be(expected);
    });

    it('getReadWriteToken', function() {
      var token = client.getReadWriteToken('user', 'test');

      expect(token).not.to.be(undefined);

      var feedId = 'usertest';
      var expected = signing.JWTScopeToken(client.apiSecret, '*', '*', { feedId: feedId, expireTokens: client.expireTokens });

      expect(token).to.be(expected);
    });

    it('feed getReadOnlyToken', function() {
      var token = client.feed('user', 'test').getReadOnlyToken();

      expect(token).not.to.be(undefined);

      var feedId = 'usertest';
      var expected = signing.JWTScopeToken(client.apiSecret, '*', 'read', { feedId: feedId, expireTokens: client.expireTokens });

      expect(token).to.be(expected);
    });

    it('feed getReadWriteToken', function() {
      var token = client.feed('user', 'test').getReadWriteToken();

      expect(token).not.to.be(undefined);

      var feedId = 'usertest';
      var expected = signing.JWTScopeToken(client.apiSecret, '*', '*', { feedId: feedId, expireTokens: client.expireTokens });

      expect(token).to.be(expected);
    });
  }
});
