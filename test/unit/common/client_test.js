import expect from 'expect.js';
import td from 'testdouble/dist/testdouble';

import utils from '../../../src/utils';
import * as errors from '../../../src/errors';
import config from '../utils/config';
import { init, beforeEachFn } from '../utils/hooks';

function enrichKwargs(kwargs) {
  return kwargs;
}

describe('[UNIT] Stream Client (Common)', function () {
  init.call(this);
  beforeEach(beforeEachFn);
  afterEach(function () {
    td.reset();
  });

  it('#connect', function () {
    expect(this.client.apiKey).to.be(config.API_KEY);
    expect(this.client.version).to.be('v1.0');
    expect(this.client.fayeUrl).to.be('https://faye-us-east.stream-io-api.com/faye');
    expect(this.client.group).to.be('unspecified');
    expect(this.client.location).to.be(undefined);
    expect(this.client.expireTokens).to.be(false);
    expect(this.client.baseUrl).to.be('https://api.stream-io-api.com/api/');
  });

  describe('#on', function () {
    it('(1) without callback', function (done) {
      expect(this.client.on).to.be.a(Function);

      td.replace(this.client, 'enrichKwargs', enrichKwargs);

      this.client.on('request', function () {
        done();
      });

      this.client.get({ uri: 'test' });
    });

    it('(2) with callback', function (done) {
      expect(this.client.on).to.be.a(Function);

      td.replace(this.client, 'enrichKwargs', enrichKwargs);

      this.client.on('request', function () {
        done();
      });

      this.client.get({ uri: 'test' }, function () {});
    });
  });

  describe('#off', function () {
    it('(1) specific off', function (done) {
      expect(this.client.off).to.be.a(Function);

      td.replace(this.client, 'enrichKwargs', enrichKwargs);

      this.client.on('request', function () {
        done('Expected not to be called');
      });
      this.client.off('request');

      this.client.get({ uri: 'test' });

      done();
    });

    it('(2) global off', function (done) {
      expect(this.client.off).to.be.a(Function);

      td.replace(this.client, 'enrichKwargs', enrichKwargs);

      this.client.on('request', function () {
        done('Expected not to be called');
      });
      this.client.off();

      this.client.get({ uri: 'test' });

      done();
    });
  });

  it('#send', function (done) {
    expect(this.client.send).to.be.a(Function);

    this.client.on('test', function (a, b) {
      expect(a).to.be(100);
      expect(b).to.be(50);
      done();
    });

    this.client.send('test', 100, 50);
  });

  describe('#feed', function () {
    it('(1) throw', function () {
      const self = this;

      function toThrow() {
        self.client.feed();
      }

      expect(toThrow).to.throwException(function (e) {
        expect(e).to.be.a(errors.FeedError);
      });
    });

    it('(2) throw', function () {
      const self = this;

      function toThrow() {
        self.client.feed('user:jaap');
      }

      expect(toThrow).to.throwException(function (e) {
        expect(e).to.be.a(errors.FeedError);
      });
    });

    it('(3) throw', function () {
      const self = this;

      function toThrow() {
        self.client.feed('user###', 'jaap');
      }

      expect(toThrow).to.throwException(function (e) {
        expect(e).to.be.a(errors.FeedError);
      });
    });

    it('(4) throw', function () {
      const self = this;

      function toThrow() {
        self.client.feed('user', '###jaap');
      }

      expect(toThrow).to.throwException(function (e) {
        expect(e).to.be.a(errors.FeedError);
      });
    });

    it('(5) throw with colon', function () {
      const self = this;

      function toThrow() {
        self.client.feed('user:jaap', 'jaap');
      }

      expect(toThrow).to.throwException(function (e) {
        expect(e).to.be.a(errors.FeedError);
      });
    });
  });

  describe('#handleResponse', function () {
    it('(1) success 200', function () {
      const data = { success: true };
      const result = this.client.handleResponse({ status: 200, data });
      expect(result).to.be.eql(data);
    });

    it('(2) success 201', function () {
      const data = { success: true };
      const result = this.client.handleResponse({ status: 201, data });
      expect(result).to.be.eql(data);
    });

    it('(3) success 203', function () {
      const data = { success: true };
      const result = this.client.handleResponse({ status: 203, data });
      expect(result).to.be.eql(data);
    });

    it('(4) success 204', function () {
      const data = { success: true };
      const result = this.client.handleResponse({ status: 204, data });
      expect(result).to.be.eql(data);
    });

    it('(5) failure 400 status code', function () {
      const data = { error: true };
      expect(() => this.client.handleResponse({ status: 400, data })).to.throwException((err) => {
        expect(err).to.be.a(errors.StreamApiError);
        expect(err.error).to.be.eql(data);
        expect(err.response).to.be.eql({ status: 400, data });
      });
    });

    it('(6) failure 500 status code', function () {
      const data = { error: true };
      expect(() => this.client.handleResponse({ status: 500, data })).to.throwException((err) => {
        expect(err).to.be.a(errors.StreamApiError);
        expect(err.error).to.be.eql(data);
        expect(err.response).to.be.eql({ status: 500, data });
      });
    });
  });

  describe('#enrichUrl', function () {
    it('(1) api service', function () {
      const feedGroup = 'user';
      const url = this.client.enrichUrl(feedGroup);
      expect(url).to.be(`${this.client.baseUrl + this.client.version}/${feedGroup}`);
    });
  });

  describe('#enrichKwargs', function () {
    it('(1) api service - jwt signature', function () {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG5Eb2UiLCJhY3Rpb24iOiJyZWFkIn0.dfayorXXS1rAyd97BGCNgrCodPH9X3P80DPMH5b9D_A';

      const kwargs = this.client.enrichKwargs({
        url: 'feed',
        token: `${token}`,
      });

      expect(kwargs.params.api_key).to.be(this.client.apiKey);
      expect(kwargs.params.location).to.be(this.client.group);
      expect(kwargs.headers['stream-auth-type']).to.be('jwt');
      expect(kwargs.headers['X-Stream-Client']).to.be(this.client.userAgent());
      expect(kwargs.headers.Authorization).to.be(token);
      expect(kwargs.url).to.contain('api.stream-io-api.com');
    });

    it('(2) personalization service - jwt signature', function () {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiJwZXJzb25hbGl6YXRpb24iLCJmZWVkX2lkIjoiKiIsInVzZXJfaWQiOiIqIn0.JvX_IGajZSPD5zDOVpeZLkn0hhClMheN_ILnowyBUN';

      const kwargs = this.client.enrichKwargs({
        url: 'feed',
        serviceName: 'personalization',
        token: `${token}`,
      });

      expect(kwargs.params.api_key).to.be(this.client.apiKey);
      expect(kwargs.params.location).to.be(this.client.group);
      expect(kwargs.headers['stream-auth-type']).to.be('jwt');
      expect(kwargs.headers['X-Stream-Client']).to.be(this.client.userAgent());
      expect(kwargs.headers.Authorization).to.be(token);
      expect(kwargs.url).to.contain('personalization.stream-io-api.com');
    });

    it('other data included', function () {
      const kwargs = this.client.enrichKwargs({
        url: 'feed',
        qs: { with_activity: true },
        body: { reaction_id: 123 },
        headers: {
          'content-type': 'application',
        },
      });

      expect(kwargs.params.api_key).to.be(this.client.apiKey);
      expect(kwargs.params.location).to.be(this.client.group);
      expect(kwargs.params.with_activity).to.be(true);
      expect(kwargs.headers['X-Stream-Client']).to.be(this.client.userAgent());
      expect(kwargs.headers['content-type']).to.be('application');
      expect(kwargs.data).to.be.eql({ reaction_id: 123 });
      expect(kwargs.url).to.be('https://api.stream-io-api.com/api/v1.0/feed');
    });
  });

  describe('Requests', function () {
    const tdDoAxiosRequest = td.function();

    beforeEach(function () {
      this.client.doAxiosRequest = tdDoAxiosRequest;
      td.replace(this.client, 'enrichKwargs', enrichKwargs);
    });

    it('#get', function () {
      this.client.get({ url: 'feed' });

      td.verify(tdDoAxiosRequest('GET', { url: 'feed' }));
    });

    it('#post', function () {
      this.client.post({ url: 'feed' });

      td.verify(tdDoAxiosRequest('POST', { url: 'feed' }));
    });

    it('#put', function () {
      this.client.put({ url: 'feed' });

      td.verify(tdDoAxiosRequest('PUT', { url: 'feed' }));
    });

    it('#delete', function () {
      this.client.delete({ url: 'feed' });

      td.verify(tdDoAxiosRequest('DELETE', { url: 'feed' }));
    });

    it('#upload', function () {
      const onUploadProgress = td.function('onUploadProgress');
      const url = 'images';
      const uri = 'file://someFile.jpg';
      const name = 'name';
      const contentType = 'type';
      this.client.getOrCreateToken = () => 'token';

      const addFileToFormData = td.function('addFileToFormData');
      const fd = { getHeaders: config.IS_NODE_ENV ? () => 'headers' : '' };
      td.when(addFileToFormData(), { ignoreExtraArgs: true }).thenReturn(fd);
      td.replace(utils, 'addFileToFormData', addFileToFormData);

      this.client.upload(url, uri, name, contentType, onUploadProgress);

      td.verify(
        tdDoAxiosRequest('POST', {
          url: 'images',
          body: fd,
          headers: config.IS_NODE_ENV ? 'headers' : {},
          token: 'token',
          axiosOptions: {
            timeout: 0,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            onUploadProgress,
          },
        }),
      );
    });
  });

  describe('doAxiosRequest', function () {
    it('#get', function () {
      td.replace(this.client, 'enrichKwargs', enrichKwargs);
      const tdRequest = td.function();
      td.when(tdRequest({ method: 'GET', url: 'feed' })).thenResolve({ status: 200, data: { next: '' } });
      this.client.request = tdRequest;

      return this.client.get({ method: 'GET', url: 'feed' }).then((response) => {
        expect(response).to.be.eql({ next: '' });
      });
    });
  });
});
