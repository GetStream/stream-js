new stream.Client('key', undefined, 'apiSecret');

// prettier-ignore
stream.connect('abc', 'def', 'ghi'); // $ExpectType StreamClient

// prettier-ignore
const client = stream.connect('abc', 'def', 'ghi');
client.feed('feedSlug', 'user'); // $ExpectType Feed

let callback = (err: object, httpResponse: object, body: object) => {};

let feed = client.feed('feedSlug', 'user');
feed.follow('feedSlug', 'user'); // $ExpectType Promise<object>
feed.follow('feedSlug', 'user', { activity_copy_limit: 10 }); // $ExpectType Promise<object>

feed.follow('feedSlug', 'user', { activity_copy_limit: 10 }, callback); // $ExpectType void
feed.follow('feedSlug', 'user', callback); // $ExpectType void

feed.unfollow('feedSlug', 'user'); // $ExpectType Promise<object>
feed.unfollow('feedSlug', 'user', { keep_history: true }); // $ExpectType Promise<object>
feed.unfollow('feedSlug', 'user', { keep_history: true }, callback); // $ExpectType void
feed.unfollow('feedSlug', 'user', callback); // $ExpectType void

let entryCallback = (data: any) => {};
let collections = client.collections; // $ExpectType Collections
collections.buildURL('events', 'login-134'); // $ExpectType string
collections.entry('events', 'login-134', { user: 'john', source: 'website' }); // $ExpectType CollectionEntry
collections.get('events', 'login-134'); // $ExpectType Promise<object>
collections.get('events', 'login-134', entryCallback); // $ExpectType void
collections.add('events', 'login-123', { user: 'john' }); // $ExpectType Promise<object>
collections.add('events', 'login-1', { user: 'mo' }, entryCallback); // $ExpectType void
collections.update('events', 'login-2', { user: 'jo' }); // $ExpectType Promise<object>
collections.update('events', 'login-2', { user: 'jo' }, entryCallback); // $ExpectType void
collections.delete('events', 'login-134'); // $ExpectType Promise<object>
collections.delete('events', 'login-134', callback); // $ExpectType void
collections.upsert('events', { id: 'login-1', user: 'jo' }); // $ExpectType Promise<object>
collections.upsert('events', { id: 'login-1', source: 'cart' }, callback); // $ExpectType void
collections.select('events', ['login-1', 'login-123']); // $ExpectType Promise<object>
collections.select('events', ['login-1', 'login-123'], callback); // $ExpectType void
collections.deleteMany('events', ['login-2', 'login-234']); // $ExpectType Promise<object>
collections.deleteMany('events', ['login-2', 'login-234'], callback); // $ExpectType void

new stream.errors.MissingSchemaError(); // $ExpectType MissingSchemaError
new stream.errors.FeedError(); // $ExpectType FeedError
new stream.errors.SiteError(); // $ExpectType SiteError
