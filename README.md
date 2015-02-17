stream-js
===========

[![Build Status](https://travis-ci.org/GetStream/stream-js.svg?branch=master)](https://travis-ci.org/GetStream/stream-js)
[![Coverage Status](https://img.shields.io/coveralls/GetStream/stream-js.svg)](https://coveralls.io/r/GetStream/stream-js?branch=master)
[![Dependencies up to date](https://david-dm.org/GetStream/stream-js.png)](https://david-dm.org/tschellenbach/stream-js)

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

#### Install by downloading the JS file

[JS](https://raw.githubusercontent.com/GetStream/stream-js/master/dist/js/getstream.js) / 
[Minified JS](https://raw.githubusercontent.com/GetStream/stream-js/master/dist/js_min/getstream.js)

#### Install for parse cloud code

[JS](https://raw.githubusercontent.com/GetStream/stream-js/parse/dist/js/getstream.js)

### Usage

```javascript
var stream = require('getstream');
// Instantiate a new client (server side)
client = stream.connect('YOUR_API_KEY', 'API_KEY_SECRET');
// Instantiate a new client (client side)
client = stream.connect('YOUR_API_KEY');
// Find your API keys here https://getstream.io/dashboard/

// Instantiate a feed object server side
user1 = client.feed('user', '1');
// Instantiate a feed object client side
// Generate a feed's token using server side signing
user1 = client.feed('user', '1', 'FEED_TOKEN');

// Get activities from 5 to 10 (slow pagination)
user1.get({limit:5, offset:5}, callback);
// (Recommended & faster) Filter on an id less than a given UUID
user1.get({limit:5, id_lt:"e561de8f-00f1-11e4-b400-0cc47a024be0"}, function(error, response, body) { /* callback */ });

// Create a new activity
activity = {'actor': 1, 'verb': 'tweet', 'object': 1, 'foreign_id': 'tweet:1'};
user1.addActivity(activity, function(error, response, body) { ... });
// Create a bit more complex activity
activity = {'actor': 1, 'verb': 'run', 'object': 1, 'foreign_id': 'run:1', 
	'course': {'name': 'Golden Gate park', 'distance': 10},
	'participants': ['Thierry', 'Tommaso'],
	'started_at': new Date()
};
user1.addActivity(activity, function(error, response, body) { /* callback */ });

// Remove an activity by its id
user1.removeActivity("e561de8f-00f1-11e4-b400-0cc47a024be0");
// or remove by the foreign id
user1.removeActivity({foreignId: 'tweet:1'});


// Follow another feed
user1.follow('flat', '42');

// Stop following another feed
user1.unfollow('flat', '42');

// List followers, following
user1.followers({limit: '10', offset: '10'});
user1.following({limit: '10', offset: '0'});

// all methods support callback as the last argument
user1.follow('flat', '42', function(error, response, body) { /* callback */ });

// adding multiple activities
activities = [
	{'actor': 1, 'verb': 'tweet', 'object': 1},
	{'actor': 2, 'verb': 'tweet', 'object': 3}, 
];
user1.addActivities(activities, function(error, response, body) { /* callback */ });

// specifying additional feeds to push the activity to using the to param
// especially usefull for notification style feeds
to = ['user:2', 'user:3'];
activity = {'to': to, 'actor': 1, 'verb': 'tweet', 'object': 1, 'foreign_id': 'tweet:1'};
user1.addActivity(activity, function(error, response, body) { /* callback */ });

// creating a feed token server side
token = user1.token;
// passed to client via template or api and initialized as such
user1 = client.feed('user', '1', token);

```

### Faye

Stream uses Faye for realtime notifications. Below is quick quide to subcribing to feed changes

```javascript
var stream = require('getstream');
// NOTE: the site id is needed for subscribing
// server side example:
client = stream.connect('YOUR_API_KEY', 'API_KEY_SECRET', 'SITE_ID');
user1 = client.feed('user', '1');
// same two lines but client side (generate the feed token server side)
client = stream.connect('YOUR_API_KEY', null, 'SITE_ID');
user1 = client.feed('user', '1', 'feedtoken');
// subscribe to the changes
user1.subscribe(function callback() {
});
// now whenever something changes to the feed user 1
// the callback will be called
```


Docs are available on [GetStream.io](http://getstream.io/docs/).



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
