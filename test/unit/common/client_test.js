var expect = require('expect.js'),
  beforeEachFn = require('../utils/hooks').beforeEach,
  init = require('../utils/hooks').init,
  config = require('../utils/config'),
  td = require('testdouble'),
  stream = require('../../../src/getstream'),
  errors = stream.errors;

function enrichKwargs(kwargs) {
  return kwargs;
}

describe('[UNIT] Stream Client (Common)', function() {
  init.call(this);
  beforeEach(beforeEachFn);
  afterEach(function() {
    td.reset();
  });

  it('#connect', function() {
    expect(this.client.apiKey).to.be(config.API_KEY);
    expect(this.client.version).to.be('v1.0');
    expect(this.client.fayeUrl).to.be('https://faye.getstream.io/faye');
    expect(this.client.group).to.be('unspecified');
    expect(this.client.location).to.be(undefined);
    expect(this.client.expireTokens).to.be(false);
    expect(this.client.baseUrl).to.be('https://api.stream-io-api.com/api/');
  });

  describe('#on', function() {
    it('(1) without callback', function(done) {
      expect(this.client.on).to.be.a(Function);

      td.replace(this.client, 'enrichKwargs', enrichKwargs);

      this.client.on('request', function() {
        done();
      });

      this.client.get({ uri: 'test' });
    });

    it('(2) with callback', function(done) {
      expect(this.client.on).to.be.a(Function);

      td.replace(this.client, 'enrichKwargs', enrichKwargs);

      this.client.on('request', function() {
        done();
      });

      this.client.get({ uri: 'test' }, function() {});
    });
  });

  describe('#off', function() {
    it('(1) specific off', function(done) {
      expect(this.client.off).to.be.a(Function);

      td.replace(this.client, 'enrichKwargs', enrichKwargs);

      this.client.on('request', function() {
        done('Expected not to be called');
      });
      this.client.off('request');

      this.client.get({ uri: 'test' });

      done();
    });

    it('(2) global off', function(done) {
      expect(this.client.off).to.be.a(Function);

      td.replace(this.client, 'enrichKwargs', enrichKwargs);

      this.client.on('request', function() {
        done('Expected not to be called');
      });
      this.client.off();

      this.client.get({ uri: 'test' });

      done();
    });
  });

  it('#send', function(done) {
    expect(this.client.send).to.be.a(Function);

    this.client.on('test', function(a, b) {
      expect(a).to.be(100);
      expect(b).to.be(50);
      done();
    });

    this.client.send('test', 100, 50);
  });

  describe('#feed', function() {
    it('(1) throw', function() {
      var self = this;

      function toThrow() {
        self.client.feed();
      }

      expect(toThrow).to.throwException(function(e) {
        expect(e).to.be.a(errors.FeedError);
      });
    });

    it('(2) throw', function() {
      var self = this;

      function toThrow() {
        self.client.feed('user:jaap');
      }

      expect(toThrow).to.throwException(function(e) {
        expect(e).to.be.a(errors.FeedError);
      });
    });

    it('(3) throw', function() {
      var self = this;

      function toThrow() {
        self.client.feed('user###', 'jaap');
      }

      expect(toThrow).to.throwException(function(e) {
        expect(e).to.be.a(errors.FeedError);
      });
    });

    it('(4) throw', function() {
      var self = this;

      function toThrow() {
        self.client.feed('user', '###jaap');
      }

      expect(toThrow).to.throwException(function(e) {
        expect(e).to.be.a(errors.FeedError);
      });
    });

    it('(5) throw with colon', function() {
      var self = this;

      function toThrow() {
        self.client.feed('user:jaap', 'jaap');
      }

      expect(toThrow).to.throwException(function(e) {
        expect(e).to.be.a(errors.FeedError);
      });
    });
  });

  describe('#wrapPromiseTask', function() {
    it('(1) success', function(done) {
      function fulfill() {
        done();
      }

      function reject(err) {
        expect(err).to.be.a(errors.StreamApiError);
        done(err);
      }

      var task = this.client.wrapPromiseTask(undefined, fulfill, reject);

      task(null, { statusCode: 200 }, {});
    });

    it('(2) failure 500 status code', function(done) {
      function fulfill() {
        done('Expected to fail');
      }

      function reject(err) {
        expect(err).to.be.a(errors.StreamApiError);
        done();
      }

      var task = this.client.wrapPromiseTask(undefined, fulfill, reject);

      task(null, { statusCode: 500 }, {});
    });

    it('(3) failure rejected', function(done) {
      function fulfill() {
        done('Expected to fail');
      }

      function reject(err) {
        expect(err).to.be.a(errors.StreamApiError);
        done();
      }

      var task = this.client.wrapPromiseTask(undefined, fulfill, reject);

      task(new Error('oops'), { statusCode: 200 }, {});
    });

    it('(4) with callback', function(done) {
      function fulfill() {}

      function reject(err) {
        expect(err).to.be.a(errors.StreamApiError);
        done(err);
      }

      var task = this.client.wrapPromiseTask(
        function() {
          done();
        },
        fulfill,
        reject,
      );

      task(null, { statusCode: 200 }, {});
    });
  });

  describe('#enrichUrl', function() {
    it('(1) api service', function() {
      var feedGroup = 'user';
      var url = this.client.enrichUrl(feedGroup);
      expect(url).to.be(
        this.client.baseUrl + this.client.version + '/' + feedGroup,
      );
    });
  });

  describe('#enrichKwargs', function() {
    it('(1) api service - simple auth type', function() {
      var kwargs = this.client.enrichKwargs({
        url: 'feed',
        signature: 'Basic encoded_password',
      });

      expect(kwargs.qs.api_key).to.be(this.client.apiKey);
      expect(kwargs.qs.location).to.be(this.client.group);
      expect(kwargs.json).to.be(true);
      expect(kwargs.headers['stream-auth-type']).to.be('simple');
      expect(kwargs.headers['X-Stream-Client']).to.be(this.client.userAgent());
      expect(kwargs.headers['Authorization']).to.be('Basic encoded_password');
      expect(kwargs.url).to.contain('api.stream-io-api.com');
    });

    it('(2) api service - jwt signature', function() {
      var signature =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG5Eb2UiLCJhY3Rpb24iOiJyZWFkIn0.dfayorXXS1rAyd97BGCNgrCodPH9X3P80DPMH5b9D_A';

      var kwargs = this.client.enrichKwargs({
        url: 'feed',
        signature: 'feedname ' + signature,
      });

      expect(kwargs.qs.api_key).to.be(this.client.apiKey);
      expect(kwargs.qs.location).to.be(this.client.group);
      expect(kwargs.json).to.be(true);
      expect(kwargs.headers['stream-auth-type']).to.be('jwt');
      expect(kwargs.headers['X-Stream-Client']).to.be(this.client.userAgent());
      expect(kwargs.headers['Authorization']).to.be(signature);
      expect(kwargs.url).to.contain('api.stream-io-api.com');
    });

    it('(3) personalization service - simple auth type', function() {
      var kwargs = this.client.enrichKwargs({
        url: 'feed',
        serviceName: 'personalization',
        signature: 'Basic encoded_password',
      });

      expect(kwargs.qs.api_key).to.be(this.client.apiKey);
      expect(kwargs.qs.location).to.be(this.client.group);
      expect(kwargs.json).to.be(true);
      expect(kwargs.headers['stream-auth-type']).to.be('simple');
      expect(kwargs.headers['X-Stream-Client']).to.be(this.client.userAgent());
      expect(kwargs.headers['Authorization']).to.be('Basic encoded_password');
      expect(kwargs.url).to.contain('personalization.stream-io-api.com');
    });

    it('(4) personalization service - jwt signature', function() {
      var signature =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiJwZXJzb25hbGl6YXRpb24iLCJmZWVkX2lkIjoiKiIsInVzZXJfaWQiOiIqIn0.JvX_IGajZSPD5zDOVpeZLkn0hhClMheN_ILnowyBUN';

      var kwargs = this.client.enrichKwargs({
        url: 'feed',
        serviceName: 'personalization',
        signature: 'feedname ' + signature,
      });

      expect(kwargs.qs.api_key).to.be(this.client.apiKey);
      expect(kwargs.qs.location).to.be(this.client.group);
      expect(kwargs.json).to.be(true);
      expect(kwargs.headers['stream-auth-type']).to.be('jwt');
      expect(kwargs.headers['X-Stream-Client']).to.be(this.client.userAgent());
      expect(kwargs.headers['Authorization']).to.be(signature);
      expect(kwargs.url).to.contain('personalization.stream-io-api.com');
    });
  });

  describe('Requests', function() {
    var tdRequest = td.function();

    function toExpect(method) {
      var arg0 = { url: 'feed', method: method, gzip: true };
      var fun = td.matchers.isA(Function);
      return tdRequest(arg0, fun);
    }

    beforeEach(function() {
      this.client.request = tdRequest;
      td.replace(this.client, 'enrichKwargs', enrichKwargs);
    });

    it('#get', function() {
      this.client.get({ url: 'feed' });

      td.verify(toExpect('GET'));
    });

    it('#post', function() {
      this.client.post({ url: 'feed' });

      td.verify(toExpect('POST'));
    });

    it('#delete', function() {
      this.client['delete']({ url: 'feed' });

      td.verify(toExpect('DELETE'));
    });
  });
});
