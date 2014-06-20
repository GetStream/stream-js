stream-node
===========

stream-node is a Node/Javascript client for [Stream][].

```javascript
var stream = require('getstream');
// Instantiate a new client (server side)
client = stream.connect('YOUR_API_KEY', 'API_KEY_SECRET')
// Instantiate a new client (client side)
client = stream.connect('YOUR_API_KEY')
// Find your API keys here https://getstream.io/dashboard/

// Instantiate a feed object server side
user1 = client.feed('user:1');
// Instantiate a feed object client side
user1 = client.feed('user:1', 'FEED_SECRET');

// Get activities from 5 to 10 (slow pagination)
user1.get({limit:5, offset:5}, callback);
// (Recommended & faster) Filter on an id less than 112334
user1.get({limit:5, id_lt:112334}, callback);

// Create a new activity
activity = {'actor': 1, 'verb': 'tweet', 'object': 1};
user1.addActivity(activity, callback);

// Remove an activity by its id
user1.removeActivity('12345678910');

// Follow another feed
user1.follow('flat:42');

// Stop following another feed
user1.unfollow('flat:42');
```

Docs are available on [GetStream.io][].

Installation
------------

### Install from NPM

```bash
npm install getstream
```

### Install using bower

```bash
bower install getstream
```

Contributing
------------

First, make sure you can run the test suite. Tests are run via Mocha

```bash
mocha test/integration/index.js
```

  [Stream]: https://getstream.io/
  [GetStream.io]: http://getstream.io/docs/
