var errors = module.exports;

function addStack(err) {
  /* istanbul ignore else */
  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(err, constructor);
  } else if (!!(new Error()).stack) {
    err.stack = (new Error()).stack;
  } else {
    err.stack = '';
  }
}

/**
 * FeedError
 * @class FeedError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param {String} [msg] - An error message that will probably end up in a log.
 */
errors.FeedError = function FeedError(msg) {
  var instance = new Error(msg);
  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  addStack(this);
  return instance;
}
errors.FeedError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
if (Object.setPrototypeOf){
    Object.setPrototypeOf(errors.FeedError, Error);
} else {
    errors.FeedError.__proto__ = Error;
}

/**
 * SiteError
 * @class SiteError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param  {string}  [msg]  An error message that will probably end up in a log.
 */
errors.SiteError = function SiteError(msg) {
  var instance = new Error(msg);
  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  addStack(this);
  return instance;
}
errors.SiteError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
if (Object.setPrototypeOf){
    Object.setPrototypeOf(errors.SiteError, Error);
} else {
    errors.SiteError.__proto__ = Error;
}

/**
 * MissingSchemaError
 * @method MissingSchemaError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param  {string} msg
 */
errors.MissingSchemaError = function (msg) {
  var instance = new Error(msg);
  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  addStack(this);
  return instance;
}
errors.MissingSchemaError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
if (Object.setPrototypeOf){
    Object.setPrototypeOf(errors.MissingSchemaError, Error);
} else {
    errors.MissingSchemaError.__proto__ = Error;
}

/**
 * StreamApiError
 * @method StreamApiError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param  {string} msg
 * @param  {object} data
 * @param  {object} response
 */
errors.StreamApiError = function StreamApiError(msg, data, response) {
  var instance = new Error(msg, data, response);
  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  addStack(this);
  return instance;
}
errors.StreamApiError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
if (Object.setPrototypeOf){
    Object.setPrototypeOf(errors.StreamApiError, Error);
} else {
    errors.StreamApiError.__proto__ = Error;
}
