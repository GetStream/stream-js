var { CloudContext } = require('./utils');
var url = require('url');
var expect = require('expect.js');

describe('Reaction pagination', () => {
  let ctx = new CloudContext();
  let eatActivity;
  let likes = [];
  let claps = [];
  let comments = [];

  ctx.createUsers();

  describe('When alice creates 1 activity', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user').addActivity({
        actor: ctx.alice.user,
        verb: 'eat',
        object: 'cheeseburger',
      });
      eatActivity = ctx.response;
      eatActivity.actor = ctx.alice.user.full;
    });
  });

  describe('When bob adds 25 likes to the activity and some comments', () => {
    for (let index = 0; index < 25; index++) {
      ctx.requestShouldNotError(async () => {
        if (index % 3 == 0) {
          ctx.response = await ctx.bob.react('comment', eatActivity.id, {
            data: { index },
          });
          ctx.response.user = ctx.bob.user.full;
          comments.unshift(ctx.response);
        }
        ctx.response = await ctx.bob.react('like', eatActivity.id, {
          data: { index },
        });
        ctx.response.user = ctx.bob.user.full;
        likes.unshift(ctx.response);
        if (index % 4 == 0) {
          ctx.response = await ctx.bob.react('clap', eatActivity.id, {
            data: { index },
          });
          ctx.response.user = ctx.bob.user.full;
          claps.unshift(ctx.response);
        }
      });
    }
  });

  describe('When bob reads alice her feed with all enrichment enabled', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.feed('user', ctx.alice.userId).get({
        withOwnReactions: true,
        withRecentReactions: true,
        withReactionCounts: true,
      });
    });
    ctx.responseShouldHaveActivityWithFields(
      'own_reactions',
      'latest_reactions',
      'latest_reactions_extra',
      'reaction_counts',
    );

    ctx.activityShould(
      'contain dave his last reactions in latest_reactions and own_reactions',
      () => {
        let lastFiveReactions = {
          like: likes.slice(0, 5),
          comment: comments.slice(0, 5),
          clap: claps.slice(0, 5),
        };
        ctx.activity.own_reactions.should.eql(lastFiveReactions);
        ctx.activity.latest_reactions.should.eql(lastFiveReactions);
      },
    );

    ctx.activityShould('contain correct reaction counts', () => {
      ctx.activity.reaction_counts.should.eql({
        like: likes.length,
        comment: comments.length,
        clap: claps.length,
      });
    });

    ctx.activityShould(
      'contain correct next urls in latest_reactions_extra',
      () => {
        let keys = ['like', 'comment', 'clap'];
        const latest_extra = ctx.activity.latest_reactions_extra;
        latest_extra.should.have.all.keys(keys);
        const checkQuery = (extra, kind, reactions, withUser) => {
          extra.next.should.be.a('string');
          extra.next.slice(0, 4).should.eql('http');
          const expectedQuery = {
            id_lt: reactions[4].id,
            limit: 5,
          };
          if (withUser) {
            expectedQuery.user_id = ctx.bob.user.id;
          }

          const query = url.parse(extra.next, true).query;
          latest_extra[kind].next.should.include('/activity_id/');
          latest_extra[kind].next.should.include(`/${kind}/`);
          latest_extra[kind].next.should.include(`/${ctx.activity.id}/`);
          expect(query).to.eql(expectedQuery);
        };
        checkQuery(latest_extra.like, 'like', likes);
        checkQuery(latest_extra.comment, 'comment', comments);
        checkQuery(latest_extra.clap, 'clap', claps);
      },
    );
  });

  describe('Paginate the whole thing', () => {
    let resp;

    ctx.test('reactions should be enriched when filtering', async () => {
      let conditions = {
        activity_id: eatActivity.id,
        kind: 'like',
        limit: 1,
      };
      resp = await ctx.alice.reactions.filter(conditions);
      resp.results.length.should.eql(1);
      resp.results[0].should.have.all.keys(...ctx.fields.reaction);
      resp.results[0].user.should.eql(ctx.bob.user.full);
    });

    ctx.test('specify page size using limit param', async () => {
      let conditions = {
        activity_id: eatActivity.id,
        kind: 'like',
        limit: 3,
      };
      resp = await ctx.alice.reactions.filter(conditions);
      resp.results.length.should.eql(3);
    });

    ctx.test('specify page size using limit param > result set', async () => {
      let conditions = {
        activity_id: eatActivity.id,
        kind: 'like',
        limit: 300,
      };
      resp = await ctx.alice.reactions.filter(conditions);
      resp.results.length.should.eql(25);
    });

    ctx.test(
      'pagination without kind param and limit >25 should return 25 mixed reactions',
      async () => {
        let conditions = {
          activity_id: eatActivity.id,
          limit: 100,
        };
        resp = await ctx.alice.reactions.filter(conditions);
        resp.results.length.should.eql(25);
        resp.results[0].kind.should.eql('clap');
        resp.results[1].kind.should.eql('like');
        resp.results[2].kind.should.eql('comment');
      },
    );

    ctx.test(
      'and then alice reads the reactions for that activity five at the time in descending order',
      async () => {
        let done = false;
        let readLikes = [];
        let conditions = {
          activity_id: eatActivity.id,
          kind: 'like',
          limit: 5,
        };
        while (!done) {
          resp = await ctx.alice.reactions.filter(conditions);
          done =
            resp.next === undefined || resp.next === '' || resp.next === null
              ? true
              : false;
          conditions.id_lt = resp.results[resp.results.length - 1].id;
          readLikes = readLikes.concat(resp.results);
        }
        readLikes.should.eql(likes);
      },
    );

    ctx.test(
      'reading everything in reverse order should also work',
      async () => {
        let done = false;
        let readLikesReversed = [];
        let conditions = {
          activity_id: eatActivity.id,
          kind: 'like',
          limit: 5,
          id_gte: resp.results[resp.results.length - 1].id,
        };

        while (!done) {
          resp = await ctx.alice.reactions.filter(conditions);
          done =
            resp.next === undefined || resp.next === '' || resp.next === null
              ? true
              : false;
          readLikesReversed = resp.results
            .slice()
            .reverse()
            .concat(readLikesReversed);
          conditions.id_gt = resp.results[resp.results.length - 1].id;
          delete conditions.id_gte;
        }
        readLikesReversed.should.eql(likes);
      },
    );
  });
});

