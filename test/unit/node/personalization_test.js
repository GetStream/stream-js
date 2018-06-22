var expect = require('expect.js'),
    beforeEachFn = require('../utils/hooks').beforeEach,
    td = require('testdouble'),
    stream = require('../../../src/getstream'),
    signing = require('../../../src/lib/signing'),
    Personalization = require('../../../src/lib/personalization');


describe('[UNIT] Stream Personalization (node)', function() {

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

    describe('#get', function() {

        it('should send get request correctly with options (promise)', function() {
            var fakedJWT = "Faked JWT";
            var resource = 'example';
            var options = {foo: 'bar', baz: 'qux'};

            this.client.personalizationToken = fakedJWT;
            this.client.personalization.get(resource, options);

            td.verify(get({
                            url: resource + '/',
                            serviceName: 'personalization',
                            qs: options,
                            signature: fakedJWT
                          }, undefined));
        });

        it('should send get request correctly with options (cb)', function() {
            var fakedJWT = "Faked JWT";
            var resource = 'example';
            var options = {foo: 'bar', baz: 'qux'};
            var cb = function() {};

            this.client.personalizationToken = fakedJWT;
            this.client.personalization.get(resource, options, cb);

            td.verify(get({
                            url: resource + '/',
                            serviceName: 'personalization',
                            qs: options,
                            signature: fakedJWT
                          },
                          callback=cb));
        });

        it('should send get request correctly without options (promise)', function() {
            var fakedJWT = "Faked JWT";
            var resource = 'example';

            this.client.personalizationToken = fakedJWT;
            this.client.personalization.get(resource);

            td.verify(get({
                            url: resource + '/',
                            serviceName: 'personalization',
                            qs: {},
                            signature: fakedJWT
                          }, undefined));
        });

        it('should send get request correctly without options (cb)', function() {
            var fakedJWT = "Faked JWT";
            var resource = 'example';
            var cb = function() {};

            this.client.personalizationToken = fakedJWT;
            this.client.personalization.get(resource, cb);

            td.verify(get({
                            url: resource + '/',
                            serviceName: 'personalization',
                            qs: {},
                            signature: fakedJWT
                          },
                          callback=cb));
        });
    });

    describe('#post', function() {

        it('should send post request correctly with options and data (promise)', function() {
            var fakedJWT = "Faked JWT";
            var resource = 'example';
            var data = {k: 'v'};
            var options = {foo: 'bar', baz: 'qux'};

            this.client.personalizationToken = fakedJWT;
            this.client.personalization.post(resource, options, data);

            td.verify(post({
                            url: resource + '/',
                            serviceName: 'personalization',
                            qs: options,
                            body: data,
                            signature: fakedJWT
                          }, undefined));
        });

        it('should send post request correctly with options and data (cb)', function() {
            var fakedJWT = "Faked JWT";
            var resource = 'example';
            var options = {foo: 'bar', baz: 'qux'};
            var data = {k: 'v'};
            var cb = function() {};

            this.client.personalizationToken = fakedJWT;
            this.client.personalization.post(resource, options, data, cb);

            td.verify(post({
                            url: resource + '/',
                            serviceName: 'personalization',
                            qs: options,
                            body: data,
                            signature: fakedJWT
                          },
                          callback=cb));
        });

        it('should send post request correctly with options (promise)', function() {
            var fakedJWT = "Faked JWT";
            var resource = 'example';
            var options = {foo: 'bar', baz: 'qux'};

            this.client.personalizationToken = fakedJWT;
            this.client.personalization.post(resource, options);

            td.verify(post({
                            url: resource + '/',
                            serviceName: 'personalization',
                            qs: options,
                            body: {},
                            signature: fakedJWT
                          }, undefined));
        });

        it('should send post request correctly with options (cb)', function() {
            var fakedJWT = "Faked JWT";
            var resource = 'example';
            var options = {foo: 'bar', baz: 'qux'};
            var cb = function() {};

            this.client.personalizationToken = fakedJWT;
            this.client.personalization.post(resource, options, cb);

            td.verify(post({
                            url: resource + '/',
                            serviceName: 'personalization',
                            qs: options,
                            body: {},
                            signature: fakedJWT
                          },
                          callback=cb));
        });


        it('should send post request correctly without options or data (promise)', function() {
            var fakedJWT = "Faked JWT";
            var resource = 'example';

            this.client.personalizationToken = fakedJWT;
            this.client.personalization.post(resource);

            td.verify(post({
                            url: resource + '/',
                            serviceName: 'personalization',
                            qs: {},
                            body: {},
                            signature: fakedJWT
                          }, undefined));
        });

        it('should send post request correctly without options or data (cb)', function() {
            var fakedJWT = "Faked JWT";
            var resource = 'example';
            var cb = function() {};

            this.client.personalizationToken = fakedJWT;
            this.client.personalization.post(resource, cb);

            td.verify(post({
                            url: resource + '/',
                            serviceName: 'personalization',
                            qs: {},
                            body: {},
                            signature: fakedJWT
                          },
                          callback=cb));
        });
    });

    describe('#delete', function() {

        it('should send delete request correctly with options (promise)', function() {
            var fakedJWT = "Faked JWT";
            var resource = 'example';
            var options = {foo: 'bar', baz: 'qux'};

            this.client.personalizationToken = fakedJWT;
            this.client.personalization.delete(resource, options);

            td.verify(del({
                            url: resource + '/',
                            serviceName: 'personalization',
                            qs: options,
                            signature: fakedJWT
                          }, undefined));
        });

        it('should send delete request correctly with options (cb)', function() {
            var fakedJWT = "Faked JWT";
            var resource = 'example';
            var options = {foo: 'bar', baz: 'qux'};
            var cb = function() {};

            this.client.personalizationToken = fakedJWT;
            this.client.personalization.delete(resource, options, cb);

            td.verify(del({
                            url: resource + '/',
                            serviceName: 'personalization',
                            qs: options,
                            signature: fakedJWT
                          },
                          callback=cb));
        });

        it('should send delete request correctly without options (promise)', function() {
            var fakedJWT = "Faked JWT";
            var resource = 'example';

            this.client.personalizationToken = fakedJWT;
            this.client.personalization.delete(resource);

            td.verify(del({
                            url: resource + '/',
                            serviceName: 'personalization',
                            qs: {},
                            signature: fakedJWT
                          }, undefined));
        });

        it('should send delete request correctly without options (cb)', function() {
            var fakedJWT = "Faked JWT";
            var resource = 'example';
            var cb = function() {};

            this.client.personalizationToken = fakedJWT;
            this.client.personalization.delete(resource, cb);

            td.verify(del({
                            url: resource + '/',
                            serviceName: 'personalization',
                            qs: {},
                            signature: fakedJWT
                          },
                          callback=cb));
        });
    });
});
