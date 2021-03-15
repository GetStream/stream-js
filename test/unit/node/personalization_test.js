import expect from 'expect.js';
import td from 'testdouble/dist/testdouble';

import { StreamClient, SiteError } from '../../../src';
import { beforeEachFn } from '../utils/hooks';

describe('[UNIT] Stream Personalization (node)', function () {
  let get;
  let post;
  let del;

  beforeEach(beforeEachFn);
  beforeEach(function () {
    get = td.function();
    post = td.function();
    del = td.function();
    td.replace(this.client, 'get', get);
    td.replace(this.client, 'post', post);
    td.replace(this.client, 'delete', del);
  });

  afterEach(function () {
    td.reset();
  });

  describe('#get', function () {
    it('should send get request correctly with options', function () {
      const fakedJWT = 'Faked JWT';
      const resource = 'example';
      const options = { foo: 'bar', baz: 'qux' };

      this.client._personalizationToken = fakedJWT;
      this.client.personalization.get(resource, options);

      td.verify(
        get({
          url: `${resource}/`,
          serviceName: 'personalization',
          qs: options,
          token: fakedJWT,
        }),
      );
    });

    it('should send get request correctly without options', function () {
      const fakedJWT = 'Faked JWT';
      const resource = 'example';

      this.client._personalizationToken = fakedJWT;
      this.client.personalization.get(resource);

      td.verify(
        get({
          url: `${resource}/`,
          serviceName: 'personalization',
          qs: {},
          token: fakedJWT,
        }),
      );
    });
  });

  describe('#post', function () {
    it('should send post request correctly with options and data', function () {
      const fakedJWT = 'Faked JWT';
      const resource = 'example';
      const data = { k: 'v' };
      const options = { foo: 'bar', baz: 'qux' };

      this.client._personalizationToken = fakedJWT;
      this.client.personalization.post(resource, options, data);

      td.verify(
        post({
          url: `${resource}/`,
          serviceName: 'personalization',
          qs: options,
          body: data,
          token: fakedJWT,
        }),
      );
    });

    it('should send post request correctly with options', function () {
      const fakedJWT = 'Faked JWT';
      const resource = 'example';
      const options = { foo: 'bar', baz: 'qux' };

      this.client._personalizationToken = fakedJWT;
      this.client.personalization.post(resource, options);

      td.verify(
        post({
          url: `${resource}/`,
          serviceName: 'personalization',
          qs: options,
          body: {},
          token: fakedJWT,
        }),
      );
    });

    it('should send post request correctly without options or data', function () {
      const fakedJWT = 'Faked JWT';
      const resource = 'example';

      this.client._personalizationToken = fakedJWT;
      this.client.personalization.post(resource);

      td.verify(
        post({
          url: `${resource}/`,
          serviceName: 'personalization',
          qs: {},
          body: {},
          token: fakedJWT,
        }),
      );
    });
  });

  describe('#delete', function () {
    it('should send delete request correctly with options', function () {
      const fakedJWT = 'Faked JWT';
      const resource = 'example';
      const options = { foo: 'bar', baz: 'qux' };

      this.client._personalizationToken = fakedJWT;
      this.client.personalization.delete(resource, options);

      td.verify(
        del({
          url: `${resource}/`,
          serviceName: 'personalization',
          qs: options,
          token: fakedJWT,
        }),
      );
    });

    it('should send delete request correctly without options', function () {
      const fakedJWT = 'Faked JWT';
      const resource = 'example';

      this.client._personalizationToken = fakedJWT;
      this.client.personalization.delete(resource);

      td.verify(
        del({
          url: `${resource}/`,
          serviceName: 'personalization',
          qs: {},
          token: fakedJWT,
        }),
      );
    });
  });

  describe('No secret provided', function () {
    it('should raise SiteErrors', function () {
      const client = new StreamClient('stub-key', null, 9498);
      const resource = 'example';
      const options = { foo: 'bar', baz: 'qux' };
      const data = { k: 'v' };

      // get
      expect(function () {
        client.personalization.get(resource, options);
      }).to.throwException(function (e) {
        expect(e).to.be.a(SiteError);
      });

      // post
      expect(function () {
        client.personalization.post(resource, options, data);
      }).to.throwException(function (e) {
        expect(e).to.be.a(SiteError);
      });

      // delete
      expect(function () {
        client.personalization.delete(resource);
      }).to.throwException(function (e) {
        expect(e).to.be.a(SiteError);
      });
    });
  });
});
