var stream = require('../../../src/getstream');
var config = require('../utils/config');
var randUserId = require('../utils/hooks').randUserId;
var expect = require('chai').expect;
var should = require('chai').should();

class CloudContext {
  constructor() {
    this.response = null;
    this.prevResponse = null;
    this.activity = null;
    this.failed = false;
    this.runningTest = false;
    this.cheeseBurger = null;
    this.cheeseBurgerData = {
      name: 'cheese burger',
      toppings: ['cheese'],
    };
    const clientOptions = {
      group: 'testCycle',
      // protocol: 'http',
      keepAlive: false,
      // location: 'beta',
    };

    this.serverSideClient = stream.connect(
      config.API_KEY,
      config.API_SECRET,
      config.APP_ID,
      clientOptions,
    );

    // apiKey, apiSecret, appId, options
    this.alice = stream.connect(
      config.API_KEY,
      this.createUserToken('alice'),
      config.APP_ID,
      clientOptions,
    );

    this.bob = stream.connect(
      config.API_KEY,
      this.createUserToken('bob'),
      config.APP_ID,
      clientOptions,
    );

    this.carl = stream.connect(
      config.API_KEY,
      this.createUserToken('carl'),
      config.APP_ID,
      clientOptions,
    );

    this.dave = stream.connect(
      config.API_KEY,
      this.createUserToken('dave'),
      config.APP_ID,
      clientOptions,
    );

    this.root = stream.connect(
      config.API_KEY,
      this.createUserToken('root', { stream_admin: true }),
      config.APP_ID,
      clientOptions,
    );

    this.userData = {
      alice: {
        name: 'Alice Abbot',
        likes: ['apples', 'ajax'],
      },
      bob: {
        name: 'Bob Baker',
        likes: ['berries'],
      },
      carl: {
        name: 'Carl Church',
        likes: ['cherries', 'curry'],
      },
      dave: {
        name: 'Dave Dawson',
        likes: ['dark chocolate'],
      },
      root: {
        name: 'The ultimate user',
        likes: ['power'],
      },
    };

    this.fields = {
      collection: [
        'id',
        'created_at',
        'updated_at',
        'collection',
        'data',
        'duration',
        'foreign_id',
      ],
      reaction: [
        'id',
        'kind',
        'activity_id',
        'user_id',
        'user',
        'data',
        'created_at',
        'updated_at',
      ],
      activity: [
        'id',
        'foreign_id',
        'time',
        'actor',
        'verb',
        'target',
        'object',
        'origin',
      ],
      reactionInActivity: [
        'id',
        'kind',
        'user',
        'data',
        'created_at',
        'updated_at',
      ],
    };
  }

  createUserToken(userId, extraData) {
    userId = randUserId(userId);
    return this.serverSideClient.createUserToken(userId, extraData);
  }

  wrapFn(fn) {
    let ctx = this;
    if (ctx.runningTest) {
      expect.fail(
        null,
        null,
        'calling ctx.test from within a ctx.test is not supported',
      );
    }

    if (fn.length == 0) {
      return async function() {
        if (ctx.failed) {
          this.skip();
        }
        ctx.runningTest = true;
        fn = fn.bind(this);
        try {
          await fn();
        } catch (ex) {
          ctx.failed = true;
          throw ex;
        } finally {
          ctx.runningTest = false;
        }
      };
    }
    return function(done) {
      if (ctx.failed) {
        this.skip();
      }
      ctx.runningTest = true;
      fn = fn.bind(this);
      try {
        this.runningTest = false;
        fn(done);
      } catch (ex) {
        ctx.failed = true;
        throw ex;
      } finally {
        ctx.runningTest = false;
      }
    };
  }

  // test is a wrapper around "it" that skips the test if a previous one in
  // the same context failed already.
  test(label, fn) {
    it(label, this.wrapFn(fn));
  }

  // afterTest is a wrapper around "after" that skips the after if a previous
  // test or afterTest in the same context failed already.
  afterTest(fn) {
    after(this.wrapFn(fn));
  }

  requestShouldNotError(fn) {
    this.test('the request should not error', fn);
  }
  noRequestsShouldError(fn) {
    this.test('the request should not error', fn);
  }
  responseShould(label, fn) {
    this.test('the response should ' + label, fn);
  }
  activityShould(label, fn) {
    this.test('the activity should ' + label, fn);
  }

