var stream = require('../../../src/getstream'),
  errors = require('../../../src/getstream').errors,
  init = require('../utils/hooks').init,
  beforeEachFn = require('../utils/hooks').beforeEach,
  expect = require('expect.js'),
  wrapCB = require('../utils').wrapCB;

describe('[INTEGRATION] Stream client (Node)', function() {
  init.call(this);
  beforeEach(beforeEachFn);

  it('get feed', function(done) {
    this.user1.get(
      {
        limit: 1,
      },
      function(error, response) {
        if (error) done(error);
        expect(response.statusCode).to.eql(200);

        var userAgent = response.req._headers['x-stream-client'];
        expect(userAgent.indexOf('stream-javascript-client')).to.eql(0);

        done();
      },
    );
  });

  it('update activities', function() {
    var self = this;
    var activities = [
      {
        actor: 1,
        verb: 'tweet',
        object: 1,
        foreign_id: 'update_activity_1',
      },
      {
        actor: 2,
        verb: 'tweet',
        object: 3,
        foreign_id: 'update_activity_1',
      },
    ];

    return this.user1
      .addActivities(activities)
      .then(function(body) {
        var activity = body['activities'][0];

        activity['answer'] = 10;
        delete activity.to;
        delete activity.target;
        delete activity.origin;

        var activities = [activity];

        return self.client.updateActivities(activities);
      })
      .then(function() {
        return self.user1.get({ limit: 2 });
      })
      .then(function(body) {
        var activity = body['results'][1];
        expect(activity.answer).to.be(10);
      });
  });

  it('update activity illegal foreign id', function() {
    var self = this;

    var activity = {
      actor: 1,
      verb: 'tweet',
      object: 2,
    };

    return this.user1
      .addActivity(activity)
      .then(function(body) {
        var activity = body;

        delete activity.id;
        delete activity.duration;
        delete activity.to;
        delete activity.time;

        activity['foreign_id'] = 'aap';

        return self.client.updateActivity(activity);
      })
      .then(function() {
        throw new Error('Expected InputException');
      })
      .catch(function(reason) {
        expect(reason.error.code).to.be(4);
        expect(reason.error.exception).to.be('InputException');
      });
  });

  it('update activity illegal time', function() {
    var self = this;

    var activity = {
      actor: 1,
      verb: 'tweet',
      object: 2,
    };

    return this.user1
      .addActivity(activity)
      .then(function(body) {
        var activity = body;

        delete activity.duration;
        delete activity.to;

        activity['time'] = 'aap';

        return self.client.updateActivity(activity);
      })
      .then(function() {
        throw new Error('Expected InputException');
      })
      .catch(function(reason) {
        expect(reason.error.code).to.be(4);
        expect(reason.error.exception).to.be('InputException');
      });
  });

  it('update activity illegal to field', function() {
    var self = this;

    var activity = {
      actor: 1,
      verb: 'tweet',
      object: 2,
    };

    return this.user1
      .addActivity(activity)
      .then(function(body) {
        var activity = body;

        delete activity.duration;
        delete activity.time;

        activity['to'] = ['to:something'];

        return self.client.updateActivity(activity);
      })
      .then(function() {
        throw new Error('Expected InputException');
      })
      .catch(function(reason) {
        expect(reason.error.code).to.be(4);
        expect(reason.error.exception).to.be('InputException');
      });
  });

  it('updating many activities', function() {
    var self = this;
    var activities = [];
    for (var i = 0; i < 10; i++) {
      activities.push({
        verb: 'do',
        object: 'object:' + i,
        actor: 'user:' + i,
        foreign_id: 'update_activities_' + i,
      });
    }

    return this.user1
      .addActivities(activities)
      .then(function(body) {
        var activitiesCreated = body['activities'];

        for (var j = 0; j < activitiesCreated.length; j++) {
          activitiesCreated[j]['answer'] = 100;
        }

        return self.client.updateActivities(activitiesCreated);
      })
      .then(function() {
        return self.user1.get({
          limit: 10,
        });
      })
      .then(function(body) {
        var activitiesUpdated = body['results'];

        for (var n = 0; n < activitiesUpdated.length; n++) {
          expect(activitiesUpdated[n]['answer']).to.be(100);
        }
      });
  });

  it('#updateActivity', function() {
    var activity = {
      verb: 'do',
      actor: 'user:1',
      object: 'object:1',
      time: new Date().toISOString(),
      foreign_id: 'update_activity_11',
    };

    return this.client.updateActivity(activity);
  });

  it('supports adding activity to multiple feeds', function(done) {
    var activity = {
      actor: 'user:11',
      verb: 'like',
      object: '000',
    };
    var feeds = ['flat:33', 'user:11'];

    this.client.addToMany(activity, feeds, wrapCB(201, done));
  });

  it('supports batch following', function(done) {
    var follows = [
      {
        source: 'flat:1',
        target: 'user:1',
      },
      {
        source: 'flat:1',
        target: 'user:2',
      },
      {
        source: 'flat:1',
        target: 'user:3',
      },
    ];

    this.client.followMany(follows, null, wrapCB(201, done));
  });

  it('supports batch following with activity_copy_limit', function(done) {
    var follows = [
      {
        source: 'flat:1',
        target: 'user:1',
      },
      {
        source: 'flat:1',
        target: 'user:2',
      },
      {
        source: 'flat:1',
        target: 'user:3',
      },
    ];

    this.client.followMany(
      follows,
      20,
      wrapCB(201, done, function(error, response) {
        expect(response.req.path.indexOf('activity_copy_limit=20')).to.not.be(
          0,
        );
        done();
      }),
    );
  });

  it('supports batch unfollowing', function(done) {
    var unfollows = [
      {
        source: 'flat:1',
        target: 'user:1',
      },
      {
        source: 'flat:1',
        target: 'user:2',
        keep_history: true,
      },
      {
        source: 'flat:1',
        target: 'user:3',
      },
    ];

    this.client.unfollowMany(unfollows, wrapCB(201, done));
  });

  it('no secret application auth', function() {
    var client = stream.connect('ahj2ndz7gsan');

    expect(function() {
      client.addToMany({}, []);
    }).to.throwError(function(e) {
      expect(e).to.be.a(errors.SiteError);
    });
  });

  it('batch promises', function() {
    var activity = {
      actor: 'user:11',
      verb: 'like',
      object: '000',
    };
    var feeds = ['flat:33', 'user:11'];

    return this.client.addToMany(activity, feeds);
  });

  it('add activity using to', function() {
    var self = this;
    var activityId = null;
    var activity = {
      actor: 1,
      verb: 'add',
      object: 1,
    };
    activity['participants'] = ['Thierry', 'Tommaso'];
    activity['route'] = {
      name: 'Vondelpark',
      distance: '20',
    };
    activity['to'] = [self.flat3.id, 'user:everyone'];

    return this.user1
      .addActivity(activity)
      .then(function(body) {
        activityId = body['id'];
        return self.flat3.get({ limit: 1 });
      })
      .then(function(body) {
        expect(body['results'][0]['id']).to.eql(activityId);
      });
  });
  describe("updating activity's 'to' targets", function() {
    it("replaces an activity's 'to' targets with `new_targets` (activity has existing targets)", function(done) {
      var self = this;
      var timestamp = new Date();

      var activity = {
        actor: 1,
        verb: 'test',
        object: 1,
        foreign_id: 1234,
        time: timestamp,
      };
      this.user1
        .addActivity(activity)
        .then(function() {
          return self.user1.updateActivityToTargets(1234, timestamp, [
            'user:5678',
          ]);
        })
        .then(function() {
          return self.user1.get();
        })
        .then(function(response) {
          expect(response.results[0].to).to.have.length(1);
          expect(response.results[0].to).to.contain('user:5678');
          return done();
        });
    });
    it("replaces an activity's 'to' targets with `new_targets` (activity has no existing targets)", function(done) {
      var self = this;
      var timestamp = new Date();

      var activity = {
        actor: 1,
        verb: 'test',
        object: 1,
        foreign_id: 1234,
        time: timestamp,
        to: ['user:1234'],
      };
      this.user1
        .addActivity(activity)
        .then(function() {
          return self.user1.updateActivityToTargets(1234, timestamp, [
            'user:5678',
          ]);
        })
        .then(function() {
          return self.user1.get();
        })
        .then(function(response) {
          expect(response.results[0].to).to.have.length(1);
          expect(response.results[0].to).to.contain('user:5678');
          return done();
        });
    });

    it("add new targets to an activity's 'to' targets with `add_targets` (activity has existing targets)", function(done) {
      var self = this;
      var timestamp = new Date();

      var activity = {
        actor: 1,
        verb: 'test',
        object: 1,
        foreign_id: 1234,
        time: timestamp,
        to: ['user:1234'],
      };
      this.user1
        .addActivity(activity)
        .then(function() {
          return self.user1.updateActivityToTargets(1234, timestamp, null, [
            'user:5678',
          ]);
        })
        .then(function() {
          return self.user1.get();
        })
        .then(function(response) {
          expect(response.results[0].to).to.have.length(2);
          expect(response.results[0].to).to.contain('user:1234');
          expect(response.results[0].to).to.contain('user:5678');
          done();
        });
    });
    it("add new targets to an activity's 'to' targets with `add_targets` (activity has no existing targets)", function(done) {
      var self = this;
      var timestamp = new Date();

      var activity = {
        actor: 1,
        verb: 'test',
        object: 1,
        foreign_id: 1234,
        time: timestamp,
      };
      this.user1
        .addActivity(activity)
        .then(function() {
          return self.user1.updateActivityToTargets(1234, timestamp, null, [
            'user:5678',
          ]);
        })
        .then(function() {
          return self.user1.get();
        })
        .then(function(response) {
          expect(response.results[0].to).to.have.length(1);
          expect(response.results[0].to).to.contain('user:5678');
          done();
        });
    });

    it("remove targets from an activity's 'to' targets with `remove_targets` (end result still has targets)", function(done) {
      var self = this;
      var timestamp = new Date();

      var activity = {
        actor: 1,
        verb: 'test',
        object: 1,
        foreign_id: 1234,
        time: timestamp,
        to: ['user:1234', 'user:5678'],
      };
      this.user1
        .addActivity(activity)
        .then(function() {
          return self.user1.updateActivityToTargets(
            1234,
            timestamp,
            null,
            null,
            ['user:5678'],
          );
        })
        .then(function() {
          return self.user1.get();
        })
        .then(function(response) {
          expect(response.results[0].to).to.have.length(1);
          expect(response.results[0].to).to.contain('user:1234');
          done();
        });
    });
    it("remove targets from an activity's 'to' targets with `remove_targets` (end result has no targets)", function(done) {
      var self = this;
      var timestamp = new Date();

      var activity = {
        actor: 1,
        verb: 'test',
        object: 1,
        foreign_id: 1234,
        time: timestamp,
        to: ['user:1234'],
      };
      this.user1
        .addActivity(activity)
        .then(function() {
          return self.user1.updateActivityToTargets(
            1234,
            timestamp,
            null,
            null,
            ['user:1234'],
          );
        })
        .then(function() {
          return self.user1.get();
        })
        .then(function(response) {
          expect(response.results[0].to).to.have.length(0);
          done();
        });
    });

    it("replaces an activity's 'to' targets with a combination of `add_targets` and `remove_targets` (activity has no other existing targets)", function(done) {
      var self = this;
      var timestamp = new Date();

      var activity = {
        actor: 1,
        verb: 'test',
        object: 1,
        foreign_id: 1234,
        time: timestamp,
        to: ['user:1234'],
      };
      this.user1
        .addActivity(activity)
        .then(function() {
          return self.user1.updateActivityToTargets(
            1234,
            timestamp,
            null,
            ['user:5678'],
            ['user:1234'],
          );
        })
        .then(function() {
          return self.user1.get();
        })
        .then(function(response) {
          expect(response.results[0].to).to.have.length(1);
          expect(response.results[0].to).to.have.contain('user:5678');
          done();
        });
    });

    it("replaces an activity's 'to' targets with a combination of `add_targets` and `remove_targets` (activity has other existing targets too, that don't get modified)", function(done) {
      var self = this;
      var timestamp = new Date();

      var activity = {
        actor: 1,
        verb: 'test',
        object: 1,
        foreign_id: 1234,
        time: timestamp,
        to: ['user:0000', 'user:1234'],
      };
      this.user1
        .addActivity(activity)
        .then(function() {
          return self.user1.updateActivityToTargets(
            1234,
            timestamp,
            null,
            ['user:5678'],
            ['user:1234'],
          );
        })
        .then(function() {
          return self.user1.get();
        })
        .then(function(response) {
          expect(response.results[0].to).to.have.length(2);
          expect(response.results[0].to).to.have.contain('user:0000');
          expect(response.results[0].to).to.have.contain('user:5678');
          done();
        });
    });
  });

  describe('get activities', function() {
    var activity;

    beforeEach(function(done) {
      var self = this;
      this.user1
        .addActivity({
          actor: 1,
          verb: 'test',
          object: 1,
          foreign_id: 1234,
          time: new Date(),
        })
        .then(function() {
          return self.user1.get();
        })
        .then(function(resp) {
          activity = resp.results[0];
          done();
        });
    });

    describe('by ID', function() {
      it('allows to retrieve activities directly by their ID', function(done) {
        this.client
          .getActivities({ ids: [activity['id']] })
          .then(function(resp) {
            expect(resp.results[0]).to.eql(activity);
            done();
          });
      });
    });

    describe('by foreign ID and time', function() {
      it('allows to retrieve activities directly by their ID', function(done) {
        this.client
          .getActivities({
            foreignIDTimes: [
              {
                foreignID: activity['foreign_id'],
                time: activity['time'],
              },
            ],
          })
          .then(function(resp) {
            expect(resp.results[0]).to.eql(activity);
            done();
          });
      });
    });
  });

  describe('update activity partial', function() {
    var activity, expected;

    beforeEach(function(done) {
      var self = this;
      this.user1
        .addActivity({
          actor: 1,
          verb: 'test',
          object: 1,
          foreign_id: 1234,
          time: new Date(),
          shares: {
            facebook: 123,
            twitter: 2000,
          },
          popularity: 50,
          color: 'blue',
        })
        .then(function() {
          return self.user1.get();
        })
        .then(function(resp) {
          activity = resp.results[0];

          expected = activity;
          delete expected.color;
          expected.popularity = 75;
          expected.shares = {
            facebook: 234,
            twitter: 2000,
            googleplus: 42,
          };
          expected.foo = {
            bar: {
              baz: 999,
            },
          };

          done();
        });
    });

    describe('by ID', function() {
      it('allows to update the activity', function(done) {
        var self = this;

        this.client
          .activityPartialUpdate({
            id: activity['id'],
            set: {
              popularity: 75,
              'shares.facebook': 234,
              'shares.googleplus': 42,
              foo: {
                bar: {
                  baz: 999,
                },
              },
            },
            unset: ['color'],
          })
          .then(function() {
            self.client
              .getActivities({ ids: [activity['id']] })
              .then(function(resp) {
                expect(resp.results[0]).to.eql(expected);
                done();
              });
          });
      });
    });

    describe('by foreign ID and time', function() {
      it('allows to update the activity', function(done) {
        var self = this;

        this.client
          .activityPartialUpdate({
            foreignID: activity['foreign_id'],
            time: activity['time'],
            set: {
              popularity: 75,
              'shares.facebook': 234,
              'shares.googleplus': 42,
              foo: {
                bar: {
                  baz: 999,
                },
              },
            },
            unset: ['color'],
          })
          .then(function() {
            self.client
              .getActivities({ ids: [activity['id']] })
              .then(function(resp) {
                expect(resp.results[0]).to.eql(expected);
                done();
              });
          });
      });
    });
  });
});
