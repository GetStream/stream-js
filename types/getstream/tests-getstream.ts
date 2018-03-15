import stream = require('getstream');

let c = new stream.Client("key", undefined, "apiSecret");

stream.connect("abc", "def", "ghi"); // $ExpectType StreamClient

stream.connect("abc", "def", "ghi").feed('feedSlug', 'user').follow('feedSlug', 'user')

new stream.errors.MissingSchemaError(); // $ExpectType MissingSchemaError
new stream.errors.FeedError(); // $ExpectType FeedError
new stream.errors.SiteError(); // $ExpectType SiteError
