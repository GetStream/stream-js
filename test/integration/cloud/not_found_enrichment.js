var { CloudContext } = require('./utils');
var randUserId = require('../utils/hooks').randUserId;

describe('Enriching not existing references', () => {
  let ctx = new CloudContext();
  let zeroUUID = '00000000-0000-0000-0000-000000000000';
  (ctx.cheeseBurger = ctx.alice.collections.entry(
    'food',
    randUserId('cheeseburger'),
    ctx.cheeseBurgerData,
  )),
    describe('When alice eats a cheese burger without adding it to collections', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.feed('user').addActivity({
          verb: 'eat',
          object: ctx.cheeseBurger,
          notExistingActivity: `SA:${zeroUUID}`,
          notExistingReaction: `SR:${zeroUUID}`,
        });
      });
      describe('and then alice reads her feed', () => {
        ctx.requestShouldNotError(async () => {
          ctx.response = await ctx.alice.feed('user').get();
        });

        ctx.responseShouldHaveActivityWithFields(
          'notExistingActivity',
          'notExistingReaction',
        );
        ctx.responseShould(
          'have the activity with errors in place of references',
          () => {
            ctx.activity.verb.should.eql('eat');
            ctx.activity.actor.should.eql({
              error: 'ReferenceNotFound',
              reference: ctx.alice.currentUser._streamRef(),
              reference_type: 'user',
              id: ctx.alice.userId,
            });
            ctx.activity.object.should.eql({
              collection: 'food',
              id: ctx.cheeseBurger.id,
              error: 'ReferenceNotFound',
              reference: ctx.cheeseBurger._streamRef(),
              reference_type: 'object',
            });
            ctx.activity.notExistingActivity.should.eql({
              id: zeroUUID,
              error: 'ReferenceNotFound',
              reference: `SA:${zeroUUID}`,
              reference_type: 'activity',
            });
            ctx.activity.notExistingReaction.should.eql({
              id: zeroUUID,
              error: 'ReferenceNotFound',
              reference: `SR:${zeroUUID}`,
              reference_type: 'reaction',
            });
          },
        );
      });
    });
});
