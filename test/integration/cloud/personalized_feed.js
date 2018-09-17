var { CloudContext } = require('./utils');

describe('Personalized enrichment story', () => {
  let ctx = new CloudContext();

  describe('When alice reads her personalization feed', () => {
    ctx.requestShouldError(404, async () => {
      ctx.response = await ctx.alice.personalizedFeed({ feed_slug: 'abc' });
    });
  });
  describe('When alice reads her personalization feed without args', () => {
    ctx.requestShouldError(404, async () => {
      ctx.response = await ctx.alice.personalizedFeed();
    });
  });
});
