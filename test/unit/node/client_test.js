var StreamFeed = require('../../../src/lib/feed'),
  expect = require('expect.js'),
  beforeEachFn = require('../utils/hooks').beforeEach,
  td = require('testdouble'),
  stream = require('../../../src/getstream'),
  StreamClient = require('../../../src/lib/client');
var jwtDecode = require('jwt-decode');

describe('[UNIT] Stream Client instantiation (Node)', function() {
  it('with secret', function() {
    new StreamClient('stub-key', 'stub-secret', 9498);
  });

  it('without secret', function() {
    new StreamClient('stub-key', null, 9498);
  });
});

describe('[UNIT] Stream Client (Node)', function() {
  beforeEach(beforeEachFn);

  it('#updateActivities', function() {
    var self = this;

    expect(function() {
      self.client.updateActivities('A-String-Thing');
    }).to.throwException(function(e) {
      expect(e).to.be.a(TypeError);
    });
  });

  it('#userAgent', function() {
    var useragent = this.client.userAgent();

    expect(useragent).to.be('stream-javascript-client-node-unknown');
  });

  it('#feed', function() {
    var feed = this.client.feed('user', 'jaap', '123456789');

    expect(feed).to.be.a(StreamFeed);
  });

  describe('#enrichUrl', function() {
    it('(1) personalization service', function() {
      var resource = 'influencers';
      var url = this.client.enrichUrl(resource, 'personalization');
      expect(url).to.be(
        'https://personalization.stream-io-api.com/personalization/' +
          this.client.version +
          '/' +
          resource,
      );
    });
  });

  describe('#updateActivities', function() {
    it('throws', function() {
      function isGoingToThrow1() {
        this.client.updateActivities({});
      }

      function isGoingToThrow2() {
        this.client.updateActivities(0);
      }

      function isGoingToThrow3() {
        this.client.updateActivities(null);
      }

      function isNotGoingToThrow() {
        this.client.updateActivities([]);
      }

      function isTypeError(err) {
        expect(err).to.be.a(TypeError);
      }

      expect(isGoingToThrow1).to.throwException(isTypeError);
      expect(isGoingToThrow2).to.throwException(isTypeError);
      expect(isGoingToThrow3).to.throwException(isTypeError);
      expect(isNotGoingToThrow).to.not.throw;
    });

    it('(1) works', function() {
      var post = td.function();
      td.replace(this.client, 'post', post);

      var activities = [{ actor: 'matthisk', object: 0, verb: 'do' }];

      this.client.updateActivities(activities);

      td.verify(
        post(
          td.matchers.contains({
            url: 'activities/',
          }),
          undefined,
        ),
      );
    });

    it('(2) works - callback', function() {
      var post = td.function();
      td.replace(this.client, 'post', post);

      var activities = [{ actor: 'matthisk', object: 0, verb: 'do' }];
      var fn = function() {};

      this.client.updateActivities(activities, fn);

      td.verify(
        post(
          td.matchers.contains({
            url: 'activities/',
          }),
          fn,
        ),
      );
    });

    it('(3) update single activity', function() {
      var post = td.function();
      td.replace(this.client, 'post', post);

      var activities = [{ actor: 'matthisk', object: 0, verb: 'do' }];

      this.client.updateActivity(activities[0]);

      td.verify(
        post(
          td.matchers.contains({
            url: 'activities/',
          }),
          undefined,
        ),
      );
    });

    it('(3) update single activity - callback', function() {
      var fn = function() {};
      var post = td.function();
      td.replace(this.client, 'post', post);

      var activities = [{ actor: 'matthisk', object: 0, verb: 'do' }];

      this.client.updateActivity(activities[0], fn);

      td.verify(
        post(
          td.matchers.contains({
            url: 'activities/',
          }),
          fn,
        ),
      );
    });
  });

  describe('#getActivities', function() {
    it('throws', function() {
      var self = this;

      function isGoingToThrow1() {
        self.client.getActivities({});
      }

      function isGoingToThrow2() {
        self.client.getActivities(0);
      }

      function isGoingToThrow3() {
        self.client.getActivities(null);
      }

      function isGoingToThrow4() {
        self.client.getActivities([]);
      }

      function isNotGoingToThrow() {
        self.client.getActivities({ ids: [] });
        self.client.getActivities({ foreignIDTimes: [] });
      }

      function isTypeError(err) {
        expect(err).to.be.a(TypeError);
      }

      expect(isGoingToThrow1).to.throwException(isTypeError);
      expect(isGoingToThrow2).to.throwException(isTypeError);
      expect(isGoingToThrow3).to.throwException(isTypeError);
      expect(isGoingToThrow4).to.throwException(isTypeError);
      expect(isNotGoingToThrow).to.not.throwException(isTypeError);
    });

    describe('by ID', function() {
      it('(1) works', function() {
        var get = td.function();
        td.replace(this.client, 'get', get);

        var ids = ['one', 'two', 'three'];

        this.client.getActivities({ ids: ids });

        td.verify(
          get(
            td.matchers.contains({
              url: 'activities/',
            }),
            undefined,
          ),
        );
      });

      it('(2) works - callback', function() {
        var get = td.function();
        td.replace(this.client, 'get', get);

        var ids = ['one', 'two', 'three'];
        var fn = function() {};

        this.client.getActivities({ ids: ids }, fn);

        td.verify(
          get(
            td.matchers.contains({
              url: 'activities/',
            }),
            fn,
          ),
        );
      });
    });

    describe('by foreign ID and time', function() {
      it('(1) works', function() {
        var get = td.function();
        td.replace(this.client, 'get', get);

        var foreignIDTimes = [
          { foreignID: 'like:1', time: '2018-07-08T14:09:36.000000' },
          { foreignID: 'post:2', time: '2018-07-09T20:30:40.000000' },
        ];

        this.client.getActivities({ foreignIDTimes: foreignIDTimes });

        td.verify(
          get(
            td.matchers.contains({
              url: 'activities/',
            }),
            undefined,
          ),
        );
      });

      it('(2) works - callback', function() {
        var get = td.function();
        td.replace(this.client, 'get', get);

        var foreignIDTimes = [
          { foreignID: 'like:1', time: '2018-07-08T14:09:36.000000' },
          { foreignID: 'post:2', time: '2018-07-09T20:30:40.000000' },
        ];
        var fn = function() {};

        this.client.getActivities({ foreignIDTimes: foreignIDTimes }, fn);

        td.verify(
          get(
            td.matchers.contains({
              url: 'activities/',
            }),
            fn,
          ),
        );
      });
    });
  });

  describe('#activityPartialUpdate', function() {
    it('throws', function() {
      var self = this;

      function isGoingToThrow1() {
        self.client.activityPartialUpdate({});
      }

      function isGoingToThrow2() {
        self.client.activityPartialUpdate(0);
      }

      function isGoingToThrow3() {
        self.client.activityPartialUpdate(null);
      }

      function isGoingToThrow4() {
        self.client.activityPartialUpdate({ foreignID: 'foo:bar' });
      }

      function isGoingToThrow5() {
        self.client.activityPartialUpdate({
          time: '2016-11-10T13:20:00.000000',
        });
      }

      function isGoingToThrow6() {
        self.client.activityPartialUpdate({ id: 'test', set: 'wrong' });
      }

      function isGoingToThrow7() {
        self.client.activityPartialUpdate({ id: 'test', unset: 'wrong' });
      }

      function isTypeError(err) {
        expect(err).to.be.a(TypeError);
      }

      expect(isGoingToThrow1).to.throwException(isTypeError);
      expect(isGoingToThrow2).to.throwException(isTypeError);
      expect(isGoingToThrow3).to.throwException(isTypeError);
      expect(isGoingToThrow4).to.throwException(isTypeError);
      expect(isGoingToThrow5).to.throwException(isTypeError);
      expect(isGoingToThrow6).to.throwException(isTypeError);
      expect(isGoingToThrow7).to.throwException(isTypeError);
    });

    describe('by ID', function() {
      it('(1) works', function() {
        var post = td.function();
        td.when(post(), { ignoreExtraArgs: true }).thenResolve('call API');
        td.replace(this.client, 'post', post);

        var data = {
          id: '54a60c1e-4ee3-494b-a1e3-50c06acb5ed4',
          set: { 'foo.bar': 42 },
          unset: ['baz'],
        };

        this.client.activityPartialUpdate(data);

        td.verify(
          post(
            td.matchers.contains({
              url: 'activity/',
            }),
            undefined,
          ),
        );
      });

      it('(2) works - callback', function() {
        var post = td.function();
        td.when(post(), { ignoreExtraArgs: true }).thenResolve('call API');
        td.replace(this.client, 'post', post);

        var data = {
          id: '54a60c1e-4ee3-494b-a1e3-50c06acb5ed4',
          set: { 'foo.bar': 42 },
          unset: ['baz'],
        };
        var fn = function() {};

        this.client.activityPartialUpdate(data, fn);

        td.verify(
          post(
            td.matchers.contains({
              url: 'activity/',
            }),
            fn,
          ),
        );
      });
    });

    describe('by foreign ID and time', function() {
      it('(1) works', function() {
        var post = td.function();
        td.when(post(), { ignoreExtraArgs: true }).thenResolve('call API');
        td.replace(this.client, 'post', post);

        var data = {
          foreignID: 'product:123',
          time: '2016-11-10T13:20:00.000000',
          set: { 'foo.bar': 42 },
          unset: ['baz'],
        };

        this.client.activityPartialUpdate(data);

        td.verify(
          post(
            td.matchers.contains({
              url: 'activity/',
            }),
            undefined,
          ),
        );
      });

      it('(2) works - callback', function() {
        var post = td.function();
        td.when(post(), { ignoreExtraArgs: true }).thenResolve('call API');
        td.replace(this.client, 'post', post);

        var data = {
          foreignID: 'product:123',
          time: '2016-11-10T13:20:00.000000',
          set: { 'foo.bar': 42 },
          unset: ['baz'],
        };
        var fn = function() {};

        this.client.activityPartialUpdate(data, fn);

        td.verify(
          post(
            td.matchers.contains({
              url: 'activity/',
            }),
            fn,
          ),
        );
      });
    });
  });

  describe('#activitiesPartialUpdate', function() {
    it('throws', function() {
      var self = this;

      function isGoingToThrow1() {
        self.client.activitiesPartialUpdate({});
      }

      function isGoingToThrow2() {
        self.client.activitiesPartialUpdate(null);
      }

      function isGoingToThrow3() {
        self.client.activitiesPartialUpdate(['one object']);
      }

      function isGoingToThrow4() {
        self.client.activitiesPartialUpdate([
          {
            id: '54a60c1e-4ee3-494b-a1e3-50c06acb5ed4',
            unset: ['tag'],
          },
          {},
        ]);
      }

      function isGoingToThrow5() {
        self.client.activitiesPartialUpdate([
          {
            id: '54a60c1e-4ee3-494b-a1e3-50c06acb5ed4',
            set: 'wrong',
          },
        ]);
      }

      function isGoingToThrow6() {
        self.client.activitiesPartialUpdate([
          {
            id: '54a60c1e-4ee3-494b-a1e3-50c06acb5ed4',
            unset: 'wrong',
          },
        ]);
      }

      function isGoingToThrow7() {
        self.client.activitiesPartialUpdate([
          {
            foreign_id: 'product:123',
          },
        ]);
      }

      function isGoingToThrow8() {
        self.client.activitiesPartialUpdate([
          {
            time: '2016-11-10T13:20:00.000000',
          },
        ]);
      }

      function isTypeError(err) {
        expect(err).to.be.a(TypeError);
      }

      expect(isGoingToThrow1).to.throwException(isTypeError);
      expect(isGoingToThrow2).to.throwException(isTypeError);
      expect(isGoingToThrow3).to.throwException(isTypeError);
      expect(isGoingToThrow4).to.throwException(isTypeError);
      expect(isGoingToThrow5).to.throwException(isTypeError);
      expect(isGoingToThrow6).to.throwException(isTypeError);
      expect(isGoingToThrow7).to.throwException(isTypeError);
      expect(isGoingToThrow8).to.throwException(isTypeError);
    });

    describe('by ID', function() {
      it('(1) works', function() {
        var post = td.function();
        td.replace(this.client, 'post', post);

        var changes = [
          {
            id: '54a60c1e-4ee3-494b-a1e3-50c06acb5ed4',
            set: { 'foo.bar': 42 },
            unset: ['baz'],
          },
          {
            id: '8d2dcad8-1e34-11e9-8b10-9cb6d0925edd',
            set: { 'foo.baz': 43 },
            unset: ['bar'],
          },
        ];

        this.client.activitiesPartialUpdate(changes);

        td.verify(
          post(
            td.matchers.contains({
              url: 'activity/',
            }),
            undefined,
          ),
        );
      });

      it('(2) works - callback', function() {
        var post = td.function();
        td.replace(this.client, 'post', post);

        var changes = [
          {
            id: '54a60c1e-4ee3-494b-a1e3-50c06acb5ed4',
            set: { 'foo.bar': 42 },
            unset: ['baz'],
          },
          {
            id: '8d2dcad8-1e34-11e9-8b10-9cb6d0925edd',
            set: { 'foo.baz': 43 },
            unset: ['bar'],
          },
        ];
        var fn = function() {};

        this.client.activitiesPartialUpdate(changes, fn);

        td.verify(
          post(
            td.matchers.contains({
              url: 'activity/',
            }),
            fn,
          ),
        );
      });
    });

    describe('by foreign ID and time', function() {
      it('(1) works', function() {
        var post = td.function();
        td.replace(this.client, 'post', post);

        var changes = [
          {
            foreign_id: 'product:123',
            time: '2016-11-10T13:20:00.000000',
            set: { 'foo.bar': 42 },
            unset: ['baz'],
          },
          {
            foreign_id: 'product:321',
            time: '2016-11-10T13:20:00.000000',
            set: { 'foo.baz': 43 },
            unset: ['bar'],
          },
        ];

        this.client.activitiesPartialUpdate(changes);

        td.verify(
          post(
            td.matchers.contains({
              url: 'activity/',
            }),
            undefined,
          ),
        );
      });

      it('(2) works - callback', function() {
        var post = td.function();
        td.replace(this.client, 'post', post);

        var changes = [
          {
            foreign_id: 'product:123',
            time: '2016-11-10T13:20:00.000000',
            set: { 'foo.bar': 42 },
            unset: ['baz'],
          },
          {
            foreign_id: 'product:321',
            time: '2016-11-10T13:20:00.000000',
            set: { 'foo.baz': 43 },
            unset: ['bar'],
          },
        ];
        var fn = function() {};

        this.client.activitiesPartialUpdate(changes, fn);

        td.verify(
          post(
            td.matchers.contains({
              url: 'activity/',
            }),
            fn,
          ),
        );
      });
    });
  });

  describe('getAnalyticsToken', function() {
    it('generate correct token', function() {
      var client = stream.connect(
        '12345',
        'abcdefghijklmnop',
      );
      var token = client.getAnalyticsToken();
      expect(token).to.be(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6ImFuYWx5dGljcyIsImFjdGlvbiI6IioiLCJ1c2VyX2lkIjoiKiJ9.f7KFu7U2Uw_yq__9hV4-wr9S0KXo7w3wxTELOAY4qdc',
      );
    });
  });

  describe('createUserSessionToken', function() {
    it('with userId only', function() {
      var client = stream.connect(
        '12345',
        'abcdefghijklmnop',
      );
      var token = client.createUserSessionToken('42');
      expect(token).to.be(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNDIifQ.fJP44ZlP7bly-2HvbPxBO7WUGJhc1i2hpj4TnXmtYLE',
      );
    });

    it('with extra data', function() {
      var client = stream.connect(
        '12345',
        'abcdefghijklmnop',
      );
      var token = client.createUserSessionToken('42', { a: 'b' });
      const jwtBody = jwtDecode(token);
      expect(jwtBody).to.eql({
        user_id: '42',
        a: 'b',
      });
      expect(token).to.be(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNDIiLCJhIjoiYiJ9.tnHcqgTi__BExVZ3Tl0awZQe_p3A7wJ3y_uNlsxg4DM',
      );
    });
    it('with expireTokens', function() {
      const client = stream.connect(
        '12345',
        'abcdefghijklmnop',
        1234,
        {
          expireTokens: true,
        },
      );
      const token = client.createUserSessionToken('42');
      const timestamp = Date.now() / 1000;
      const jwtBody = jwtDecode(token);
      expect(jwtBody.user_id).to.eql('42');
      expect(jwtBody.iat).to.be.within(timestamp - 1, timestamp);
    });
  });

  describe('connect', function() {
    it('#LOCAL', function() {
      process.env['LOCAL'] = 1;

      var client = stream.connect(
        '12345',
        'abcdefghijklmnop',
      );
      expect(client.baseUrl).to.be('http://localhost:8000/api/');

      delete process.env['LOCAL'];
    });

    it('#LOCAL', function() {
      var client = stream.connect(
        '12345',
        'abcdefghijklmnop',
        null,
        {
          location: 'nl-NL',
        },
      );
      expect(client.baseUrl).to.be('https://nl-NL-api.stream-io-api.com/api/');
    });

    it('#LOCAL_FAYE', function() {
      process.env['LOCAL_FAYE'] = 1;

      var client = stream.connect(
        '12345',
        'abcdefghijklmnop',
      );
      expect(client.fayeUrl).to.be('http://localhost:9999/faye/');

      delete process.env['LOCAL_FAYE'];
    });

    it('#STREAM_BASE_URL', function() {
      process.env['STREAM_BASE_URL'] = 'https://local.stream-io-api.com/api/';

      var client = stream.connect(
        '12345',
        'abcdefghijklmnop',
      );
      expect(client.baseUrl).to.be('https://local.stream-io-api.com/api/');

      delete process.env['STREAM_BASE_URL'];
    });
  });
});
