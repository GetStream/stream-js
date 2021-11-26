/* eslint-disable no-await-in-loop */
import url from 'url';
import expect from 'expect.js';

import { CloudContext } from './utils';

describe('Reaction pagination', () => {
  const ctx = new CloudContext();
  let eatActivity;
  const likes = [];
  const claps = [];
  const comments = [];

  ctx.createUsers();

  describe('When alice creates 1 activity', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user', ctx.alice.userId).addActivity({
        verb: 'eat',
        object: 'cheeseburger',
      });
      eatActivity = ctx.response;
      delete eatActivity.duration;
      eatActivity.actor = ctx.alice.currentUser.full;
    });
  });

  describe('When bob adds 25 likes to the activity and some comments', () => {
    const addReactionReq = async (index) => {
      if (index % 3 === 0) {
        ctx.response = await ctx.bob.reactions.add('comment', eatActivity.id, { index });
        delete ctx.response.duration;
        ctx.response.user = ctx.bob.currentUser.full;
        comments.unshift(ctx.response);
      }
      ctx.response = await ctx.bob.reactions.add('like', eatActivity.id, { index });
      delete ctx.response.duration;
      ctx.response.user = ctx.bob.currentUser.full;
      likes.unshift(ctx.response);
      if (index % 4 === 0) {
        ctx.response = await ctx.bob.reactions.add('clap', eatActivity.id, { index });
        delete ctx.response.duration;
        ctx.response.user = ctx.bob.currentUser.full;
        claps.unshift(ctx.response);
      }
    };

    for (let index = 0; index < 25; index++) {
      ctx.requestShouldNotError(() => addReactionReq(index));
    }
  });

  describe('When bob reads alice her feed with all enrichment enabled', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.feed('user', ctx.alice.userId).get({
        reactions: { own: true, recent: true, counts: true },
      });
    });
    ctx.responseShouldHaveActivityWithFields(
      'own_reactions',
      'latest_reactions',
      'latest_reactions_extra',
      'reaction_counts',
    );

    ctx.activityShould('contain dave his last reactions in latest_reactions and own_reactions', () => {
      const lastFiveReactions = {
        like: likes.slice(0, 5),
        comment: comments.slice(0, 5),
        clap: claps.slice(0, 5),
      };
      ctx.activity.own_reactions.should.eql(lastFiveReactions);
      ctx.activity.latest_reactions.should.eql(lastFiveReactions);
    });

    ctx.activityShould('contain correct reaction counts', () => {
      ctx.activity.reaction_counts.should.eql({
        like: likes.length,
        comment: comments.length,
        clap: claps.length,
      });
    });

    ctx.activityShould('contain correct next urls in latest_reactions_extra', () => {
      const keys = ['like', 'comment', 'clap'];
      const latestExtra = ctx.activity.latest_reactions_extra;
      latestExtra.should.have.all.keys(keys);
      const checkQuery = (extra, kind, reactions, withUser) => {
        extra.next.should.be.a('string');
        extra.next.slice(0, 4).should.eql('http');
        const expectedQuery = {
          id_lt: reactions[4].id,
          limit: '5',
          withOwnChildren: 'false',
        };
        if (withUser) {
          expectedQuery.user_id = ctx.bob.userId;
        }

        const { query } = url.parse(extra.next, true);
        latestExtra[kind].next.should.include('/activity_id/');
        latestExtra[kind].next.should.include(`/${kind}/`);
        latestExtra[kind].next.should.include(`/${ctx.activity.id}/`);
        expect(query).to.eql(expectedQuery);
      };
      checkQuery(latestExtra.like, 'like', likes);
      checkQuery(latestExtra.comment, 'comment', comments);
      checkQuery(latestExtra.clap, 'clap', claps);
    });
  });

  describe('Paginate the whole thing', () => {
    let resp;

    ctx.test('errors with multiple lookup types', async () => {
      const conditions = {
        activity_id: eatActivity.id,
        user_id: ctx.alice.userId,
      };
      expect(ctx.alice.reactions.filter).withArgs(conditions).to.throwError();
    });

    ctx.test('reactions should be enriched when filtering', async () => {
      const conditions = {
        activity_id: eatActivity.id,
        kind: 'like',
        limit: 1,
      };
      resp = await ctx.alice.reactions.filter(conditions);
      resp.results.length.should.eql(1);
      resp.results[0].should.have.all.keys(...ctx.fields.reaction);
      resp.results[0].user.should.eql(ctx.bob.currentUser.full);
    });

    describe('when filtering with with_activity_data', () => {
      ctx.requestShouldNotError(async () => {
        const conditions = {
          activity_id: eatActivity.id,
          limit: 1,
          with_activity_data: true,
        };
        ctx.response = await ctx.alice.reactions.filter(conditions);
        ctx.activity = ctx.response.activity;
      });
      ctx.activityShouldHaveFields('latest_reactions', 'latest_reactions_extra', 'own_reactions', 'reaction_counts');
      ctx.test('the activity should be returned', async () => {
        ctx.activity.should.deep.include(eatActivity);
      });
    });

    ctx.test('specify page size using limit param', async () => {
      const conditions = {
        activity_id: eatActivity.id,
        kind: 'like',
        limit: 3,
      };
      resp = await ctx.alice.reactions.filter(conditions);
      resp.results.length.should.eql(3);
    });

    ctx.test('specify page size using limit param > result set', async () => {
      const conditions = {
        activity_id: eatActivity.id,
        kind: 'like',
        limit: 300,
      };
      resp = await ctx.alice.reactions.filter(conditions);
      resp.results.length.should.eql(25);
    });

    ctx.test('pagination without kind param and limit >25 should return 25 mixed reactions', async () => {
      const conditions = {
        activity_id: eatActivity.id,
        limit: 100,
      };
      resp = await ctx.alice.reactions.filter(conditions);
      resp.results.length.should.eql(25);
      resp.results[0].kind.should.eql('clap');
      resp.results[1].kind.should.eql('like');
      resp.results[2].kind.should.eql('comment');
    });

    ctx.test('and then alice reads the reactions for that activity five at the time in descending order', async () => {
      let done = false;
      let readLikes = [];
      const conditions = {
        activity_id: eatActivity.id,
        kind: 'like',
        limit: 5,
      };
      while (!done) {
        resp = await ctx.alice.reactions.filter(conditions);
        done = resp.next === undefined || resp.next === '' || resp.next === null;
        conditions.id_lt = resp.results[resp.results.length - 1].id;
        readLikes = readLikes.concat(resp.results);
      }
      readLikes.should.eql(likes);
    });

    ctx.test('reading everything in reverse order should also work', async () => {
      let done = false;
      let readLikesReversed = [];
      const conditions = {
        activity_id: eatActivity.id,
        kind: 'like',
        limit: 5,
        id_gte: resp.results[resp.results.length - 1].id,
      };

      while (!done) {
        resp = await ctx.alice.reactions.filter(conditions);
        done = resp.next === undefined || resp.next === '' || resp.next === null;
        readLikesReversed = resp.results.slice().reverse().concat(readLikesReversed);
        conditions.id_gt = resp.results[resp.results.length - 1].id;
        delete conditions.id_gte;
      }
      readLikesReversed.should.eql(likes);
    });
  });
});

