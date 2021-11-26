import chai, { expect } from 'chai';

import { connect, StreamApiError } from '../../../src';
import config from '../utils/config';
import { randUserId } from '../utils/hooks';

const should = chai.should();

export class CloudContext {
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
    this.clientOptions = {
      group: 'testCycle',
    };

    this.serverSideClient = connect(config.API_KEY, config.API_SECRET, config.APP_ID, this.clientOptions);

    // apiKey, apiSecret, appId, options
    this.alice = this.createUserClient('alice');
    this.bob = this.createUserClient('bob');
    this.carl = this.createUserClient('carl');
    this.dave = this.createUserClient('dave');

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

    const reactionFields = [
      'id',
      'kind',
      'activity_id',
      'user_id',
      'user',
      'data',
      'created_at',
      'updated_at',
      'parent',
      'latest_children',
      'children_counts',
    ];
    this.fields = {
      collection: ['id', 'created_at', 'updated_at', 'collection', 'data', 'duration', 'foreign_id'],
      reaction: reactionFields,
      reactionResponse: ['duration', ...reactionFields],
      reactionResponseWithTargets: ['duration', 'target_feeds', ...reactionFields],
      activity: ['id', 'foreign_id', 'time', 'actor', 'verb', 'target', 'object', 'origin'],
      reactionInActivity: ['id', 'kind', 'user', 'data', 'created_at', 'updated_at'],
    };
  }

  createUserToken(userId, extraData) {
    userId = randUserId(userId);
    return this.serverSideClient.createUserToken(userId, extraData);
  }

  createUserClient(userId, extraData) {
    return connect(config.API_KEY, this.createUserToken(userId, extraData), config.APP_ID, this.clientOptions);
  }

  wrapFn(fn) {
    const ctx = this;
    if (ctx.runningTest) {
      expect.fail(null, null, 'calling ctx.test from within a ctx.test is not supported');
    }

    if (fn.length === 0) {
      return async function () {
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
    return function (done) {
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
    this.test(`the response should ${label}`, fn);
  }

  activityShould(label, fn) {
    this.test(`the activity should ${label}`, fn);
  }

  requestShouldError(status, fn) {
    this.test(`the request should error with status ${status}`, async () => {
      try {
        await fn();
        expect.fail(null, null, 'request should not succeed');
      } catch (e) {
        if (!(e instanceof StreamApiError)) {
          throw e;
        }
        if (e.response.status !== status) {
          console.log(e.error); // eslint-disable-line no-console
        }
        e.response.status.should.equal(status);
        this.error = e;
        this.response = e.error;
      }
    });
  }

  responseShouldHaveFields(...fields) {
    this.responseShould('have all expected fields', () => {
      const response = this.response.full || this.response;
      response.should.have.all.keys(fields);
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
    this.activityShouldHaveFields(...fields);
  }

  responseShouldHaveActivityWithFields(...fields) {
    this.responseShould('have a single activity', () => {
      this.response.should.have.all.keys('results', 'next', 'duration');
      this.response.results.should.be.lengthOf(1);
      this.activity = this.response.results[0];
    });
    this.activityShouldHaveFields(...fields);
  }

  activityShouldHaveFields(...fields) {
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
      const response = this.response.full || this.response;
      const prevResponse = this.prevResponse.full || this.prevResponse;
      should.exist(prevResponse.updated_at);
      should.exist(response.updated_at);
      response.updated_at.should.not.equal(prevResponse.updated_at);
    });
  }

  shouldEqualBesideDuration = (obj1, obj2) => {
    const obj1Copy = { ...obj1, duration: null };
    const obj2Copy = { ...obj2, duration: null };
    obj1Copy.should.eql(obj2Copy);
  };

  shouldHaveNonEmptyKeys = (obj, ...keys) => {
    keys.map((k) => should.exist(obj[k]));
  };

  responseShouldEqualPreviousResponse() {
    this.responseShould('be the same as the previous response', () => {
      should.exist(this.prevResponse);
      should.exist(this.response);
      let response = this.response.full || this.response;
      let prevResponse = this.prevResponse.full || this.prevResponse;
      response = { ...response, duration: this.response === null };
      prevResponse = { ...prevResponse, duration: this.prevResponse === null };
      response.should.eql(prevResponse);
    });
  }

  aliceAddsCheeseBurger() {
    describe('When alice adds a cheese burger to the food collection', () => {
      this.requestShouldNotError(async () => {
        this.cheeseBurger = await this.alice.collections.add('food', null, this.cheeseBurgerData);

        this.response = this.cheeseBurger.full;
      });

      this.responseShouldHaveFields(...this.fields.collection);

      this.responseShouldHaveUUID();

      this.responseShould('have collection and data matching the request', () => {
        this.response.collection.should.equal('food');
        this.shouldEqualBesideDuration(this.response.data, this.cheeseBurgerData);
      });
    });
  }

  createUsers() {
    describe('When creating the users', () => {
      this.noRequestsShouldError(async () => {
        await this.alice.setUser(this.userData.alice);
        await this.bob.setUser(this.userData.bob);
        await this.carl.setUser(this.userData.carl);
        await this.dave.setUser(this.userData.dave);
      });
    });
  }

  reactionToReactionInActivity = (reaction, user) => {
    reaction = { ...reaction };
    reaction.user = user.full;
    return reaction;
  };
}
