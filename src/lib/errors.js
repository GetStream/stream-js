var errors = module.exports;

var canCapture = (typeof Error.captureStackTrace === 'function');
var canStack = !!(new Error()).stack;

/**
 * Abstract error object
 * @class ErrorAbstract
 * @access private
 * @param  {string}      [msg]         Error message
 * @param  {function}    constructor
 */
function ErrorAbstract(msg, constructor) {
  this.message = msg;

  Error.call(this, this.message);

  if (canCapture) {
    Error.captureStackTrace(this, constructor);
  } else if (canStack) {
    this.stack = (new Error()).stack;
  } else {
    this.stack = '';
  }
}

errors._Abstract = ErrorAbstract;
ErrorAbstract.prototype = new Error();

/**
 * FeedError
 * @class FeedError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param {String} [msg] - An error message that will probably end up in a log.
 */
errors.FeedError = function FeedError(msg) {
  ErrorAbstract.call(this, msg);
};

errors.FeedError.prototype = new ErrorAbstract();

/**
 * SiteError
 * @class SiteError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param  {string}  [msg]  An error message that will probably end up in a log.
 */
errors.SiteError = function SiteError(msg) {
  ErrorAbstract.call(this, msg);
};

errors.SiteError.prototype = new ErrorAbstract();

/**
 * MissingSchemaError
 * @method MissingSchema
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param  {string} msg
 */
errors.MissingSchemaError = function MissingSchemaError(msg) {
  ErrorAbstract.call(this, msg);
};

errors.MissingSchemaError.prototype = new ErrorAbstract();
