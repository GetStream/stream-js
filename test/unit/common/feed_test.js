import expect from 'expect.js';
import td from 'testdouble/dist/testdouble';

import { StreamFeed, SiteError } from '../../../src';
import { init, beforeEachFn } from '../utils/hooks';

describe('[UNIT] Stream Feed (Common)', function () {
  let get;
  let post;
  let del;
  let feed;

  init.call(this);
  beforeEach(beforeEachFn);
  beforeEach(function () {
    feed = new StreamFeed(this.client, 'user', 'matthisk', 'token');
    post = td.function();
    del = td.function();
    get = td.function();
    td.replace(this.client, 'post', post);
    td.replace(this.client, 'delete', del);
    td.replace(this.client, 'get', get);
  });

  afterEach(function () {
    td.reset();
  });

  it('#intialize', function () {
    expect(feed.client).to.be(this.client);
    expect(feed.slug).to.be('user');
    expect(feed.userId).to.be('matthisk');
    expect(feed.id).to.be('user:matthisk');
    expect(feed.feedUrl).to.be('user/matthisk');
    expect(feed.feedTogether).to.be('usermatthisk');
    expect(feed.token).to.be('token');
    expect(feed.notificationChannel).to.be(`site-${this.client.appId}-feed-usermatthisk`);
  });

  it('#addActivity', function () {
    const activity = { actor: 'matthisk', object: 0, verb: 'tweet' };
    feed.addActivity(activity);

    td.verify(
      post({
        url: 'feed/user/matthisk/',
        body: activity,
        token: 'token',
      }),
    );
  });

  it('#addActivities', function () {
    const activities = [{ actor: 'matthisk', object: 0, verb: 'tweet' }];
    feed.addActivities(activities);

    td.verify(
      post({
        url: 'feed/user/matthisk/',
        body: { activities },
        token: 'token',
      }),
    );
  });

  describe('#follow', function () {
    it('(1) throws', function () {
      function throws1() {
        feed.follow('user###', 'henk');
      }

      function throws2() {
        feed.follow('user', '###henk');
      }

      expect(throws1).to.throw;
      expect(throws2).to.throw;
    });

    it('(2) default', function () {
      feed.follow('user', 'henk');

      const body = {
        target: 'user:henk',
      };

      td.verify(
        post({
          url: 'feed/user/matthisk/following/',
          body,
          token: 'token',
        }),
      );
    });

    it('(3) activity copy limit', function () {
      feed.follow('user', 'henk', { limit: 10 });

      const body = {
        target: 'user:henk',
        activity_copy_limit: 10,
      };

      td.verify(
        post({
          url: 'feed/user/matthisk/following/',
          body,
          token: 'token',
        }),
      );
    });
  });

  describe('#unfollow', function () {
    it('(1) throws', function () {
      function throws1() {
        feed.unfollow('user###', 'henk');
      }

      function throws2() {
        feed.unfollow('user', '###henk');
      }

      expect(throws1).to.throw;
      expect(throws2).to.throw;
    });

    it('(2) default', function () {
      feed.unfollow('user', 'henk');

      td.verify(
        del({
          url: 'feed/user/matthisk/following/user:henk/',
          qs: {},
          token: 'token',
        }),
      );
    });

    it('(3) default keep_history', function () {
      feed.unfollow('user', 'henk', { keepHistory: true });

      td.verify(
        del({
          url: 'feed/user/matthisk/following/user:henk/',
          qs: {
            keep_history: '1',
          },
          token: 'token',
        }),
      );
    });
  });

  describe('#following', function () {
    it('(1) default', function () {
      feed.following({});

      td.verify(
        get({
          url: 'feed/user/matthisk/following/',
          qs: {},
          token: 'token',
        }),
      );
    });

    it('(2) options', function () {
      const filter = ['a', 'b', 'c'];
      feed.following({ filter });

      td.verify(
        get({
          url: 'feed/user/matthisk/following/',
          qs: {
            filter: 'a,b,c',
          },
          token: 'token',
        }),
      );
    });
  });

  describe('#followers', function () {
    it('(1) default', function () {
      feed.followers({});

      td.verify(
        get({
          url: 'feed/user/matthisk/followers/',
          qs: {},
          token: 'token',
        }),
      );
    });

    it('(2) options', function () {
      const filter = ['a', 'b', 'c'];
      feed.followers({ filter });

      td.verify(
        get({
          url: 'feed/user/matthisk/followers/',
          qs: {
            filter: 'a,b,c',
          },
          token: 'token',
        }),
      );
    });
  });

  describe('#followStats', function () {
    it('(1) default', function () {
      feed.followStats();

      td.verify(
        get({
          url: 'stats/follow/',
          qs: { followers: 'user:matthisk', following: 'user:matthisk' },
          token: feed.client.getOrCreateToken() || feed.token,
        }),
      );
    });

    it('(2) options', function () {
      feed.followStats({ followingSlugs: ['user', 'timeline'], followerSlugs: ['channel'] });

      td.verify(
        get({
          url: 'stats/follow/',
          qs: {
            followers: 'user:matthisk',
            following: 'user:matthisk',
            following_slugs: 'user,timeline',
            followers_slugs: 'channel',
          },
          token: feed.client.getOrCreateToken() || feed.token,
        }),
      );
    });
  });

  describe('#get', function () {
    it('(1) default', function () {
      feed.get({});
      let expectedUrl = 'feed/user/matthisk/';
      if (feed.client.enrichByDefault) {
        expectedUrl = 'enrich/feed/user/matthisk/';
      }

      td.verify(
        get({
          url: expectedUrl,
          qs: {},
          token: 'token',
        }),
      );
    });

    it('(2) default', function () {
      feed.get({
        mark_read: ['a', 'b'],
        mark_seen: ['c', 'd'],
      });
      let expectedUrl = 'feed/user/matthisk/';
      if (feed.client.enrichByDefault) {
        expectedUrl = 'enrich/feed/user/matthisk/';
      }

      td.verify(
        get({
          url: expectedUrl,
          qs: {
            mark_read: 'a,b',
            mark_seen: 'c,d',
          },
          token: 'token',
        }),
      );
    });

    it('(4) options', function () {
      feed.get({
        mark_read: ['a', 'b'],
        mark_seen: ['c', 'd'],
      });
      let expectedUrl = 'feed/user/matthisk/';
      if (feed.client.enrichByDefault) {
        expectedUrl = 'enrich/feed/user/matthisk/';
      }

      td.verify(
        get({
          url: expectedUrl,
          qs: {
            mark_read: 'a,b',
            mark_seen: 'c,d',
          },
          token: 'token',
        }),
      );
    });

    it('(5) enrich undefined', function () {
      feed.get({});

      td.verify(
        get(
          td.matchers.contains({
            url: feed.client.enrichByDefault ? 'enrich/feed/user/matthisk/' : 'feed/user/matthisk/',
            qs: {},
          }),
        ),
      );
    });

    it('(6) enrich true', function () {
      feed.get({ enrich: true });
      td.verify(get(td.matchers.contains({ url: 'enrich/feed/user/matthisk/' })));
    });

    it('(7) enrich false', function () {
      feed.get({ enrich: false });
      td.verify(get(td.matchers.contains({ url: 'feed/user/matthisk/' })));
    });

    it('(8) enrich false with ownReactions true', function () {
      feed.get({ enrich: false, ownReactions: true });
      td.verify(get(td.matchers.contains({ url: 'feed/user/matthisk/' })));
    });
  });

  describe('#subscribe', function () {
    it('(1) throws', function () {
      td.replace(this.client, 'appId', 0);

      function throws() {
        feed.subscribe();
      }

      expect(throws).to.throwException(function (err) {
        expect(err).to.be.a(SiteError);
      });
    });

    it('(2) default', function () {
      td.replace(this.client, 'appId', 1234);

      const fn = td.function();
      const subscribeFn = td.function();

      td.when(fn()).thenReturn({
        subscribe: subscribeFn,
      });

      td.replace(this.client, 'getFayeClient', fn);

      feed.subscribe();

      td.verify(subscribeFn(`/${feed.notificationChannel}`, undefined));
    });

    it('(3) cb', function () {
      const cb = function () {};
      td.replace(this.client, 'appId', 1234);

      const fn = td.function();
      const subscribeFn = td.function();

      td.when(fn()).thenReturn({
        subscribe: subscribeFn,
      });

      td.replace(this.client, 'getFayeClient', fn);

      feed.subscribe(cb);

      td.verify(subscribeFn(`/${feed.notificationChannel}`, cb));
    });
  });

  describe('#unsubscribe', function () {
    it('(1) default', function () {
      const subscriptionId = `/${feed.notificationChannel}`;
      const subscriptionDbl = td.object(['cancel']);

      feed.client.subscriptions[subscriptionId] = {
        fayeSubscription: subscriptionDbl,
      };

      feed.unsubscribe();
      expect(feed.client.subscriptions[subscriptionId]).to.be(undefined);
      td.verify(subscriptionDbl.cancel());
    });
  });

  describe('#removeActivity', function () {
    it('(1)', function () {
      feed.removeActivity('aID');

      td.verify(
        del({
          url: 'feed/user/matthisk/aID/',
          qs: {},
          token: 'token',
        }),
      );
    });

    it('(2)', function () {
      feed.removeActivity({ foreignId: 'fID' });

      td.verify(
        del({
          url: 'feed/user/matthisk/fID/',
          qs: { foreign_id: '1' },
          token: 'token',
        }),
      );
    });
  });

  describe('#updateActivityToTargets', function () {
    it("throws an error if `foreign_id` or `time` isn't provided", function () {
      function noTime() {
        feed.updateActivityToTargets('foreign_id:1234');
      }

      function noForeignID() {
        feed.updateActivityToTargets(null, new Date());
      }
      expect(noTime).to.throwException();
      expect(noForeignID).to.throwException();
    });

    it("throws an error if no `new_targets`, `add_targets`, or `remove_targets` isn't provided", function () {
      const noTargets = function () {
        feed.updateActivityToTargets('foreign_id:1234', new Date());
      };
      expect(noTargets).to.throwException();
    });

    it('throws an error if `new_targets` is provided along with either `add_targets` or `remove_targets`', function () {
      const newTargetsWithAdd = function () {
        feed.updateActivityToTargets('foreign_id:1234', new Date(), ['targetFeed:1234'], ['anotherTargetFeed:1234']);
      };
      const newTargetsWithRemove = function () {
        feed.updateActivityToTargets('foreign_id:1234', new Date(), ['targetFeed:1234'], null, [
          'anotherTargetFeed:1234',
        ]);
      };
      expect(newTargetsWithAdd).to.throwException();
      expect(newTargetsWithRemove).to.throwException();
    });

    it('throws an error if `add_targets` and `remove_targets` both contain the same ID', function () {
      const sameTargets1 = function () {
        feed.updateActivityToTargets('foreign_id:1234', new Date(), null, ['targetFeed:1234'], ['targetFeed:1234']);
      };
      const sameTargets2 = function () {
        feed.updateActivityToTargets(
          'foreign_id:1234',
          new Date(),
          null,
          ['targetFeed:1234', 'targetFeed:5678'],
          ['targetFeed:1234', 'targetFeed:0000'],
        );
      };
      expect(sameTargets1).to.throwException();
      expect(sameTargets2).to.throwException();
    });
  });
});