describe('Nested reactions pagination', () => {
  const ctx = new CloudContext();
  let eatActivity;
  let daveComment;
  let carlComment;
  let aliceDaveComment;
  const carlCommentLikes = [];
  const daveCommentLikes = [];
  const aliceDaveCommentLikes = [];

  ctx.createUsers();

  describe('When alice eats a cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user', ctx.alice.userId).addActivity({
        verb: 'eat',
        object: 'cheeseburger',
      });
      eatActivity = ctx.response;
    });
  });

  describe('When bob comments on that alice ate the cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.reactions.add('comment', eatActivity.id, {
        text: 'bob likes this!',
      });
    });
  });

  describe('When dave comments on that alice ate the cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.dave.reactions.add('comment', eatActivity.id, {
        text: 'dave likes this!',
      });
      daveComment = ctx.response;
    });
  });

  describe('When carl comments on that alice ate the cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.carl.reactions.add('comment', eatActivity.id, {
        text: 'carl likes this!',
      });
      carlComment = ctx.response;
    });
  });

  describe("and then alice likes dave's comment 33 times", () => {
    ctx.requestShouldNotError(async () => {
      for (let i = 0; i < 33; i++) {
        const response = await ctx.alice.reactions.addChild('like', daveComment, { i });
        delete response.duration;
        daveCommentLikes.push(response);
      }
    });
  });

  describe("and then alice unlikes carl's comment 33 times", () => {
    ctx.requestShouldNotError(async () => {
      for (let i = 0; i < 33; i++) {
        const response = await ctx.alice.reactions.addChild('unlike', carlComment, { i });
        delete response.duration;
        carlCommentLikes.push(response);
      }
    });
  });

  describe("and then alice comments dave's comment", () => {
    ctx.requestShouldNotError(async () => {
      aliceDaveComment = await ctx.alice.reactions.addChild('comment', daveComment, { text: 'I like' });
    });
  });

  describe("and then alice unlikes own comment of dave's comment 33 times", () => {
    ctx.requestShouldNotError(async () => {
      for (let i = 0; i < 33; i++) {
        const response = await ctx.alice.reactions.addChild('unlike', aliceDaveComment, { i });
        delete response.duration;
        aliceDaveCommentLikes.push(response);
      }
    });
  });

  describe('pagination time', () => {
    let resp;

    ctx.test('alice reads the children reactions for dave comment five at the time in descending order', async () => {
      let done = false;
      let readChildren = [];
      const conditions = {
        reaction_id: daveComment.id,
        kind: 'like',
        limit: 5,
      };
      while (!done) {
        resp = await ctx.alice.reactions.filter(conditions);
        done = resp.next === undefined || resp.next === '' || resp.next === null;
        conditions.id_lt = resp.results[resp.results.length - 1].id;
        readChildren = readChildren.concat(resp.results);
      }
      readChildren.should.eql(daveCommentLikes.reverse());
    });

    ctx.test('alice reads the children reactions for carl comment four at the time in descending order', async () => {
      let done = false;
      let readChildren = [];
      const conditions = {
        reaction_id: carlComment.id,
        kind: 'unlike',
        limit: 4,
      };
      while (!done) {
        resp = await ctx.alice.reactions.filter(conditions);
        done = resp.next === undefined || resp.next === '' || resp.next === null;
        conditions.id_lt = resp.results[resp.results.length - 1].id;
        readChildren = readChildren.concat(resp.results);
      }
      readChildren.should.eql(carlCommentLikes.reverse());
    });

    ctx.test(
      'alice reads the children reactions for alice comment of dave comment four at the time in descending order',
      async () => {
        let done = false;
        let readChildren = [];
        const conditions = {
          reaction_id: aliceDaveComment.id,
          kind: 'unlike',
          limit: 4,
        };
        while (!done) {
          resp = await ctx.alice.reactions.filter(conditions);
          done = resp.next === undefined || resp.next === '' || resp.next === null;
          conditions.id_lt = resp.results[resp.results.length - 1].id;
          readChildren = readChildren.concat(resp.results);
        }
        readChildren.should.eql(aliceDaveCommentLikes.reverse());
      },
    );
  });
});

