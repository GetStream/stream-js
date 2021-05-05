# Stream-JS

[![build](https://github.com/GetStream/stream-js/workflows/build/badge.svg)](https://github.com/GetStream/stream-js/actions)

[![NPM](https://nodei.co/npm/getstream.png)](https://nodei.co/npm/getstream/)

[stream-js](https://github.com/GetStream/stream-js) is the official JavaScript client for [Stream](https://getstream.io/), a web service for building scalable newsfeeds and activity streams.

Note that there is also a [higher level Node integration](https://github.com/getstream/stream-node-orm) which hooks into your ORM.

You can sign up for a Stream account at https://getstream.io/get_started.

### Installation

#### Install from NPM/YARN

```bash
npm install getstream
```

or if you are using yarn

```bash
yarn add getstream
```

### Using JS deliver

```html
<script src="https://cdn.jsdelivr.net/npm/getstream/dist/js_min/getstream.js"></script>
```

> :warning: This will pull the latest which can be breaking for your application. Always pin a specific version as follows:

```html
<script src="https://cdn.jsdelivr.net/npm/getstream@5.0.0/dist/js_min/getstream.js"></script>
```

#### Install by downloading the JS file

[JS](https://raw.githubusercontent.com/GetStream/stream-js/main/dist/js/getstream.js) /
[Minified JS](https://raw.githubusercontent.com/GetStream/stream-js/main/dist/js_min/getstream.js)

> :warning: Beware about the version you're pulling. It's the latest by default which can break your app anytime.

### Full documentation

Documentation for this JavaScript client are available at the [Stream website](https://getstream.io/docs/?language=js).

#### Using with React Native

This package can be integrated into React Native applications. Remember to not expose the App Secret in browsers, "native" mobile apps, or other non-trusted environments.

### Usage

### API client setup Node

```js
import { connect } from 'getstream';
// or if you are on commonjs
const { connect } = require('getstream');

// Instantiate a new client (server side)
const client = connect('YOUR_API_KEY', 'API_KEY_SECRET');
// Optionally supply the app identifier and an options object specifying the data center to use and timeout for requests (15s)
const client = connect('YOUR_API_KEY', 'API_KEY_SECRET', 'APP_ID', { location: 'us-east', timeout: 15000 });
```

### API client setup Node + Browser

If you want to use the API client directly on your web/mobile app you need to generate a user token server-side and pass it.

#### Server-side token generation

```js
import { connect } from 'getstream';
// or if you are on commonjs
const { connect } = require('getstream');

// Instantiate a new client (server side)
const client = connect('YOUR_API_KEY', 'API_KEY_SECRET');
// Optionally supply the app identifier and an options object specifying the data center to use and timeout for requests (15s)
const client = connect('YOUR_API_KEY', 'API_KEY_SECRET', 'APP_ID', { location: 'us-east', timeout: 15000 });
// Create a token for user with id "the-user-id"
const userToken = client.createUserToken('the-user-id');
```

> :warning: Client checks if it's running in a browser environment with a secret and throws an error for a possible security issue of exposing your secret. If you are running backend code in Google Cloud or you know what you're doing, you can specify `browser: false` in `options` to skip this check.

```js
const client = connect('YOUR_API_KEY', 'API_KEY_SECRET', 'APP_ID', { browser: false });
```

#### Client API init

```js
import { connect } from 'getstream';
// or if you are on commonjs
const { connect } = require('getstream');
// Instantiate new client with a user token
const client = connect('apikey', userToken, 'appid');
```

#### Examples

```js
// Instantiate a feed object server side
user1 = client.feed('user', '1');

// Get activities from 5 to 10 (slow pagination)
user1.get({ limit: 5, offset: 5 });
// Filter on an id less than a given UUID
user1.get({ limit: 5, id_lt: 'e561de8f-00f1-11e4-b400-0cc47a024be0' });

// All API calls are performed asynchronous and return a Promise object
user1
  .get({ limit: 5, id_lt: 'e561de8f-00f1-11e4-b400-0cc47a024be0' })
  .then(function (body) {
    /* on success */
  })
  .catch(function (reason) {
    /* on failure, reason.error contains an explanation */
  });

// Create a new activity
activity = { actor: 1, verb: 'tweet', object: 1, foreign_id: 'tweet:1' };
user1.addActivity(activity);
// Create a bit more complex activity
activity = {
  actor: 1,
  verb: 'run',
  object: 1,
  foreign_id: 'run:1',
  course: { name: 'Golden Gate park', distance: 10 },
  participants: ['Thierry', 'Tommaso'],
  started_at: new Date(),
};
user1.addActivity(activity);

// Remove an activity by its id
user1.removeActivity('e561de8f-00f1-11e4-b400-0cc47a024be0');
// or remove by the foreign id
user1.removeActivity({ foreign_id: 'tweet:1' });

// mark a notification feed as read
notification1 = client.feed('notification', '1');
params = { mark_read: true };
notification1.get(params);

// mark a notification feed as seen
params = { mark_seen: true };
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
user1.followers({ limit: '10', offset: '10' });
user1.following({ limit: '10', offset: '0' });

user1.follow('flat', '42');

// adding multiple activities
activities = [
  { actor: 1, verb: 'tweet', object: 1 },
  { actor: 2, verb: 'tweet', object: 3 },
];
user1.addActivities(activities);

// specifying additional feeds to push the activity to using the to param
// especially useful for notification style feeds
to = ['user:2', 'user:3'];
activity = {
  to: to,
  actor: 1,
  verb: 'tweet',
  object: 1,
  foreign_id: 'tweet:1',
};
user1.addActivity(activity);

// adding one activity to multiple feeds
feeds = ['flat:1', 'flat:2', 'flat:3', 'flat:4'];
activity = {
  actor: 'User:2',
  verb: 'pin',
  object: 'Place:42',
  target: 'Board:1',
};

// ⚠️ server-side only!
client.addToMany(activity, feeds);

// Batch create follow relations (let flat:1 follow user:1, user:2 and user:3 feeds in one single request)
follows = [
  { source: 'flat:1', target: 'user:1' },
  { source: 'flat:1', target: 'user:2' },
  { source: 'flat:1', target: 'user:3' },
];

// ⚠️ server-side only!
client.followMany(follows);

// Updating parts of an activity
set = {
  'product.price': 19.99,
  shares: {
    facebook: '...',
    twitter: '...',
  },
};
unset = ['daily_likes', 'popularity'];
// ...by ID
client.activityPartialUpdate({
  id: '54a60c1e-4ee3-494b-a1e3-50c06acb5ed4',
  set: set,
  unset: unset,
});
// ...or by combination of foreign ID and time
client.activityPartialUpdate({
  foreign_id: 'product:123',
  time: '2016-11-10T13:20:00.000000',
  set: set,
  unset: unset,
});

// ⚠️ server-side only!
// Create redirect urls
impression = {
  content_list: ['tweet:1', 'tweet:2', 'tweet:3'],
  user_data: 'tommaso',
  location: 'email',
  feed_id: 'user:global',
};
engagement = {
  content: 'tweet:2',
  label: 'click',
  position: 1,
  user_data: 'tommaso',
  location: 'email',
  feed_id: 'user:global',
};
events = [impression, engagement];
redirectUrl = client.createRedirectUrl('http://google.com', 'user_id', events);

// update the 'to' fields on an existing activity
// client.feed("user", "ken").function (foreign_id, timestamp, new_targets, added_targets, removed_targets)
// new_targets, added_targets, and removed_targets are all arrays of feed IDs
// either provide only the `new_targets` parameter (will replace all targets on the activity),
// OR provide the added_targets and removed_targets parameters
// NOTE - the updateActivityToTargets method is not intended to be used in a browser environment.
client.feed('user', 'ken').updateActivityToTargets('foreign_id:1234', timestamp, ['feed:1234']);
client.feed('user', 'ken').updateActivityToTargets('foreign_id:1234', timestamp, null, ['feed:1234']);
client.feed('user', 'ken').updateActivityToTargets('foreign_id:1234', timestamp, null, null, ['feed:1234']);
```

### Typescript

```ts
import { connect, EnrichedActivity, NotificationActivity } from getstream;

type User1Type = { name: string; username: string; image?: string };
type User2Type = { name: string; avatar?: string };
type ActivityType = { attachments: string[]; text: string };
type Collection1Type = { cid: string; rating?: number };
type Collection2Type = { branch: number; location: string };

type ReactionType = { text: string };
type ChildReactionType = { text?: string };

const client = connect<
  User1Type | User2Type,
  ActivityType,
  Collection1Type | Collection2Type,
  ReactionType,
  ChildReactionType
>('api_key', 'secret!', 'app_id');

// if you have different union types like "User1Type | User2Type" you can use type guards as follow:
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types
function isUser1Type(user: User1Type | User2Type): user is User1Type {
  return (user as User1Type).username !== undefined;
}

client
  .user('user_id')
  .get()
  .then((user) => {
    const { data, id } = user;
    if (isUser1Type(data)) return data.username;
    return id;
  });

// notification: StreamFeed<User1Type | User2Type, ActivityType, Collection1Type | Collection2Type, ReactionType, ChildReactionType>
const timeline = client.feed('timeline', 'feed_id');
timeline.get({ withOwnChildren: true, withOwnReactions: true }).then((response) => {
  // response: FeedAPIResponse<User1Type | User2Type, ActivityType, Collection1Type | Collection2Type, ReactionType, ChildReactionType>
  if (response.next !== '') return response.next;

  return (response.results as EnrichedActivity<User2Type, ActivityType>[]).map((activity) => {
    return activity.id + activity.text + (activity.actor as User2Type).name;
  });
});

// notification: StreamFeed<User1Type | User2Type, ActivityType, Collection1Type | Collection2Type, ReactionType, ChildReactionType>
const notification = client.feed('notification', 'feed_id');
notification.get({ mark_read: true, mark_seen: true }).then((response) => {
  // response: FeedAPIResponse<User1Type | User2Type, ActivityType, Collection1Type | Collection2Type, ReactionType, ChildReactionType>
  if (response.unread || response.unseen) return response.next;

  return (response.results as NotificationActivity<ActivityType>[]).map((activityGroup) => {
    const { activities, id, verb, activity_count, actor_count } = activityGroup;
    return activities[0].text + id + actor_count + activity_count + verb;
  });
});

client.collections.get('collection_1', 'taco').then((item: CollectionEntry<Collection1Type>) => {
  if (item.data.rating) return { [item.data.cid]: item.data.rating };
  return item.id;
});
```

### Realtime (Faye)

Stream uses [Faye](http://faye.jcoglan.com/browser.html) for realtime notifications. Below is quick guide to subscribing to feed changes

```js
const { connect } = require('getstream');

// ⚠️ userToken is generated server-side (see previous section)
const client = connect('YOUR_API_KEY', userToken, 'APP_ID');
const user1 = client.feed('user', '1');

// subscribe to the changes
const subscription = user1.subscribe(function (data) {
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

This API Client project requires Node.js v10 at a minimum.

The project is supported in line with the Node.js Foundation Release Working Group.

See the [github action configuration](.github/workflows/ci.yml) for details of how it is built, tested and packaged.

## Contributing

See extensive at [test documentation](test/README.md) for your changes.

You can find generic API documentation enriched by code snippets from this package at http://getstream.io/docs/?language=js

### Copyright and License Information

Project is licensed under the [BSD 3-Clause](LICENSE).

## We are hiring!

We've recently closed a [$38 million Series B funding round](https://techcrunch.com/2021/03/04/stream-raises-38m-as-its-chat-and-activity-feed-apis-power-communications-for-1b-users/) and we keep actively growing.
Our APIs are used by more than a billion end-users, and you'll have a chance to make a huge impact on the product within a team of the strongest engineers all over the world.

Check out our current openings and apply via [Stream's website](https://getstream.io/team/#jobs).
