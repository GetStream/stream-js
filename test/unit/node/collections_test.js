import expect from 'expect.js';
import td from 'testdouble';

import StreamClient from '../../../src/lib/client';
import errors from '../../../src/lib/errors';
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
    it('should send get request correctly with single id (callback)', function () {
      const fakedJWT = 'Faked JWT';
      const collectionName = 'user';
      const id = 'john';
      const cb = function () {};

      this.client._collectionsToken = fakedJWT;
      this.client.collections.deleteMany(collectionName, id, cb);

      td.verify(
        del(
          {
            url: 'collections/',
            serviceName: 'api',
            qs: {
              collection_name: collectionName,
              ids: id,
            },
            signature: fakedJWT,
          },
          cb,
        ),
      );
    });
  });

  describe('#upsert', function () {
    it('should send post request correctly with single object (promise)', function () {
      const fakedJWT = 'Faked JWT';
      const collectionName = 'user';
      const data = { id: 'john', username: 'johndoe', favorite_color: 'gray' };

      this.client._collectionsToken = fakedJWT;
      this.client.collections.upsert(collectionName, data);

      const expected_body = { data: {} };
      expected_body.data[collectionName] = [data];
      td.verify(
        post(
          {
            url: 'collections/',
            serviceName: 'api',
            body: expected_body,
            signature: fakedJWT,
          },
          undefined,
        ),
      );
    });

    it('should send post request correctly with single object (cb)', function () {
      const fakedJWT = 'Faked JWT';
      const collectionName = 'user';
      const data = { id: 'john', username: 'johndoe', favorite_color: 'gray' };
      const cb = function () {};

      this.client._collectionsToken = fakedJWT;
      this.client.collections.upsert(collectionName, data, cb);

      const expected_body = { data: {} };
      expected_body.data[collectionName] = [data];
      td.verify(
        post(
          {
            url: 'collections/',
            serviceName: 'api',
            body: expected_body,
            signature: fakedJWT,
          },
          cb,
        ),
      );
    });

    it('should send post request correctly with multiple objects (promise)', function () {
      const fakedJWT = 'Faked JWT';
      const collectionName = 'user';
      const data = [
        { id: 'john', username: 'johndoe', favorite_color: 'gray' },
        { id: 'dave', username: 'daveo', favorite_color: 'green' },
      ];

      this.client._collectionsToken = fakedJWT;
      this.client.collections.upsert(collectionName, data);

      const expected_body = { data: {} };
      expected_body.data[collectionName] = data;
      td.verify(
        post(
          {
            url: 'collections/',
            serviceName: 'api',
            body: expected_body,
            signature: fakedJWT,
          },
          undefined,
        ),
      );
    });

    it('should send post request correctly with multiple objects (cb)', function () {
      const fakedJWT = 'Faked JWT';
      const collectionName = 'user';
      const data = [
        { id: 'john', username: 'johndoe', favorite_color: 'gray' },
        { id: 'dave', username: 'daveo', favorite_color: 'green' },
      ];
      const cb = function () {};

      this.client._collectionsToken = fakedJWT;
      this.client.collections.upsert(collectionName, data, cb);

      const expected_body = { data: {} };
      expected_body.data[collectionName] = data;
      td.verify(
        post(
          {
            url: 'collections/',
            serviceName: 'api',
            body: expected_body,
            signature: fakedJWT,
          },
          cb,
        ),
      );
    });
  });

  describe('#select', function () {
    it('should send get request correctly with single id (promise)', function () {
      const fakedJWT = 'Faked JWT';
      const collectionName = 'user';
      const id = 'john';

      this.client._collectionsToken = fakedJWT;
      this.client.collections.select(collectionName, id);

      td.verify(
        get(
          {
            url: 'collections/',
            serviceName: 'api',
            qs: { foreign_ids: `${collectionName}:${id}` },
            signature: fakedJWT,
          },
          undefined,
        ),
      );
    });

    it('should send get request correctly with single id (callback)', function () {
      const fakedJWT = 'Faked JWT';
      const collectionName = 'user';
      const id = 'john';
      const cb = function () {};

      this.client._collectionsToken = fakedJWT;
      this.client.collections.select(collectionName, id, cb);

      td.verify(
        get(
          {
            url: 'collections/',
            serviceName: 'api',
            qs: { foreign_ids: `${collectionName}:${id}` },
            signature: fakedJWT,
          },
          cb,
        ),
      );
    });

    it('should send get request correctly with multiple ids (promise)', function () {
      const fakedJWT = 'Faked JWT';
      const collectionName = 'user';
      const ids = ['john', 'dave'];

      this.client._collectionsToken = fakedJWT;
      this.client.collections.select(collectionName, ids);

      td.verify(
        get(
          {
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
          },
          undefined,
        ),
      );
    });

    it('should send get request correctly with multiple ids (callback)', function () {
      const fakedJWT = 'Faked JWT';
      const collectionName = 'user';
      const ids = ['john', 'dave'];
      const cb = function () {};

      this.client._collectionsToken = fakedJWT;
      this.client.collections.select(collectionName, ids, cb);

      td.verify(
        get(
          {
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
          },
          cb,
        ),
      );
    });

    describe('No secret provided', function () {
      it('should raise SiteErrors', function () {
        const client = new StreamClient('stub-key', null, 9498);
        const collectionName = 'user';
        const ids = ['john', 'dave'];
        const data = { id: 'john', username: 'johndoe', favorite_color: 'gray' };
        const cb = function () {};

        // upsert
        expect(function () {
          client.collections.upsert(collectionName, data, cb);
        }).to.throwException(function (e) {
          expect(e).to.be.a(errors.SiteError);
        });

        // select
        expect(function () {
          client.collections.select(collectionName, ids, cb);
        }).to.throwException(function (e) {
          expect(e).to.be.a(errors.SiteError);
        });

        // delete
        expect(function () {
          client.collections.deleteMany(collectionName, ids, cb);
        }).to.throwException(function (e) {
          expect(e).to.be.a(errors.SiteError);
        });
      });
    });
  });
});
