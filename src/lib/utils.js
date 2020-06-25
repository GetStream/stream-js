import FormData from 'form-data';

import errors from './errors';

const validFeedSlugRe = /^[\w]+$/;
const validUserIdRe = /^[\w-]+$/;

function validateFeedSlug(feedSlug) {
  /*
   * Validate that the feedSlug matches \w
   */
  if (!validFeedSlugRe.test(feedSlug)) {
    throw new errors.FeedError(`Invalid feedSlug, please use letters, numbers or _: ${feedSlug}`);
  }

  return feedSlug;
}

function validateUserId(userId) {
  /*
   * Validate the userId matches \w
   */
  if (!validUserIdRe.test(userId)) {
    throw new errors.FeedError(`Invalid userId, please use letters, numbers, - or _: ${userId}`);
  }

  return userId;
}

function rfc3986(str) {
  return str.replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function isReadableStream(obj) {
  return typeof obj === 'object' && typeof obj._read === 'function' && typeof obj._readableState === 'object';
}

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

function addFileToFormData(uri, name, contentType) {
  const data = new FormData();

  let fileField;
  if (isReadableStream(uri) || (uri && uri.toString && uri.toString() === '[object File]')) {
    fileField = uri;
  } else {
    fileField = { uri, name: name || uri.split('/').reverse()[0] };
    if (contentType != null) fileField.type = contentType;
  }

  data.append('file', fileField);
  return data;
}

function replaceStreamObjects(obj) {
  if (Array.isArray(obj)) return obj.map((v) => replaceStreamObjects(v));
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    const cloned = {};
    Object.keys(obj).forEach((k) => {
      cloned[k] = replaceStreamObjects(obj[k]);
    });
    return cloned;
  }
  if (typeof obj === 'object' && typeof obj.ref === 'function') return obj.ref();
  return obj;
}

export default {
  validateFeedId,
  validateFeedSlug,
  validateUserId,
  rfc3986,
  isReadableStream,
  addFileToFormData,
  replaceStreamObjects,
};
