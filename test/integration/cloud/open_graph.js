import { CloudContext } from './utils';

describe('OpenGraph story', () => {
  const ctx = new CloudContext();

  describe('When alice requests opengraph info for google', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.og('https://google.com');
    });

    ctx.responseShould('have the expected content', () => {
      ctx.shouldHaveNonEmptyKeys(ctx.response, 'title', 'description', 'original_url', 'favicon', 'images');
      ctx.shouldHaveNonEmptyKeys(ctx.response.images[0], 'image');
    });
  });

  describe('When alice requests opengraph info for a binary blob', () => {
    ctx.requestShouldError(400, async () => {
      ctx.response = await ctx.alice.og('https://github.com/buger/goreplay/releases/download/v0.14.0/gor.exe');
    });

    ctx.responseShould('have the expected content', () => {
      ctx.shouldEqualBesideDuration(ctx.response, {
        detail: "couldn't find og data for the provided url",
        status_code: 400,
        code: 4,
        exception: 'InputException',
        more_info: 'https://getstream.io/docs/api_error_responses',
      });
    });
  });
});
