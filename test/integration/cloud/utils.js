var stream = require('../../../src/getstream');
var config = require('../utils/config');
var signing = require('../../../src/lib/signing');
var randUserId = require('../utils/hooks').randUserId;
var expect = require('chai').expect;
var should = require('chai').should();

class CloudContext {
  constructor() {
    this.response = null;
    this.prevResponse = null;
    this.activity = null;
    this.failed = false;
    this.cheeseBurger = null;
    this.cheeseBurgerData = {
      name: 'cheese burger',
      toppings: ['cheese'],
    };
    this.client = stream.connectCloud(config.API_KEY, config.APP_ID, {
      group: 'testCycle',
      protocol: 'https',
      keepAlive: false,
    });
    this.alice = this.createUserSession('alice');
    this.bob = this.createUserSession('bob');
    this.carl = this.createUserSession('carl');
    this.dave = this.createUserSession('dave');
    this.root = this.createUserSession('root', { stream_admin: true });
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
      collection: ['id', 'created_at', 'updated_at', 'collection', 'data'],
      reaction: [
        'id',
        'kind',
        'activity_id',
        'user_id',
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

  createUserSession(userId, extraData) {
    userId = randUserId(userId);
    return this.client.createUserSession(
      signing.JWTUserSessionToken(config.API_SECRET, userId, extraData)
    );
  }

  wrapFn(fn) {
    let ctx = this;
    if (fn.length == 0) {
      return async function() {
        if (ctx.failed) {
          this.skip();
        }
        try {
          await fn();
        } catch (ex) {
          ctx.failed = true;
          throw ex;
        }
      };
    }
    return function(done) {
      if (ctx.failed) {
        this.skip();
      }
      try {
        fn(done);
      } catch (ex) {
        ctx.failed = true;
        throw ex;
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
          e.response.statusCode.should.equal(statusCode);
          this.response = e.error;
        }
      }
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

  responseShouldEqualPreviousResponse() {
    this.responseShould('be the same as the previous response', () => {
      should.exist(this.prevResponse);
      should.exist(this.response);
      this.response.should.eql(this.prevResponse);
    });
  }

  aliceAddsCheeseBurger() {
    describe('When alice adds a cheese burger to the food collection', () => {
      this.requestShouldNotError(async () => {
        this.response = await this.alice
          .storage('food')
          .add(null, this.cheeseBurgerData);
      });

      this.responseShouldHaveFields(...this.fields.collection);

      this.responseShouldHaveUUID();

      this.responseShould(
        'have collection and data matching the request',
        () => {
          this.response.collection.should.equal('food');
          this.response.data.should.eql(this.cheeseBurgerData);
        }
      );

      this.afterTest(() => {
        this.cheeseBurger = this.alice.objectFromResponse(this.response);
      });
    });
  }

  createUsers() {
    describe('When creating the users', () => {
      this.noRequestsShouldError(async () => {
        await Promise.all([
          this.alice.user.create(this.userData.alice),
          this.bob.user.create(this.userData.bob),
          this.carl.user.create(this.userData.carl),
          this.dave.user.create(this.userData.dave),
        ]);
      });
    });
  }

  reactionToReactionInActivity(reaction, user) {
    reaction = Object.assign({}, reaction);

    delete reaction.activity_id;
    delete reaction.user_id;
    reaction.user = user.full;

    return reaction;
  }
}

module.exports = {
  CloudContext: CloudContext,
};
