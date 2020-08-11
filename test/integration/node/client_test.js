import expect from 'expect.js';

import { connect } from '../../../src';
import * as errors from '../../../src/errors';

import { init, beforeEachFn } from '../utils/hooks';

describe('[INTEGRATION] Stream client (Node)', function () {
  init.call(this);
  beforeEach(beforeEachFn);

  it('get feed', function () {
    return this.user1.get({ limit: 1 }).then((response) => {
      expect(response.results).to.eql([]);
      expect(response.next).to.be('');
    });
  });

  it('update activities', function () {
    const activities = [
      {
        actor: 1,
        verb: 'tweet',
        object: 1,
        foreign_id: 'update_activity_1',
        time: new Date(),
      },
      {
        actor: 2,
        verb: 'tweet',
        object: 2,
        foreign_id: 'update_activity_2',
        time: new Date(),
      },
    ];

    return this.user1
      .addActivities(activities)
      .then((body) => {
        const activity = body.activities.find((a) => a.foreign_id === activities[0].foreign_id);
        activity.answer = 10;
        delete activity.to;
        delete activity.target;
        delete activity.origin;
        return this.client.updateActivities([activity]);
      })
      .then(() => this.user1.get({ limit: 2 }))
      .then((body) => {
        const activity = body.results.find((a) => a.foreign_id === activities[0].foreign_id);
        expect(activity.answer).to.be(10);
      });
  });

  it('update activity illegal foreign id', function (done) {
    const activity = {
      actor: 1,
      verb: 'tweet',
      object: 2,
    };

    this.user1
      .addActivity(activity)
      .then((addedActivity) => {
        delete addedActivity.id;
        delete addedActivity.duration;
        delete addedActivity.to;
        delete addedActivity.time;

        addedActivity.foreign_id = 'aap';

        return this.client.updateActivity(addedActivity);
      })
      .then(() => {
        throw new Error('Expected InputException');
      })
      .catch((err) => {
        expect(err.error.code).to.be(4);
        expect(err.error.exception).to.be('InputException');
        done();
      });
  });

  it('update activity illegal time', function (done) {
    const activity = {
      actor: 1,
      verb: 'tweet',
      object: 2,
    };

    this.user1
      .addActivity(activity)
      .then((addedActivity) => {
        delete addedActivity.duration;
        delete addedActivity.to;

        addedActivity.time = 'aap';

        return this.client.updateActivity(addedActivity);
      })
      .then(() => {
        throw new Error('Expected InputException');
      })
      .catch((err) => {
        expect(err.error.code).to.be(4);
        expect(err.error.exception).to.be('InputException');
        done();
      });
  });

  it('update activity illegal to field', function (done) {
    const activity = {
      actor: 1,
      verb: 'tweet',
      object: 2,
    };

    this.user1
      .addActivity(activity)
      .then((addedActivity) => {
        delete addedActivity.duration;
        delete addedActivity.time;

        addedActivity.to = ['to:something'];

        return this.client.updateActivity(addedActivity);
      })
      .then(() => {
        throw new Error('Expected InputException');
      })
      .catch((reason) => {
        expect(reason.error.code).to.be(4);
        expect(reason.error.exception).to.be('InputException');
        done();
      });
  });

  it('updating many activities', function () {
    const activities = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
      activities.push({
        verb: 'do',
        object: `object:${i}`,
        actor: `user:${i}`,
        foreign_id: `update_activities_${i}`,
        time: new Date(),
      });
    }

    return this.user1
      .addActivities(activities)
      .then((body) => {
        expect(body.activities.length).to.be(count);

        const updatedActivities = body.activities.map((a) => ({ ...a, answer: 100 }));
        return this.client.updateActivities(updatedActivities);
      })
      .then(() => this.user1.get({ limit: 10 }))
      .then(({ results }) => {
        expect(results.length).to.be(count);
        results.forEach((a) => {
          expect(a.answer).to.be(100);
        });
      });
  });

  it('#updateActivity', function () {
    const activity = {
      verb: 'do',
      actor: 'user:1',
      object: 'object:11',
      time: new Date().toISOString(),
      foreign_id: 'update_activity_11',
    };

    return this.user1
      .addActivity(activity)
      .then((body) => {
        delete body.duration;
        delete body.to;
        delete body.id;

        delete body.target;
        delete body.origin;
        body.answer = 11;
        return this.client.updateActivity(body);
      })
      .then(() => this.user1.get({ limit: 1 }))
      .then(({ results }) => {
        expect(results[0].foreign_id).to.be(activity.foreign_id);
        expect(results[0].answer).to.be(11);
      });
  });

  it('supports adding activity to multiple feeds', function () {
    const activity = {
      actor: 'user:11',
      verb: 'like',
      object: '000',
    };
    const feeds = [this.flat3.id, this.user1.id];

    return this.client
      .addToMany(activity, feeds)
      .then(() => this.flat3.get({ limit: 1 }))
      .then(({ results }) => {
        expect(results[0].actor).to.be(activity.actor);
        expect(results[0].verb).to.be(activity.verb);
        expect(results[0].object).to.be(activity.object);

        return this.user1.get({ limit: 1 });
      })
      .then(({ results }) => {
        expect(results[0].actor).to.be(activity.actor);
        expect(results[0].verb).to.be(activity.verb);
        expect(results[0].object).to.be(activity.object);
      });
  });

  it('supports batch following', function () {
    const follows = [
      {
        source: this.flat3.id,
        target: 'user:1',
      },
      {
        source: this.flat3.id,
        target: 'user:2',
      },
      {
        source: this.flat3.id,
        target: 'user:3',
      },
    ];

    return this.client
      .followMany(follows)
      .then(() => this.flat3.following({ limit: 3 }))
      .then(({ results }) => {
        const sortedFollows = results
          .map((f) => ({ source: f.feed_id, target: f.target_id }))
          .sort((a, b) => (a.target > b.target ? 1 : -1));
        expect(sortedFollows).to.be.eql(follows);
      });
  });

  it('supports batch following with activity_copy_limit', function () {
    const activities = [];
    const copyLimit = 25;
    for (let i = 0; i < copyLimit * 2; i++) {
      activities.push({
        verb: 'do',
        object: `object:${i}`,
        actor: `user:${i}`,
        foreign_id: `follow_activities_${i}`,
        time: new Date(),
      });
    }

    const follows = [
      {
        source: this.flat3.id,
        target: this.user1.id,
      },
      {
        source: this.flat3.id,
        target: 'user:2',
      },
      {
        source: this.flat3.id,
        target: 'user:3',
      },
    ];

    return this.user1
      .addActivities(activities)
      .then(() => this.client.followMany(follows, copyLimit))
      .then(() => this.flat3.following({ limit: 10 }))
      .then(({ results }) => {
        const sortedFollows = results
          .map((f) => ({ source: f.feed_id, target: f.target_id }))
          .sort((a, b) => (a.target > b.target ? 1 : -1));
        expect(sortedFollows).to.be.eql(follows);
      })
      .then(() => this.flat3.get({ limit: 100 }))
      .then(({ results }) => {
        expect(results.length).to.be(copyLimit);
      });
  });

  it('supports batch unfollowing', function () {
    const unfollows = [
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

    return this.client.unfollowMany(unfollows).then((response) => {
      expect(response.duration).to.be.a('string');
    });
  });

  it('no secret application auth', function () {
    const client = connect('ahj2ndz7gsan');

    expect(() => client.addToMany({}, [])).to.throwError((e) => {
      expect(e).to.be.a(errors.SiteError);
    });
  });

  it('batch promises', function () {
    const activity = {
      actor: 'user:11',
      verb: 'like',
      object: '000',
    };
    const feeds = ['flat:33', 'user:11'];

    return this.client.addToMany(activity, feeds);
  });

  it('add activity using to', function () {
    let activityId = null;
    const activity = {
      actor: 1,
      verb: 'add',
      object: 1,
    };
    activity.participants = ['Thierry', 'Tommaso'];
    activity.route = {
      name: 'Vondelpark',
      distance: '20',
    };
    activity.to = [this.flat3.id, 'user:everyone'];

    return this.user1
      .addActivity(activity)
      .then((body) => {
        activityId = body.id;
        return this.flat3.get({ limit: 1 });
      })
      .then((body) => {
        expect(body.results[0].id).to.eql(activityId);
      });
  });

  describe("updating activity's 'to' targets", function () {
    it("replaces an activity's 'to' targets with `new_targets` (activity has no existing targets)", function () {
      const activity = {
        actor: 1,
        verb: 'test',
        object: 1,
        foreign_id: 'random_foregin_id',
        time: new Date(),
      };

      const newTargets = ['user:5678'];

      return this.user1
        .addActivity(activity)
        .then(() => this.user1.updateActivityToTargets(activity.foreign_id, activity.time, newTargets))
        .then(() => this.user1.get())
        .then(({ results }) => {
          expect(results[0].to).to.eql(newTargets);
        });
    });

    it("replaces an activity's 'to' targets with `new_targets` (activity has existing targets)", function () {
      const activity = {
        actor: 1,
        verb: 'test',
        object: 1,
        foreign_id: 'random_foregin_id',
        time: new Date(),
        to: ['user:1234'],
      };

      const newTargets = ['user:4321'];

      return this.user1
        .addActivity(activity)
        .then(() => this.user1.updateActivityToTargets(activity.foreign_id, activity.time, newTargets))
        .then(() => this.user1.get())
        .then(({ results }) => {
          expect(results[0].to).to.eql(newTargets);
        });
    });

    it("add new targets to an activity's 'to' targets with `add_targets` (activity has existing targets)", function () {
      const activity = {
        actor: 1,
        verb: 'test',
        object: 1,
        foreign_id: 'random_foregin_id',
        time: new Date(),
        to: ['user:1234'],
      };

      return this.user1
        .addActivity(activity)
        .then(() => this.user1.updateActivityToTargets(activity.foreign_id, activity.time, null, ['user:5678']))
        .then(() => this.user1.get())
        .then((response) => {
          expect(response.results[0].to).to.have.length(2);
          expect(response.results[0].to).to.contain('user:1234');
          expect(response.results[0].to).to.contain('user:5678');
        });
    });

    it("add new targets to an activity's 'to' targets with `add_targets` (activity has no existing targets)", function () {
      const activity = {
        actor: 1,
        verb: 'test',
        object: 1,
        foreign_id: 'random_foregin_id',
        time: new Date(),
      };

      return this.user1
        .addActivity(activity)
        .then(() => this.user1.updateActivityToTargets(activity.foreign_id, activity.time, null, ['user:5678']))
        .then(() => this.user1.get())
        .then(({ results }) => {
          expect(results[0].to).to.eql(['user:5678']);
        });
    });

    it("remove targets from an activity's 'to' targets with `remove_targets` (end result still has targets)", function () {
      const activity = {
        actor: 1,
        verb: 'test',
        object: 1,
        foreign_id: 'random_foregin_id',
        time: new Date(),
        to: ['user:1234', 'user:5678'],
      };

      return this.user1
        .addActivity(activity)
        .then(() => this.user1.updateActivityToTargets(activity.foreign_id, activity.time, null, null, ['user:5678']))
        .then(() => this.user1.get())
        .then(({ results }) => {
          expect(results[0].to).to.eql(['user:1234']);
        });
    });

    it("remove targets from an activity's 'to' targets with `remove_targets` (end result has no targets)", function () {
      const activity = {
        actor: 1,
        verb: 'test',
        object: 1,
        foreign_id: 'random_foregin_id',
        time: new Date(),
        to: ['user:1234'],
      };

      return this.user1
        .addActivity(activity)
        .then(() => this.user1.updateActivityToTargets(activity.foreign_id, activity.time, null, null, ['user:1234']))
        .then(() => this.user1.get())
        .then(({ results }) => {
          expect(results[0].to).to.be(undefined);
        });
    });

    it("replaces an activity's 'to' targets with a combination of `add_targets` and `remove_targets` (activity has no other existing targets)", function () {
      const activity = {
        actor: 1,
        verb: 'test',
        object: 1,
        foreign_id: 'random_foregin_id',
        time: new Date(),
        to: ['user:1234'],
      };

      return this.user1
        .addActivity(activity)
        .then(() =>
          this.user1.updateActivityToTargets(activity.foreign_id, activity.time, null, ['user:5678'], ['user:1234']),
        )
        .then(() => this.user1.get())
        .then(({ results }) => {
          expect(results[0].to).to.eql(['user:5678']);
        });
    });

    it("replaces an activity's 'to' targets with a combination of `add_targets` and `remove_targets` (activity has other existing targets too, that don't get modified)", function () {
      const activity = {
        actor: 1,
        verb: 'test',
        object: 1,
        foreign_id: 'random_foregin_id',
        time: new Date(),
        to: ['user:0000', 'user:1234'],
      };

      return this.user1
        .addActivity(activity)
        .then(() =>
          this.user1.updateActivityToTargets(activity.foreign_id, activity.time, null, ['user:5678'], ['user:1234']),
        )
        .then(() => this.user1.get())
        .then((response) => {
          expect(response.results[0].to).to.have.length(2);
          expect(response.results[0].to).to.have.contain('user:0000');
          expect(response.results[0].to).to.have.contain('user:5678');
        });
    });
  });

  describe('get activities', function () {
    let activity;

    beforeEach(function () {
      return this.user1
        .addActivity({
          actor: 1,
          verb: 'test',
          object: 1,
          foreign_id: 1234,
          time: new Date(),
        })
        .then(() => this.user1.get())
        .then((resp) => {
          activity = resp.results[0];
        });
    });

    describe('by ID', function () {
      it('allows to retrieve activities directly by their ID', function () {
        return this.client.getActivities({ ids: [activity.id] }).then((resp) => {
          expect(resp.results[0]).to.eql(activity);
        });
      });
    });

    describe('by foreign ID and time', function () {
      it('allows to retrieve activities directly by their ID', function () {
        return this.client
          .getActivities({
            foreignIDTimes: [
              {
                foreignID: activity.foreign_id,
                time: activity.time,
              },
            ],
          })
          .then((resp) => {
            expect(resp.results[0]).to.eql(activity);
          });
      });
    });
  });

  describe('update activity partial', function () {
    let activity;
    let expected;

    beforeEach(function () {
      return this.user1
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
        .then(() => this.user1.get())
        .then((resp) => {
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
        });
    });

    describe('by ID', function () {
      it('allows to update the activity', function () {
        return this.client
          .activityPartialUpdate({
            id: activity.id,
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
          .then(() => this.client.getActivities({ ids: [activity.id] }))
          .then((resp) => {
            expect(resp.results[0]).to.eql(expected);
          });
      });
    });

    describe('by foreign ID and time', function () {
      it('allows to update the activity', function () {
        return this.client
          .activityPartialUpdate({
            foreign_id: activity.foreign_id,
            time: activity.time,
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
          .then(() => this.client.getActivities({ ids: [activity.id] }))
          .then((resp) => {
            expect(resp.results[0]).to.eql(expected);
          });
      });
    });
  });
});
