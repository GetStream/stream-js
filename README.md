Stream-JS
===========

[![Build Status](https://travis-ci.org/GetStream/stream-js.svg?branch=master)](https://travis-ci.org/GetStream/stream-js)
[![Sauce Test Status](https://saucelabs.com/buildstatus/tthisk)](https://saucelabs.com/u/tthisk)

[![NPM](https://nodei.co/npm/getstream.png)](https://nodei.co/npm/getstream/)

[stream-js](https://github.com/GetStream/stream-js) is the official JavaScript client for [Stream](https://getstream.io/), a web service for building scalable newsfeeds and activity streams.

Note that there is also a [higher level Node integration](https://github.com/getstream/stream-node-orm) which hooks into your ORM.

You can sign up for a Stream account at https://getstream.io/get_started.

### Installation

#### Install from NPM

```bash
npm install getstream
```
### Using JS deliver

```html
<script src="https://cdn.jsdelivr.net/npm/getstream/dist/js_min/getstream.js"></script>
```

#### Install by downloading the JS file

[JS](https://raw.githubusercontent.com/GetStream/stream-js/master/dist/js/getstream.js) /
[Minified JS](https://raw.githubusercontent.com/GetStream/stream-js/master/dist/js_min/getstream.js)

### Full documentation

Documentation for this JavaScript client are available at the [Stream website](https://getstream.io/docs/?language=js).

#### Using with React Native

This package can be integrated into React Native applications. Remember to not expose the App Secret in browsers, "native" mobile apps, or other non-trusted environments.

### Usage

### API client setup Node

```javascript
var stream = require('getstream');
// Instantiate a new client (server side)
client = stream.connect('YOUR_API_KEY', 'API_KEY_SECRET');
// Optionally supply the app identifier and an object specifying the data center to use
client = stream.connect('YOUR_API_KEY', 'API_KEY_SECRET', 'APP_ID', { location: 'us-west' });
```

### API client setup Node + Browser

If you want to use the API client directly on your web/mobile app you need to generate a user token server-side and pass it.

#### Server-side token generation

```javascript
var stream = require('getstream');
// Instantiate a new client (server side)
client = stream.connect('YOUR_API_KEY', 'API_KEY_SECRET');
// Optionally supply the app identifier and an object specifying the data center to use
client = stream.connect('YOUR_API_KEY', 'API_KEY_SECRET', 'APP_ID', { location: 'us-west' });
// Create a token for user with id "the-user-id"
const userToken = client.createUserToken('the-user-id');
```

#### Client API init

```javascript
var stream = require('getstream');

// Instantiate new client with a user token
client = stream.connect('apikey', userToken,  'appid');
```

#### Examples

```javascript
// Instantiate a feed object server side
user1 = client.feed('user', '1');

// Get activities from 5 to 10 (slow pagination)
user1.get({limit:5, offset:5}, callback);
// Filter on an id less than a given UUID
user1.get({limit:5, id_lt:"e561de8f-00f1-11e4-b400-0cc47a024be0"});

// All API calls are performed asynchronous and return a Promise object
user1.get({limit:5, id_lt:"e561de8f-00f1-11e4-b400-0cc47a024be0"})
	.then(function(body) { /* on success */ })
	.catch(function(reason) { /* on failure, reason.error contains an explanation */ });

// Create a new activity
activity = {'actor': 1, 'verb': 'tweet', 'object': 1, 'foreign_id': 'tweet:1'};
user1.addActivity(activity);
// Create a bit more complex activity
activity = {'actor': 1, 'verb': 'run', 'object': 1, 'foreign_id': 'run:1',
	'course': {'name': 'Golden Gate park', 'distance': 10},
	'participants': ['Thierry', 'Tommaso'],
	'started_at': new Date()
};
user1.addActivity(activity);

// Remove an activity by its id
user1.removeActivity("e561de8f-00f1-11e4-b400-0cc47a024be0");
// or remove by the foreign id
user1.removeActivity({foreignId: 'tweet:1'});

// mark a notification feed as read
notification1 = client.feed('notification', '1');
var params = {mark_read: true};
notification1.get(params);

// mark a notification feed as seen
var params = {mark_seen:true};
notification1.get(params);

// Follow another feed
user1.follow('flat', '42');

// Stop following another feed
user1.unfollow('flat', '42');

// Stop following another feed while keeping previously published activities
// from that feed
user1.unfollow('flat', '42', { keepHistory: true });

// Follow another feed without copying the history
user1.follow('flat', '42', { limit: 0 });

// List followers, following
user1.followers({limit: '10', offset: '10'});
user1.following({limit: '10', offset: '0'});

// all methods support callback as the last argument
user1.follow('flat', '42');

// adding multiple activities
activities = [
	{'actor': 1, 'verb': 'tweet', 'object': 1},
	{'actor': 2, 'verb': 'tweet', 'object': 3},
];
user1.addActivities(activities);

// specifying additional feeds to push the activity to using the to param
// especially useful for notification style feeds
to = ['user:2', 'user:3'];
activity = {'to': to, 'actor': 1, 'verb': 'tweet', 'object': 1, 'foreign_id': 'tweet:1'};
user1.addActivity(activity);

// adding one activity to multiple feeds
var feeds = ['flat:1', 'flat:2', 'flat:3', 'flat:4'];
activity = {
  'actor': 'User:2',
  'verb': 'pin',
  'object': 'Place:42',
  'target': 'Board:1'
};

// ⚠️ server-side only!
client.addToMany(activity, feeds);

// Batch create follow relations (let flat:1 follow user:1, user:2 and user:3 feeds in one single request)
var follows = [
  {'source': 'flat:1', 'target': 'user:1'},
  {'source': 'flat:1', 'target': 'user:2'},
  {'source': 'flat:1', 'target': 'user:3'}
];

// ⚠️ server-side only!
client.followMany(follows);

// Updating parts of an activity
var set = {
  'product.price': 19.99,
  'shares': {
    'facebook': '...',
    'twitter': '...'
  },
}
var unset = [
  'daily_likes',
  'popularity'
]
// ...by ID
client.activityPartialUpdate({
  id: '54a60c1e-4ee3-494b-a1e3-50c06acb5ed4',
  set: set,
  unset: unset,
})
// ...or by combination of foreign ID and time
client.activityPartialUpdate({
  foreignID: 'product:123',
  time: '2016-11-10T13:20:00.000000',
  set: set,
  unset: unset,
})

// ⚠️ server-side only!
// Create redirect urls
var impression = {
    'content_list': ['tweet:1', 'tweet:2', 'tweet:3'],
    'user_data': 'tommaso',
    'location': 'email',
    'feed_id': 'user:global'
};
var engagement = {
    'content': 'tweet:2',
    'label': 'click',
    'position': 1,
    'user_data': 'tommaso',
    'location': 'email',
    'feed_id':
    'user:global'
};
var events = [impression, engagement];
var redirectUrl = client.createRedirectUrl('http://google.com', 'user_id', events);

// update the 'to' fields on an existing activity
// client.feed("user", "ken").function (foreign_id, timestamp, new_targets, added_targets, removed_targets)
// new_targets, added_targets, and removed_targets are all arrays of feed IDs
// either provide only the `new_targets` parameter (will replace all targets on the activity),
// OR provide the added_targets and removed_targets parameters
// NOTE - the updateActivityToTargets method is not intended to be used in a browser environment.
client.feed("user", "ken").updateActivityToTargets("foreign_id:1234", timestamp, ["feed:1234"])
client.feed("user", "ken").updateActivityToTargets("foreign_id:1234", timestamp, null, ["feed:1234"])
client.feed("user", "ken").updateActivityToTargets("foreign_id:1234", timestamp, null, null, ["feed:1234"])

```

### Realtime (Faye)

Stream uses [Faye](http://faye.jcoglan.com/browser.html) for realtime notifications. Below is quick guide to subscribing to feed changes

```javascript
var stream = require('getstream');

// ⚠️ userToken is generated server-side (see previous section)
client = stream.connect('YOUR_API_KEY', userToken, 'APP_ID');
user1 = client.feed('user', '1');

// subscribe to the changes
var subscription = user1.subscribe(function (data) {
	console.log(data);
});
// now whenever something changes to the feed user 1
// the callback will be called

// To cancel a subscription you can call cancel on the
// object returned from a subscribe call.
// This will remove the listener from this channel.
subscription.cancel();
```


Docs are available on [GetStream.io](http://getstream.io/docs/?language=js).

#### Node version requirements & Browser support

This API Client project requires Node.js v6 at a minimum.

The project is supported in line with the Node.js Foundation Release Working Group.

See the [Travis configuration](.travis.yml) and [Sauce Test Status](https://saucelabs.com/u/tthisk) for details of how it is built, tested and packaged.

Contributing
------------

First, make sure you can run the test suite. Tests are run via Mocha

```bash
mocha test/integration/index.js test/unit/index.js
# browser version (needs to be build through gulp build:test)
test/browser/test.html
# coverage
mocha test/cov.js -R html-cov > cov.html
```

  [Stream]: https://getstream.io/
  [GetStream.io]: http://getstream.io/docs/?language=js

### Copyright and License Information

Copyright (c) 2015-2018 Stream.io Inc, and individual contributors. All rights reserved.

See the file "LICENSE" for information on the history of this software, terms & conditions for usage, and a DISCLAIMER OF ALL WARRANTIES.
