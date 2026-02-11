import expect from 'expect.js';

import { CloudContext } from './utils';
import config from '../utils/config';

// User flagging requires moderation features to be enabled on the Stream account.
// APP_ID 16792 has moderation enabled. Other test apps (e.g., from StreamAPI CI)
// have moderation disabled, so we skip these tests there.
const shouldRunModerationTests = config.APP_ID === '16792';
const describeOrSkip = shouldRunModerationTests ? describe : describe.skip;

describe('User Flagging', () => {
  const ctx = new CloudContext();

  ctx.createUsers();

  describeOrSkip('When creating activities to establish users in moderation system', () => {
    ctx.requestShouldNotError(async () => {
      // Create activities with users as actors to establish them in the moderation system
      // Using user1 and user2 which are commonly used across integration tests
      await ctx.serverSideClient.feed('user', 'user1').addActivity({
        actor: 'user1',
        verb: 'post',
        object: 'post:1',
        message: 'Test post from user1',
      });
      await ctx.serverSideClient.feed('user', 'user2').addActivity({
        actor: 'user2',
        verb: 'post',
        object: 'post:2',
        message: 'Test post from user2',
      });
    });
  });

  describeOrSkip('When flagging a user with client.flagUser()', () => {
    ctx.requestShouldNotError(async () => {
      // Flag user1 (which exists in the moderation system from other tests)
      ctx.response = await ctx.serverSideClient.flagUser('user1', {
        reason: 'spam',
        user_id: 'user2',
      });
      expect(ctx.response.duration).to.be.a('string');
    });
  });

  describeOrSkip('When flagging using user.flag()', () => {
    ctx.requestShouldNotError(async () => {
      // Flag using the user object method
      ctx.response = await ctx.serverSideClient.user('user1').flag({
        reason: 'inappropriate_content',
        user_id: 'user2',
      });
      expect(ctx.response.duration).to.be.a('string');
    });
  });
});
