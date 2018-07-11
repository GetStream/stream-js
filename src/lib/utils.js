var errors = require('./errors');
var validFeedSlugRe = /^[\w]+$/;
var validUserIdRe = /^[\w-]+$/;

function validateFeedId(feedId) {
  /*
  	 * Validate that the feedId matches the spec user:1
  	 */
  var parts = feedId.split(':');
  if (parts.length !== 2) {
    throw new errors.FeedError(
      'Invalid feedId, expected something like user:1 got ' + feedId
    );
  }

  var feedSlug = parts[0];
  var userId = parts[1];
  validateFeedSlug(feedSlug);
  validateUserId(userId);
  return feedId;
}

exports.validateFeedId = validateFeedId;

function validateFeedSlug(feedSlug) {
  /*
  	 * Validate that the feedSlug matches \w
  	 */
  var valid = validFeedSlugRe.test(feedSlug);
  if (!valid) {
    throw new errors.FeedError(
      'Invalid feedSlug, please use letters, numbers or _: ' + feedSlug
    );
  }

  return feedSlug;
}

exports.validateFeedSlug = validateFeedSlug;

function validateUserId(userId) {
  /*
  	 * Validate the userId matches \w
  	 */
  var valid = validUserIdRe.test(userId);
  if (!valid) {
    throw new errors.FeedError(
      'Invalid userId, please use letters, numbers, - or _: ' + userId
    );
  }

  return userId;
}

exports.validateUserId = validateUserId;

function rfc3986(str) {
  return str.replace(/[!'()*]/g, function(c) {
    return (
      '%' +
      c
        .charCodeAt(0)
        .toString(16)
        .toUpperCase()
    );
  });
}

exports.rfc3986 = rfc3986;
