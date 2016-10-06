var init = require('../utils/hooks').init
  , beforeEachFn = require('../utils/hooks').beforeEach
  , expect = require('expect.js')
  , errors = require('../../../src/getstream').errors
  , config = require('../utils/config');

describe('Stream client (Common)', function() {

    init.call(this);
    beforeEach(beforeEachFn);

    it('handlers', function(done) {
        var called = {};
        var self = this;
        called.request = 0;
        called.response = 0;

        function callback() {
            called.request += 1;
        }

        function responseCallback() {
            called.response += 1;
        }

        this.client.on('request', callback);
        this.client.on('response', responseCallback);

        function third() {
            expect(called.request).to.eql(1);
            expect(called.response).to.eql(1);
            done();
        }

        function second() {
            self.client.off();
            self.user1.get({
                'limit': 1
            }, third);
        }

        this.user1.get({
            'limit': 1
        }, second);
    });

    it('signing', function(done) {
        expect(this.user1.token).to.be.an('string');
        done();
    });

    it('get feed', function(done) {
        this.user1.get({
            'limit': 1
        }, function(error, response, body) {
            expect(response.statusCode).to.eql(200);
            expect(body['results'][0]['id']).to.be.a('string');

            if (config.IS_NODE_ENV) {
                var userAgent = response.req._headers['x-stream-client'];
                expect(userAgent.indexOf('stream-javascript-client')).to.eql(0);
            }

            done();
        });
    });

    it('get wrong feed', function(done) {
        var self = this;

        var getFeed = function() {
            self.client.feed('flat1');
        };
        expect(getFeed).to.throwException(function(e) {
            expect(e).to.be.a(errors.FeedError);
        });
        done();
    });

    it('get wrong format', function(done) {
        var self = this;

        var getFeed = function() {
            self.client.feed('flat:1', '2');
        };
        expect(getFeed).to.throwException(function(e) {
            expect(e).to.be.a(errors.FeedError);
        });
        done();
    });

    it('get invalid format', function(done) {
        var self = this;

        var invalidFormats = [];
        invalidFormats.push(function() {
            self.client.feed('flat 1', '2');
        });
        invalidFormats.push(function() {
            self.client.feed('flat1', '2:3');
        });
        invalidFormats.push(function() {
            self.user1.follow('flat 1', '3');
        });
        invalidFormats.push(function() {
            self.user1.follow('flat', '3 3');
        });
        // verify all of the above throw an error
        for (var i = 0; i < invalidFormats.length; i++) {
            var callable = invalidFormats[i];
            expect(callable).to.throwException(function(e) {
                expect(e).to.be.a(errors.FeedError);
            });
        }
        // a dash should be allowed
        this.client.feed('flat1', '2-3', 'token');
        done();
    });

    it('add activity', function(done) {
        var self = this;
        var activity = {
            'actor': 'test-various:characters',
            'verb': 'add',
            'object': 1,
            'tweet': 'hello world'
        };

        function get(error, response, body) {
            var activityId = body['id'];
            self.user1.get({
                'limit': 1
            }, function(error, response, body) {
                expect(response.statusCode).to.eql(200);
                expect(body['results'][0]['id']).to.eql(activityId);
                done();
            });
        }
        this.user1.addActivity(activity, get);
    });

    it('add complex activity', function(done) {
        var self = this;
        var activity = {
            'actor': 1,
            'verb': 'add',
            'object': 1
        };
        activity['participants'] = ['Thierry', 'Tommaso'];
        activity['route'] = {
            'name': 'Vondelpark',
            'distance': '20'
        };
        var currentDate = new Date();
        activity['date'] = currentDate;
        var isoDate = currentDate.toISOString();

        function get(error, response, body) {
            var activityId = body['id'];
            self.user1.get({
                'limit': 1
            }, function(error, response, body) {
                expect(response.statusCode).to.eql(200);
                expect(body['results'][0]['id']).to.eql(activityId);
                expect(body['results'][0]['participants']).to.eql(['Thierry', 'Tommaso']);
                expect(body['results'][0]['route']).to.eql({
                    'name': 'Vondelpark',
                    'distance': '20'
                });
                expect(body['results'][0]['date']).to.eql(isoDate);
                done();
            });
        }
        this.user1.addActivity(activity, get);
    });

    it('add activity using to', function(done) {
        var self = this;
        var activity = {
            'actor': 1,
            'verb': 'add',
            'object': 1
        };
        activity['participants'] = ['Thierry', 'Tommaso'];
        activity['route'] = {
            'name': 'Vondelpark',
            'distance': '20'
        };
        activity['to'] = ['flat:33', 'user:everyone'];
        //flat3
        if (!config.IS_NODE_ENV) activity['to'] = ['flat:33' + ' ' + this.flat3.token];

        function get(error, response, body) {
            var activityId = body['id'];
            expect(error).to.eql(null);
            expect(body.exception).to.eql(undefined);
            self.flat3.get({
                'limit': 1
            }, function(error, response, body) {
                expect(response.statusCode).to.eql(200);
                expect(body['results'][0]['id']).to.eql(activityId);
                done();
            });
        }
        this.user1.addActivity(activity, get);
    });

    it('add activity no callback', function(done) {
        var activity = {
            'actor': 1,
            'verb': 'add',
            'object': 1
        };
        this.user1.addActivity(activity);
        done();
    });

    it('remove activity', function(done) {
        var self = this;
        var activity = {
            'actor': 1,
            'verb': 'add',
            'object': 1
        };

        function remove(error, response, body) {
            var activityId = body['id'];
            expect(response.statusCode).to.eql(201);
            self.user1.removeActivity(activityId, function(error, response, body) {
                expect(response.statusCode).to.eql(200);
                done();
            });
        }
        this.user1.addActivity(activity, remove);
    });

    it.skip('remove activity foreign id', function(done) {
        var self = this;
        var activity = {
            'actor': 1,
            'verb': 'add',
            'object': 1,
            'foreign_id': 'add:2'
        };
        var now = new Date();
        activity.time = now.toISOString();

        function remove(error, response, body) {
            var activityId = body['id'];
            expect(response.statusCode).to.eql(201);
            self.user1.removeActivity({
                foreignId: 'add:1'
            }, function(error, response, body) {
                expect(response.statusCode).to.eql(200);
                self.user1.get({
                    limit: 10
                }, function(error, response, body) {
                    expect(response.statusCode).to.eql(200);
                    expect(body['results'][0]['id']).not.to.eql(activityId);
                    expect(body['results'][0]['foreign_id']).not.to.eql('add:1');
                    done();
                });
            });
        }
        self.user1.addActivity(activity, remove);
    });

    it('add activities', function(done) {
        var self = this;
        var activities = [{
            'actor': 1,
            'verb': 'tweet',
            'object': 1
        }, {
            'actor': 2,
            'verb': 'tweet',
            'object': 3
        }, ];

        function get(error, response, body) {
            var activityIdFirst = body['activities'][0]['id'];
            var activityIdLast = body['activities'][1]['id'];
            self.user1.get({
                'limit': 2
            }, function(error, response, body) {
                expect(response.statusCode).to.eql(200);
                expect(body['results'][0]['id']).to.eql(activityIdLast);
                expect(body['results'][1]['id']).to.eql(activityIdFirst);
                done();
            });
        }
        this.user1.addActivities(activities, get);
    });


    it('follow', function(done) {
        var self = this;
        var activityId = null;
        this.timeout(9000);

        function add() {
            var activity = {
                'actor': 1,
                'verb': 'add',
                'object': 1
            };
            self.user1.addActivity(activity, follow);
        }

        function follow(error, response, body) {
            activityId = body['id'];
            self.aggregated2.follow('user', '11', runCheck);
        }

        function runCheck(error, response, body) {
            function check() {
                self.aggregated2.get({
                    'limit': 1
                }, function(error, response, body) {
                    expect(response.statusCode).to.eql(200);
                    expect(body['results'][0]['activities'][0]['id']).to.eql(activityId);
                    done();
                });
            }
            setTimeout(check, config.READ_TIMEOUT);
        }
        add();
    });

    it('follow without callback', function(done) {
        this.aggregated2.follow('user', '111');
        done();
    });

    it('follow with copy limit', function(done) {
        this.aggregated2.follow('user', '999', {
            limit: 500
        }, function(error, response, body) {
            if (error) done(error);
            expect(response.statusCode).to.be(201);
            done();
        });
    });

    it.skip('unfollow', function(done) {
        var self = this;
        this.timeout(6000);
        var activityId = null;

        function add() {
            var activity = {
                'actor': 1,
                'verb': 'add',
                'object': 1
            };
            self.user1.addActivity(activity, follow);
        }

        function follow(error, response, body) {
            activityId = body['id'];
            self.aggregated2.follow('user', '11', unfollow);
        }

        function unfollow(error, response, body) {
            self.aggregated2.unfollow('user', '11', check);
        }

        function check(error, response, body) {
            setTimeout(function() {
                self.aggregated2.get({
                    'limit': 1
                }, function(error, response, body) {
                    expect(response.statusCode).to.eql(200);
                    var firstResult = body['results'][0];
                    var activityFound = (firstResult) ? firstResult['activities'][0]['id'] : null;
                    expect(activityFound).to.not.eql(activityId);
                    done();
                });
            }, config.READ_TIMEOUT);
        }
        add();
    });

    it.skip('unfollow keep_history', function(done) {
        var self = this;
        this.timeout(6000);

        var activityId = null;

        function add() {
            var activity = {
                'actor': 1,
                'verb': 'add',
                'object': 1
            };
            self.user1.addActivity(activity, follow);
        }

        function follow(error, response, body) {
            if (error) return done(error);

            activityId = body['id'];
            self.flat3.follow('user', '11', unfollow);
        }

        function unfollow(error, response, body) {
            if (error) return done(error);

            self.flat3.unfollow('user', '11', {
                keepHistory: true
            }, check);
        }

        function check(error, response, body) {
            if (error) return done(error);

            setTimeout(function() {
                self.flat3.get({
                    'limit': 1
                }, function(error, response, body) {
                    expect(response.statusCode).to.eql(200);
                    var firstResult = body['results'][0];
                    var activityFound = (firstResult) ? firstResult['id'] : null;
                    expect(activityFound).to.eql(activityId);
                    done();
                });
            }, config.READ_TIMEOUT);
        }

        add();
    });

    it('list followers', function(done) {
        function callback(error, response, body) {
            expect(error).to.eql(null);
            expect(body.exception).to.eql(undefined);
            done();
        }
        this.user1.followers({
            limit: '10',
            offset: '10'
        }, callback);
    });

    it('list following', function(done) {
        function callback(error, response, body) {
            expect(error).to.eql(null);
            expect(body.exception).to.eql(undefined);
            done();
        }
        this.user1.following({
            limit: '10',
            offset: '10'
        }, callback);
    });

    it('do i follow', function(done) {
        var self = this;
        function doifollow() {
            self.user1.following({
                'filter': ['flat:33', 'flat:44']
            }, callback);
        }

        function callback(error, response, body) {
            expect(error).to.eql(null);
            expect(body.exception).to.eql(undefined);
            var results = body.results;
            expect(results.length).to.eql(1);
            expect(results[0].target_id).to.eql('flat:33');
            done();
        }
        this.user1.follow('flat', '33', doifollow);
    });

    it('get read-only feed', function(done) {
        function check(error, response, body) {
            expect(response.statusCode).to.eql(200);
            done();
        }
        this.user1ReadOnly.get({
            'limit': 2
        }, check);
    });

    it('get filtering', function(done) {
        // first add three activities
        //TODO find a library to make async testing easier on the eye
        var self = this;
        var activityIdOne = null;
        var activityIdTwo = null;
        var activityIdThree = null;

        function add() {
            var activity = {
                'actor': 1,
                'verb': 'add',
                'object': 1
            };
            self.user1.addActivity(activity, add2);
        }

        function add2(error, response, body) {
            activityIdOne = body['id'];
            var activity = {
                'actor': 2,
                'verb': 'watch',
                'object': 2
            };
            self.user1.addActivity(activity, add3);
        }

        function add3(error, response, body) {
            activityIdTwo = body['id'];
            var activity = {
                'actor': 3,
                'verb': 'run',
                'object': 2
            };
            self.user1.addActivity(activity, function(error, response, body) {
                // testing eventual consistency is not easy :)
                function getBound() {
                    get(error, response, body);
                }
                setTimeout(getBound, 200);
            });
        }

        function get(error, response, body) {
            activityIdThree = body['id'];
            self.user1.get({
                'limit': 2
            }, check);
        }

        // no filtering
        function check(error, response, body) {
            expect(body['results'].length).to.eql(2);
            expect(body['results'][0]['id']).to.eql(activityIdThree);
            expect(body['results'][1]['id']).to.eql(activityIdTwo);
            self.user1.get({
                limit: 2,
                offset: 1
            }, check2);
        }

        // offset based
        function check2(error, response, body) {
            expect(body['results'].length).to.eql(2);
            expect(body['results'][0]['id']).to.eql(activityIdTwo);
            expect(body['results'][1]['id']).to.eql(activityIdOne);
            self.user1.get({
                limit: 2,
                id_lt: activityIdTwo
            }, check3);
        }

        // try id_lt based
        function check3(error, response, body) {
            expect(body['results'].length).to.eql(2);
            expect(body['results'][0]['id']).to.eql(activityIdOne);
            done();
        }

        add();

    });

    it('mark read and seen', function(done) {
        // add 2 activities to ensure we have new data
        var self = this;
        var params = {
            limit: 2
        };
        var activities = [{
            'actor': 1,
            'verb': 'add',
            'object': 1
        }, {
            'actor': 2,
            'verb': 'test',
            'object': 2
        }];
        this.notification3.addActivities(activities, getNotifications);
        // lookup the notification ids
        function getNotifications(error, response, body) {
            self.notification3.get(params, markRead);
        }
        // mark all seen and the first read
        function markRead(error, response, body) {
            var notificationId = body['results'][0]['id'];
            var params = {
                limit: 2,
                mark_seen: true,
                mark_read: notificationId
            };
            self.notification3.get(params, readFeed);
        }
        // read the feed (should be seen and 1 unread)
        function readFeed(error, response, body) {
            self.notification3.get(params, verifyState);
        }
        // verify the seen and 1 unread
        function verifyState(error, response, body) {
            expect(body['results'][0]['is_seen']).to.eql(true);
            expect(body['results'][1]['is_seen']).to.eql(true);
            expect(body['results'][0]['is_read']).to.eql(true);
            expect(body['results'][1]['is_read']).to.eql(false);
            expect(body['unread']).to.be.greaterThan(1);
            expect(body['unseen']).to.eql(0);
            done();
        }

    });

});