  requestShouldError(statusCode, fn) {
    this.test(
      'the request should error with status ' + statusCode,
      async () => {
        try {
          await fn();
          expect.fail(null, null, 'request should not succeed');
        } catch (e) {
          if (!(e instanceof stream.errors.StreamApiError)) {
            throw e;
          }
          if (e.response.statusCode != statusCode) {
            console.log(e.error);
          }
          e.response.statusCode.should.equal(statusCode);
          this.response = e.error;
        }
      },
    );
  }

  responseShouldHaveFields(...fields) {
    this.responseShould('have all expected fields', () => {
      this.response.should.have.all.keys(fields);
    });
  }

  responseShouldHaveNoActivities() {
    this.responseShould('have no activities', () => {
      this.response.results.should.eql([]);
    });
  }

  responseShouldHaveActivityInGroupWithFields(...fields) {
    this.responseShould('have a single group with a single activity', () => {
      this.response.should.include.keys('results', 'next', 'duration');
      this.response.results.should.be.lengthOf(1);
      this.response.results[0].activities.should.be.lengthOf(1);
      this.activity = this.response.results[0].activities[0];
    });

    this.test('the activity should have all expected fields', () => {
      this.activity.should.have.all.keys(...this.fields.activity, ...fields);
    });
  }

  responseShouldHaveActivityWithFields(...fields) {
    this.responseShould('have a single activity', () => {
      this.response.should.have.all.keys('results', 'next', 'duration');
      this.response.results.should.be.lengthOf(1);
      this.activity = this.response.results[0];
    });

    this.test('the activity should have all expected fields', () => {
      this.activity.should.have.all.keys(...this.fields.activity, ...fields);
    });
  }

  responseShouldHaveUUID() {
    this.responseShould('have a generated UUID as ID', () => {
      this.response.id.should.be.a('string').lengthOf(36);
    });
  }

  responseShouldHaveNewUpdatedAt() {
    this.responseShould('have an updated updated_at', () => {
      should.exist(this.prevResponse.updated_at);
      should.exist(this.response.updated_at);
      this.response.updated_at.should.not.equal(this.prevResponse.updated_at);
    });
  }

  shouldEqualBesideDuration(obj1, obj2) {
    let obj1Copy = Object.assign({}, obj1, { duration: null });
    let obj2Copy = Object.assign({}, obj2, { duration: null });
    obj1Copy.should.eql(obj2Copy);
  }

  responseShouldEqualPreviousResponse() {
    this.responseShould('be the same as the previous response', () => {
      should.exist(this.prevResponse);
      should.exist(this.response);
      let response = Object.assign({}, this.response, {
        duration: this.response === null,
      });
      let prevResponse = Object.assign({}, this.prevResponse, {
        duration: this.prevResponse === null,
      });
      response.should.eql(prevResponse);
    });
  }

  aliceAddsCheeseBurger() {
    describe('When alice adds a cheese burger to the food collection', () => {
      this.requestShouldNotError(async () => {
        this.cheeseBurger = (await this.alice
          .collections('food')
          .add(null, this.cheeseBurgerData));

        this.response = this.cheeseBurger.full;
      });

      this.responseShouldHaveFields(...this.fields.collection);

      this.responseShouldHaveUUID();

      this.responseShould(
        'have collection and data matching the request',
        () => {
          this.response.collection.should.equal('food');
          this.shouldEqualBesideDuration(
            this.response.data,
            this.cheeseBurgerData,
          );
        },
      );
    });
  }

  createUsers() {
    describe('When creating the users', () => {
      this.noRequestsShouldError(async () => {
        this.alice.user = await this.alice.getOrCreateUser(this.userData.alice);
        this.bob.user = await this.bob.getOrCreateUser(this.userData.bob);
        this.carl.user = await this.carl.getOrCreateUser(this.userData.carl);
        this.dave.user = await this.dave.getOrCreateUser(this.userData.dave);
      });
    });
  }

  reactionToReactionInActivity(reaction, user) {
    reaction = Object.assign({}, reaction);
    reaction.user = user.full;
    return reaction;
  }
}

module.exports = {
  CloudContext: CloudContext,
};
