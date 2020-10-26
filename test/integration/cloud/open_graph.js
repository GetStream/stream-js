import { CloudContext } from './utils';

describe('OpenGraph story', () => {
  const ctx = new CloudContext();

  describe('When alice requests opengraph info for our blog', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.og('https://getstream.io/blog/try-out-the-stream-api-with-postman');
    });

    ctx.responseShould('have the expected content', () => {
      ctx.shouldHaveNonEmptyKeys(ctx.response, 'type', 'title', 'description', 'url', 'favicon', 'images');
      ctx.shouldHaveNonEmptyKeys(ctx.response.images[0], 'height', 'width', 'image');
    });
  });

  describe('When alice requests opengraph info for a binary blob', () => {
    ctx.requestShouldError(400, async () => {
      ctx.response = await ctx.alice.og('https://github.com/buger/goreplay/releases/download/v0.14.0/gor.exe');
    });

    ctx.responseShould('have the expected content', () => {
      ctx.shouldEqualBesideDuration(ctx.response, {
        detail: 'url content too big',
        status_code: 400,
        code: 4,
        exception: 'InputException',
        more_info: 'https://getstream.io/docs/api_error_responses',
      });
    });
  });
});
