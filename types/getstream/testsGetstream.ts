new stream.Client('key', undefined, 'apiSecret');

// prettier-ignore
stream.connect('abc', 'def', 'ghi'); // $ExpectType StreamClient

// prettier-ignore
const client = stream.connect('abc', 'def', 'ghi');
client.feed('feedSlug', 'user'); // $ExpectType Feed
client.og('https://getstream.io'); // $ExpectType Promise<OGResponse>
client.images.upload('http://foo.bar/img.jpg', 'img.jpg', 'image/jpeg'); // $ExpectType Promise<FileUploadAPIResponse>
// prettier-ignore
client.images.process('http://foo.bar/img.jpg', { crop: 'bottom', resize: 'clip', h: 50, w: 50 }); // $ExpectType Promise<FileUploadAPIResponse>
// prettier-ignore
client.images.thumbnail('http://foo.bar/img.jpg', 50, 50, { crop: 'bottom', resize: 'fill' }); // $ExpectType Promise<FileUploadAPIResponse>
client.images.delete('http://foo.bar/img.jpg'); // $ExpectType Promise<void>
client.files.upload('http://foo.bar/txt.txt', 'txt.txt', 'text/plain'); // $ExpectType Promise<FileUploadAPIResponse>
client.files.delete('http://foo.bar/txt.txt'); // $ExpectType Promise<void>

let feed = client.feed('feedSlug', 'user');
feed.follow('feedSlug', 'user'); // $ExpectType Promise<object>
feed.follow('feedSlug', 'user', { activity_copy_limit: 10 }); // $ExpectType Promise<object>

feed.unfollow('feedSlug', 'user'); // $ExpectType Promise<object>
feed.unfollow('feedSlug', 'user', { keep_history: true }); // $ExpectType Promise<object>

let collections = client.collections; // $ExpectType Collections
collections.buildURL('events', 'login-134'); // $ExpectType string
collections.entry('events', 'login-134', { user: 'john', source: 'website' }); // $ExpectType CollectionEntry
collections.get('events', 'login-134'); // $ExpectType Promise<object>
collections.add('events', 'login-123', { user: 'john' }); // $ExpectType Promise<object>
collections.update('events', 'login-2', { user: 'jo' }); // $ExpectType Promise<object>
collections.delete('events', 'login-134'); // $ExpectType Promise<object>
collections.upsert('events', { id: 'login-1', user: 'jo' }); // $ExpectType Promise<object>
collections.upsert('events', { id: 'login-1', source: 'cart' }); // $ExpectType Promise<object>
collections.select('events', ['login-1', 'login-123']); // $ExpectType Promise<object>
collections.deleteMany('events', ['login-2', 'login-234']); // $ExpectType Promise<object>

new stream.errors.MissingSchemaError(); // $ExpectType MissingSchemaError
new stream.errors.FeedError(); // $ExpectType FeedError
new stream.errors.SiteError(); // $ExpectType SiteError
