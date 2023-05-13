# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [8.1.4](https://github.com/GetStream/stream-js/compare/v8.1.3...v8.1.4) (2023-05-13)

### [8.1.3](https://github.com/GetStream/stream-js/compare/v8.1.2...v8.1.3) (2023-05-12)

### [8.1.2](https://github.com/GetStream/stream-js/compare/v8.1.1...v8.1.2) (2023-02-15)


### Bug Fixes

* **utils:** failing TS check  ([#537](https://github.com/GetStream/stream-js/issues/537)) ([bb21585](https://github.com/GetStream/stream-js/commit/bb2158506e56b049407d123505e581b72b9b0ded))

### [8.1.1](https://github.com/GetStream/stream-js/compare/v8.1.0...v8.1.1) (2023-02-14)

### Chore

- Bump JWT [#533](https://github.com/GetStream/stream-js/pull/533) ([e5aa262](https://github.com/GetStream/stream-js/commit/e5aa2623bf250a57255d6dfa5d110e078c03194e))

### [8.1.0](https://github.com/GetStream/stream-js/compare/v8.0.3...v8.1.0) (2022-09-13)

### Features

- add many version of activity to target update ([#523](https://github.com/GetStream/stream-js/pull/523)) ([4edfa65](https://github.com/GetStream/stream-js/commit/4edfa65cfe7f1ba72d0b6c73e74fa7d19f891c9e))
  - this API is async and can change without notice

### [8.0.3](https://github.com/GetStream/stream-js/compare/v8.0.2...v8.0.3) (2022-08-22)

### Bug Fixes

- upgrade follow-redirects for security ([#520](https://github.com/GetStream/stream-js/pull/520)) ([071483e](https://github.com/GetStream/stream-js/commit/071483ecd7c87c0e6b4a2bd78a8e8be5976f8fc0))

### [8.0.2](https://github.com/GetStream/stream-js/compare/v8.0.1...v8.0.2) (2022-08-01)

### Bug Fixes

- handle api secret and its warning in browser ([#517](https://github.com/GetStream/stream-js/issues/517)) ([e973fe5](https://github.com/GetStream/stream-js/commit/e973fe5d317d8f0b199356728bef7ab97447eac6))

### [8.0.1](https://github.com/GetStream/stream-js/compare/v8.0.0...v8.0.1) (2022-04-29)

### Features

- general maintenance of ci/cd ([#504](https://github.com/GetStream/stream-js/issues/504)) ([f35b66d](https://github.com/GetStream/stream-js/commit/f35b66da64396f0cfaecafe2d10ebd212ad962c3))

### Bug Fixes

- release scripts ([#508](https://github.com/GetStream/stream-js/issues/508)) ([a040f28](https://github.com/GetStream/stream-js/commit/a040f282d77345a40fa34abbd5d0be258d060767))

## [8.0.0](https://github.com/GetStream/stream-js/releases/tag/v8.0.0) - 2021-02-11

- Refactor generics into a single one [#490](https://github.com/GetStream/stream-js/pull/490)
- Security package upgrades [#498](https://github.com/GetStream/stream-js/pull/498)

## [7.4.1](https://github.com/GetStream/stream-js/releases/tag/v7.4.1) - 2021-12-21

### Fix

- Correct types of collections in upsert request and response [#487](https://github.com/GetStream/stream-js/pull/487)

## [7.4.0](https://github.com/GetStream/stream-js/releases/tag/v7.4.0) - 2021-12-15

### Feature

- Add target feeds into reaction responses [#480](https://github.com/GetStream/stream-js/pull/480)
- Add support for multiple collection upsert in a single call [#486](https://github.com/GetStream/stream-js/pull/486)

### Fix

- Correct type for latest children in enriched reaction [#483](https://github.com/GetStream/stream-js/pull/483)

### Chore

- Bump axios for security related [#484](https://github.com/GetStream/stream-js/pull/484)

## [7.3.1](https://github.com/GetStream/stream-js/releases/tag/v7.3.1) - 2021-10-26

### Fix

- Add optional user_id param for GetFeedOptions [#478](https://github.com/GetStream/stream-js/pull/478)

## [7.3.0](https://github.com/GetStream/stream-js/releases/tag/v7.3.0) - 2021-10-19

### Feature

- Reaction filter supports own children [#475](https://github.com/GetStream/stream-js/pull/475)

### Chore

- Drop refresh endpoints [#471](https://github.com/GetStream/stream-js/pull/471)

## [7.2.11](https://github.com/GetStream/stream-js/releases/tag/v7.2.11) - 2021-09-14

### Fix

- EnrichedActivity type generic issue [#468](https://github.com/GetStream/stream-js/pull/468)

## [7.2.10](https://github.com/GetStream/stream-js/releases/tag/v7.2.10) - 2021-06-10

### Fix

- RealTimeMessage type [#459](https://github.com/GetStream/stream-js/pull/459)

## [7.2.9](https://github.com/GetStream/stream-js/releases/tag/v7.2.9) - 2021-05-05

### Fix

- Standardize 'foregin_id' field [#450](https://github.com/GetStream/stream-js/pull/450)
- BaseActivity 'actor' type [#449](https://github.com/GetStream/stream-js/pull/449)

### Chore

- Support Node 16x [#447](https://github.com/GetStream/stream-js/pull/447)

## [7.2.8](https://github.com/GetStream/stream-js/releases/tag/v7.2.8) - 2021-04-22

### Fix

- Revert to 7.2.6 [#446](https://github.com/GetStream/stream-js/pull/446)

## [7.2.7](https://github.com/GetStream/stream-js/releases/tag/v7.2.8) - 2021-04-22

### Fix

- Use cached token for feed follow stats [#445](https://github.com/GetStream/stream-js/pull/445)

## [7.2.6](https://github.com/GetStream/stream-js/releases/tag/v7.2.6) - 2021-04-20

### Fix

- Fix enriched reaction user type [#443](https://github.com/GetStream/stream-js/pull/443)
- Drop codecov [#439](https://github.com/GetStream/stream-js/pull/439)

## [7.2.5](https://github.com/GetStream/stream-js/releases/tag/v7.2.5) - 2021-02-19

### Fix

- Handle custom token for follow stats [#438](https://github.com/GetStream/stream-js/pull/438)

## [7.2.4](https://github.com/GetStream/stream-js/releases/tag/v7.2.4) - 2021-02-19

### Fix

- Fix Realtime callback type [#437](https://github.com/GetStream/stream-js/pull/437)

## [7.2.3](https://github.com/GetStream/stream-js/releases/tag/v7.2.3) - 2021-02-16

### Fix

- EnrichedUser type [#435](https://github.com/GetStream/stream-js/pull/435)

## [7.2.2](https://github.com/GetStream/stream-js/releases/tag/v7.2.2) - 2021-02-15

### Fix

- Typescripting Faye realtime messages [#432](https://github.com/GetStream/stream-js/pull/432) [#431](https://github.com/GetStream/stream-js/pull/431)

### Chore

- Update jsdoc inline links [#425](https://github.com/GetStream/stream-js/pull/425)
- Upgrade dependencies [#428](https://github.com/GetStream/stream-js/pull/428)

## [7.2.1](https://github.com/GetStream/stream-js/releases/tag/v7.2.1) - 2021-01-29

### Fix

- Add `type` attribute to file upload form data [#417](https://github.com/GetStream/stream-js/pull/417)

## [7.2.0](https://github.com/GetStream/stream-js/releases/tag/v7.2.0) - 2021-01-21

- Add JWT support for multi action, resource and feed id [#415](https://github.com/GetStream/stream-js/pull/415)

## [7.1.3](https://github.com/GetStream/stream-js/releases/tag/v7.1.3) - 2021-01-21

- Add a note into readme about browser detection and option to skip [#414](https://github.com/GetStream/stream-js/pull/414)

## [7.1.2](https://github.com/GetStream/stream-js/releases/tag/v7.1.2) - 2021-01-20

- Improve docs [#413](https://github.com/GetStream/stream-js/pull/413)

## [7.1.1](https://github.com/GetStream/stream-js/releases/tag/v7.1.1) - 2021-01-08

- Security upgrades [#405](https://github.com/GetStream/stream-js/pull/405)[#406](https://github.com/GetStream/stream-js/pull/406)[#408](https://github.com/GetStream/stream-js/pull/408)

## [7.1.0](https://github.com/GetStream/stream-js/releases/tag/v7.1.0) - 2020-12-10

- Add CDN url refresh handlers [#391](https://github.com/GetStream/stream-js/pull/391)
- Add keywords into package config for easier finding in npm [#402](https://github.com/GetStream/stream-js/pull/402)

## [7.0.1](https://github.com/GetStream/stream-js/releases/tag/v7.0.1) - 2020-12-04

### Fix

- Correct server side follow stat call permission [#401](https://github.com/GetStream/stream-js/pull/401)

## [7.0.0](https://github.com/GetStream/stream-js/releases/tag/v7.0.0) - 2020-11-24

### ⚠️ Breaking Changes

- Drop simple auth, only JWT is supported [#399](https://github.com/GetStream/stream-js/pull/399)

## [6.2.2](https://github.com/GetStream/stream-js/releases/tag/v6.2.2) - 2020-11-13

### Fix

- Correct type of own_reactions [#398](https://github.com/GetStream/stream-js/pull/398)

## [6.2.1](https://github.com/GetStream/stream-js/releases/tag/v6.2.1) - 2020-11-03

### Fix

- Browser file upload incorrect file name [#393](https://github.com/GetStream/stream-js/pull/393)

## [6.2.0](https://github.com/GetStream/stream-js/releases/tag/v6.2.0) - 2020-10-01

### Feature

- Buffer and other types of data streams are accepted for file and image uploads [#389](https://github.com/GetStream/stream-js/pull/389)

## [6.1.4](https://github.com/GetStream/stream-js/releases/tag/v6.1.4) - 2020-09-23

### Fixed

- Typescript compiler option `allowSyntheticDefaultImports` no longer needed ([#387](https://github.com/GetStream/stream-js/pull/387)).
- Undefined process error in some environments ([#388](https://github.com/GetStream/stream-js/pull/388)).

## [6.1.3](https://github.com/GetStream/stream-js/releases/tag/v6.1.3) - 2020-09-15

### Fixed

- Enrich option respects the enrich value if not undefined ([#382](https://github.com/GetStream/stream-js/pull/382)).

## [6.1.2](https://github.com/GetStream/stream-js/releases/tag/v6.1.2) - 2020-09-03

### Fixed

- Correct `AggregatedActivityEnriched` type ([#374](https://github.com/GetStream/stream-js/pull/374)).

- Add `maxBodyLength: Infinity` option to axios file upload requests ([#375](https://github.com/GetStream/stream-js/pull/375)).

### Chore

- Bump dependencies ([#375](https://github.com/GetStream/stream-js/pull/375)).

## [6.1.1](https://github.com/GetStream/stream-js/releases/tag/v6.1.1) - 2020-09-02

### Fixed

- Correct `CollectionResponse` type ([#372](https://github.com/GetStream/stream-js/pull/372)).

## [6.1.0](https://github.com/GetStream/stream-js/releases/tag/v6.1.0) - 2020-09-02

### Added

- Support follow counting ([#369](https://github.com/GetStream/stream-js/pull/369)). By default,
  only server side auth is allowed. Contact support to enable for client side auth support for specific feed groups.

## [6.0.0](https://github.com/GetStream/stream-js/releases/tag/6.0.0) - 2020-08-26

### ⚠️ Breaking Changes

- Default export `import stream from 'getstream'` or equally `const stream = require('getstream').default` is removed [#366](https://github.com/GetStream/stream-js/pull/366).

- `connect` export is removed: `import { connect } from 'getstream'` or `const {connect} = require('getstream')` [#366](https://github.com/GetStream/stream-js/pull/366).
- `Signing` export is removed: : `import { JWTUserSessionToken, JWTScopeToken } from 'getstream'` [#366](https://github.com/GetStream/stream-js/pull/366).
- `errors` export is removed: `import { FeedError, SiteError, StreamApiError } from 'getstream'` [#366](https://github.com/GetStream/stream-js/pull/366).
- `Client` export is removed and renamed to StreamClient: `import { StreamClient } from 'getstream'` [#366](https://github.com/GetStream/stream-js/pull/366).

- `reaction.all()` is removed in favor of `reaction.filter()` [#365](https://github.com/GetStream/stream-js/pull/365).

### 🔄 Changed

- Entire library is re-written in typescript [#356](https://github.com/GetStream/stream-js/pull/356).

## 5.0.5 - 2020-08-02

- re-release 5.0.2, 5.0.3, 5.0.4 to fix the bad build

## 5.0.4 - 2020-07-30

- Elliptic security upgrade

## 5.0.3 - 2020-07-30

- Fix undefined `process` in Angular

## 5.0.2 - 2020-07-20

- Lodash security upgrade

## 5.0.1 - 2020-07-13

- Add named exports in addition to default and deprecate default
- Improve readme snippets
- Add a warning for the version if installing from cdnjs

## 5.0.0 - 2020-07-06

This release drops some of the already deprecated functions.

### BREAKING CHANGES

- Drop support for Node v11
- Drop support for Node v13
- Drop callback support for all functions. This affects some of functions and requires the callbacks to be replaced with promise, e.g. `feed1.get({}, callback)` should change to `feed1.get({}).then().catch()`
- `Stream.request` is no longer exported
- `"request"` and `"response"` handler params are slightly different due to using Axios
- `client.images.thumbmail` renamed to `client.images.thumbnail`
- `StreamApiError.response.statusCode` is renamed to `StreamApiError.response.status`
- Drop `client.makeSignedRequest`. This function is removed due to being out of scope. Similar functionality can be reproduced by manually generating authorization token and adding it to the request header.
- Drop `client.createUserSessionToken` in favor of `client.createUserToken`
- Drop `collections._streamRef` in favor of `collections.ref`
- Drop `user._streamRef` in favor of `user.ref`
- Drop `feed.getReadOnlyToken` in favor of `client.getReadOnlyToken`
- Drop `feed.getReadWriteToken` in favor of `client.getReadWriteToken`
- `Feed(feedSlug: string, userId: string, token?: string)` instantiation with token as last parameter is deprecated. Token should be supplied by client like `stream.connect(apiKey, userToken, appId).feed(feedSlug: string, userId: string)`

### New features

- `onUploadProgress` callback for uploads.
- `options.timeout` is honored if given in client setup

## 4.5.4 - 2020-06-12

- GitHub Action
- More tests for types
- Format change in changelog
- Enable node 11

## 4.5.3 - 2020-05-28

- Add open graph scrape (og) types

## 4.5.2 - 2020-05-27

- Extend types for client variables, files and images

## 4.5.1 - 2020-03-30

- Move babel-runtime to dependencies

## 4.5.0 - 2020-03-30

- Use faye-us-east.stream-io-api.com for realtime updates

## 4.4.0 - 2019-12-30

- Update package.json engine to support Node 13

## 4.3.0 - 2019-10-29

- Make personalization token an option
- Improve Typescript types manifest

## 4.2.1 - 2019-02-18

- Add support for the `expireTokens` option of the client to `createUserToken`

## 4.2.0 - 2019-02-12

- Add support for batch activity partial update

## 4.1.0 - 2019-01-09

- Add support for enriched `getActivities`
- Improve file error handling

## 4.0.9 - 2018-12-17

### Fixed

- Allow using `getActivities` with user token authentication

## 4.0.8 - 2018-12-17

Use forked cross-fetch for better react native support

## 4.0.7 - 2018-12-10

Update some dependencies that had vulnerabilities. `npm audit` is now clean.

## 4.0.6 - 2018-12-11

Fix a bad release with a big file in the publish on npm

## 4.0.5 - 2018-12-10

Bugfix release: follow/unfollow stopped working server-side due to bad JWT generation code

## 4.0.4 - 2018-12-10

Bugfix release: follow/unfollow stopped working server-side due to bad JWT generation code

## 4.0.0 - 2018-12-03

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

- Support Node 11.x

## 3.23.0 - 2018-10-29

- Add support for filtering reactions

## 3.22.0 - 2018-10-17

- Add support for reading reactions by ID
- Make collections an alias for the storage API, to make naming consistent

## 3.21.0 - 2018-09-17

- Support for a new set of frontend API's

## 3.20.0 - 2018-07-17

A beta release was released by accident on the "latest" npm tag. This release
is effectively undoes that by creating a newer version.

- Support for partial activity update
- Support creating a client without a secret on the nodejs again.

## 3.19.0 - 2018-07-17

Added get activities endpoint support

## 3.18.0 - 2018-06-26

Update dependencies
Update build to Webpack 4

## 3.17.0 - 2018-05-22

- Node 10 support

## 3.15.0 - 2018-04-11

- Make sure KeepAlive is used server-side

## 3.14.0 - 2018-04-06

- Accept gzip encoded responses

## 3.13.0 - 2018-03-15

- Fixes break on babel transpilation introduced in 3.12.3 (#145)
- Fixes regex checks on Feed Ids and User Ids and clarifies error messages
- Updates downstream dependencies
- Fixes and enhancements to TypeScript type definitions (#139)
- Advances package 'engines' advisory to cover Node.js v9.0

## 3.12.3 - 2018-01-31

- Fixed incorrect TypeScript type definition on Feed.subscribe()

## 3.12.2 - 2018-01-29

- Further improvements to custom Error messages

## 3.12.1 - 2018-01-25

- Improvements to custom Error messages

## 3.12.0 - 2018-01-24

- Fixes for Node 4 compatibility
- Corrects error/validation message on user id regex check
- Clarifications to documentation

## 3.10.0 - 2017-12-06

- Adds an updateActivityToTargets method - updates the `to` field on activities.

## 3.9.0 - 2017-11-01

- Conveniently expose the signing library for people using custom endpoints

## 3.8.0 - 2017-10-30

- Add missing StreamApiError prototype (via PR #121 and Issue #119)
- Updated dtslint to ^0.2.0

## 3.7.0 - 2017-10-30

- API endpoint domain switched from 'getstream.io' to 'stream-io-api.com'
- API call functions now error with a StreamAPIError

## 3.6.0 - 2017-09-05

- Add type definitions
- Enforce withCredentials to false (Browser only)

## 3.4.0 - 2016-06-28

- add getReadOnlyToken and getReadWriteToken method to feed instances
- Update Faye to 1.2.0

## 3.3.0 - 2016-06-27

- Pin down all dependencies

## 3.2.0 - 2016-03-30

- Added support for keep_history parameter on unfollow

## 3.1.2 - 2016-03-01

- Stream-JS is now compatible with React-Native
- dependency browser-request fork changed to xmlhttp-request hosted on npm

## 3.1.1 - 2016-02-29

- Stream-JS is now compatible with React-Native
- dependency browser-request updated to 0.3.4

## 3.1.0 - 2016-02-22

- Added support for update_activity API
- Added support for activity_copy_limit to limit the amount of activities copied by client.followMany
- dependency request updated to 2.67.0
- dependency qs updated to 6.0.1
- dependency faye updated to 1.1.2

## 3.0.0 - 2015-10-28

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

- Added location support to reduce latency
- Heroku location support

## 2.0.5 - 2014-11-25

- Allow "-" in feed id for compatibility with mongo ids

## 2.0.4 - 2014-11-18

- Added validation on feed slug and user id

## 2.0.0 - 2014-11-10

- Breaking change: New style feed syntax, client.feed('user', '1') instead of client.feed('user:3')
- Breaking change: New style follow syntax, feed.follow('user', 3)
- API versioning support
- Cleanup of API client codebase and naming

## 1.0.6 - 2014-09-16

- Bugfix for filtering support

## 1.0.5 - 2014-09-15

- Added user agent for getstream.io analytics
- Added support for filtering followers and following by providing the feeds argument

## 1.0.4 - 2014-09-12

- Added support for attaching global handlers via client.on('request', callback)
- Add support for mark read and mark seen (notifications feeds)