describe('Nested reactions violations', () => {
  const ctx = new CloudContext();

  ctx.createUsers();

  describe('When a reaction is added to a reaction that does not exist', () => {
    ctx.requestShouldError(400, async () => {
      ctx.response = await ctx.bob.reactions.addChild('comment', {
        id: 'does-not-exist',
      });
    });
  });

  let eatActivity;
  let commentFirstLevel;
  let commentSecondLevel;
  let commentThirdLevel;

  describe('When alice eats a cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user', ctx.alice.userId).addActivity({
        verb: 'eat',
        object: 'cheeseburger',
      });
      eatActivity = ctx.response;
      eatActivity.actor = ctx.alice.currentUser.full;
    });
  });

  describe('When a reaction is added at the first nesting level', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.reactions.add('comment', eatActivity.id, {
        text: 'Looking yummy! @carl wanna get this on Tuesday?',
      });
      commentFirstLevel = ctx.response;
    });
  });

  describe('When a reaction is added at the second nesting level', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.reactions.addChild('comment', commentFirstLevel, { text: 'Yes!' });
      commentSecondLevel = ctx.response;
    });
  });

  describe('When a reaction is added at the third nesting level', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.reactions.addChild('comment', commentSecondLevel, { text: 'I want too!' });
      commentThirdLevel = ctx.response;
    });
  });

  describe('When a reaction is added at the forth+ nesting level', () => {
    ctx.requestShouldError(400, async () => {
      ctx.response = await ctx.alice.reactions.addChild('like', commentThirdLevel);
    });
  });
});

