var expect = require('expect.js'),
    beforeEachFn = require('../utils/hooks').beforeEach,
    td = require('testdouble'),
    stream = require('../../../src/getstream'),
    signing = require('../../../src/lib/signing'),
    Collections = require('../../../src/lib/collections');


describe('[UNIT] Stream Collections (node)', function() {

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

    describe('#upsert', function() {

        it('should send post request correctly with single object (promise)', function() {
            var fakedJWT = 'Faked JWT';
            var collectionName = 'user';
            var data = {'id': 'john', 'username': 'johndoe', 'favorite_color': 'gray'};

            this.client.collectionsToken = fakedJWT;
            this.client.collections.upsert(collectionName, data);

            var expected_body = {data: {}};
            expected_body.data[collectionName] = [data];
            td.verify(post(
              {
                url: 'meta/',
                serviceName: 'api',
                body: expected_body,
                signature: fakedJWT
              },
              undefined));
        });

        it('should send post request correctly with single object (cb)', function() {
            var fakedJWT = 'Faked JWT';
            var collectionName = 'user';
            var data = {'id': 'john', 'username': 'johndoe', 'favorite_color': 'gray'};
            var cb = function() {};

            this.client.collectionsToken = fakedJWT;
            this.client.collections.upsert(collectionName, data, cb);

            var expected_body = {data: {}};
            expected_body.data[collectionName] = [data];
            td.verify(post(
              {
                url: 'meta/',
                serviceName: 'api',
                body: expected_body,
                signature: fakedJWT
              },
              cb));
        });

        it('should send post request correctly with multiple objects (promise)', function() {
            var fakedJWT = 'Faked JWT';
            var collectionName = 'user';
            var data = [
                {'id': 'john', 'username': 'johndoe', 'favorite_color': 'gray'},
                {'id': 'dave', 'username': 'daveo', 'favorite_color': 'green'}
            ];

            this.client.collectionsToken = fakedJWT;
            this.client.collections.upsert(collectionName, data);

            var expected_body = {data: {}};
            expected_body.data[collectionName] = data;
            td.verify(post(
              {
                url: 'meta/',
                serviceName: 'api',
                body: expected_body,
                signature: fakedJWT
              },
              undefined));
        });

        it('should send post request correctly with multiple objects (cb)', function() {
            var fakedJWT = 'Faked JWT';
            var collectionName = 'user';
            var data = [
                {'id': 'john', 'username': 'johndoe', 'favorite_color': 'gray'},
                {'id': 'dave', 'username': 'daveo', 'favorite_color': 'green'}
            ];
            var cb = function() {};

            this.client.collectionsToken = fakedJWT;
            this.client.collections.upsert(collectionName, data, cb);

            var expected_body = {data: {}};
            expected_body.data[collectionName] = data;
            td.verify(post(
              {
                url: 'meta/',
                serviceName: 'api',
                body: expected_body,
                signature: fakedJWT
              },
              cb));
        });
    });

    describe('#select', function() {

        it('should send get request correctly with single id (promise)', function() {
            var fakedJWT = 'Faked JWT';
            var collectionName = 'user';
            var id = 'john';

            this.client.collectionsToken = fakedJWT;
            this.client.collections.select(collectionName, id);

            td.verify(get(
              {
                url: 'meta/',
                serviceName: 'api',
                qs: {'foreign_ids': collectionName + ':' + id},
                signature: fakedJWT
              },
              undefined));
        });

        it('should send get request correctly with single id (callback)', function() {
            var fakedJWT = 'Faked JWT';
            var collectionName = 'user';
            var id = 'john';
            var cb = function() {};

            this.client.collectionsToken = fakedJWT;
            this.client.collections.select(collectionName, id, cb);

            td.verify(get(
              {
                url: 'meta/',
                serviceName: 'api',
                qs: {'foreign_ids': collectionName + ':' + id},
                signature: fakedJWT
              },
              cb));
        });

        it('should send get request correctly with multiple ids (promise)', function() {
            var fakedJWT = 'Faked JWT';
            var collectionName = 'user';
            var ids = ['john', 'dave'];

            this.client.collectionsToken = fakedJWT;
            this.client.collections.select(collectionName, ids);

            td.verify(get(
              {
                url: 'meta/',
                serviceName: 'api',
                qs: {'foreign_ids': ids.map(function (id) { return collectionName + ':' + id;}).join(',')},
                signature: fakedJWT
              },
              undefined));
        });

        it('should send get request correctly with multiple ids (callback)', function() {
            var fakedJWT = 'Faked JWT';
            var collectionName = 'user';
            var ids = ['john', 'dave'];
            var cb = function() {};

            this.client.collectionsToken = fakedJWT;
            this.client.collections.select(collectionName, ids, cb);

            td.verify(get(
              {
                url: 'meta/',
                serviceName: 'api',
                qs: {'foreign_ids': ids.map(function (id) { return collectionName + ':' + id;}).join(',')},
                signature: fakedJWT
              },
              cb));
        });

    });

});
