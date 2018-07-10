var { CloudContext } = require('./utils');

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
            delete eatActivity.duration;
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

        describe('and then alice reads bob his feed', () => {
            ctx.requestShouldNotError(async () => {
                ctx.response = await ctx.alice.feed('user', ctx.bob.user).get();
            });
            ctx.responseShouldHaveActivityWithFields();
            ctx.activityShould('contain the expected data', () => {
                expectedCommentData = {
                    verb: 'comment',
                    foreign_id: `SR:${comment.id}`,
                    time: comment.created_at.slice(0, -1), // chop off the Z suffix
                    target: '',
                    origin: null,
                };

                ctx.activity.should.include(expectedCommentData);
                ctx.activity.actor.should.eql(ctx.bob.user.full);
                ctx.activity.object.should.eql(eatActivity);
                commentActivity = ctx.activity;
            });
        });

        describe('and then alice reads her own notification feed', () => {
            ctx.requestShouldNotError(async () => {
                ctx.response = await ctx.alice.feed('notification').get();
            });
            ctx.responseShouldHaveActivityInGroupWithFields();
            ctx.activityShould('be the same as on bob his feed', () => {
                ctx.activity.should.eql(commentActivity);
            });
        });

        describe('and then carl reads his notification feed', () => {
            ctx.requestShouldNotError(async () => {
                ctx.response = await ctx.carl.feed('notification').get();
            });
            ctx.responseShouldHaveActivityInGroupWithFields();
            ctx.activityShould('be the same as on bob his feed', () => {
                ctx.activity.should.eql(commentActivity);
            });
        });
    });

    describe('When bob updates his comment and tags dave instead of carl', () => {
        ctx.requestShouldNotError(async () => {
            commentData = {
                text: 'Looking yummy! @dave wanna get this on Tuesday?',
            };
            ctx.response = await ctx.bob.reactions.update(
                comment.id,
                commentData,
                [
                    ctx.bob.feed('user').id,
                    ctx.bob.feed('notification', ctx.alice.userId),
                    ctx.bob.feed('notification', ctx.dave.userId),
                ],
            );
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

        describe('and then alice reads bob his feed', () => {
            ctx.requestShouldNotError(async () => {
                ctx.response = await ctx.alice.feed('user', ctx.bob.user).get();
            });
            ctx.responseShouldHaveActivityWithFields();
            ctx.activityShould('contain the expected data', () => {
                ctx.activity.should.include(expectedCommentData);
                commentActivity = ctx.activity;
            });
        });

        describe('and then alice reads her own notification feed', () => {
            ctx.requestShouldNotError(async () => {
                ctx.response = await ctx.alice.feed('notification').get();
            });
            ctx.responseShouldHaveActivityInGroupWithFields();
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
            ctx.responseShouldHaveActivityInGroupWithFields();
            ctx.activityShould('be the same as on bob his feed', () => {
                ctx.activity.should.eql(commentActivity);
            });
        });
    });

    describe('When bob deletes his comment', () => {
        ctx.requestShouldNotError(async () => {
            ctx.response = await ctx.bob.reactions.delete(comment.id);
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
});
