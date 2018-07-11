new stream.Client('key', undefined, 'apiSecret');

stream.connect(
  'abc',
  'def',
  'ghi',
); // $ExpectType StreamClient

const client = stream.connect(
  'abc',
  'def',
  'ghi',
);
client.feed('feedSlug', 'user'); // $ExpectType Feed

let feed = client.feed('feedSlug', 'user');
feed.follow('feedSlug', 'user'); // $ExpectType Promise<object>
feed.follow('feedSlug', 'user', { activity_copy_limit: 10 }); // $ExpectType Promise<object>
feed.follow(
  'feedSlug',
  'user',
  { activity_copy_limit: 10 },
  (err: object, httpResponse: object, body: object) => {},
); // $ExpectType void
feed.follow(
  'feedSlug',
  'user',
  (err: object, httpResponse: object, body: object) => {},
); // $ExpectType void

feed.unfollow('feedSlug', 'user'); // $ExpectType Promise<object>
feed.unfollow('feedSlug', 'user', { keep_history: true }); // $ExpectType Promise<object>
feed.unfollow(
  'feedSlug',
  'user',
  { keep_history: true },
  (err: object, httpResponse: object, body: object) => {},
); // $ExpectType void
feed.unfollow(
  'feedSlug',
  'user',
  (err: object, httpResponse: object, body: object) => {},
); // $ExpectType void

new stream.errors.MissingSchemaError(); // $ExpectType MissingSchemaError
new stream.errors.FeedError(); // $ExpectType FeedError
new stream.errors.SiteError(); // $ExpectType SiteError
