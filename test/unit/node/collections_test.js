import expect from 'expect.js';
import td from 'testdouble';

import { StreamClient, SiteError } from '../../../src';
import { beforeEachFn } from '../utils/hooks';

describe('[UNIT] Stream Collections (node)', function () {
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

  describe('#delete_many', function () {
    it('should send get request correctly with single id', function () {
      const fakedJWT = 'Faked JWT';
      const collectionName = 'user';
      const id = 'john';

      this.client._collectionsToken = fakedJWT;
      this.client.collections.deleteMany(collectionName, id);

      td.verify(
        del({
          url: 'collections/',
          serviceName: 'api',
          qs: {
            collection_name: collectionName,
            ids: id,
          },
          signature: fakedJWT,
        }),
      );
    });
  });

  describe('#upsert', function () {
    it('should send post request correctly with single object', function () {
      const fakedJWT = 'Faked JWT';
      const collectionName = 'user';
      const data = { id: 'john', username: 'johndoe', favorite_color: 'gray' };

      this.client._collectionsToken = fakedJWT;
      this.client.collections.upsert(collectionName, data);

      const body = { data: {} };
      body.data[collectionName] = [data];
      td.verify(
        post({
          url: 'collections/',
          serviceName: 'api',
          body,
          signature: fakedJWT,
        }),
      );
    });

    it('should send post request correctly with single object', function () {
      const fakedJWT = 'Faked JWT';
      const collectionName = 'user';
      const data = { id: 'john', username: 'johndoe', favorite_color: 'gray' };

      this.client._collectionsToken = fakedJWT;
      this.client.collections.upsert(collectionName, data);

      const body = { data: {} };
      body.data[collectionName] = [data];
      td.verify(
        post({
          url: 'collections/',
          serviceName: 'api',
          body,
          signature: fakedJWT,
        }),
      );
    });

    it('should send post request correctly with multiple objects', function () {
      const fakedJWT = 'Faked JWT';
      const collectionName = 'user';
      const data = [
        { id: 'john', username: 'johndoe', favorite_color: 'gray' },
        { id: 'dave', username: 'daveo', favorite_color: 'green' },
      ];

      this.client._collectionsToken = fakedJWT;
      this.client.collections.upsert(collectionName, data);

      const body = { data: {} };
      body.data[collectionName] = data;
      td.verify(
        post({
          url: 'collections/',
          serviceName: 'api',
          body,
          signature: fakedJWT,
        }),
      );
    });
  });

  describe('#select', function () {
    it('should send get request correctly with single id', function () {
      const fakedJWT = 'Faked JWT';
      const collectionName = 'user';
      const id = 'john';

      this.client._collectionsToken = fakedJWT;
      this.client.collections.select(collectionName, id);

      td.verify(
        get({
          url: 'collections/',
          serviceName: 'api',
          qs: { foreign_ids: `${collectionName}:${id}` },
          signature: fakedJWT,
        }),
      );
    });

    it('should send get request correctly with single id', function () {
      const fakedJWT = 'Faked JWT';
      const collectionName = 'user';
      const id = 'john';

      this.client._collectionsToken = fakedJWT;
      this.client.collections.select(collectionName, id);

      td.verify(
        get({
          url: 'collections/',
          serviceName: 'api',
          qs: { foreign_ids: `${collectionName}:${id}` },
          signature: fakedJWT,
        }),
      );
    });

    it('should send get request correctly with multiple ids', function () {
      const fakedJWT = 'Faked JWT';
      const collectionName = 'user';
      const ids = ['john', 'dave'];

      this.client._collectionsToken = fakedJWT;
      this.client.collections.select(collectionName, ids);

      td.verify(
        get({
          url: 'collections/',
          serviceName: 'api',
          qs: {
            foreign_ids: ids
              .map(function (id) {
                return `${collectionName}:${id}`;
              })
              .join(','),
          },
          signature: fakedJWT,
        }),
      );
    });

    describe('No secret provided', function () {
      it('should raise SiteErrors', function () {
        const client = new StreamClient('stub-key', null, 9498);
        const collectionName = 'user';
        const ids = ['john', 'dave'];
        const data = { id: 'john', username: 'johndoe', favorite_color: 'gray' };

        // upsert
        expect(function () {
          client.collections.upsert(collectionName, data);
        }).to.throwException(function (e) {
          expect(e).to.be.a(SiteError);
        });

        // select
        expect(function () {
          client.collections.select(collectionName, ids);
        }).to.throwException(function (e) {
          expect(e).to.be.a(SiteError);
        });

        // delete
        expect(function () {
          client.collections.deleteMany(collectionName, ids);
        }).to.throwException(function (e) {
          expect(e).to.be.a(SiteError);
        });
      });
    });
  });
});