describe('Nested reactions madness', () => {
  const ctx = new CloudContext();
  let eatActivity;
  let comment;
  const commentData = {
    text: 'Looking yummy! @carl wanna get this on Tuesday?',
  };
  let likeReaction;
  let children = [];

  ctx.createUsers();

  describe('When alice eats a cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user', ctx.alice.userId).addActivity({
        verb: 'eat',
        object: 'cheeseburger',
      });
      eatActivity = ctx.response;
      eatActivity.actor = ctx.alice.currentUser.full;
    });
  });

  describe('When bob comments on that alice ate the cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.reactions.add('comment', eatActivity.id, commentData);
      comment = ctx.response;
    });
  });

  describe("and then alice likes Bob's comment", () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.reactions.addChild('like', comment);
      likeReaction = ctx.response;
    });
  });

  describe('and then alice reads the comment reaction', () => {
    ctx.requestShouldNotError(async () => {
      const reaction = await ctx.alice.reactions.get(comment.id);
      reaction.children_counts.should.have.all.keys('like');
      reaction.children_counts.like.should.eql(1);
      reaction.latest_children.should.have.all.keys('like');
      reaction.latest_children.like.should.have.length(1);
    });
  });

  describe("and then alice likes Bob's comment 103 times", () => {
    ctx.requestShouldNotError(async () => {
      const promises = [];
      for (let i = 0; i < 103; i++) {
        promises.push(ctx.alice.reactions.addChild('like', comment));
      }
      children = await Promise.all(promises);
    });
  });

  describe('and then alice reads the comment reaction', () => {
    ctx.requestShouldNotError(async () => {
      const reaction = await ctx.alice.reactions.get(comment.id);
      reaction.children_counts.like.should.eql(104);
      reaction.latest_children.should.have.all.keys('like');
      reaction.latest_children.like.should.have.length(10);
    });
  });

  describe('and then alice deletes 103 likes', () => {
    ctx.requestShouldNotError(async () => {
      const promises = [];
      for (let i = 0; i < children.length; i++) {
        promises.push(ctx.alice.reactions.delete(children[i].id));
      }
      children = await Promise.all(promises);
    });
  });

  describe('and then alice reads the comment reaction', () => {
    ctx.requestShouldNotError(async () => {
      const reaction = await ctx.alice.reactions.get(comment.id);
      reaction.children_counts.like.should.eql(1);
      reaction.latest_children.should.have.all.keys('like');
      reaction.latest_children.like.should.have.length(1);
      ctx.shouldEqualBesideDuration(reaction.latest_children.like[0], likeReaction);
    });
  });

  describe("and then alice like her own like Bob's comment", () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.reactions.addChild('like', likeReaction);
    });
  });

  describe('and then alice reads the comment reaction', () => {
    ctx.requestShouldNotError(async () => {
      const reaction = await ctx.alice.reactions.get(comment.id);
      reaction.children_counts.like.should.eql(1);
      reaction.latest_children.should.have.all.keys('like');
      reaction.latest_children.like.should.have.length(1);
    });
  });

  describe('and then alice reads the activity', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice
        .feed('user', ctx.alice.userId)
        .get({ limit: 1, reactions: { own: true, recent: true } });
    });

    ctx.responseShouldHaveActivityWithFields('own_reactions', 'latest_reactions', 'latest_reactions_extra');

    ctx.test('the activity should have the whole reaction trail', () => {
      const activity = ctx.response.results[0];
      activity.latest_reactions.should.have.all.keys('comment');
      activity.latest_reactions.comment.should.have.length(1);
      activity.latest_reactions.comment[0].latest_children.should.have.all.keys('like');
      activity.latest_reactions.comment[0].latest_children.like.should.have.length(1);
      activity.latest_reactions.comment[0].children_counts.should.have.all.keys('like');
      activity.latest_reactions.comment[0].children_counts.like.should.eql(1);

      activity.latest_reactions.comment[0].latest_children.like[0].latest_children.should.have.all.keys('like');
      activity.latest_reactions.comment[0].latest_children.like[0].latest_children.like.should.have.length(1);
      activity.latest_reactions.comment[0].latest_children.like[0].children_counts.should.have.all.keys('like');
      activity.latest_reactions.comment[0].latest_children.like[0].children_counts.like.should.eql(1);
    });
  });

  describe('and then alice creates 3 different kind of children reactions', () => {
    ctx.requestShouldNotError(async () => {
      const promises = [];
      for (let i = 0; i < 29; i++) {
        let kind;
        switch (i % 3) {
          case 2:
            kind = 'like';
            break;
          case 1:
            kind = 'unlike';
            break;
          case 0:
            kind = 'clap';
            break;
          default:
            break;
        }
        promises.push(await ctx.alice.reactions.addChild(kind, comment));
      }
      await Promise.all(promises);
    });

    describe('and then alice reads the comment reaction', () => {
      ctx.requestShouldNotError(async () => {
        const reaction = await ctx.alice.reactions.get(comment.id);
        reaction.children_counts.should.eql({
          clap: 10,
          like: 10,
          unlike: 10,
        });
        reaction.latest_children.should.have.all.keys('like', 'clap', 'unlike');
        reaction.latest_children.clap.should.have.length(3);
        reaction.latest_children.like.should.have.length(3);
        reaction.latest_children.unlike.should.have.length(4);
      });
    });

    describe('and then alice reads the activity', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.feed('user', ctx.alice.userId).get({
          limit: 1,
          reactions: {
            own: true,
            recent: true,
            counts: true,
            own_children: true,
          },
        });
      });

      ctx.responseShouldHaveActivityWithFields(
        'own_reactions',
        'latest_reactions',
        'latest_reactions_extra',
        'reaction_counts',
      );

      ctx.test('the activity should have the whole reaction trail', () => {
        const activity = ctx.response.results[0];
        activity.latest_reactions.should.have.all.keys('comment');
        activity.latest_reactions.comment.should.have.length(1);
        const commentReaction = activity.latest_reactions.comment[0];
        commentReaction.should.have.all.keys(...ctx.fields.reaction, 'own_children');
        commentReaction.own_children.clap.should.have.length(5);
        commentReaction.own_children.like.should.have.length(5);
        commentReaction.own_children.unlike.should.have.length(5);
        activity.reaction_counts.should.have.all.keys('comment');
        activity.reaction_counts.should.eql({
          comment: 1,
        });
      });
    });

    describe('bob deletes his comment', () => {
      ctx.requestShouldNotError(async () => {
        await ctx.bob.reactions.delete(comment.id);
      });
    });

    describe('and then alice reads the comment reaction', () => {
      ctx.requestShouldError(404, async () => {
        await ctx.alice.reactions.get(comment.id);
      });
    });

    describe('and then alice reads the activity', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.feed('user', ctx.alice.userId).get({
          limit: 1,
          reactions: { own: true, recent: true, counts: true },
        });
      });

      ctx.responseShouldHaveActivityWithFields(
        'own_reactions',
        'latest_reactions',
        'latest_reactions_extra',
        'reaction_counts',
      );

      ctx.test('the activity should have no reactions and the counts should be all to 0', () => {
        const activity = ctx.response.results[0];
        activity.latest_reactions.should.eql({});
        activity.reaction_counts.should.have.all.keys('comment');
        activity.reaction_counts.should.eql({
          comment: 0,
        });
      });
    });
  });
});

