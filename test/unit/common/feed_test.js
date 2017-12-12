var expect = require('expect.js')
  , beforeEachFn = require('../utils/hooks').beforeEach
  , init = require('../utils/hooks').init
  , td = require('testdouble')
  , errors = require('../../../src/getstream').errors
  , StreamFeed = require('../../../src/lib/feed');

describe('[UNIT] Stream Feed (Common)', function() {
    var get, post, del, feed;

    init.call(this);
    beforeEach(beforeEachFn);
    beforeEach(function() {
        feed = new StreamFeed(this.client, 'user', 'matthisk', 'token');
        post = td.function();
        del = td.function();
        get = td.function();
        td.replace(this.client, 'post', post);
        td.replace(this.client, 'delete', del);
        td.replace(this.client, 'get', get);
    });

    afterEach(function() {
        td.reset();
    });

    it('#intialize', function() {
        expect(feed.client).to.be(this.client);
        expect(feed.slug).to.be('user');
        expect(feed.userId).to.be('matthisk');
        expect(feed.id).to.be('user:matthisk');
        expect(feed.feedUrl).to.be('user/matthisk');
        expect(feed.feedTogether).to.be('usermatthisk');
        expect(feed.signature).to.be('usermatthisk token');
        expect(feed.notificationChannel).to.be('site-' + this.client.appId + '-feed-usermatthisk');
    });

    describe('#addActivity', function() {
        var activity = { actor: 'matthisk', object: 0, verb: 'tweet' };

        it('(1)', function() {
            feed.addActivity(activity);

            td.verify(post({
                url: 'feed/user/matthisk/',
                body: activity,
                signature: 'usermatthisk token',
            }, undefined));
        });

        it('(2)', function() {
            var cb = function() {};
            feed.addActivity(activity, cb);

            td.verify(post({
                url: 'feed/user/matthisk/',
                body: activity,
                signature: 'usermatthisk token',
            }, cb));
        });

    });

    describe('#addActivities', function() {
        var activities = [{ actor: 'matthisk', object: 0, verb: 'tweet' }];

        it('(1)', function() {
            feed.addActivities(activities);

            td.verify(post({
                url: 'feed/user/matthisk/',
                body: { activities: activities },
                signature: 'usermatthisk token',
            }, undefined));
        });

        it('(2)', function() {
            var cb = function() {};
            feed.addActivities(activities, cb);

            td.verify(post({
                url: 'feed/user/matthisk/',
                body: { activities: activities },
                signature: 'usermatthisk token',
            }, cb));
        });

    });

    describe('#follow', function() {

        it('(1) throws', function() {
            function throws1() {
                feed.follow('user###', 'henk');
            }

            function throws2() {
                feed.follow('user', '###henk');
            }

            expect(throws1).to.throw;
            expect(throws2).to.throw;
        });

        it('(2) default', function() {
            feed.follow('user', 'henk');
            
            var body = {
                target: 'user:henk',
            };

            td.verify(post({
                url: 'feed/user/matthisk/following/',
                body: body,
                signature: 'usermatthisk token',
            }, undefined));
        });

        it('(3) with cb', function() {
            var cb = function() {};
            feed.follow('user', 'henk', cb);
            
            var body = {
                target: 'user:henk',
            };

            td.verify(post({
                url: 'feed/user/matthisk/following/',
                body: body,
                signature: 'usermatthisk token',
            }, cb));
        });

        it('(4) activity copy limit', function() {
            feed.follow('user', 'henk', { limit: 10 });
            
            var body = {
                target: 'user:henk',
                activity_copy_limit: 10,
            };

            td.verify(post({
                url: 'feed/user/matthisk/following/',
                body: body,
                signature: 'usermatthisk token',
            }, undefined));
        });

        it('(5) with cb and activity copy limit', function() {
            var cb = function() {};
            feed.follow('user', 'henk', { limit: 10 }, cb);
            
            var body = {
                target: 'user:henk',
                activity_copy_limit: 10,
            };

            td.verify(post({
                url: 'feed/user/matthisk/following/',
                body: body,
                signature: 'usermatthisk token',
            }, cb));
        });

    });

    describe('#unfollow', function() {

        it('(1) throws', function() {
            function throws1() {
                feed.unfollow('user###', 'henk');
            }

            function throws2() {
                feed.unfollow('user', '###henk');
            }

            expect(throws1).to.throw;
            expect(throws2).to.throw;
        });

        it('(2) default', function() {
            feed.unfollow('user', 'henk');

            td.verify(del({
                url: 'feed/user/matthisk/following/user:henk/',
                qs: {},
                signature: 'usermatthisk token',
            }, undefined));
        });

        it('(3) default cb', function() {
            var cb = function() {};
            feed.unfollow('user', 'henk', cb);

            td.verify(del({
                url: 'feed/user/matthisk/following/user:henk/',
                qs: {},
                signature: 'usermatthisk token',
            }, cb));
        });

        it('(4) default keep_history', function() {
            feed.unfollow('user', 'henk', { keepHistory: true });

            td.verify(del({
                url: 'feed/user/matthisk/following/user:henk/',
                qs: {
                    keep_history: '1',
                },
                signature: 'usermatthisk token',
            }, undefined));
        });

        it('(5) default cb keep_history', function() {
            var cb = function() {};
            feed.unfollow('user', 'henk', { keepHistory: true }, cb);

            td.verify(del({
                url: 'feed/user/matthisk/following/user:henk/',
                qs: {
                    keep_history: '1',
                },
                signature: 'usermatthisk token',
            }, cb));
        });

    });

    describe('#following', function() {

        it('(1) default', function() {
            feed.following({});

            td.verify(get({
                url: 'feed/user/matthisk/following/',
                qs: {},
                signature: 'usermatthisk token',
            }, undefined));
        });

        it('(2) cb', function() {
            var cb = function() {};
            feed.following({}, cb);

            td.verify(get({
                url: 'feed/user/matthisk/following/',
                qs: {},
                signature: 'usermatthisk token',
            }, cb)); 
        });

        it('(3) options', function() {
            var cb = function() {};
            var filter = ['a', 'b', 'c'];
            feed.following({ filter: filter }, cb);

            td.verify(get({
                url: 'feed/user/matthisk/following/',
                qs: {
                    filter: 'a,b,c',
                },
                signature: 'usermatthisk token',
            }, cb)); 
        });

    });

    describe('#followers', function() {

        it('(1) default', function() {
            feed.followers({});

            td.verify(get({
                url: 'feed/user/matthisk/followers/',
                qs: {},
                signature: 'usermatthisk token',
            }, undefined));
        });

        it('(2) cb', function() {
            var cb = function() {};
            feed.followers({}, cb);

            td.verify(get({
                url: 'feed/user/matthisk/followers/',
                qs: {},
                signature: 'usermatthisk token',
            }, cb)); 
        });

        it('(3) options', function() {
            var cb = function() {};
            var filter = ['a', 'b', 'c'];
            feed.followers({ filter: filter }, cb);

            td.verify(get({
                url: 'feed/user/matthisk/followers/',
                qs: {
                    filter: 'a,b,c',
                },
                signature: 'usermatthisk token',
            }, cb)); 
        });        

    });


    describe('#get', function() {

        it('(1) default', function() {
            feed.get({});

            td.verify(get({
                url: 'feed/user/matthisk/',
                qs: {},
                signature: 'usermatthisk token',
            }, undefined));
        });

        it('(2) cb', function() {
            var cb = function cb() {};
            feed.get({}, cb);

            td.verify(get({
                url: 'feed/user/matthisk/',
                qs: {},
                signature: 'usermatthisk token',
            }, cb));
        });

        it('(3) default', function() {
            feed.get({
                mark_read: ['a', 'b'],
                mark_seen: ['c', 'd'],
            });

            td.verify(get({
                url: 'feed/user/matthisk/',
                qs: {
                    mark_read: 'a,b',
                    mark_seen: 'c,d',
                },
                signature: 'usermatthisk token',
            }, undefined));
        });

        it('(4) options plus cb', function() {
            var cb = function() {};
            feed.get({
                mark_read: ['a', 'b'],
                mark_seen: ['c', 'd'],
            }, cb);

            td.verify(get({
                url: 'feed/user/matthisk/',
                qs: {
                    mark_read: 'a,b',
                    mark_seen: 'c,d',
                },
                signature: 'usermatthisk token',
            }, cb));
        });

    });

    describe('#subscribe', function() {

        it('(1) throws', function() {
            td.replace(this.client, 'appId', 0);            

            function throws() {
                feed.subscribe();
            }

            expect(throws).to.throwException(function(err) {
                expect(err).to.be.a(errors.SiteError);
            });
        });

        it('(2) default', function() {
            td.replace(this.client, 'appId', 1234);

            var fn = td.function();
            var subscribeFn = td.function();

            td.when(fn()).thenReturn({
                subscribe: subscribeFn,
            });
            
            td.replace(this.client, 'getFayeClient', fn);

            feed.subscribe();

            td.verify(subscribeFn('/' + feed.notificationChannel, undefined));
        });

        it('(3) cb', function() {
            var cb = function() {};
            td.replace(this.client, 'appId', 1234);

            var fn = td.function();
            var subscribeFn = td.function();

            td.when(fn()).thenReturn({
                subscribe: subscribeFn,
            });
            
            td.replace(this.client, 'getFayeClient', fn);

            feed.subscribe(cb);

            td.verify(subscribeFn('/' + feed.notificationChannel, cb));
        });

    });

    describe('#removeActivity', function() {

        it('(1)', function() {
            feed.removeActivity('aID');

            td.verify(del({
                url: 'feed/user/matthisk/aID/',
                qs: {},
                signature: 'usermatthisk token',
            }, undefined));
        });

        it('(2)', function() {
            feed.removeActivity({ foreignId: 'fID' });

            td.verify(del({
                url: 'feed/user/matthisk/fID/',
                qs: { 'foreign_id': '1' },
                signature: 'usermatthisk token',
            }, undefined));
        });

        it('(3)', function() {
            var cb = function() {};
            feed.removeActivity('aID', cb);

            td.verify(del({
                url: 'feed/user/matthisk/aID/',
                qs: {},
                signature: 'usermatthisk token',
            }, cb));
        });

    });

    describe('#updateActivityToTargets', function() {
        it('throws an error if `foreign_id` or `time` isn\'t provided', function() {
            function noTime() {
                feed.updateActivityToTargets('foreign_id:1234');
            }

            function noForeignID() {
                feed.updateActivityToTargets(null, new Date());
            }
            expect(noTime).to.throwException();
            expect(noForeignID).to.throwException();
        });

        it('throws an error if no `new_targets`, `add_targets`, or `remove_targets` isn\'t provided', function() {
            var noTargets = function() {
                feed.updateActivityToTargets('foreign_id:1234', new Date());
            };
            expect(noTargets).to.throwException();
        });

        it('throws an error if `new_targets` is provided along with either `add_targets` or `remove_targets`', function() {
            var newTargetsWithAdd = function() {
                feed.updateActivityToTargets('foreign_id:1234', new Date(), ["targetFeed:1234"], ["anotherTargetFeed:1234"]);
            };
            var newTargetsWithRemove = function() {
                feed.updateActivityToTargets('foreign_id:1234', new Date(), ["targetFeed:1234"], null, ["anotherTargetFeed:1234"]);
            };
            expect(newTargetsWithAdd).to.throwException();
            expect(newTargetsWithRemove).to.throwException();
        });

        it('throws an error if `add_targets` and `remove_targets` both contain the same ID', function() {
            var sameTargets1 = function() {
                feed.updateActivityToTargets('foreign_id:1234', new Date(), null, ["targetFeed:1234"], ["targetFeed:1234"]);
            };
            var sameTargets2 = function() {
                feed.updateActivityToTargets('foreign_id:1234', new Date(), null, ["targetFeed:1234", "targetFeed:5678"], ["targetFeed:1234", "targetFeed:0000"]);
            };
            expect(sameTargets1).to.throwException();
            expect(sameTargets2).to.throwException();
        });
    });
});
