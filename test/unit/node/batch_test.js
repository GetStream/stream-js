import expect from 'expect.js';
import td from 'testdouble/dist/testdouble';

import { beforeEachFn } from '../utils/hooks';

describe('[UNIT] Stream Client Batch (Node)', function () {
  let post;

  beforeEach(beforeEachFn);
  beforeEach(function () {
    post = td.function();
    td.replace(this.client, 'post', post);
  });

  afterEach(function () {
    td.reset();
  });

  it('#addToMany', function () {
    expect(this.client.addToMany).to.be.a(Function);

    const activity = { actor: 'matthisk', object: 0, verb: 'tweet' };
    const feeds = ['global:feed', 'global:feed2'];

    this.client.addToMany(activity, feeds);

    td.verify(
      post(
        td.matchers.contains({
          url: 'feed/add_to_many/',
          body: {
            activity,
            feeds,
          },
        }),
      ),
    );
  });

  it('#followMany', function () {
    expect(this.client.followMany).to.be.a(Function);

    const follows = [];

    this.client.followMany(follows, 10);

    td.verify(
      post(
        td.matchers.contains({
          url: 'follow_many/',
          body: follows,
          qs: {
            activity_copy_limit: 10,
          },
        }),
      ),
    );
  });

  it('#followMany', function () {
    expect(this.client.followMany).to.be.a(Function);

    const follows = [];

    this.client.followMany(follows);

    td.verify(
      post(
        td.matchers.contains({
          url: 'follow_many/',
          body: follows,
          qs: {},
        }),
      ),
    );
  });

  it('#followMany', function () {
    expect(this.client.followMany).to.be.a(Function);

    const follows = [];

    this.client.followMany(follows, 0);

    td.verify(
      post(
        td.matchers.contains({
          url: 'follow_many/',
          body: follows,
          qs: {
            activity_copy_limit: 0,
          },
        }),
      ),
    );
  });

  it('#unfollowMany', function () {
    expect(this.client.unfollowMany).to.be.a(Function);

    const unfollows = [];

    this.client.unfollowMany(unfollows);

    td.verify(
      post(
        td.matchers.contains({
          url: 'unfollow_many/',
          body: unfollows,
        }),
      ),
    );
  });
});
