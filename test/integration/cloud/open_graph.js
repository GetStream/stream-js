import { CloudContext } from './utils';

describe('OpenGraph story', () => {
  const ctx = new CloudContext();

  describe('When alice requests opengraph info for our blog', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.og('https://getstream.io/blog/try-out-the-stream-api-with-postman');
    });

    ctx.responseShould('have the expected content', () => {
      ctx.shouldEqualBesideDuration(ctx.response, {
        type: 'website',
        title: 'Try out the Stream API with Postman - The Stream Blog',
        description: 'Many of us at Stream use Postman regularly as w…',
        url: 'https://getstream.io/blog/try-out-the-stream-api-with-postman/',
        Favicon: 'https://getstream.io/blog/favicon-32x32.png?v=a90bc4693ff63b2c71ad2c84a80bdc44',
        images: [
          {
            height: 600,
            image: 'https://i.imgur.com/cQTq2QA.jpg',
            width: 1200,
          },
        ],
      });
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
