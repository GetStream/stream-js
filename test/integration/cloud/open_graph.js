var { CloudContext } = require('./utils');

describe('OpenGraph story', () => {
  let ctx = new CloudContext();

  describe('When alice requests opengraph info for our blog', () => {
    ctx.requestShouldNotError(async () => {
      ctx.response = await ctx.alice.og(
        'https://getstream.io/blog/try-out-the-stream-api-with-postman',
      );
    });

    ctx.responseShould('have the expected content', () => {
      ctx.shouldEqualBesideDuration(ctx.response, {
        locale: 'en_US',
        type: 'article',
        title: 'Try out the Stream API with Postman - The Stream Blog',
        description:
          "Many of us at Stream use Postman regularly as we build and test our services. We're also always looking for ways to make it quick and easy for other developers to try the service. One of our goals is to help people see first hand how simple it is to build powerful social apps with Stream.",
        url: 'https://getstream.io/blog/try-out-the-stream-api-with-postman/',
        site_name: 'The Stream Blog',
        favicon:
          'https://getstream-blog.imgix.net/blog/wp-content/uploads/2016/08/8597527.png?w=32&h=32',
        images: [
          {
            image:
              'https://getstream-blog.imgix.net/blog/wp-content/uploads/2018/04/stream_postman.png',
            secure_url:
              'https://getstream-blog.imgix.net/blog/wp-content/uploads/2018/04/stream_postman.png',
            width: 1600,
            height: 835,
          },
        ],
      });
    });
  });

  describe('When alice requests opengraph info for a binary blob', () => {
    ctx.requestShouldError(400, async () => {
      ctx.response = await ctx.alice.og(
        'https://github.com/buger/goreplay/releases/download/v0.14.0/gor.exe',
      );
    });

    ctx.responseShould('have the expected content', () => {
      ctx.shouldEqualBesideDuration(ctx.response, {
        detail: 'url content too big',
        status_code: 400,
        code: 4,
        exception: 'InputException',
      });
    });
  });
});
