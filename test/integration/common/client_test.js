var init = require('../utils/hooks').init
  , beforeEachFn = require('../utils/hooks').beforeEach
  , expect = require('expect.js')
  , errors = require('../../../src/getstream').errors
  , utils = require('../utils')
  , config = require('../utils/config');

describe('Stream client (Common)', function() {

    init.call(this);
    beforeEach(beforeEachFn);

    it('handlers', function() {
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

        return this.user1.get({
                'limit': 1
            })
            .then(function() {
                self.client.off();
                return self.user1.get({ 'limit': 1 });
            })
            .then(function() {
                expect(called.request).to.eql(1);
                expect(called.response).to.eql(1);
            });
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

    it('get invalid format', function() {
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
    });

    it('add activity', function() {
        var self = this;
        var activityId = null;
        var activity = {
            'actor': 'test-various:characters',
            'verb': 'add',
            'object': 1,
            'tweet': 'hello world'
        };

        return this.user1.addActivity(activity)
            .then(function(body) {
                activityId = body['id'];
                return self.user1.get({'limit': 1});
            })
            .then(function(body) {
                expect(body['results'][0]['id']).to.eql(activityId);
            });
    });

    it('add complex activity', function() {
        var self = this;
        var activityId = null;
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
        
        return this.user1.addActivity(activity)
            .then(function(body) {
                activityId = body['id'];
                return self.user1.get({ 'limit': 1 });
            })
            .then(function(body) {
                expect(body['results'][0]['id']).to.eql(activityId);
                expect(body['results'][0]['participants']).to.eql(['Thierry', 'Tommaso']);
                expect(body['results'][0]['route']).to.eql({
                    'name': 'Vondelpark',
                    'distance': '20'
                });
                expect(body['results'][0]['date']).to.eql(isoDate);
            });
    });

    it('add activity using to', function() {
        var self = this;
        var activityId = null;
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
        
        return this.user1.addActivity(activity)
            .then(function(body) {
                activityId = body['id'];
                return self.flat3.get({ 'limit': 1 });
            })
            .then(function(body) {
                expect(body['results'][0]['id']).to.eql(activityId); 
            });
    });

    it('add activity no callback', function() {
        var activity = {
            'actor': 1,
            'verb': 'add',
            'object': 1
        };

        return this.user1.addActivity(activity);
    });

    it('remove activity', function() {
        var self = this;
        var activity = {
            'actor': 1,
            'verb': 'add',
            'object': 1
        };

        return this.user1.addActivity(activity)
            .then(function(body) {
                var activityId = body['id'];
                return self.user1.removeActivity(activityId);
            });
    });

    it('remove activity foreign id', function() {
        var self = this;
        var activityId = null;
        var activity = {
            'actor': 1,
            'verb': 'add',
            'object': 1,
            'foreign_id': 'add:2'
        };
        var now = new Date();
        activity.time = now.toISOString();

        return self.user1.addActivity(activity)
            .then(function(body) {
                activityId = body['id'];
                return self.user1.removeActivity({
                    foreignId: 'add:2'
                });
            })
            .then(function() {
                return self.user1.get({ limit: 10 });
            })
            .then(function(body) {
                expect(body['results'][0]['id']).not.to.eql(activityId);
                expect(body['results'][0]['foreign_id']).not.to.eql('add:1');
            });
    });

    it('add activities', function() {
        var self = this;
        var activityIdFirst, activityIdLast;
        var activities = [{
            'actor': 1,
            'verb': 'tweet',
            'object': 1
        }, {
            'actor': 2,
            'verb': 'tweet',
            'object': 3
        }, ];

        return this.user1.addActivities(activities)
            .then(function(body) {
                activityIdFirst = body['activities'][0]['id'];
                activityIdLast = body['activities'][1]['id'];
                return self.user1.get({ 'limit': 2 });
            })
            .then(function(body) {
                expect(body['results'][0]['id']).to.eql(activityIdLast);
                expect(body['results'][1]['id']).to.eql(activityIdFirst);
            });
    });


    it('follow', function() {
        var self = this;
        var activityId = null;
        this.timeout(9000);

        var activity = {
            'actor': 1,
            'verb': 'add',
            'object': 1
        };

        return self.user1.addActivity(activity)
            .then(function (body) {
                activityId = body['id'];
                return self.aggregated2.follow('user', '11');
            })
            .then(function() {
                return utils.delay(config.READ_TIMEOUT);
            })
            .then(function check() {
                return self.aggregated2.get({ 'limit': 1 });
            })
            .then(function(body) {
                expect(body['results'][0]['activities'][0]['id']).to.eql(activityId);
            });
    });

    it('follow without callback', function() {
        return this.aggregated2.follow('user', '111');
    });

    it('follow with copy limit', function() {
        return this.aggregated2.follow('user', '999', {
            limit: 500
        });
    });

    it('unfollow', function() {
        var self = this;
        this.timeout(6000);
        var activityId = null;

        var activity = {
            'actor': 1,
            'verb': 'add',
            'object': 1
        };

        return self.user1.addActivity(activity)
            .then(function follow(body) {
                activityId = body['id'];
                return self.aggregated2.follow('user', '11');
            }).then(function () {
                return self.aggregated2.unfollow('user', '11');
            }).then(function () {
                return utils.delay(config.READ_TIMEOUT);
            }).then(function() {
                return self.aggregated2.get({ 'limit': 1 });
            }).then(function(body) {
                var firstResult = body['results'][0];
                var activityFound = (firstResult) ? firstResult['activities'][0]['id'] : null;
                expect(activityFound).to.not.eql(activityId);
            });
    });

    it('unfollow keep_history', function() {
        var self = this;
        this.timeout(6000);

        var activityId = null;

        var activity = {
            'actor': 1,
            'verb': 'add',
            'object': 1
        };
        return self.user1.addActivity(activity)
            .then(function (body) {
                activityId = body['id'];
                self.flat3.follow('user', '11');
            })
            .then(function () {
                return self.flat3.unfollow('user', '11', {
                    keepHistory: true
                });
            })
            .then(function() {
                return utils.delay(config.READ_TIMEOUT);
            })
            .then(function() {
                return self.flat3.get({ 'limit': 1 }); 
            })
            .then(function(body) {
                var firstResult = body['results'][0];
                var activityFound = (firstResult) ? firstResult['id'] : null;
                expect(activityFound).to.eql(activityId);
            });
    });

    it('list followers', function() {
        return this.user1.followers({
            limit: '10',
            offset: '10'
        });
    });

    it('list following', function() {
        return this.user1.following({
            limit: '10',
            offset: '10'
        });
    });

    it('do i follow', function() {
        var self = this;
        
        return this.user1.follow('flat', '33')
            .then(function doifollow() {
                return self.user1.following({
                    'filter': ['flat:33', 'flat:44']
                });
            })
            .then(function callback(body) {
                var results = body.results;
                expect(results.length).to.eql(1);
                expect(results[0].target_id).to.eql('flat:33');
            });
    });

    it('get read-only feed', function() {
        return this.user1ReadOnly.get({
            'limit': 2
        });
    });

    it('get filtering', function() {
        // first add three activities
        //TODO find a library to make async testing easier on the eye
        var self = this;
        var activityIdOne = null;
        var activityIdTwo = null;
        var activityIdThree = null;

        var activity = {
            'actor': 1,
            'verb': 'add',
            'object': 1
        };

        return self.user1.addActivity(activity)
            .then(function add2(body) {
                activityIdOne = body['id'];
                var activity = {
                    'actor': 2,
                    'verb': 'watch',
                    'object': 2
                };
                return self.user1.addActivity(activity);
            })
            .then(function add3(body) {
                activityIdTwo = body['id'];
                var activity = {
                    'actor': 3,
                    'verb': 'run',
                    'object': 2
                };
                return self.user1.addActivity(activity);
            })
            .then(function(body) {
                return utils.delay(200, body);
            })
            .then(function get(body) {
                activityIdThree = body['id'];
                return self.user1.get({
                    'limit': 2
                });
            })
            .then(function check(body) {
                expect(body['results'].length).to.eql(2);
                expect(body['results'][0]['id']).to.eql(activityIdThree);
                expect(body['results'][1]['id']).to.eql(activityIdTwo);

                return self.user1.get({
                    limit: 2,
                    offset: 1
                });
            })
            .then(function check2(body) {
                expect(body['results'].length).to.eql(2);
                expect(body['results'][0]['id']).to.eql(activityIdTwo);
                expect(body['results'][1]['id']).to.eql(activityIdOne);

                return self.user1.get({
                    limit: 2,
                    id_lt: activityIdTwo
                });
            })
            .then(function check3(body) {
                expect(body['results'].length).to.eql(2);
                expect(body['results'][0]['id']).to.eql(activityIdOne);
            });

    });

    it('mark read and seen', function() {
        // add 2 activities to ensure we have new data
        this.timeout(15000);
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

        return this.notification3.addActivities(activities)
            .then(function() {
                return self.notification3.get(params);
            })
            .then(function(body) {
                var notificationId = body['results'][0]['id'];
                var params = {
                    limit: 2,
                    mark_seen: true,
                    mark_read: notificationId
                };

                return self.notification3.get(params); 
            })
            .then(function() {
                return self.notification3.get(params);
            })
            .then(function(body) {
                expect(body['results'][0]['is_seen']).to.eql(true);
                expect(body['results'][1]['is_seen']).to.eql(true);
                expect(body['results'][0]['is_read']).to.eql(true);
                expect(body['results'][1]['is_read']).to.eql(false);
                // expect(body['unread']).to.be.greaterThan(1);
                expect(body['unseen']).to.eql(0);
            });

    });

});