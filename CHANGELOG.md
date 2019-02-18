# Changelog

## 4.2.1 - 2019-02-18

:by: Jelte Fennema

- Add support for the `expireTokens` option of the client to `createUserToken`

## 4.2.0 - 2019-02-12

:by: Mircea Cosbuc

- Add support for batch activity partial update

## 4.1.0 - 2019-01-09

:by: Jelte Fennema

- Add support for enriched `getActivities`
- Improve file error handling

## 4.0.9 - 2018-12-17

:by: Jelte Fennema

### Fixed

- Allow using `getActivities` with user token authentication

## 4.0.8 - 2018-12-17

:by: Jelte Fennema

Use forked cross-fetch for better react native support

## 4.0.7 - 2018-12-10

:by: Jelte Fennema

Update some dependencies that had vulnerabilities. `npm audit` is now clean.

## 4.0.6 - 2018-12-11

:by: Tommaso Barbugli

Fix a bad release with a big file in the publish on npm

## 4.0.5 - 2018-12-10

:by: Tommaso Barbugli

Bugfix release: follow/unfollow stopped working server-side due to bad JWT generation code

## 4.0.4 - 2018-12-10

:by: Tommaso Barbugli

Bugfix release: follow/unfollow stopped working server-side due to bad JWT generation code

## 4.0.0 - 2018-12-03

:by: Jelte Fennema

This release merges frontend and backend usage of the client for a much better experience. To do this it has same breaking changes

### BREAKING CHANGES

- Remove `createUserSession`. This is replaced by using the user token as the
  second argument to `stream.connect`, i.e. `stream.connect(apiKey, userToken, appId)`. All calls you did on the user session can now be done the same way on the client (except for the things mentioned below).
- Change `userSession.collection(collectionName).add(id, data)` to
  `client.collections.add(collectionName, id, data)`. The same is done for `update`, `delete`, `get`
- Rename `client.collections.delete` to `client.collections.delete_many`
- `session.react` was removed in favor of `client.reactions.add`
- `session.followUser` was removed in favor of using `client.follow`
- the arguments for `session.reactions.add` have slightly changed

```
// old
session.reactions.add(kind, activity, {data, targetFeeds})
// new
client.reactions.add(kind, activity, data, {targetFeeds})
```

- `session.user` is replaced with `client.currentUser`
- `session.getUser(id)` is replaced with `client.user(id)`
- Remove `client.collections.createReference(collection, entryId)` with `client.collections.entry(collection, itemId)`
- Remove `client.collections.createUserReference(userId)` with `client.user(userId)`

### New features

- `client.reactions.addChild()` was added to create reactions to reactions
- responses from user(id).get/add/update and collections.get/add/update apis
  can now be used directly in an activity and will be replaced by a reference automatically

## 3.23.1 - 2018-11-20

:by: Jelte Fennema

- Support Node 11.x

## 3.23.0 - 2018-10-29

:by: Jelte Fennema

- Add support for filtering reactions

## 3.22.0 - 2018-10-17

:by: Jelte Fennema

- Add support for reading reactions by ID
- Make collections an alias for the storage API, to make naming consistent

## 3.21.0 - 2018-09-17

:by: Jelte Fennema

- Support for a new set of frontend API's

## 3.20.0 - 2018-07-17

:by: Jelte Fennema

A beta release was released by accident on the "latest" npm tag. This release
is effectively undoes that by creating a newer version.

- Support for partial activity update
- Support creating a client without a secret on the nodejs again.

## 3.19.0 - 2018-07-17

:by: Tommaso Barbugli

Added get activities endpoint support

## 3.18.0 - 2018-06-26

:by: Thierry Schellenbach

Update dependencies
Update build to Webpack 4

## 3.17.0 - 2018-05-22

:by: Tommaso Barbugli

- Node 10 support

## 3.15.0 - 2018-04-11

:by: Tommaso Barbugli

- Make sure KeepAlive is used server-side

## 3.14.0 - 2018-04-06

:by: Tommaso Barbugli

- Accept gzip encoded responses

## 3.13.0 - 2018-03-15

:by: Dwight Gunning (@dwightgunning)