describe('Reaction CRUD and posting reactions to feeds', () => {
  const ctx = new CloudContext();

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
      ctx.response = await ctx.alice.feed('user', ctx.alice.userId).addActivity({
        verb: 'eat',
        object: 'cheeseburger',
      });
      eatActivity = ctx.response;
      eatActivity.actor = ctx.alice.currentUser.full;
    });
  });

  describe('When bob comments on that alice ate the cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.reactions.add('comment', eatActivity.id, commentData, {
        targetFeeds: [
          ctx.bob.feed('user', ctx.bob.userId).id,
          ctx.bob.feed('notification', ctx.alice.userId).id,
          ctx.bob.feed('notification', ctx.carl.userId).id,
        ],
        targetFeedsExtraData: {
          custom: 'yay',
        },
      });
      delete ctx.response.target_feeds_extra_data;
      comment = ctx.response;
    });

    ctx.responseShouldHaveFields(...ctx.fields.reactionResponseWithTargets);

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

      ctx.responseShouldHaveFields(...ctx.fields.reactionResponseWithTargets);

      ctx.test('response should include bob user data', () => {
        ctx.response.user.should.eql(ctx.bob.currentUser.full);
      });
    });

    describe('and then bob reads the reaction by ID', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.bob.reactions.get(comment.id);
      });
      ctx.responseShouldHaveFields(...ctx.fields.reactionResponseWithTargets);
    });

    describe('and then alice reads bob feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.feed('user', ctx.bob.userId).get();
      });
      ctx.responseShouldHaveActivityWithFields('reaction', 'custom');
      ctx.activityShould('contain the expected data', () => {
        expectedCommentData = {
          verb: 'comment',
          foreign_id: `reaction:${comment.id}`,
          time: comment.created_at.slice(0, -1), // chop off the Z suffix
          target: '',
          origin: null,
          custom: 'yay',
        };
        ctx.activity.should.include(expectedCommentData);
        ctx.activity.actor.should.eql(ctx.bob.currentUser.full);
        ctx.shouldEqualBesideDuration(ctx.activity.object, eatActivity);
        ctx.shouldEqualBesideDuration(ctx.activity.reaction, comment);
        commentActivity = ctx.activity;
      });
    });

    describe('and then alice reads her own notification feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.feed('notification', ctx.alice.userId).get();
      });
      ctx.responseShouldHaveActivityInGroupWithFields('reaction', 'custom');
      ctx.activityShould('be the same as on bob his feed', () => {
        ctx.activity.should.eql(commentActivity);
      });
    });

    describe('and then carl reads his notification feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.carl.feed('notification', ctx.carl.userId).get();
      });
      ctx.responseShouldHaveActivityInGroupWithFields('reaction', 'custom');
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
      ctx.response = await ctx.alice.reactions.update(comment.id, commentData);
    });
  });

  describe('When bob tries to update his comment with timeline from alice as a target feed', () => {
    ctx.requestShouldError(403, async () => {
      commentData = {
        text: 'Looking yummy! @dave wanna get this on Tuesday?',
      };
      ctx.response = await ctx.bob.reactions.update(comment.id, commentData, {
        targetFeeds: [`timeline:${ctx.alice.userId}`],
      });
    });
  });

  describe('When bob tries to add a comment with the same id again', () => {
    ctx.requestShouldError(409, async () => {
      commentData = {
        text: 'Looking yummy! @dave wanna get this on Tuesday?',
      };
      ctx.response = await ctx.bob.reactions.add('comment', eatActivity.id, commentData, { id: comment.id });
    });
  });

  describe('When bob updates his comment and tags dave instead of carl', () => {
    ctx.requestShouldNotError(async () => {
      commentData = {
        text: 'Looking yummy! @dave wanna get this on Tuesday?',
      };
      ctx.response = await ctx.bob.reactions.update(comment.id, commentData, {
        targetFeeds: [
          ctx.bob.feed('user', ctx.bob.userId).id,
          ctx.bob.feed('notification', ctx.alice.userId).id,
          ctx.bob.feed('notification', ctx.dave.userId).id,
        ],
        targetFeedsExtraData: {
          custom: 'yay',
        },
      });
      delete ctx.response.target_feeds_extra_data;
    });

    ctx.responseShouldHaveFields(...ctx.fields.reactionResponseWithTargets);

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
        ctx.response = await ctx.alice.feed('user', ctx.bob.userId).get();
      });
      ctx.responseShouldHaveActivityWithFields('reaction', 'custom');
      ctx.activityShould('contain the expected data', () => {
        ctx.activity.should.include(expectedCommentData);
        commentActivity = ctx.activity;
      });
    });

    describe('and then alice reads her own notification feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.feed('notification', ctx.alice.userId).get();
      });
      ctx.responseShouldHaveActivityInGroupWithFields('reaction', 'custom');
      ctx.activityShould('be the same as on bob his feed', () => {
        ctx.activity.should.eql(commentActivity);
      });
    });

    describe('and then carl reads his notification feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.carl.feed('notification', ctx.carl.userId).get();
      });
      ctx.responseShouldHaveNoActivities();
    });

    describe('and then dave reads his notification feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.dave.feed('notification', ctx.dave.userId).get();
      });
      ctx.responseShouldHaveActivityInGroupWithFields('reaction', 'custom');
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

  describe('and then Bob likes his own comment', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.reactions.addChild('like', comment);
    });
  });

  describe('and then bob reads his feed again', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.bob.feed('user', ctx.alice.userId).get({
        reactions: {
          recent: true,
          own: true,
          counts: true,
          own_children: true,
        },
      });
    });
    ctx.responseShouldHaveActivityWithFields(
      'latest_reactions',
      'latest_reactions_extra',
      'own_reactions',
      'reaction_counts',
    );
    ctx.activityShould('contain the activity with the nested like', () => {
      ctx.activity.latest_reactions.should.have.all.keys('comment');
      ctx.activity.latest_reactions.comment.should.have.length(1);
      const commentReaction = ctx.activity.latest_reactions.comment[0];
      commentReaction.should.have.all.keys(...ctx.fields.reaction, 'own_children', 'target_feeds');
      commentReaction.latest_children.should.have.all.keys('like');
      commentReaction.latest_children.like.should.have.length(1);
      commentReaction.latest_children.like[0].parent.should.eql(commentReaction.id);
    });
  });

  describe('When bob updates his comment', () => {
    ctx.requestShouldNotError(async () => {
      commentData = {
        text: 'Alice you are the best!!!!',
      };
      ctx.response = await ctx.bob.reactions.update(comment.id, commentData);
      ctx.response.created_at.should.eql(comment.created_at);
      ctx.response.updated_at.should.not.eql(comment.updated_at);
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
        ctx.response = await ctx.alice.reactions.update(comment.id, commentData);
      });
    });

    describe("and then alice tries to delete bob's comment", () => {
      ctx.requestShouldError(404, async () => {
        ctx.response = await ctx.alice.reactions.delete(comment.id);
      });
    });

    describe('and then alice reads bob his feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.feed('user', ctx.bob.userId).get();
      });
      ctx.responseShouldHaveNoActivities();
    });

    describe('and then alice reads her own notification feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.alice.feed('notification', ctx.alice.userId).get();
      });
      ctx.responseShouldHaveNoActivities();
    });

    describe('and then carl reads his notification feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.carl.feed('notification', ctx.carl.userId).get();
      });
      ctx.responseShouldHaveNoActivities();
    });

    describe('and then dave reads his notification feed', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.dave.feed('notification', ctx.dave.userId).get();
      });
      ctx.responseShouldHaveNoActivities();
    });
  });

  describe('When alice tries to set a string as the reaction data', () => {
    ctx.requestShouldError(400, async () => {
      ctx.response = await ctx.alice.reactions.add('comment', eatActivity.id, 'some string');
    });
  });
});

