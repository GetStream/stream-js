stream-js
===========

[![Build Status](https://travis-ci.org/tschellenbach/stream-js.svg?branch=master)](https://travis-ci.org/tschellenbach/stream-js)
[![Coverage Status](https://coveralls.io/repos/tschellenbach/stream-js/badge.png?branch=master)](https://coveralls.io/r/tschellenbach/stream-js?branch=master)
[![Dependencies up to date](https://david-dm.org/tschellenbach/stream-js.png)](https://david-dm.org/tschellenbach/stream-js)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/tschellenbach.svg)](https://saucelabs.com/u/tschellenbach)

stream-node is a Node/Javascript client for [Stream][].

### Installation

#### Install from NPM

```bash
npm install getstream
```

#### Install using bower

```bash
bower install getstream
```

### Usage

```javascript
var stream = require('getstream');
// Instantiate a new client (server side)
client = stream.connect('YOUR_API_KEY', 'API_KEY_SECRET');
// Instantiate a new client (client side)
client = stream.connect('YOUR_API_KEY');
// Find your API keys here https://getstream.io/dashboard/

// Instantiate a feed object server side
user1 = client.feed('user:1');
// Instantiate a feed object client side
// Generate a feed's token using server side signing
user1 = client.feed('user:1', 'FEED_TOKEN');

// Get activities from 5 to 10 (slow pagination)
user1.get({limit:5, offset:5}, callback);
// (Recommended & faster) Filter on an id less than a given UUID
user1.get({limit:5, id_lt:"e561de8f-00f1-11e4-b400-0cc47a024be0"}, callback);

// Create a new activity
activity = {'actor': 1, 'verb': 'tweet', 'object': 1};
user1.addActivity(activity, callback);

// Remove an activity by its id
user1.removeActivity("e561de8f-00f1-11e4-b400-0cc47a024be0");

// Follow another feed
user1.follow('flat:42');

// Stop following another feed
user1.unfollow('flat:42');

// all methods support callback as the last argument
user1.follow('flat:42', callback);
// with this signature
function(error, response, body) {
}
```

### Faye

Stream uses Faye for realtime notifications. Below is quick quide to subcribing to feed changes

```javascript
var stream = require('getstream');
// NOTE: the site id is needed for subscribing
client = stream.connect('YOUR_API_KEY', 'API_KEY_SECRET', 'SITE_ID');
user1 = client.feed('user:1');
user1.subscribe(function callback() {
});
// now whenever something changes to the feed user 1
// the callback will be called
```


API Docs are available on [GetStream.io](http://getstream.io/docs/).



Contributing
------------

First, make sure you can run the test suite. Tests are run via Mocha

```bash
mocha test/integration/index.js
# browser version
test/browser/test.html
# coverage
mocha test/integration/cov.js -R html-cov > cov.html
```

To release a new version
```bash
# package.json is leading and overwrites bower.json version
gulp bump
# builds the browserify, tags and submits to npm
gulp publish
```

  [Stream]: https://getstream.io/
  [GetStream.io]: http://getstream.io/docs/
