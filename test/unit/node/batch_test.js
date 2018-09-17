var errors = require('../../../src/getstream').errors,
  expect = require('expect.js'),
  Promise = require('../../../src/lib/promise'),
  td = require('testdouble'),
  beforeEachFn = require('../utils/hooks').beforeEach,
  signing = signing || require('../../../src/lib/signing');

describe('[UNIT] Stream Client Batch (Node)', function() {
  beforeEach(beforeEachFn);

  afterEach(function() {
    td.reset();
  });

  function replaceMSR() {
    var msr = td.function();
    td.replace(this.client, 'makeSignedRequest', msr);
    return msr;
  }

  it('#addToMany', function() {
    expect(this.client.addToMany).to.be.a(Function);

    var msr = replaceMSR.call(this);

    var activity = { actor: 'matthisk', object: 0, verb: 'tweet' };
    var feeds = ['global:feed', 'global:feed2'];

    this.client.addToMany(activity, feeds);

    td.verify(
      msr(
        {
          url: 'feed/add_to_many/',
          body: {
            activity: activity,
            feeds: feeds,
          },
        },
        undefined,
      ),
    );
  });

  it('#followMany', function() {
    expect(this.client.followMany).to.be.a(Function);

    var msr = replaceMSR.call(this);

    var follows = [];
    var cb = function() {};

    this.client.followMany(follows, 10, cb);

    td.verify(
      msr(
        {
          url: 'follow_many/',
          body: follows,
          qs: {
            activity_copy_limit: 10,
          },
        },
        cb,
      ),
    );
  });

  it('#followMany', function() {
    expect(this.client.followMany).to.be.a(Function);

    var msr = replaceMSR.call(this);

    var follows = [];
    var cb = function() {};

    this.client.followMany(follows, cb);

    td.verify(
      msr(
        {
          url: 'follow_many/',
          body: follows,
          qs: {},
        },
        cb,
      ),
    );
  });

  it('#followMany', function() {
    expect(this.client.followMany).to.be.a(Function);

    var msr = replaceMSR.call(this);

    var follows = [];
    var cb = function() {};

    this.client.followMany(follows, 0, cb);

    td.verify(
      msr(
        {
          url: 'follow_many/',
          body: follows,
          qs: {
            activity_copy_limit: 0,
          },
        },
        cb,
      ),
    );
  });

  it('#makeSignedRequest', function() {
    var self = this;
    td.replace(this.client, 'apiSecret', '');

    function throws() {
      self.client.makeSignedRequest({});
    }

    expect(throws).to.throwException(function(err) {
      expect(err).to.be.a(errors.SiteError);
    });
  });

  it('#makeSignedRequest', function() {
    var p = this.client.makeSignedRequest({});

    expect(p).to.be.a(Promise);
  });

  it('#unfollowMany', function() {
    expect(this.client.unfollowMany).to.be.a(Function);

    var msr = replaceMSR.call(this);

    var unfollows = [];
    var cb = function() {};

    this.client.unfollowMany(unfollows, cb);

    td.verify(
      msr(
        {
          url: 'unfollow_many/',
          body: unfollows,
        },
        cb,
      ),
    );
  });
});
