import expect from 'expect.js';

import { connect, SiteError } from '../../../src';
import { init, beforeEachFn } from '../utils/hooks';

describe('[INTEGRATION] Stream client (Faye)', function () {
  init.call(this);
  beforeEach(beforeEachFn);

  it('fayeGetClient', function () {
    this.user1.getFayeClient();
  });

  it('fayeSubscribe', function () {
    return this.user1.subscribe(function callback() {});
  });

  it('fayeSubscribeListening', function (done) {
    this.timeout(60000);

    const testUser1 = this.user1;
    const testUser2 = this.user2;
    const testUser3 = this.user3;

    let messages = 0;
    const N_MESSAGES = 3;
    const activity = {
      verb: 'test',
      actor: 'User:1',
      object: 1,
    };

    const msgCallback = function (message) {
      if (message && message.new && message.new.length > 0) {
        messages += 1;
      }

      if (messages === N_MESSAGES) {
        done();
      }
    };

    const httpCallback = function (error, response, body) {
      if (error) done(error);
      if (response.status !== 201) done(body);
    };

    Promise.all([
      testUser1.subscribe(msgCallback),
      testUser2.subscribe(msgCallback),
      testUser3.subscribe(msgCallback),
    ]).then(function () {
      testUser1.addActivity(activity, httpCallback);
      testUser2.addActivity(activity, httpCallback);
      testUser3.addActivity(activity, httpCallback);
    }, done);
  });

  it('fayeSubscribeListeningWrongToken', function (done) {
    // Invalid token:
    const testUser1 = this.client.feed(
      'user',
      '111',
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6InVzZXIyMjIifQ.WXZTbUgxfitUVwJOhRKu9HRnpf-Je8AwA5BmiUG6vYY',
    );
    // Valid token:
    const testUser2 = this.user2;

    let messages = 0;
    const activity = {
      verb: 'test',
      actor: 'User:1',
      object: 1,
    };

    const httpCallback = function (error, response, body) {
      if (error) done(error);
      if (response.status !== 201) done(body);
    };

    const doneYet = function () {
      messages++;

      if (messages === 1) {
        testUser1
          .subscribe(function () {
            done('testUser1 should not receive any messages');
          })
          .then(function () {
            done('testUser1 should not authenticate successfully');
          }, doneYet);
      }

      if (messages === 2) done();
    };

    testUser2.subscribe(doneYet).then(function () {
      testUser2.addActivity(activity, httpCallback);
    }, done);
  });

  it('fayeSubscribeScope', function (done) {
    this.user1ReadOnly.getFayeClient();
    let isDone = false;

    const doneYet = function () {
      if (!isDone) {
        done();
        isDone = true;
      }
    };

    const subscription = this.user1ReadOnly.subscribe(doneYet);
    subscription.then(doneYet);
  });

  it('fayeSubscribeScopeTampered', function (done) {
    this.user1ReadOnly.getFayeClient();
    let isDone = false;

    const doneYet = function () {
      if (!isDone) {
        done();
        isDone = true;
      }
    };
    const subscription = this.user1ReadOnly.subscribe(doneYet);
    subscription.then(doneYet);
  });

  it('fayeSubscribeError', function (done) {
    const client = connect('5crf3bhfzesn');

    function sub() {
      const user1 = client.feed('user', '11', 'secret');
      user1.subscribe();
    }
    expect(sub).to.throwException(function (e) {
      expect(e).to.be.a(SiteError);
    });
    done();
  });
});