- Fixes break on babel transpilation introduced in 3.12.3 (#145)
- Fixes regex checks on Feed Ids and User Ids and clarifies error messages
- Updates downstream dependencies
- Fixes and enhancements to TypeScript type definitions (#139)
- Advances package 'engines' advisory to cover Node.js v9.0

## 3.12.3 - 2018-01-31

:by: Ken Hoff (@kenhoff)

- Fixed incorrect TypeScript type definition on Feed.subscribe()

## 3.12.2 - 2018-01-29

:by: Ken Hoff (@kenhoff)

- Further improvements to custom Error messages

## 3.12.1 - 2018-01-25

:by: Ken Hoff (@kenhoff)

- Improvements to custom Error messages

## 3.12.0 - 2018-01-24

:by: Ken Hoff (@kenhoff)

- Fixes for Node 4 compatibility
- Corrects error/validation message on user id regex check
- Clarifications to documention

## 3.10.0 - 2017-12-06

:by: Ken Hoff (@kenhoff)

- Adds an updateActivityToTargets method - updates the `to` field on activities.

## 3.9.0 - 2017-11-01

:by: Thierry Schellenbach (@tschellenbach)

- Conveniently expose the sigining library for people using custom endpoints

## 3.8.0 - 2017-10-30

:by: Ken Hoff (@kenhoff)

- Add missing StreamApiError prototype (via PR #121 and Issue #119)
- Updated dtslint to ^0.2.0

## 3.7.0 - 2017-10-30

:by: Tommaso Barbugli

- API endpoint domain switched from 'getstream.io' to 'stream-io-api.com'
- API call functions now error with a StreamAPIError

## 3.6.0 - 2017-09-05

:by: Tommaso Barbugli

- Add type definitions
- Enforce withCredentials to false (Browser only)

## 3.4.0 - 2016-06-28

:by: Matthisk Heimensen

- add getReadOnlyToken and getReadWriteToken method to feed instances
- Update Faye to 1.2.0

## 3.3.0 - 2016-06-27

:by: Tommaso Barbugli

- Pin down all dependencies

## 3.2.0 - 2016-03-30

:by: Tommaso Barbugli

- Added support for keep_history parameter on unfollow

## 3.1.2 - 2016-03-01

:by: Matthisk Heimensen

- Stream-JS is now compatible with React-Native
- dependency browser-request fork changed to xmlhttp-request hosted on npm

## 3.1.1 - 2016-02-29

:by: Matthisk Heimensen

- Stream-JS is now compatible with React-Native
- dependency browser-request updated to 0.3.4

## 3.1.0 - 2016-02-22

:by: Matthisk Heimensen

- Added support for update_activity API
- Added support for activity_copy_limit to limit the amount of activities copied by client.followMany
- dependency request updated to 2.67.0
- dependency qs updated to 6.0.1
- dependency faye updated to 1.1.2

## 3.0.0 - 2015-10-28

:by: Matthisk Heimensen

- Breaking change: Functions performing an XHR Request no longer return the request object, instead they return a Promise
- Added support for add_to_many api call (i.e. client.addToMany) to add one activity to many feeds
- Added support for follow_many api call (i.e. client.followMany) to create multiple follow relations in one request
- Added support to create a redirect url (i.e. client.createRedirectUrl) to track events via stream's analytics platform
- Added support for follow_copy_limit API parameter on follow.
- Added option to enable JWT token expiration (default behavior is no expiration) through option: { expireTokens: true }
- Removed Buffer as a dependency of lib/signing.js to reduce distributable size for the browser. Instead use Base64 lib for
  base64 encoding.
- Generated API documentation in /docs
- Enforce code style through jscs and jshint during the build (i.e. gulp lint)

## 2.1.0 - 2014-12-19

:by: Thierry Schellenbach

- Added location support to reduce latency
- Heroku location support

## 2.0.5 - 2014-11-25

:by: Thierry Schellenbach

- Allow "-" in feed id for compatibility with mongo ids

## 2.0.4 - 2014-11-18

:by: Thierry Schellenbach

- Added validation on feed slug and user id

## 2.0.0 - 2014-11-10

:by: Thierry Schellenbach

- Breaking change: New style feed syntax, client.feed('user', '1') instead of client.feed('user:3')
- Breaking change: New style follow syntax, feed.follow('user', 3)
- API versioning support
- Cleanup of API client codebase and naming

## 1.0.6 - 2014-09-16

:by: Thierry Schellenbach

- Bugfix for filtering support

## 1.0.5 - 2014-09-15

:by: Thierry Schellenbach

- Added user agent for getstream.io analytics
- Added support for filtering followers and following by providing the feeds argument

## 1.0.4 - 2014-09-12

:by: Thierry Schellenbach

- Added support for attaching global handlers via client.on('request', callback)
- Add support for mark read and mark seen (notifications feeds)
