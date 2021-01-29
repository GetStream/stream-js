import FormData from 'form-data';

import { FeedError } from './errors';

const validFeedSlugRe = /^[\w]+$/;
const validUserIdRe = /^[\w-]+$/;

/*
 * Validate that the feedSlug matches \w
 */
function validateFeedSlug(feedSlug: string) {
  if (!validFeedSlugRe.test(feedSlug)) {
    throw new FeedError(`Invalid feedSlug, please use letters, numbers or _: ${feedSlug}`);
  }

  return feedSlug;
}

/*
 * Validate the userId matches \w
 */
function validateUserId(userId: string) {
  if (!validUserIdRe.test(userId)) {
    throw new FeedError(`Invalid userId, please use letters, numbers, - or _: ${userId}`);
  }

  return userId;
}

function rfc3986(str: string) {
  return str.replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function isReadableStream(obj: unknown): obj is NodeJS.ReadStream {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    ((obj as NodeJS.ReadStream).readable || typeof (obj as NodeJS.ReadStream)._read === 'function')
  );
}

function isBuffer(obj: unknown): obj is Buffer {
  return (
    obj != null &&
    (obj as Buffer).constructor != null &&
    // @ts-expect-error
    typeof obj.constructor.isBuffer === 'function' &&
    // @ts-expect-error
    obj.constructor.isBuffer(obj)
  );
}

function isFileWebAPI(uri: unknown): uri is File {
  return typeof window !== 'undefined' && 'File' in window && uri instanceof File;
}

/*
 * Validate that the feedId matches the spec user:1
 */
function validateFeedId(feedId: string) {
  const parts = feedId.split(':');
  if (parts.length !== 2) {
    throw new FeedError(`Invalid feedId, expected something like user:1 got ${feedId}`);
  }

  const [feedSlug, userId] = parts;
  validateFeedSlug(feedSlug);
  validateUserId(userId);
  return feedId;
}

function addFileToFormData(uri: string | File | Buffer | NodeJS.ReadStream, name?: string, contentType?: string) {
  const data = new FormData();

  if (isReadableStream(uri) || isBuffer(uri) || isFileWebAPI(uri)) {
    if (name) data.append('file', uri, name);
    else data.append('file', uri);
  } else {
    data.append('file', {
      uri,
      name: name || (uri as string).split('/').reverse()[0],
      type: contentType || undefined,
      contentType: contentType || undefined,
    });
  }

  return data;
}

// TODO: refactor and add proper types
function replaceStreamObjects<T, V>(obj: T): V {
  // @ts-expect-error
  if (Array.isArray(obj)) return obj.map((v) => replaceStreamObjects(v));

  // @ts-expect-error
  if (Object.prototype.toString.call(obj) !== '[object Object]') return obj;

  // @ts-expect-error
  if (typeof obj.ref === 'function') return obj.ref();

  const cloned = {};
  Object.keys(obj).forEach((k) => {
    // @ts-expect-error
    cloned[k] = replaceStreamObjects(obj[k]);
  });

  // @ts-expect-error
  return cloned;
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
