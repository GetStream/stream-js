var beforeEachFn = require('../utils/hooks').beforeEach,
  td = require('testdouble');

describe('[UNIT] Stream Personalization (node)', function() {
  beforeEach(beforeEachFn);

  beforeEach(function() {
    this.get = td.function();
    this.post = td.function();
    this.del = td.function();
    td.replace(this.client, 'get', this.get);
    td.replace(this.client, 'post', this.post);
    td.replace(this.client, 'delete', this.del);
  });

  afterEach(function() {
    td.reset();
  });

  describe('#get', function() {
    it('should send get request correctly with options (promise)', function() {
      var fakedJWT = 'Faked JWT';
      var resource = 'example';
      var options = { foo: 'bar', baz: 'qux' };

      this.client.personalizationToken = fakedJWT;
      this.client.personalization.get(resource, options);

      td.verify(
        this.get(
          {
            url: resource + '/',
            serviceName: 'personalization',
            qs: options,
            signature: fakedJWT,
          },
          undefined
        )
      );
    });

    it('should send get request correctly with options (cb)', function() {
      var fakedJWT = 'Faked JWT';
      var resource = 'example';
      var options = { foo: 'bar', baz: 'qux' };
      var cb = function() {};

      this.client.personalizationToken = fakedJWT;
      this.client.personalization.get(resource, options, cb);

      td.verify(
        this.get(
          {
            url: resource + '/',
            serviceName: 'personalization',
            qs: options,
            signature: fakedJWT,
          },
          cb
        )
      );
    });

    it('should send get request correctly without options (promise)', function() {
      var fakedJWT = 'Faked JWT';
      var resource = 'example';

      this.client.personalizationToken = fakedJWT;
      this.client.personalization.get(resource);

      td.verify(
        this.get(
          {
            url: resource + '/',
            serviceName: 'personalization',
            qs: {},
            signature: fakedJWT,
          },
          undefined
        )
      );
    });

    it('should send get request correctly without options (cb)', function() {
      var fakedJWT = 'Faked JWT';
      var resource = 'example';
      var cb = function() {};

      this.client.personalizationToken = fakedJWT;
      this.client.personalization.get(resource, cb);

      td.verify(
        this.get(
          {
            url: resource + '/',
            serviceName: 'personalization',
            qs: {},
            signature: fakedJWT,
          },
          cb
        )
      );
    });
  });

  describe('#post', function() {
    it('should send post request correctly with options and data (promise)', function() {
      var fakedJWT = 'Faked JWT';
      var resource = 'example';
      var data = { k: 'v' };
      var options = { foo: 'bar', baz: 'qux' };

      this.client.personalizationToken = fakedJWT;
      this.client.personalization.post(resource, options, data);

      td.verify(
        this.post(
          {
            url: resource + '/',
            serviceName: 'personalization',
            qs: options,
            body: data,
            signature: fakedJWT,
          },
          undefined
        )
      );
    });

    it('should send post request correctly with options and data (cb)', function() {
      var fakedJWT = 'Faked JWT';
      var resource = 'example';
      var options = { foo: 'bar', baz: 'qux' };
      var data = { k: 'v' };
      var cb = function() {};

      this.client.personalizationToken = fakedJWT;
      this.client.personalization.post(resource, options, data, cb);

      td.verify(
        this.post(
          {
            url: resource + '/',
            serviceName: 'personalization',
            qs: options,
            body: data,
            signature: fakedJWT,
          },
          cb
        )
      );
    });

    it('should send post request correctly with options (promise)', function() {
      var fakedJWT = 'Faked JWT';
      var resource = 'example';
      var options = { foo: 'bar', baz: 'qux' };

      this.client.personalizationToken = fakedJWT;
      this.client.personalization.post(resource, options);

      td.verify(
        this.post(
          {
            url: resource + '/',
            serviceName: 'personalization',
            qs: options,
            body: {},
            signature: fakedJWT,
          },
          undefined
        )
      );
    });

    it('should send post request correctly with options (cb)', function() {
      var fakedJWT = 'Faked JWT';
      var resource = 'example';
      var options = { foo: 'bar', baz: 'qux' };
      var cb = function() {};

      this.client.personalizationToken = fakedJWT;
      this.client.personalization.post(resource, options, cb);

      td.verify(
        this.post(
          {
            url: resource + '/',
            serviceName: 'personalization',
            qs: options,
            body: {},
            signature: fakedJWT,
          },
          cb
        )
      );
    });

    it('should send post request correctly without options or data (promise)', function() {
      var fakedJWT = 'Faked JWT';
      var resource = 'example';

      this.client.personalizationToken = fakedJWT;
      this.client.personalization.post(resource);

      td.verify(
        this.post(
          {
            url: resource + '/',
            serviceName: 'personalization',
            qs: {},
            body: {},
            signature: fakedJWT,
          },
          undefined
        )
      );
    });

    it('should send post request correctly without options or data (cb)', function() {
      var fakedJWT = 'Faked JWT';
      var resource = 'example';
      var cb = function() {};

      this.client.personalizationToken = fakedJWT;
      this.client.personalization.post(resource, cb);

      td.verify(
        this.post(
          {
            url: resource + '/',
            serviceName: 'personalization',
            qs: {},
            body: {},
            signature: fakedJWT,
          },
          cb
        )
      );
    });
  });

  describe('#delete', function() {
    it('should send delete request correctly with options (promise)', function() {
      var fakedJWT = 'Faked JWT';
      var resource = 'example';
      var options = { foo: 'bar', baz: 'qux' };

      this.client.personalizationToken = fakedJWT;
      this.client.personalization.delete(resource, options);

      td.verify(
        this.del(
          {
            url: resource + '/',
            serviceName: 'personalization',
            qs: options,
            signature: fakedJWT,
          },
          undefined
        )
      );
    });

    it('should send delete request correctly with options (cb)', function() {
      var fakedJWT = 'Faked JWT';
      var resource = 'example';
      var options = { foo: 'bar', baz: 'qux' };
      var cb = function() {};

      this.client.personalizationToken = fakedJWT;
      this.client.personalization.delete(resource, options, cb);

      td.verify(
        this.del(
          {
            url: resource + '/',
            serviceName: 'personalization',
            qs: options,
            signature: fakedJWT,
          },
          cb
        )
      );
    });

    it('should send delete request correctly without options (promise)', function() {
      var fakedJWT = 'Faked JWT';
      var resource = 'example';

      this.client.personalizationToken = fakedJWT;
      this.client.personalization.delete(resource);

      td.verify(
        this.del(
          {
            url: resource + '/',
            serviceName: 'personalization',
            qs: {},
            signature: fakedJWT,
          },
          undefined
        )
      );
    });

    it('should send delete request correctly without options (cb)', function() {
      var fakedJWT = 'Faked JWT';
      var resource = 'example';
      var cb = function() {};

      this.client.personalizationToken = fakedJWT;
      this.client.personalization.delete(resource, cb);

      td.verify(
        this.del(
          {
            url: resource + '/',
            serviceName: 'personalization',
            qs: {},
            signature: fakedJWT,
          },
          cb
        )
      );
    });
  });
});