describe('Reaction CRUD server side', () => {
  const ctx = new CloudContext();

  let eatActivity;
  let comment;
  let like;
  let expectedCommentData;
  const commentData = {
    text: 'Looking yummy! @carl wanna get this on Tuesday?',
  };

  ctx.createUsers();
  describe('When alice eats a cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.feed('user', ctx.alice.userId).addActivity({
        verb: 'eat',
        object: 'cheeseburger',
      });
      eatActivity = ctx.response;
      eatActivity.actor = ctx.alice.currentUser.full;
    });
  });

  describe('When server side bob comments on that alice ate the cheese burger', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.serverSideClient.reactions.add('comment', eatActivity.id, commentData, {
        targetFeeds: [
          ctx.bob.feed('user', ctx.bob.userId),
          ctx.bob.feed('notification', ctx.alice.userId).id,
          ctx.bob.feed('notification', ctx.carl.userId).id,
        ],
        userId: ctx.bob.userId,
      });
      comment = ctx.response;
    });

    ctx.responseShouldHaveFields(...ctx.fields.reactionResponseWithTargets);

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

      ctx.responseShouldHaveFields(...ctx.fields.reactionResponseWithTargets);

      ctx.test('response should include bob user data', () => {
        ctx.response.user.should.eql(ctx.bob.currentUser.full);
      });
    });

    describe('and then alice reads bob feed from the server side', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.serverSideClient.feed('user', ctx.bob.userId).get({ enrich: true });
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
        ctx.activity.actor.should.eql(ctx.bob.currentUser.full);
        ctx.shouldEqualBesideDuration(ctx.activity.object, eatActivity);
        ctx.shouldEqualBesideDuration(ctx.activity.reaction, comment);
      });
    });

    describe("and then server side alice likes bob's comment", () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.serverSideClient.reactions.addChild(
          'like',
          comment,
          {},
          {
            userId: ctx.alice.userId,
          },
        );
        like = ctx.response;
      });
    });

    describe('and then bob reads the like by ID', () => {
      ctx.requestShouldNotError(async () => {
        ctx.response = await ctx.bob.reactions.get(like.id);
      });

      ctx.responseShouldHaveFields(...ctx.fields.reactionResponse);

      ctx.test('response should include alice user data', () => {
        ctx.response.user.should.eql(ctx.alice.currentUser.full);
      });
    });

    describe("and then alice tries to delete bob's comment", () => {
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
    });
  });
});
