import util from 'util';

import { CloudContext } from './utils';
import { randUserId } from '../utils/hooks';

const someActivityId = 'f9969ca8-e659-11e8-801f-e4a47194940e';
// eslint-disable-next-line no-unused-vars
function log(...args) {
  // eslint-disable-next-line no-console
  console.log(util.inspect(...args, { showHidden: false, depth: null, colors: true }));
}

describe('Permission checking', () => {
  const ctx = new CloudContext();
  ctx.createUsers();
  describe('When alice tries to impersonate bob', () => {
    const at = new Date().toISOString();
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.alice.feed('user').addActivity({
        actor: ctx.bob.currentUser,
        verb: 'post',
        object: 'I love Alice',
        foreign_id: 'fid:123',
        time: at,
      });
    });
  });
  describe('When alice tries to create another user', () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.alice.user(randUserId('someone')).create();
    });
  });
  describe('When alice tries to update bob', () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.alice.user(ctx.bob.userId).update({ hacked: true });
    });
  });
  describe('When alice tries to delete bob', () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.alice.user(ctx.bob.userId).update({ hacked: true });
    });
  });

  describe('When alice tries to read bobs timeline', () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.alice.feed('timeline', ctx.bob.userId).get();
    });
  });

  describe('When alice tries to mark her own notification feed', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('notification').get({ mark_seen: true, mark_read: true });
    });
  });

  describe('When alice tries to post to bobs timeline', () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.alice.feed('timeline', ctx.bob.userId).addActivity({
        verb: 'post',
        object: "I'm writing this directly on your timeline",
      });
    });
  });

  describe('When alice tries to post to someone elses timeline by using to targets', () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.alice.feed('user').addActivity({
        verb: 'post',
        object: "I'm writing this on your timeline by using to targets",
        to: ['timeline:123'],
      });
    });
  });

  describe('When alice tries to post to someone elses timeline by using target feeds when adding a reaction', () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.alice.reactions.add('comment', someActivityId, {}, { targetFeeds: ['timeline:123'] });
    });
  });

  describe('When alice tries to add a reaction with bobs user id', () => {
    ctx.requestShouldError(400, async () => {
      ctx.response = await ctx.alice.reactions.add(
        'like',
        {},
        {
          userId: ctx.bob.userId,
        },
      );
    });
  });

  describe('When alice tries to add a child reaction with bobs user id', () => {
    ctx.requestShouldError(400, async () => {
      ctx.response = await ctx.alice.reactions.addChild('like', someActivityId, {
        userId: ctx.bob.userId,
      });
    });
  });

  describe('When alice tries to make bob follow her', () => {
    ctx.requestShouldError(403, async () => {
      await ctx.alice.feed('timeline', ctx.bob.userId).follow('user', ctx.alice.userId);
    });
  });

  describe('When alice tries to make bob unfollow her', () => {
    ctx.requestShouldError(403, async () => {
      await ctx.alice.feed('timeline', ctx.bob.userId).unfollow('user', ctx.alice.userId);
    });
  });

  describe('When alice tries to list the followers of bob', () => {
    ctx.requestShouldError(403, async () => {
      await ctx.alice.feed('timeline', ctx.bob.userId).followers();
    });
  });

  describe('When alice tries to make bob unfollow her', () => {
    ctx.requestShouldError(403, async () => {
      await ctx.alice.feed('user', ctx.bob.userId).following();
    });
  });

  describe('When alice tries to delete an activity from bob his feed', () => {
    ctx.requestShouldError(403, async () => {
      await ctx.alice.feed('user', ctx.bob.userId).removeActivity(someActivityId);
    });
  });

  describe('When alice tries to delete an activity from her own feed', () => {
    ctx.requestShouldNotError(async () => {
      await ctx.alice.feed('user').removeActivity(someActivityId);
    });
  });
});
