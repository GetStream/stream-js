import expect from 'expect.js';

import { connect } from '../../../src';
import { init, beforeEachFn } from '../utils/hooks';

describe('[UNIT] Stream client (Heroku)', function () {
  init.call(this);
  beforeEach(beforeEachFn);

  describe('#Heroku', function () {
    it('heroku (stream-io-api.com)', function (done) {
      const url = 'https://thierry:pass@stream-io-api.com/?app_id=1';
      process.env.STREAM_URL = url;
      this.client = connect();
      expect(this.client.apiKey).to.eql('thierry');
      expect(this.client.apiSecret).to.eql('pass');
      expect(this.client.appId).to.eql('1');
      expect(this.client.baseUrl).to.eql('https://api.stream-io-api.com/api/');
      delete process.env.STREAM_URL;
      done();
    });

    it('heroku (getstream.io)', function (done) {
      const url = 'https://thierry:pass@getstream.io/?app_id=1';
      process.env.STREAM_URL = url;
      process.env.STREAM_BASE_URL = 'https://api.getstream.io/api/';
      this.client = connect();
      expect(this.client.apiKey).to.eql('thierry');
      expect(this.client.apiSecret).to.eql('pass');
      expect(this.client.appId).to.eql('1');
      expect(this.client.baseUrl).to.eql('https://api.getstream.io/api/');
      delete process.env.STREAM_URL;
      delete process.env.STREAM_BASE_URL;
      done();
    });

    it('heroku legacy (stream-io-api.com)', function (done) {
      const url =
        'https://bvt88g4kvc63:twc5ywfste5bm2ngqkzs7ukxk3pn96yweghjrxcmcrarnt3j4dqj3tucbhym5wfd@stream-io-api.com/?app_id=669';
      process.env.STREAM_URL = url;
      this.client = connect();
      expect(this.client.apiKey).to.eql('bvt88g4kvc63');
      expect(this.client.apiSecret).to.eql('twc5ywfste5bm2ngqkzs7ukxk3pn96yweghjrxcmcrarnt3j4dqj3tucbhym5wfd');
      expect(this.client.appId).to.eql('669');
      expect(this.client.baseUrl).to.eql('https://api.stream-io-api.com/api/');
      delete process.env.STREAM_URL;
      done();
    });

    it('heroku legacy (getstream.io)', function (done) {
      const url =
        'https://bvt88g4kvc63:twc5ywfste5bm2ngqkzs7ukxk3pn96yweghjrxcmcrarnt3j4dqj3tucbhym5wfd@getstream.io/?app_id=669';
      process.env.STREAM_URL = url;
      process.env.STREAM_BASE_URL = 'https://api.getstream.io/api/';
      this.client = connect();
      expect(this.client.apiKey).to.eql('bvt88g4kvc63');
      expect(this.client.apiSecret).to.eql('twc5ywfste5bm2ngqkzs7ukxk3pn96yweghjrxcmcrarnt3j4dqj3tucbhym5wfd');
      expect(this.client.appId).to.eql('669');
      expect(this.client.baseUrl).to.eql('https://api.getstream.io/api/');
      delete process.env.STREAM_URL;
      delete process.env.STREAM_BASE_URL;
      done();
    });

    it('heroku with location (stream-io-api.com)', function (done) {
      const url =
        'https://ahj2ndz7gsan:gthc2t9gh7pzq52f6cky8w4r4up9dr6rju9w3fjgmkv6cdvvav2ufe5fv7e2r9qy@us-east.stream-io-api.com/?app_id=1';
      process.env.STREAM_URL = url;
      this.client = connect();
      expect(this.client.apiKey).to.eql('ahj2ndz7gsan');
      expect(this.client.apiSecret).to.eql('gthc2t9gh7pzq52f6cky8w4r4up9dr6rju9w3fjgmkv6cdvvav2ufe5fv7e2r9qy');
      expect(this.client.appId).to.eql('1');
      expect(this.client.baseUrl).to.eql('https://us-east-api.stream-io-api.com/api/');
      delete process.env.STREAM_URL;
      done();
    });

    it('heroku with location (getstream.io)', function (done) {
      const url =
        'https://ahj2ndz7gsan:gthc2t9gh7pzq52f6cky8w4r4up9dr6rju9w3fjgmkv6cdvvav2ufe5fv7e2r9qy@us-east.getstream.io/?app_id=1';
      process.env.STREAM_URL = url;
      process.env.STREAM_BASE_URL = 'https://us-east-api.getstream.io/api/';
      this.client = connect();
      expect(this.client.apiKey).to.eql('ahj2ndz7gsan');
      expect(this.client.apiSecret).to.eql('gthc2t9gh7pzq52f6cky8w4r4up9dr6rju9w3fjgmkv6cdvvav2ufe5fv7e2r9qy');
      expect(this.client.appId).to.eql('1');
      expect(this.client.baseUrl).to.eql('https://us-east-api.getstream.io/api/');
      delete process.env.STREAM_URL;
      delete process.env.STREAM_BASE_URL;
      done();
    });

    it('heroku_overwrite (stream-io-api.com)', function (done) {
      const url = 'https://thierry:pass@stream-io-api.com/?app_id=1';
      process.env.STREAM_URL = url;
      this.client = connect('a', 'b', 'c');
      expect(this.client.apiKey).to.eql('a');
      expect(this.client.apiSecret).to.eql('b');
      expect(this.client.appId).to.eql('c');
      delete process.env.STREAM_URL;
      done();
    });

    it('heroku_overwrite (getstream.io)', function (done) {
      const url = 'https://thierry:pass@getstream.io/?app_id=1';
      process.env.STREAM_URL = url;
      this.client = connect('a', 'b', 'c');
      expect(this.client.apiKey).to.eql('a');
      expect(this.client.apiSecret).to.eql('b');
      expect(this.client.appId).to.eql('c');
      delete process.env.STREAM_URL;
      done();
    });
  });
});
