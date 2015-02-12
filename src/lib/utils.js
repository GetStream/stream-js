var errors = require('./errors');
var validRe = /^[\w-]+$/;


function validateFeedId(feedId) {
	/*
	 * Validate that the feedId matches the spec user:1
	 */
	var parts = feedId.split(':');
	if (parts.length != 2) {
        throw new errors.FeedError('Invalid feedId, expected something like user:1 got ' + feedId);
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
	var valid = validRe.test(feedSlug);
	if (!valid) {
        throw new errors.FeedError('Invalid feedSlug, please use letters, numbers or _ got: ' + feedSlug);
	}
	return feedSlug;
}
exports.validateFeedSlug = validateFeedSlug;


function validateUserId(userId) {
	/*
	 * Validate the userId matches \w
	 */
	var valid = validRe.test(userId);
	if (!valid) {
        throw new errors.FeedError('Invalid feedSlug, please use letters, numbers or _ got: ' + userId);
	}
	return userId;	
}
exports.validateUserId = validateUserId;