describe('Reaction CRUD and posting reactions to feeds', () => {
  let ctx = new CloudContext();

  let eatActivity;
  let commentActivity;
  let comment;
  let expectedCommentData;
  let commentData = {
    text: 'Looking yummy! @carl wanna get this on Tuesday?',
  };

  ctx.createUsers();
  describe('When alice eats a cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user').addActivity({
        actor: ctx.alice.user,
        verb: 'eat',
        object: 'cheeseburger',
      });
      eatActivity = ctx.response;
      eatActivity.actor = ctx.alice.user.full;
    });
  });

  describe('When bob comments on that alice ate the cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.react('comment', eatActivity.id, {
        data: commentData,
        targetFeeds: [
          ctx.bob.feed('user').id,
          ctx.bob.feed('notification', ctx.alice.userId),
          ctx.bob.feed('notification', ctx.carl.userId),
        ],
      });
      comment = ctx.response;
    });

    ctx.responseShouldHaveFields(...ctx.fields.reaction);

    ctx.responseShouldHaveUUID();

    ctx.responseShould('have data matching the request', () => {
      ctx.response.should.deep.include({
        kind: 'comment',
        activity_id: eatActivity.id,
        user_id: ctx.bob.userId,
      });
      ctx.response.data.should.eql(commentData);
    });

    describe('and then alice reads the reaction by ID', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.reactions.get(comment.id);
      });

      ctx.responseShouldHaveFields(...ctx.fields.reaction);

      ctx.test('response should include bob user data', () => {
        ctx.response.user.should.eql(ctx.bob.user.full);
      });
    });

    describe('and then bob reads the reaction by ID', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.bob.reactions.get(comment.id);
      });
      ctx.responseShouldHaveFields(...ctx.fields.reaction);
    });

    describe('and then alice reads bob his feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.feed('user', ctx.bob.user).get();
      });
      ctx.responseShouldHaveActivityWithFields('reaction');
      ctx.activityShould('contain the expected data', () => {
        expectedCommentData = {
          verb: 'comment',
          foreign_id: `reaction:${comment.id}`,
          time: comment.created_at.slice(0, -1), // chop off the Z suffix
          target: '',
          origin: null,
        };

        ctx.activity.should.include(expectedCommentData);
        ctx.activity.actor.should.eql(ctx.bob.user.full);
        ctx.shouldEqualBesideDuration(ctx.activity.object, eatActivity);
        ctx.activity.reaction.should.eql(comment);
        commentActivity = ctx.activity;
      });
    });

    describe('and then alice reads her own notification feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.feed('notification').get();
      });
      ctx.responseShouldHaveActivityInGroupWithFields('reaction');
      ctx.activityShould('be the same as on bob his feed', () => {
        ctx.activity.should.eql(commentActivity);
      });
    });

    describe('and then carl reads his notification feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.carl.feed('notification').get();
      });
      ctx.responseShouldHaveActivityInGroupWithFields('reaction');
      ctx.activityShould('be the same as on bob his feed', () => {
        ctx.activity.should.eql(commentActivity);
      });
    });
  });

  describe('When alice tries to update bob his comment', () => {
    ctx.requestShouldError(403, async () => {
      commentData = {
        text: 'Alice you are the best!!!!',
      };
      ctx.response = await ctx.alice.reactions.update(comment.id, {
        data: commentData,
      });
    });
  });

  describe('When bob updates his comment and tags dave instead of carl', () => {
    ctx.requestShouldNotError(async () => {
      commentData = {
        text: 'Looking yummy! @dave wanna get this on Tuesday?',
      };
      ctx.response = await ctx.bob.reactions.update(comment.id, {
        data: commentData,
        targetFeeds: [
          ctx.bob.feed('user').id,
          ctx.bob.feed('notification', ctx.alice.userId),
          ctx.bob.feed('notification', ctx.dave.userId),
        ],
      });
    });

    ctx.responseShouldHaveFields(...ctx.fields.reaction);

    ctx.responseShouldHaveUUID();

    ctx.responseShould('have data matching the request', () => {
      ctx.response.should.deep.include({
        kind: 'comment',
        activity_id: eatActivity.id,
        user_id: ctx.bob.userId,
      });
      ctx.response.data.should.eql(commentData);
      comment = ctx.response;
    });

    describe('and then alice reads bob his feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.feed('user', ctx.bob.user).get();
      });
      ctx.responseShouldHaveActivityWithFields('reaction');
      ctx.activityShould('contain the expected data', () => {
        ctx.activity.should.include(expectedCommentData);
        commentActivity = ctx.activity;
      });
    });

    describe('and then alice reads her own notification feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.feed('notification').get();
      });
      ctx.responseShouldHaveActivityInGroupWithFields('reaction');
      ctx.activityShould('be the same as on bob his feed', () => {
        ctx.activity.should.eql(commentActivity);
      });
    });

    describe('and then carl reads his notification feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.carl.feed('notification').get();
      });
      ctx.responseShouldHaveNoActivities();
    });

    describe('and then dave reads his notification feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.dave.feed('notification').get();
      });
      ctx.responseShouldHaveActivityInGroupWithFields('reaction');
      ctx.activityShould('be the same as on bob his feed', () => {
        ctx.activity.should.eql(commentActivity);
      });
    });
  });

  describe("When alice tries to delete bob's comment", () => {
    ctx.requestShouldError(403, async () => {
      ctx.response = await ctx.alice.reactions.delete(comment.id);
    });
  });

  describe('When bob deletes his comment', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.reactions.delete(comment.id);
    });

    ctx.responseShould('be empty JSON', () => {
      delete ctx.response.duration;
      ctx.response.should.eql({});
    });

    describe('and then alice reads the reaction by ID', () => {
      ctx.requestShouldError(404, async () => {
        await ctx.alice.reactions.get(comment.id);
      });
    });

    describe('and then alice tries to update bob his comment', () => {
      ctx.requestShouldError(404, async () => {
        commentData = {
          text: 'Alice you are the best!!!!',
        };
        ctx.response = await ctx.alice.reactions.update(comment.id, {
          data: commentData,
        });
      });
    });

    describe.skip("and then alice tries to delete bob's comment", () => {
      ctx.requestShouldError(404, async () => {
        ctx.response = await ctx.alice.reactions.delete(comment.id);
      });
    });

    describe('and then alice reads bob his feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.feed('user', ctx.bob.user).get();
      });
      ctx.responseShouldHaveNoActivities();
    });

    describe('and then alice reads her own notification feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.feed('notification').get();
      });
      ctx.responseShouldHaveNoActivities();
    });

    describe('and then carl reads his notification feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.carl.feed('notification').get();
      });
      ctx.responseShouldHaveNoActivities();
    });

    describe('and then dave reads his notification feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.dave.feed('notification').get();
      });
      ctx.responseShouldHaveNoActivities();
    });
  });

  describe('When alice tries to set a string as the reaction data', () => {
    ctx.requestShouldError(400, async () => {
      ctx.response = await ctx.alice.react('comment', eatActivity.id, {
        data: 'some string',
      });
    });
  });
});
