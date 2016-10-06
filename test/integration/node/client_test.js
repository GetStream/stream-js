var stream = require('../../../src/getstream')
  , errors = require('../../../src/getstream').errors
  , init = require('../utils/hooks').init
  , beforeEachFn = require('../utils/hooks').beforeEach
  , expect = require('expect.js')
  , wrapCB = require('../utils').wrapCB;

describe('Stream client (Node)', function() {

    init.call(this);
    beforeEach(beforeEachFn);

    it('location support', function() {
        var options = {};
        var location = 'us-east';
        var fullLocation = 'https://us-east-api.getstream.io/api/';
        options.location = location;
        this.client = stream.connect('a', 'b', 'c', options);
        expect(this.client.baseUrl).to.eql(fullLocation);
        expect(this.client.location).to.eql(location);
    });

    it('update activities', function(done) {
        var activities = [{
            'actor': 1,
            'verb': 'tweet',
            'object': 1,
            'foreign_id': 'update_activity_1'
        }, {
            'actor': 2,
            'verb': 'tweet',
            'object': 3,
            'foreign_id': 'update_activity_1'
        }, ];

        this.user1.addActivities(activities)
            .then(function(body) {
                var activity = body['activities'][0];

                activity['answer'] = 10;
                delete activity.to;
                delete activity.target;
                delete activity.origin;

                var activities = [activity];

                return this.client.updateActivities(activities);
            })
            .then(function(body) {
                var activity = body['activities'][0];
                expect(activity.answer).to.be(10);
                done();
            })
            .catch(function(reason) {
                done(reason.error);
            });
    });

    it('update activity illegal foreign id', function(done) {
        var activity = {
            'actor': 1,
            'verb': 'tweet',
            'object': 2,
        };

        this.user1.addActivity(activity)
            .catch(done)
            .then(function(body) {
                var activity = body;

                delete activity.id;
                delete activity.duration;
                delete activity.to;
                delete activity.time;

                activity['foreign_id'] = 'aap';

                return this.client.updateActivity(activity);
            })
            .then(function() {
                done('Expected InputException');
            })
            .catch(function(reason) {
                expect(reason.error.code).to.be(4);
                expect(reason.error.exception).to.be('InputException')
                done();
            });
    });

    it('update activity illegal time', function(done) {
        var activity = {
            'actor': 1,
            'verb': 'tweet',
            'object': 2,
        };

        this.user1.addActivity(activity)
            .catch(done)
            .then(function(body) {
                var activity = body;

                delete activity.duration;
                delete activity.to;

                activity['time'] = 'aap';

                return this.client.updateActivity(activity);
            })
            .then(function() {
                done('Expected InputException');
            })
            .catch(function(reason) {
                expect(reason.error.code).to.be(4);
                expect(reason.error.exception).to.be('InputException')
                done();
            });
    });

    it('update activity illegal to field', function(done) {
        var activity = {
            'actor': 1,
            'verb': 'tweet',
            'object': 2,
        };

        this.user1.addActivity(activity)
            .catch(done)
            .then(function(body) {
                var activity = body;

                delete activity.duration;
                delete activity.time;

                activity['to'] = ['to:something'];

                return this.client.updateActivity(activity);
            })
            .then(function() {
                done('Expected InputException');
            })
            .catch(function(reason) {
                expect(reason.error.code).to.be(4);
                expect(reason.error.exception).to.be('InputException')
                done();
            });
    });

    it('updating many activities', function(done) {
        var activities = [];
        for (var i = 0; i < 10; i++) {
            activities.push({
                'verb': 'do',
                'object': 'object:' + i,
                'actor': 'user:' + i,
                'foreign_id': 'update_activities_' + i
            });
        }

        this.user1.addActivities(activities)
            .then(function(body) {
                var activitiesCreated = body['activities'];

                for (var j = 0; j < activitiesCreated.length; j++) {
                    activitiesCreated[j]['answer'] = 100;
                }

                return this.client.updateActivities(activitiesCreated);
            }.bind(this))
            .then(function(body) {
                return this.user1.get({
                    limit: 10
                });
            }.bind(this))
            .then(function(body) {
                var activitiesUpdated = body['results'];

                for (var n = 0; n < activitiesUpdated.length; n++) {
                    expect(activitiesUpdated[n]['answer']).to.be(100);
                }

                done();
            })
            .catch(done);
    });

    it('#updateActivity', function(done) {
        var activity = {
            'verb': 'do',
            'actor': 'user:1',
            'object': 'object:1',
            'time': new Date().toISOString(),
            'foreign_id': 'update_activity_11'
        };

        this.client.updateActivity(activity)
            .then(function() {
                done();
            }, done);
    });


    it('supports application level authentication', function(done) {
        this.client.makeSignedRequest({
            url: 'test/auth/digest/'
        }, wrapCB(200, done));
    });

    it('fails application level authentication with wrong keys', function(done) {
        var client = stream.connect('aap', 'noot');

        client.makeSignedRequest({
            url: 'test/auth/digest/'
        }, function(error, response, body) {
            if (error) done(error);
            if (body.exception === 'ApiKeyException') done();
        });
    });

    it('supports adding activity to multiple feeds', function(done) {
        var activity = {
            'actor': 'user:11',
            'verb': 'like',
            'object': '000'
        };
        var feeds = ['flat:33', 'user:11'];

        this.client.addToMany(activity, feeds, wrapCB(201, done));
    });

    it('supports batch following', function(done) {
        this.timeout(6000);

        var follows = [{
            'source': 'flat:1',
            'target': 'user:1'
        }, {
            'source': 'flat:1',
            'target': 'user:2'
        }, {
            'source': 'flat:1',
            'target': 'user:3'
        }];

        this.client.followMany(follows, null, wrapCB(201, done));
    });

    it('supports batch following with activity_copy_limit', function(done) {
        var follows = [{
            'source': 'flat:1',
            'target': 'user:1'
        }, {
            'source': 'flat:1',
            'target': 'user:2'
        }, {
            'source': 'flat:1',
            'target': 'user:3'
        }];

        this.client.followMany(follows, 20, wrapCB(201, done, function(error, response, body) {
            expect(response.req.path.indexOf('activity_copy_limit=20')).to.not.be(0);
            done();
        }));
    });

    it('no secret application auth', function() {
        var client = stream.connect('ahj2ndz7gsan');

        expect(function() {
            client.addToMany({}, []);
        }).to.throwError(function(e) {
            expect(e).to.be.a(errors.SiteError);
        });
    });

    it('batch promises', function(done) {
        var activity = {
            'actor': 'user:11',
            'verb': 'like',
            'object': '000'
        };
        var feeds = ['flat:33', 'user:11'];

        this.client.addToMany(activity, feeds).then(function(body) {
            done();
        }, done);
    });
});