var errors = module.exports;

var canCapture = ( typeof Error.captureStackTrace === 'function');
var canStack = !!(new Error()).stack;

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
 * @param {String} [msg] - An error message that will probably end up in a log.
 */
errors.FeedError = function FeedError(msg) {
	ErrorAbstract.call(this, msg);
};
errors.FeedError.prototype = new ErrorAbstract();

errors.SiteError = function SiteError(msg) {
	ErrorAbstract.call(this, msg);
};
errors.SiteError.prototype = new ErrorAbstract();

