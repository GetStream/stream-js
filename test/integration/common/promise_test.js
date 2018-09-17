var init = require('../utils/hooks').init,
  beforeEachFn = require('../utils/hooks').beforeEach;

describe('[INTEGRATION] Stream client (Promises)', function() {
  init.call(this);
  beforeEach(beforeEachFn);

  it('get promises', function() {
    return this.user1.get({
      limit: 1,
    });
  });

  it('post promises', function() {
    var activity = {
      actor: 'test-various:characters',
      verb: 'add',
      object: 1,
      tweet: 'hello world',
    };
    return this.user1.addActivity(activity);
  });

  it('post promises fail', function(done) {
    var activity = {
      actor: 'test-various:characters',
      verb: 'add',
      object: '',
      tweet: 'hello world',
    };

    this.user1.addActivity(activity).then(
      function() {
        done('expected failure');
      },
      function() {
        done();
      },
    );
  });
});
