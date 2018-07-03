var { CloudContext } = require('./utils');

describe('Reaction CRUD and posting reactions to feeds', () => {
    let ctx = new CloudContext();

    let eatActivity;
    let likeActivity;
    let like;
    describe('When alice eats a cheese burger', () => {
        ctx.requestShouldNotError(async () => {
            ctx.response = await ctx.alice.feed('user').addActivity({
                actor: ctx.alice.userId,
                verb: 'eat',
                object: 'cheeseburger',
            });
            eatActivity = ctx.response;
        });
    });

    let commentData = { text: 'Looking yummy!' };

    describe('When bob then comments on that alice ate the cheese burger', () => {
        ctx.requestShouldNotError(async () => {
            ctx.response = await ctx.bob.react('comment', eatActivity.id, {
                data: commentData,
                targetFeeds: [
                    ctx.bob.feed('user'),
                    ctx.bob.feed('notification', ctx.alice.userId),
                ],
            });
            like = ctx.response;
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
    });
});
