import errors from './errors';

const validFeedSlugRe = /^[\w]+$/;
const validUserIdRe = /^[\w-]+$/;

function validateFeedId(feedId) {
  /*
   * Validate that the feedId matches the spec user:1
   */
  const parts = feedId.split(':');
  if (parts.length !== 2) {
    throw new errors.FeedError(`Invalid feedId, expected something like user:1 got ${feedId}`);
  }

  const [feedSlug, userId] = parts;
  validateFeedSlug(feedSlug);
  validateUserId(userId);
  return feedId;
}

function validateFeedSlug(feedSlug) {
  /*
   * Validate that the feedSlug matches \w
   */
  const valid = validFeedSlugRe.test(feedSlug);
  if (!valid) {
    throw new errors.FeedError(`Invalid feedSlug, please use letters, numbers or _: ${feedSlug}`);
  }

  return feedSlug;
}

function validateUserId(userId) {
  /*
   * Validate the userId matches \w
   */
  const valid = validUserIdRe.test(userId);
  if (!valid) {
    throw new errors.FeedError(`Invalid userId, please use letters, numbers, - or _: ${userId}`);
  }

  return userId;
}

function rfc3986(str) {
  return str.replace(/[!'()*]/g, function (c) {
    return `%${c.charCodeAt(0).toString(16).toUpperCase()}`;
  });
}

function isReadableStream(obj) {
  return typeof obj === 'object' && typeof (obj._read === 'function') && typeof (obj._readableState === 'object');
}

export default {
  validateFeedId,
  validateFeedSlug,
  validateUserId,
  rfc3986,
  isReadableStream,
};
