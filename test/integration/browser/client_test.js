var beforeEachFn = require('../utils/hooks').beforeEach,
  expect = require('expect.js'),
  signing = require('../../../src/lib/signing'),
  init = require('../utils/hooks').init;

describe('[INTEGRATION] Stream client (Browser)', function() {
  init.call(this);
  beforeEach(beforeEachFn);

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
    var signature = signing.sign(
      process.env.STREAM_API_SECRET,
      this.flat3.slug + this.flat3.userId,
    );
    activity['to'] = [this.flat3.id + ' ' + signature];

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
});
