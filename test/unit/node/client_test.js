var stream = require('../../../src/getstream')
  , StreamFeed = require('../../../src/lib/feed')
  , expect = require('expect.js')
  , jwt = require('jsonwebtoken')
  , url = require('url')
  , errors = require('../../../src/lib/errors')
  , request = require('request')
  , beforeEachFn = require('../utils/hooks').beforeEach
  , signing = signing || require('../../../src/lib/signing')
  , qs = require('qs');


describe('Stream Client', function() {

    beforeEach(beforeEachFn);

    it('#updateActivities', function() {
        var self = this;

      expect(function() {
        self.client.updateActivities('A-String-Thing');
      }).to.throwException(function(e) {
        expect(e).to.be.a(TypeError);
      });
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
      var redirectUrl = this.client.createRedirectUrl(targetUrl, userId, events);

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

      var redirectUrl = this.client.createRedirectUrl(targetUrl, userId, events);

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
        var self = this;
        expect(function() {
            self.client.createRedirectUrl('google.com', 'tommaso', []);
        }).to.throwException(errors.MissingSchemaError);
    });

    it('getReadOnlyToken', function() {
      var token = this.client.getReadOnlyToken('user', 'test');

      expect(token).not.to.be(undefined);

      var feedId = 'usertest';
      var expected = signing.JWTScopeToken(this.client.apiSecret, '*', 'read', { feedId: feedId, expireTokens: this.client.expireTokens });

      expect(token).to.be(expected);
    });

    it('getReadWriteToken', function() {
      var token = this.client.getReadWriteToken('user', 'test');

      expect(token).not.to.be(undefined);

      var feedId = 'usertest';
      var expected = signing.JWTScopeToken(this.client.apiSecret, '*', '*', { feedId: feedId, expireTokens: this.client.expireTokens });

      expect(token).to.be(expected);
    });

    it('feed getReadOnlyToken', function() {
      var token = this.client.feed('user', 'test').getReadOnlyToken();

      expect(token).not.to.be(undefined);

      var feedId = 'usertest';
      var expected = signing.JWTScopeToken(this.client.apiSecret, '*', 'read', { feedId: feedId, expireTokens: this.client.expireTokens });

      expect(token).to.be(expected);
    });

    it('feed getReadWriteToken', function() {
      var token = this.client.feed('user', 'test').getReadWriteToken();

      expect(token).not.to.be(undefined);

      var feedId = 'usertest';
      var expected = signing.JWTScopeToken(this.client.apiSecret, '*', '*', { feedId: feedId, expireTokens: this.client.expireTokens });

      expect(token).to.be(expected);
    });

    it('#userAgent', function() {
        var useragent = this.client.userAgent();

        expect(useragent).to.be('stream-javascript-client-node-unknown');
    });

    it('#feed', function() {
        var feed = this.client.feed('user','jaap', '123456789');

        expect(feed).to.be.a(StreamFeed);
    });    
});