var expect = require('expect.js'),
  beforeEachFn = require('../utils/hooks').beforeEach,
  errors = require('../../../src/getstream').errors,
  td = require('testdouble'),
  StreamClient = require('../../../src/lib/client');

describe('[UNIT] Stream Collections (node)', function() {
  let get;
  let post;
  let del;

  beforeEach(beforeEachFn);
  beforeEach(function() {
    get = td.function();
    post = td.function();
    del = td.function();
    td.replace(this.client, 'get', get);
    td.replace(this.client, 'post', post);
    td.replace(this.client, 'delete', del);
  });

  afterEach(function() {
    td.reset();
  });

  describe('#delete_many', function() {
    it('should send get request correctly with single id (callback)', function() {
      var fakedJWT = 'Faked JWT';
      var collectionName = 'user';
      var id = 'john';
      var cb = function() {};

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

  describe('#upsert', function() {
    it('should send post request correctly with single object (promise)', function() {
      var fakedJWT = 'Faked JWT';
      var collectionName = 'user';
      var data = { id: 'john', username: 'johndoe', favorite_color: 'gray' };

      this.client._collectionsToken = fakedJWT;
      this.client.collections.upsert(collectionName, data);

      var expected_body = { data: {} };
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

    it('should send post request correctly with single object (cb)', function() {
      var fakedJWT = 'Faked JWT';
      var collectionName = 'user';
      var data = { id: 'john', username: 'johndoe', favorite_color: 'gray' };
      var cb = function() {};

      this.client._collectionsToken = fakedJWT;
      this.client.collections.upsert(collectionName, data, cb);

      var expected_body = { data: {} };
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

    it('should send post request correctly with multiple objects (promise)', function() {
      var fakedJWT = 'Faked JWT';
      var collectionName = 'user';
      var data = [
        { id: 'john', username: 'johndoe', favorite_color: 'gray' },
        { id: 'dave', username: 'daveo', favorite_color: 'green' },
      ];

      this.client._collectionsToken = fakedJWT;
      this.client.collections.upsert(collectionName, data);

      var expected_body = { data: {} };
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

    it('should send post request correctly with multiple objects (cb)', function() {
      var fakedJWT = 'Faked JWT';
      var collectionName = 'user';
      var data = [
        { id: 'john', username: 'johndoe', favorite_color: 'gray' },
        { id: 'dave', username: 'daveo', favorite_color: 'green' },
      ];
      var cb = function() {};

      this.client._collectionsToken = fakedJWT;
      this.client.collections.upsert(collectionName, data, cb);

      var expected_body = { data: {} };
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

  describe('#select', function() {
    it('should send get request correctly with single id (promise)', function() {
      var fakedJWT = 'Faked JWT';
      var collectionName = 'user';
      var id = 'john';

      this.client._collectionsToken = fakedJWT;
      this.client.collections.select(collectionName, id);

      td.verify(
        get(
          {
            url: 'collections/',
            serviceName: 'api',
            qs: { foreign_ids: collectionName + ':' + id },
            signature: fakedJWT,
          },
          undefined,
        ),
      );
    });

    it('should send get request correctly with single id (callback)', function() {
      var fakedJWT = 'Faked JWT';
      var collectionName = 'user';
      var id = 'john';
      var cb = function() {};

      this.client._collectionsToken = fakedJWT;
      this.client.collections.select(collectionName, id, cb);

      td.verify(
        get(
          {
            url: 'collections/',
            serviceName: 'api',
            qs: { foreign_ids: collectionName + ':' + id },
            signature: fakedJWT,
          },
          cb,
        ),
      );
    });

    it('should send get request correctly with multiple ids (promise)', function() {
      var fakedJWT = 'Faked JWT';
      var collectionName = 'user';
      var ids = ['john', 'dave'];

      this.client._collectionsToken = fakedJWT;
      this.client.collections.select(collectionName, ids);

      td.verify(
        get(
          {
            url: 'collections/',
            serviceName: 'api',
            qs: {
              foreign_ids: ids
                .map(function(id) {
                  return collectionName + ':' + id;
                })
                .join(','),
            },
            signature: fakedJWT,
          },
          undefined,
        ),
      );
    });

    it('should send get request correctly with multiple ids (callback)', function() {
      var fakedJWT = 'Faked JWT';
      var collectionName = 'user';
      var ids = ['john', 'dave'];
      var cb = function() {};

      this.client._collectionsToken = fakedJWT;
      this.client.collections.select(collectionName, ids, cb);

      td.verify(
        get(
          {
            url: 'collections/',
            serviceName: 'api',
            qs: {
              foreign_ids: ids
                .map(function(id) {
                  return collectionName + ':' + id;
                })
                .join(','),
            },
            signature: fakedJWT,
          },
          cb,
        ),
      );
    });

    describe('No secret provided', function() {
      it('should raise SiteErrors', function() {
        var client = new StreamClient('stub-key', null, 9498);
        var collectionName = 'user';
        var ids = ['john', 'dave'];
        var data = { id: 'john', username: 'johndoe', favorite_color: 'gray' };
        var cb = function() {};

        // upsert
        expect(function() {
          client.collections.upsert(collectionName, data, cb);
        }).to.throwException(function(e) {
          expect(e).to.be.a(errors.SiteError);
        });

        // select
        expect(function() {
          client.collections.select(collectionName, ids, cb);
        }).to.throwException(function(e) {
          expect(e).to.be.a(errors.SiteError);
        });

        // delete
        expect(function() {
          client.collections.deleteMany(collectionName, ids, cb);
        }).to.throwException(function(e) {
          expect(e).to.be.a(errors.SiteError);
        });
      });
    });
  });
});
