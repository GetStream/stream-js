(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["stream"] = factory();
	else
		root["stream"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 9272:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// rawAsap provides everything we need except exception management.
var rawAsap = __webpack_require__(723);
// RawTasks are recycled to reduce GC churn.
var freeTasks = [];
// We queue errors to ensure they are thrown in right order (FIFO).
// Array-as-queue is good enough here, since we are just dealing with exceptions.
var pendingErrors = [];
var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawAsap(rawTask);
}

// We wrap tasks with recyclable task objects.  A task object implements
// `call`, just like a function.
function RawTask() {
    this.task = null;
}

// The sole purpose of wrapping the task is to catch the exception and recycle
// the task object after its single use.
RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            // This hook exists purely for testing purposes.
            // Its name will be periodically randomized to break any code that
            // depends on its existence.
            asap.onerror(error);
        } else {
            // In a web browser, exceptions are not fatal. However, to avoid
            // slowing down the queue of pending tasks, we rethrow the error in a
            // lower priority turn.
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};


/***/ }),

/***/ 723:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` or `self` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

/* globals self */
var scope = typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js


/***/ }),

/***/ 3513:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  n: () => (/* binding */ StreamClient)
});

// NAMESPACE OBJECT: ./node_modules/axios/lib/platform/common/utils.js
var common_utils_namespaceObject = {};
__webpack_require__.r(common_utils_namespaceObject);
__webpack_require__.d(common_utils_namespaceObject, {
  hasBrowserEnv: () => (hasBrowserEnv),
  hasStandardBrowserEnv: () => (hasStandardBrowserEnv),
  hasStandardBrowserWebWorkerEnv: () => (hasStandardBrowserWebWorkerEnv)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js + 5 modules
var slicedToArray = __webpack_require__(8152);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js + 1 modules
var objectWithoutProperties = __webpack_require__(4925);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
var asyncToGenerator = __webpack_require__(5861);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
var classCallCheck = __webpack_require__(5671);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
var createClass = __webpack_require__(3144);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__(4942);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(4687);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);
// EXTERNAL MODULE: http (ignored)
var http_ignored_ = __webpack_require__(8854);
// EXTERNAL MODULE: https (ignored)
var https_ignored_ = __webpack_require__(5697);
;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/bind.js


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/utils.js




// utils is a library of generic helper functions non-specific to axios

const {toString: utils_toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = utils_toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
}

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
}

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
}

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const utils_hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
}

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
}

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  }

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
}

const noop = () => {}

const toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
}

const ALPHA = 'abcdefghijklmnopqrstuvwxyz'

const DIGIT = '0123456789';

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
}

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const {length} = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length|0]
  }

  return str;
}

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  }

  return visit(obj, 0);
}

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

/* harmony default export */ const utils = ({
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty: utils_hasOwnProperty,
  hasOwnProp: utils_hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/AxiosError.js




/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

const AxiosError_prototype = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(AxiosError_prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(AxiosError_prototype);

  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/* harmony default export */ const core_AxiosError = (AxiosError);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/null.js
// eslint-disable-next-line strict
/* harmony default export */ const helpers_null = (null);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/toFormData.js




// temporary hotfix to avoid circular references until AxiosURLSearchParams is refactored


/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils.isPlainObject(thing) || utils.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!utils.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (helpers_null || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils.isSpecCompliantForm(formData);

  if (!utils.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils.isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && utils.isBlob(value)) {
      throw new core_AxiosError('Blob is not supported. Use a Buffer instead.');
    }

    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils.isArray(value) && isFlatArray(value)) ||
        ((utils.isFileList(value) || utils.endsWith(key, '[]')) && (arr = utils.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils.forEach(value, function each(el, key) {
      const result = !(utils.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/* harmony default export */ const helpers_toFormData = (toFormData);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/AxiosURLSearchParams.js




/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && helpers_toFormData(params, this, options);
}

const AxiosURLSearchParams_prototype = AxiosURLSearchParams.prototype;

AxiosURLSearchParams_prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

AxiosURLSearchParams_prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/* harmony default export */ const helpers_AxiosURLSearchParams = (AxiosURLSearchParams);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/buildURL.js





/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function buildURL_encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || buildURL_encode;

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils.isURLSearchParams(params) ?
      params.toString() :
      new helpers_AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/InterceptorManager.js




class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

/* harmony default export */ const core_InterceptorManager = (InterceptorManager);

;// CONCATENATED MODULE: ./node_modules/axios/lib/defaults/transitional.js


/* harmony default export */ const defaults_transitional = ({
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js



/* harmony default export */ const classes_URLSearchParams = (typeof URLSearchParams !== 'undefined' ? URLSearchParams : helpers_AxiosURLSearchParams);

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/browser/classes/FormData.js


/* harmony default export */ const classes_FormData = (typeof FormData !== 'undefined' ? FormData : null);

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/browser/classes/Blob.js


/* harmony default export */ const classes_Blob = (typeof Blob !== 'undefined' ? Blob : null);

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/browser/index.js




/* harmony default export */ const browser = ({
  isBrowser: true,
  classes: {
    URLSearchParams: classes_URLSearchParams,
    FormData: classes_FormData,
    Blob: classes_Blob
  },
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/common/utils.js
const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = (
  (product) => {
    return hasBrowserEnv && ['ReactNative', 'NativeScript', 'NS'].indexOf(product) < 0
  })(typeof navigator !== 'undefined' && navigator.product);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();



;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/index.js



/* harmony default export */ const platform = ({
  ...common_utils_namespaceObject,
  ...browser
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/toURLEncodedForm.js






function toURLEncodedForm(data, options) {
  return helpers_toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/formDataToJSON.js




/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
    const obj = {};

    utils.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/* harmony default export */ const helpers_formDataToJSON = (formDataToJSON);

;// CONCATENATED MODULE: ./node_modules/axios/lib/defaults/index.js










/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: defaults_transitional,

  adapter: ['xhr', 'http'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils.isObject(data);

    if (isObjectPayload && utils.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils.isFormData(data);

    if (isFormData) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify(helpers_formDataToJSON(data)) : data;
    }

    if (utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return helpers_toFormData(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw core_AxiosError.from(e, core_AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

/* harmony default export */ const lib_defaults = (defaults);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/parseHeaders.js




// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
/* harmony default export */ const parseHeaders = (rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/AxiosHeaders.js





const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils.isString(value)) return;

  if (utils.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite)
    } else if(utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils.forEach(this, (value, header) => {
      const key = utils.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
utils.reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

utils.freezeMethods(AxiosHeaders);

/* harmony default export */ const core_AxiosHeaders = (AxiosHeaders);

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/transformData.js






/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || lib_defaults;
  const context = response || config;
  const headers = core_AxiosHeaders.from(context.headers);
  let data = context.data;

  utils.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/isCancel.js


function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/CanceledError.js





/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  core_AxiosError.call(this, message == null ? 'canceled' : message, core_AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, core_AxiosError, {
  __CANCEL__: true
});

/* harmony default export */ const cancel_CanceledError = (CanceledError);

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/settle.js




/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new core_AxiosError(
      'Request failed with status code ' + response.status,
      [core_AxiosError.ERR_BAD_REQUEST, core_AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/cookies.js





/* harmony default export */ const cookies = (platform.hasStandardBrowserEnv ?

// Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        const cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

// Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })());

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isAbsoluteURL.js


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/combineURLs.js


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/buildFullPath.js





/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isURLSameOrigin.js





/* harmony default export */ const isURLSameOrigin = (platform.hasStandardBrowserEnv ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement('a');
    let originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      let href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
          urlParsingNode.pathname :
          '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })());

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/parseProtocol.js


function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/speedometer.js


/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/* harmony default export */ const helpers_speedometer = (speedometer);

;// CONCATENATED MODULE: ./node_modules/axios/lib/adapters/xhr.js
















function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = helpers_speedometer(50, 250);

  return e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e
    };

    data[isDownloadStream ? 'download' : 'upload'] = true;

    listener(data);
  };
}

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

/* harmony default export */ const xhr = (isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    let requestData = config.data;
    const requestHeaders = core_AxiosHeaders.from(config.headers).normalize();
    const responseType = config.responseType;
    let onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    let contentType;

    if (utils.isFormData(requestData)) {
      if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
        requestHeaders.setContentType(false); // Let the browser set it
      } else if ((contentType = requestHeaders.getContentType()) !== false) {
        // fix semicolon duplication issue for ReactNative FormData implementation
        const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
        requestHeaders.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
      }
    }

    let request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      const username = config.auth.username || '';
      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
    }

    const fullPath = buildFullPath(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = core_AxiosHeaders.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new core_AxiosError('Request aborted', core_AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new core_AxiosError('Network Error', core_AxiosError.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = config.transitional || defaults_transitional;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new core_AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? core_AxiosError.ETIMEDOUT : core_AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (platform.hasStandardBrowserEnv) {
      // Add xsrf header
      // regarding CVE-2023-45857 config.withCredentials condition was removed temporarily
      const xsrfValue = isURLSameOrigin(fullPath) && config.xsrfCookieName && cookies.read(config.xsrfCookieName);

      if (xsrfValue) {
        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
      }
    }

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new cancel_CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(fullPath);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new core_AxiosError('Unsupported protocol ' + protocol + ':', core_AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/adapters/adapters.js





const knownAdapters = {
  http: helpers_null,
  xhr: xhr
}

utils.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => utils.isFunction(adapter) || adapter === null || adapter === false;

/* harmony default export */ const adapters = ({
  getAdapter: (adapters) => {
    adapters = utils.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new core_AxiosError(`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new core_AxiosError(
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/dispatchRequest.js









/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new cancel_CanceledError(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = core_AxiosHeaders.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || lib_defaults.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = core_AxiosHeaders.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = core_AxiosHeaders.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/mergeConfig.js





const headersToObject = (thing) => thing instanceof core_AxiosHeaders ? thing.toJSON() : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, caseless) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge.call({caseless}, target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, caseless) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };

  utils.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/env/data.js
const VERSION = "1.6.1";
;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/validator.js





const validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new core_AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        core_AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new core_AxiosError('options must be an object', core_AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new core_AxiosError('option ' + opt + ' must be ' + result, core_AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new core_AxiosError('Unknown option ' + opt, core_AxiosError.ERR_BAD_OPTION);
    }
  }
}

/* harmony default export */ const validator = ({
  assertOptions,
  validators
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/Axios.js











const Axios_validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new core_InterceptorManager(),
      response: new core_InterceptorManager()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: Axios_validators.transitional(Axios_validators.boolean),
        forcedJSONParsing: Axios_validators.transitional(Axios_validators.boolean),
        clarifyTimeoutError: Axios_validators.transitional(Axios_validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        }
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: Axios_validators.function,
          serialize: Axios_validators.function
        }, true);
      }
    }

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils.merge(
      headers.common,
      headers[config.method]
    );

    headers && utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = core_AxiosHeaders.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/* harmony default export */ const core_Axios = (Axios);

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/CancelToken.js




/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new cancel_CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

/* harmony default export */ const cancel_CancelToken = (CancelToken);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/spread.js


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isAxiosError.js




/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/HttpStatusCode.js
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

/* harmony default export */ const helpers_HttpStatusCode = (HttpStatusCode);

;// CONCATENATED MODULE: ./node_modules/axios/lib/axios.js




















/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new core_Axios(defaultConfig);
  const instance = bind(core_Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, core_Axios.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(lib_defaults);

// Expose Axios class to allow class inheritance
axios.Axios = core_Axios;

// Expose Cancel & CancelToken
axios.CanceledError = cancel_CanceledError;
axios.CancelToken = cancel_CancelToken;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = helpers_toFormData;

// Expose AxiosError class
axios.AxiosError = core_AxiosError;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

// Expose mergeConfig
axios.mergeConfig = mergeConfig;

axios.AxiosHeaders = core_AxiosHeaders;

axios.formToJSON = thing => helpers_formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = adapters.getAdapter;

axios.HttpStatusCode = helpers_HttpStatusCode;

axios.default = axios;

// this module should only have a default export
/* harmony default export */ const lib_axios = (axios);

// EXTERNAL MODULE: ./node_modules/faye/src/faye_browser.js
var faye_browser = __webpack_require__(2965);
;// CONCATENATED MODULE: ./node_modules/jwt-decode/build/esm/index.js
class InvalidTokenError extends Error {
}
InvalidTokenError.prototype.name = "InvalidTokenError";
function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).replace(/(.)/g, (m, p) => {
        let code = p.charCodeAt(0).toString(16).toUpperCase();
        if (code.length < 2) {
            code = "0" + code;
        }
        return "%" + code;
    }));
}
function base64UrlDecode(str) {
    let output = str.replace(/-/g, "+").replace(/_/g, "/");
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += "==";
            break;
        case 3:
            output += "=";
            break;
        default:
            throw new Error("base64 string is not of the correct length");
    }
    try {
        return b64DecodeUnicode(output);
    }
    catch (err) {
        return atob(output);
    }
}
function jwtDecode(token, options) {
    if (typeof token !== "string") {
        throw new InvalidTokenError("Invalid token specified: must be a string");
    }
    options || (options = {});
    const pos = options.header === true ? 0 : 1;
    const part = token.split(".")[pos];
    if (typeof part !== "string") {
        throw new InvalidTokenError(`Invalid token specified: missing part #${pos + 1}`);
    }
    let decoded;
    try {
        decoded = base64UrlDecode(part);
    }
    catch (e) {
        throw new InvalidTokenError(`Invalid token specified: invalid base64 for part #${pos + 1} (${e.message})`);
    }
    try {
        return JSON.parse(decoded);
    }
    catch (e) {
        throw new InvalidTokenError(`Invalid token specified: invalid json for part #${pos + 1} (${e.message})`);
    }
}

// EXTERNAL MODULE: ./src/personalization.ts
var personalization = __webpack_require__(8039);
// EXTERNAL MODULE: ./src/collections.ts
var collections = __webpack_require__(3709);
// EXTERNAL MODULE: ./src/files.ts
var files = __webpack_require__(448);
// EXTERNAL MODULE: ./src/images.ts + 1 modules
var src_images = __webpack_require__(9082);
// EXTERNAL MODULE: ./src/reaction.ts
var reaction = __webpack_require__(8824);
// EXTERNAL MODULE: ./src/user.ts
var src_user = __webpack_require__(7878);
// EXTERNAL MODULE: ./src/signing.ts
var signing = __webpack_require__(6685);
// EXTERNAL MODULE: ./src/errors.ts + 9 modules
var errors = __webpack_require__(2589);
// EXTERNAL MODULE: ./src/utils.ts
var src_utils = __webpack_require__(2637);
// EXTERNAL MODULE: ./src/batch_operations.ts
var batch_operations = __webpack_require__(6793);
var batch_operations_default = /*#__PURE__*/__webpack_require__.n(batch_operations);
// EXTERNAL MODULE: ./src/redirect_url.ts
var redirect_url = __webpack_require__(7496);
var redirect_url_default = /*#__PURE__*/__webpack_require__.n(redirect_url);
// EXTERNAL MODULE: ./src/feed.ts
var src_feed = __webpack_require__(7248);
;// CONCATENATED MODULE: ./src/client.ts






var _excluded = ["method", "token"],
  _excluded2 = ["ids", "foreignIDTimes"],
  _excluded3 = ["activities"];

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,defineProperty/* default */.Z)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/// <reference path="../types/modules.d.ts" />



















// alias to avoid breaking change

/**
 * Client to connect to Stream api
 * @class StreamClient
 */
var StreamClient = /*#__PURE__*/function () {
  // eslint-disable-line no-use-before-define

  /**
   * Initialize a client
   * @link https://getstream.io/activity-feeds/docs/node/#setup
   * @method initialize
   * @memberof StreamClient.prototype
   * @param {string} apiKey - the api key
   * @param {string} [apiSecret] - the api secret
   * @param {string} [appId] - id of the app
   * @param {ClientOptions} [options] - additional options
   * @param {string} [options.location] - which data center to use
   * @param {boolean} [options.expireTokens=false] - whether to use a JWT timestamp field (i.e. iat)
   * @param {string} [options.version] - advanced usage, custom api version
   * @param {boolean} [options.keepAlive] - axios keepAlive, default to true
   * @param {number} [options.timeout] - axios timeout in Ms, default to 10s
   * @example <caption>initialize is not directly called by via stream.connect, ie:</caption>
   * stream.connect(apiKey, apiSecret)
   * @example <caption>secret is optional and only used in server side mode</caption>
   * stream.connect(apiKey, null, appId);
   */
  function StreamClient(apiKey, apiSecretOrToken, appId) {
    var _this = this;
    var _options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    (0,classCallCheck/* default */.Z)(this, StreamClient);
    (0,defineProperty/* default */.Z)(this, "baseUrl", void 0);
    (0,defineProperty/* default */.Z)(this, "baseAnalyticsUrl", void 0);
    (0,defineProperty/* default */.Z)(this, "apiKey", void 0);
    (0,defineProperty/* default */.Z)(this, "appId", void 0);
    (0,defineProperty/* default */.Z)(this, "usingApiSecret", void 0);
    (0,defineProperty/* default */.Z)(this, "apiSecret", void 0);
    (0,defineProperty/* default */.Z)(this, "userToken", void 0);
    (0,defineProperty/* default */.Z)(this, "enrichByDefault", void 0);
    (0,defineProperty/* default */.Z)(this, "options", void 0);
    (0,defineProperty/* default */.Z)(this, "userId", void 0);
    (0,defineProperty/* default */.Z)(this, "authPayload", void 0);
    (0,defineProperty/* default */.Z)(this, "version", void 0);
    (0,defineProperty/* default */.Z)(this, "fayeUrl", void 0);
    (0,defineProperty/* default */.Z)(this, "group", void 0);
    (0,defineProperty/* default */.Z)(this, "expireTokens", void 0);
    (0,defineProperty/* default */.Z)(this, "location", void 0);
    (0,defineProperty/* default */.Z)(this, "fayeClient", void 0);
    (0,defineProperty/* default */.Z)(this, "browser", void 0);
    (0,defineProperty/* default */.Z)(this, "node", void 0);
    (0,defineProperty/* default */.Z)(this, "nodeOptions", void 0);
    (0,defineProperty/* default */.Z)(this, "request", void 0);
    (0,defineProperty/* default */.Z)(this, "subscriptions", void 0);
    (0,defineProperty/* default */.Z)(this, "handlers", void 0);
    (0,defineProperty/* default */.Z)(this, "currentUser", void 0);
    (0,defineProperty/* default */.Z)(this, "personalization", void 0);
    (0,defineProperty/* default */.Z)(this, "collections", void 0);
    (0,defineProperty/* default */.Z)(this, "files", void 0);
    (0,defineProperty/* default */.Z)(this, "images", void 0);
    (0,defineProperty/* default */.Z)(this, "reactions", void 0);
    (0,defineProperty/* default */.Z)(this, "_personalizationToken", void 0);
    (0,defineProperty/* default */.Z)(this, "_collectionsToken", void 0);
    (0,defineProperty/* default */.Z)(this, "_getOrCreateToken", void 0);
    (0,defineProperty/* default */.Z)(this, "addToMany", void 0);
    // eslint-disable-line no-use-before-define
    (0,defineProperty/* default */.Z)(this, "followMany", void 0);
    // eslint-disable-line no-use-before-define
    (0,defineProperty/* default */.Z)(this, "unfollowMany", void 0);
    // eslint-disable-line no-use-before-define
    (0,defineProperty/* default */.Z)(this, "createRedirectUrl", void 0);
    (0,defineProperty/* default */.Z)(this, "replaceReactionOptions", function (options) {
      // Shortcut options for reaction enrichment
      if (options !== null && options !== void 0 && options.reactions) {
        if (options.reactions.own != null) {
          options.withOwnReactions = options.reactions.own;
        }
        if (options.reactions.recent != null) {
          options.withRecentReactions = options.reactions.recent;
        }
        if (options.reactions.ranking_vars != null) {
          options.rankingVars = options.reactions.ranking_vars;
        }
        if (options.reactions.score_vars != null) {
          options.withScoreVars = options.reactions.score_vars;
        }
        if (options.reactions.counts != null) {
          options.withReactionCounts = options.reactions.counts;
        }
        if (options.reactions.own_children != null) {
          options.withOwnChildren = options.reactions.own_children;
        }
        if (options.reactions.kinds != null) {
          options.reactionKindsFilter = options.reactions.kinds;
        }
        if (options.reactions.user_id != null) {
          options.withUserId = options.reactions.user_id;
        }
        delete options.reactions;
      }
    });
    (0,defineProperty/* default */.Z)(this, "handleResponse", function (response) {
      if (/^2/.test("".concat(response.status))) {
        _this.send('response', null, response, response.data);
        return response.data;
      }
      throw new errors/* StreamApiError */.eY("".concat(JSON.stringify(response.data), " with HTTP status code ").concat(response.status), response.data, response);
    });
    (0,defineProperty/* default */.Z)(this, "doAxiosRequest", /*#__PURE__*/function () {
      var _ref = (0,asyncToGenerator/* default */.Z)( /*#__PURE__*/regenerator_default().mark(function _callee(method, options) {
        var response, err;
        return regenerator_default().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _this.send('request', method, options);
              _context.prev = 1;
              _context.next = 4;
              return _this.request(_this.enrichKwargs(_objectSpread({
                method: method
              }, options)));
            case 4:
              response = _context.sent;
              return _context.abrupt("return", _this.handleResponse(response));
            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](1);
              err = _context.t0;
              if (!err.response) {
                _context.next = 13;
                break;
              }
              return _context.abrupt("return", _this.handleResponse(err.response));
            case 13:
              throw new errors/* SiteError */.z4(err.message);
            case 14:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[1, 8]]);
      }));
      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
    this.baseUrl = 'https://api.stream-io-api.com/api/';
    this.baseAnalyticsUrl = 'https://analytics.stream-io-api.com/analytics/';
    this.apiKey = apiKey;
    this.usingApiSecret = apiSecretOrToken != null && !apiSecretOrToken.includes(".");
    this.apiSecret = this.usingApiSecret ? apiSecretOrToken : null;
    this.userToken = this.usingApiSecret ? null : apiSecretOrToken;
    this.enrichByDefault = !this.usingApiSecret;
    if (this.userToken != null) {
      var jwtBody = jwtDecode(this.userToken);
      if (!jwtBody.user_id) {
        throw new TypeError('user_id is missing in user token');
      }
      this.userId = jwtBody.user_id;
      this.currentUser = this.user(this.userId);
    }
    this.appId = appId;
    this.options = _options;
    this.version = this.options.version || 'v1.0';
    this.fayeUrl = this.options.fayeUrl || 'https://faye-us-east.stream-io-api.com/faye';
    this.fayeClient = null;
    // track a source name for the api calls, ie get started or databrowser
    this.group = this.options.group || 'unspecified';
    // track subscriptions made on feeds created by this client
    this.subscriptions = {};
    this.expireTokens = this.options.expireTokens ? this.options.expireTokens : false;
    // which data center to use
    this.location = this.options.location;
    this.baseUrl = this.getBaseUrl();
    if (typeof process !== 'undefined') {
      var _process$env, _process$env2;
      if ((_process$env = ({"PACKAGE_VERSION":"8.4.0"})) !== null && _process$env !== void 0 && _process$env.LOCAL_FAYE) {
        this.fayeUrl = 'http://localhost:9999/faye/';
      }
      if ((_process$env2 = ({"PACKAGE_VERSION":"8.4.0"})) !== null && _process$env2 !== void 0 && _process$env2.STREAM_ANALYTICS_BASE_URL) {
        this.baseAnalyticsUrl = ({"PACKAGE_VERSION":"8.4.0"}).STREAM_ANALYTICS_BASE_URL;
      }
    }
    this.handlers = {};
    this.node = typeof window === 'undefined'; // use for real browser vs node behavior
    // use for browser warnings
    this.browser = typeof this.options.browser !== 'undefined' ? this.options.browser : !this.node;
    if (this.node) {
      var keepAlive = this.options.keepAlive === undefined ? true : this.options.keepAlive;
      this.nodeOptions = {
        httpAgent: new http_ignored_.Agent({
          keepAlive: keepAlive,
          keepAliveMsecs: 3000
        }),
        httpsAgent: new https_ignored_.Agent({
          keepAlive: keepAlive,
          keepAliveMsecs: 3000
        })
      };
    }
    this.request = lib_axios.create(_objectSpread({
      timeout: this.options.timeout || 10000,
      withCredentials: false
    }, this.nodeOptions || {}));
    this.personalization = new personalization/* Personalization */.S(this);
    if (this.browser && this.usingApiSecret) {
      throw new errors/* FeedError */.IY('You are publicly sharing your App Secret. Do not expose the App Secret in browsers, "native" mobile apps, or other non-trusted environments.');
    }
    this.collections = new collections/* Collections */.n(this, this.getOrCreateToken());
    this.files = new files/* StreamFileStore */.h(this, this.getOrCreateToken());
    this.images = new src_images/* StreamImageStore */.$(this, this.getOrCreateToken());
    this.reactions = new reaction/* StreamReaction */.R(this, this.getOrCreateToken());

    // If we are in a node environment and batchOperations/createRedirectUrl is available add the methods to the prototype of StreamClient
    if ((batch_operations_default()) && !!(redirect_url_default())) {
      this.addToMany = (batch_operations_default()).addToMany;
      this.followMany = (batch_operations_default()).followMany;
      this.unfollowMany = (batch_operations_default()).unfollowMany;
      this.createRedirectUrl = (redirect_url_default());
    }
  }
  (0,createClass/* default */.Z)(StreamClient, [{
    key: "_throwMissingApiSecret",
    value: function _throwMissingApiSecret() {
      if (!this.usingApiSecret) {
        throw new errors/* SiteError */.z4('This method can only be used server-side using your API Secret, use client = stream.connect(key, secret);');
      }
    }
  }, {
    key: "getPersonalizationToken",
    value: function getPersonalizationToken() {
      if (this._personalizationToken) return this._personalizationToken;
      this._throwMissingApiSecret();
      this._personalizationToken = (0,signing/* JWTScopeToken */.v)(this.apiSecret, 'personalization', '*', {
        userId: '*',
        feedId: '*',
        expireTokens: this.expireTokens
      });
      return this._personalizationToken;
    }
  }, {
    key: "getCollectionsToken",
    value: function getCollectionsToken() {
      if (this._collectionsToken) return this._collectionsToken;
      this._throwMissingApiSecret();
      this._collectionsToken = (0,signing/* JWTScopeToken */.v)(this.apiSecret, 'collections', '*', {
        feedId: '*',
        expireTokens: this.expireTokens
      });
      return this._collectionsToken;
    }
  }, {
    key: "getAnalyticsToken",
    value: function getAnalyticsToken() {
      this._throwMissingApiSecret();
      return (0,signing/* JWTScopeToken */.v)(this.apiSecret, 'analytics', '*', {
        userId: '*',
        expireTokens: this.expireTokens
      });
    }
  }, {
    key: "getBaseUrl",
    value: function getBaseUrl(serviceName) {
      var _process$env3, _process$env4;
      if (!serviceName) serviceName = 'api';
      if (this.options.urlOverride && this.options.urlOverride[serviceName]) return this.options.urlOverride[serviceName];
      var urlEnvironmentKey = serviceName === 'api' ? 'STREAM_BASE_URL' : "STREAM_".concat(serviceName.toUpperCase(), "_URL");
      if (typeof process !== 'undefined' && (_process$env3 = ({"PACKAGE_VERSION":"8.4.0"})) !== null && _process$env3 !== void 0 && _process$env3[urlEnvironmentKey]) return ({"PACKAGE_VERSION":"8.4.0"})[urlEnvironmentKey];
      if (typeof process !== 'undefined' && (_process$env4 = ({"PACKAGE_VERSION":"8.4.0"})) !== null && _process$env4 !== void 0 && _process$env4.LOCAL || this.options.local) return "http://localhost:8000/".concat(serviceName, "/");
      if (this.location) {
        var protocol = this.options.protocol || 'https';
        return "".concat(protocol, "://").concat(this.location, "-").concat(serviceName, ".stream-io-api.com/").concat(serviceName, "/");
      }
      if (serviceName !== 'api') return "https://".concat(serviceName, ".stream-io-api.com/").concat(serviceName, "/");
      return this.baseUrl;
    }

    /**
     * Support for global event callbacks
     * This is useful for generic error and loading handling
     * @method on
     * @memberof StreamClient.prototype
     * @param {string} event - Name of the event
     * @param {function} callback - Function that is called when the event fires
     * @example
     * client.on('request', callback);
     * client.on('response', callback);
     */
  }, {
    key: "on",
    value: function on(event, callback) {
      this.handlers[event] = callback;
    }

    /**
     * Remove one or more event handlers
     * @method off
     * @memberof StreamClient.prototype
     * @param {string} [key] - Name of the handler
     * @example
     * client.off() removes all handlers
     * client.off(name) removes the specified handler
     */
  }, {
    key: "off",
    value: function off(key) {
      if (key === undefined) {
        this.handlers = {};
      } else {
        delete this.handlers[key];
      }
    }

    /**
     * Call the given handler with the arguments
     * @method send
     * @memberof StreamClient.prototype
     * @access private
     */
  }, {
    key: "send",
    value: function send(key) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      if (this.handlers[key]) this.handlers[key].apply(this, args);
    }

    /**
     * Get the current user agent
     * @method userAgent
     * @memberof StreamClient.prototype
     * @return {string} current user agent
     */
  }, {
    key: "userAgent",
    value: function userAgent() {
      if (process === undefined || "8.4.0" === undefined) {
        // eslint-disable-next-line
        return "stream-javascript-client-".concat(this.node ? 'node' : 'browser', "-").concat((__webpack_require__(4147)/* .version */ .i8));
      }
      return "stream-javascript-client-".concat(this.node ? 'node' : 'browser', "-").concat("8.4.0");
    }

    /**
     * Returns a token that allows only read operations
     *
     * @method getReadOnlyToken
     * @memberof StreamClient.prototype
     * @param {string} feedSlug - The feed slug to get a read only token for
     * @param {string} userId - The user identifier
     * @return {string} token
     * @example client.getReadOnlyToken('user', '1');
     */
  }, {
    key: "getReadOnlyToken",
    value: function getReadOnlyToken(feedSlug, userId) {
      src_utils/* default */.Z.validateFeedSlug(feedSlug);
      src_utils/* default */.Z.validateUserId(userId);
      return (0,signing/* JWTScopeToken */.v)(this.apiSecret, '*', 'read', {
        feedId: "".concat(feedSlug).concat(userId),
        expireTokens: this.expireTokens
      });
    }

    /**
     * Returns a token that allows read and write operations
     *
     * @method getReadWriteToken
     * @memberof StreamClient.prototype
     * @param {string} feedSlug - The feed slug to get a read only token for
     * @param {string} userId - The user identifier
     * @return {string} token
     * @example client.getReadWriteToken('user', '1');
     */
  }, {
    key: "getReadWriteToken",
    value: function getReadWriteToken(feedSlug, userId) {
      src_utils/* default */.Z.validateFeedSlug(feedSlug);
      src_utils/* default */.Z.validateUserId(userId);
      return (0,signing/* JWTScopeToken */.v)(this.apiSecret, '*', '*', {
        feedId: "".concat(feedSlug).concat(userId),
        expireTokens: this.expireTokens
      });
    }

    /**
     * Returns a feed object for the given feed id and token
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js
     * @method feed
     * @memberof StreamClient.prototype
     * @param {string} feedSlug - The feed slug
     * @param {string} [userId] - The user identifier
     * @param {string} [token] - The token
     * @return {StreamFeed}
     * @example  client.feed('user', '1');
     */
  }, {
    key: "feed",
    value: function feed(feedSlug, userId, token) {
      if (userId instanceof src_user/* StreamUser */.h) userId = userId.id;
      if (token === undefined) {
        if (this.usingApiSecret) {
          token = (0,signing/* JWTScopeToken */.v)(this.apiSecret, '*', '*', {
            feedId: "".concat(feedSlug).concat(userId)
          });
        } else {
          token = this.userToken;
        }
      }
      return new src_feed/* StreamFeed */.r(this, feedSlug, userId || this.userId, token);
    }

    /**
     * Combines the base url with version and the relative url
     * @method enrichUrl
     * @memberof StreamClient.prototype
     * @private
     * @param {string} relativeUrl
     * @param {string} [serviceName]
     * @return {string}
     */
  }, {
    key: "enrichUrl",
    value: function enrichUrl(relativeUrl, serviceName) {
      return "".concat(this.getBaseUrl(serviceName)).concat(this.version, "/").concat(relativeUrl);
    }
  }, {
    key: "shouldUseEnrichEndpoint",
    value: function shouldUseEnrichEndpoint() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (options.enrich !== undefined) {
        var result = options.enrich;
        delete options.enrich;
        return result;
      }
      return this.enrichByDefault || options.ownReactions != null || options.reactionKindsFilter != null || options.withRecentReactions != null || options.withScoreVars != null || options.withReactionCounts != null || options.withOwnChildren != null || options.withUserId != null;
    }

    /**
     * Adds the API key and the token
     * @method enrichKwargs
     * @private
     * @memberof StreamClient.prototype
     * @param {AxiosConfig} kwargs
     * @return {axios.AxiosRequestConfig}
     */
  }, {
    key: "enrichKwargs",
    value: function enrichKwargs(_ref2) {
      var method = _ref2.method,
        token = _ref2.token,
        kwargs = (0,objectWithoutProperties/* default */.Z)(_ref2, _excluded);
      return _objectSpread({
        method: method,
        url: this.enrichUrl(kwargs.url, kwargs.serviceName),
        data: kwargs.body,
        params: _objectSpread({
          api_key: this.apiKey,
          location: this.group
        }, kwargs.qs || {}),
        headers: _objectSpread({
          'X-Stream-Client': this.userAgent(),
          'stream-auth-type': 'jwt',
          Authorization: token
        }, kwargs.headers || {})
      }, kwargs.axiosOptions || {});
    }

    /**
     * Get the authorization middleware to use Faye with getstream.io
     * @method getFayeAuthorization
     * @memberof StreamClient.prototype
     * @private
     * @return {Faye.Middleware} Faye authorization middleware
     */
  }, {
    key: "getFayeAuthorization",
    value: function getFayeAuthorization() {
      var _this2 = this;
      return {
        incoming: function incoming(message, callback) {
          return callback(message);
        },
        outgoing: function outgoing(message, callback) {
          if (message.subscription && _this2.subscriptions[message.subscription]) {
            var subscription = _this2.subscriptions[message.subscription];
            message.ext = {
              user_id: subscription.userId,
              api_key: _this2.apiKey,
              signature: subscription.token
            };
          }
          callback(message);
        }
      };
    }

    /**
     * Returns this client's current Faye client
     * @method getFayeClient
     * @memberof StreamClient.prototype
     * @private
     * @param {number} timeout
     * @return {Faye.Client} Faye client
     */
  }, {
    key: "getFayeClient",
    value: function getFayeClient() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
      if (this.fayeClient === null) {
        this.fayeClient = new faye_browser.Client(this.fayeUrl, {
          timeout: timeout
        });
        var authExtension = this.getFayeAuthorization();
        this.fayeClient.addExtension(authExtension);
      }
      return this.fayeClient;
    }
  }, {
    key: "upload",
    value: function upload(url, uri, name, contentType, onUploadProgress) {
      var fd = src_utils/* default */.Z.addFileToFormData(uri, name, contentType);
      return this.doAxiosRequest('POST', {
        url: url,
        body: fd,
        headers: fd.getHeaders ? fd.getHeaders() : {},
        // node vs browser
        token: this.getOrCreateToken(),
        axiosOptions: {
          timeout: 0,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          onUploadProgress: onUploadProgress
        }
      });
    }

    /**
     * Shorthand function for get request
     * @method get
     * @memberof StreamClient.prototype
     * @private
     * @param  {AxiosConfig}    kwargs
     * @return {Promise}   Promise object
     */
  }, {
    key: "get",
    value: function get(kwargs) {
      return this.doAxiosRequest('GET', kwargs);
    }

    /**
     * Shorthand function for post request
     * @method post
     * @memberof StreamClient.prototype
     * @private
     * @param  {AxiosConfig}    kwargs
     * @return {Promise}   Promise object
     */
  }, {
    key: "post",
    value: function post(kwargs) {
      return this.doAxiosRequest('POST', kwargs);
    }

    /**
     * Shorthand function for delete request
     * @method delete
     * @memberof StreamClient.prototype
     * @private
     * @param  {AxiosConfig}    kwargs
     * @return {Promise}   Promise object
     */
  }, {
    key: "delete",
    value: function _delete(kwargs) {
      return this.doAxiosRequest('DELETE', kwargs);
    }

    /**
     * Shorthand function for put request
     * @method put
     * @memberof StreamClient.prototype
     * @private
     * @param  {AxiosConfig}    kwargs
     * @return {Promise}   Promise object
     */
  }, {
    key: "put",
    value: function put(kwargs) {
      return this.doAxiosRequest('PUT', kwargs);
    }

    /**
     * create a user token
     * @link https://getstream.io/activity-feeds/docs/node/feeds_getting_started/?language=js#generate-user-token-server-side
     * @param {string} userId
     * @param {object} extraData
     * @return {string}
     */
  }, {
    key: "createUserToken",
    value: function createUserToken(userId) {
      var extraData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this._throwMissingApiSecret();
      return (0,signing/* JWTUserSessionToken */.c)(this.apiSecret, userId, extraData, {
        noTimestamp: !this.expireTokens
      });
    }

    /**
     * Updates all supplied activities on the stream
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#updating-activities
     * @param  {UpdateActivity<StreamFeedGenerics>[]} activities list of activities to update
     * @return {Promise<APIResponse>}
     */
  }, {
    key: "updateActivities",
    value: function updateActivities(activities) {
      this._throwMissingApiSecret();
      if (!(activities instanceof Array)) {
        throw new TypeError('The activities argument should be an Array');
      }
      var token = (0,signing/* JWTScopeToken */.v)(this.apiSecret, 'activities', '*', {
        feedId: '*',
        expireTokens: this.expireTokens
      });
      return this.post({
        url: 'activities/',
        body: {
          activities: activities
        },
        token: token
      });
    }

    /**
     * Updates one activity on the stream
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#updating-activities
     * @param  {UpdateActivity<StreamFeedGenerics>} activity The activity to update
     * @return {Promise<APIResponse>}
     */
  }, {
    key: "updateActivity",
    value: function updateActivity(activity) {
      this._throwMissingApiSecret();
      return this.updateActivities([activity]);
    }

    /**
     * Retrieve activities by ID or foreign_id and time
     * @link https://getstream.io/activity-feeds/docs/node/add_many_activities/?language=js#batch-get-activities-by-id
     * @param  {object} params object containing either the list of activity IDs as {ids: ['...', ...]} or foreign_ids and time as {foreignIDTimes: [{foreign_id: ..., time: ...}, ...]}
     * @return {Promise<GetActivitiesAPIResponse>}
     */
  }, {
    key: "getActivities",
    value: function getActivities(_ref3) {
      var ids = _ref3.ids,
        foreignIDTimes = _ref3.foreignIDTimes,
        params = (0,objectWithoutProperties/* default */.Z)(_ref3, _excluded2);
      var extraParams = {};
      if (ids) {
        if (!(ids instanceof Array)) {
          throw new TypeError('The ids argument should be an Array');
        }
        extraParams.ids = ids.join(',');
      } else if (foreignIDTimes) {
        if (!(foreignIDTimes instanceof Array)) {
          throw new TypeError('The foreignIDTimes argument should be an Array');
        }
        var foreignIDs = [];
        var timestamps = [];
        foreignIDTimes.forEach(function (fidTime) {
          if (!(fidTime instanceof Object)) {
            throw new TypeError('foreignIDTimes elements should be Objects');
          }
          foreignIDs.push(fidTime.foreign_id || fidTime.foreignID);
          timestamps.push(fidTime.time);
        });
        extraParams.foreign_ids = foreignIDs.join(',');
        extraParams.timestamps = timestamps.join(',');
      } else {
        throw new TypeError('Missing ids or foreignIDTimes params');
      }
      var token = this.userToken;
      if (this.usingApiSecret) {
        token = (0,signing/* JWTScopeToken */.v)(this.apiSecret, 'activities', '*', {
          feedId: '*',
          expireTokens: this.expireTokens
        });
      }
      this.replaceReactionOptions(params);
      var path = this.shouldUseEnrichEndpoint(params) ? 'enrich/activities/' : 'activities/';
      return this.get({
        url: path,
        qs: _objectSpread(_objectSpread({}, params), extraParams),
        token: token
      });
    }
  }, {
    key: "getOrCreateToken",
    value: function getOrCreateToken() {
      if (!this._getOrCreateToken) {
        this._getOrCreateToken = this.usingApiSecret ? (0,signing/* JWTScopeToken */.v)(this.apiSecret, '*', '*', {
          feedId: '*'
        }) : this.userToken;
      }
      return this._getOrCreateToken;
    }
  }, {
    key: "user",
    value: function user(userId) {
      return new src_user/* StreamUser */.h(this, userId, this.getOrCreateToken());
    }
  }, {
    key: "setUser",
    value: function () {
      var _setUser = (0,asyncToGenerator/* default */.Z)( /*#__PURE__*/regenerator_default().mark(function _callee2(data) {
        var body, user;
        return regenerator_default().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!this.usingApiSecret) {
                _context2.next = 2;
                break;
              }
              throw new errors/* SiteError */.z4('This method can only be used client-side using a user token');
            case 2:
              body = _objectSpread({}, data);
              delete body.id;
              _context2.next = 6;
              return this.currentUser.getOrCreate(body);
            case 6:
              user = _context2.sent;
              this.currentUser = user;
              return _context2.abrupt("return", user);
            case 9:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function setUser(_x3) {
        return _setUser.apply(this, arguments);
      }
      return setUser;
    }()
  }, {
    key: "og",
    value: function og(url) {
      return this.get({
        url: 'og/',
        qs: {
          url: url
        },
        token: this.getOrCreateToken()
      });
    }
  }, {
    key: "personalizedFeed",
    value: function personalizedFeed() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return this.get({
        url: 'enrich/personalization/feed/',
        qs: options,
        token: this.getOrCreateToken()
      });
    }

    /**
     * Update a single activity with partial operations.
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js&q=partial+#activity-partial-update
     * @param {ActivityPartialChanges<StreamFeedGenerics>} data object containing either the ID or the foreign_id and time of the activity and the operations to issue as set:{...} and unset:[...].
     * @return {Promise<Activity<StreamFeedGenerics>>}
     * @example
     * client.activityPartialUpdate({
     *   id: "54a60c1e-4ee3-494b-a1e3-50c06acb5ed4",
     *   set: {
     *     "product.price": 19.99,
     *     "shares": {
     *       "facebook": "...",
     *       "twitter": "...",
     *     }
     *   },
     *   unset: [
     *     "daily_likes",
     *     "popularity"
     *   ]
     * })
     * @example
     * client.activityPartialUpdate({
     *   foreign_id: "product:123",
     *   time: "2016-11-10T13:20:00.000000",
     *   set: {
     *     ...
     *   },
     *   unset: [
     *     ...
     *   ]
     * })
     */
  }, {
    key: "activityPartialUpdate",
    value: function () {
      var _activityPartialUpdate = (0,asyncToGenerator/* default */.Z)( /*#__PURE__*/regenerator_default().mark(function _callee3(data) {
        var _yield$this$activitie, activities, response, _activities, activity;
        return regenerator_default().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.activitiesPartialUpdate([data]);
            case 2:
              _yield$this$activitie = _context3.sent;
              activities = _yield$this$activitie.activities;
              response = (0,objectWithoutProperties/* default */.Z)(_yield$this$activitie, _excluded3);
              _activities = (0,slicedToArray/* default */.Z)(activities, 1), activity = _activities[0];
              return _context3.abrupt("return", _objectSpread(_objectSpread({}, activity), response));
            case 7:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function activityPartialUpdate(_x4) {
        return _activityPartialUpdate.apply(this, arguments);
      }
      return activityPartialUpdate;
    }()
    /**
     * Update multiple activities with partial operations.
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js&q=partial+#activity-partial-update
     * @param {ActivityPartialChanges<StreamFeedGenerics>[]} changes array containing the changesets to be applied. Every changeset contains the activity identifier which is either the ID or the pair of of foreign ID and time of the activity. The operations to issue can be set:{...} and unset:[...].
     * @return {Promise<{ activities: Activity<StreamFeedGenerics>[] }>}
     * @example
     * client.activitiesPartialUpdate([
     *   {
     *     id: "4b39fda2-d6e2-42c9-9abf-5301ef071b12",
     *     set: {
     *       "product.price.eur": 12.99,
     *       "colors": {
     *         "blue": "#0000ff",
     *         "green": "#00ff00",
     *       },
     *     },
     *     unset: [ "popularity", "size.x2" ],
     *   },
     *   {
     *     id: "8d2dcad8-1e34-11e9-8b10-9cb6d0925edd",
     *     set: {
     *       "product.price.eur": 17.99,
     *       "colors": {
     *         "red": "#ff0000",
     *         "green": "#00ff00",
     *       },
     *     },
     *     unset: [ "rating" ],
     *   },
     * ])
     * @example
     * client.activitiesPartialUpdate([
     *   {
     *     foreign_id: "product:123",
     *     time: "2016-11-10T13:20:00.000000",
     *     set: {
     *       ...
     *     },
     *     unset: [
     *       ...
     *     ]
     *   },
     *   {
     *     foreign_id: "product:321",
     *     time: "2016-11-10T13:20:00.000000",
     *     set: {
     *       ...
     *     },
     *     unset: [
     *       ...
     *     ]
     *   },
     * ])
     */
  }, {
    key: "activitiesPartialUpdate",
    value: function activitiesPartialUpdate(changes) {
      if (!(changes instanceof Array)) {
        throw new TypeError('changes should be an Array');
      }
      changes.forEach(function (item) {
        if (!(item instanceof Object)) {
          throw new TypeError("changeset should be and Object");
        }
        if (item.foreignID) {
          item.foreign_id = item.foreignID;
        }
        if (item.id === undefined && (item.foreign_id === undefined || item.time === undefined)) {
          throw new TypeError('missing id or foreign_id and time');
        }
        if (item.set && !(item.set instanceof Object)) {
          throw new TypeError('set field should be an Object');
        }
        if (item.unset && !(item.unset instanceof Array)) {
          throw new TypeError('unset field should be an Array');
        }
      });
      var token = this.userToken;
      if (this.usingApiSecret) {
        token = (0,signing/* JWTScopeToken */.v)(this.apiSecret, 'activities', '*', {
          feedId: '*',
          expireTokens: this.expireTokens
        });
      }
      return this.post({
        url: 'activity/',
        body: {
          changes: changes
        },
        token: token
      });
    }
  }]);
  return StreamClient;
}();

/***/ }),

/***/ 3709:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   R: () => (/* binding */ CollectionEntry),
/* harmony export */   n: () => (/* binding */ Collections)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5861);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5671);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3144);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4942);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4687);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2589);






var CollectionEntry = /*#__PURE__*/function () {
  function CollectionEntry(
  // eslint-disable-next-line no-use-before-define
  store, collection, id, data) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(this, CollectionEntry);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(this, "id", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(this, "collection", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(this, "store", void 0);
    // eslint-disable-line no-use-before-define
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(this, "data", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(this, "full", void 0);
    this.collection = collection;
    this.store = store;
    this.id = id;
    this.data = data;
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(CollectionEntry, [{
    key: "ref",
    value: function ref() {
      return "SO:".concat(this.collection, ":").concat(this.id);
    }

    /**
     * get item from collection and sync data
     * @method get
     * @memberof CollectionEntry.prototype
     * @return {Promise<CollectionEntry<StreamFeedGenerics>>}
     * @example collection.get("0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     */
  }, {
    key: "get",
    value: function () {
      var _get = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.store.get(this.collection, this.id);
            case 2:
              response = _context.sent;
              this.data = response.data;
              this.full = response;
              return _context.abrupt("return", response);
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function get() {
        return _get.apply(this, arguments);
      }
      return get;
    }()
    /**
     * Add item to collection
     * @link https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=js#adding-collections
     * @method add
     * @memberof CollectionEntry.prototype
     * @return {Promise<CollectionEntry<StreamFeedGenerics>>}
     * @example collection.add("cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
  }, {
    key: "add",
    value: function () {
      var _add = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2() {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.store.add(this.collection, this.id, this.data);
            case 2:
              response = _context2.sent;
              this.data = response.data;
              this.full = response;
              return _context2.abrupt("return", response);
            case 6:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function add() {
        return _add.apply(this, arguments);
      }
      return add;
    }()
    /**
     * Update item in the object storage
     * @link https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=js#updating-collections
     * @method update
     * @memberof CollectionEntry.prototype
     * @return {Promise<CollectionEntry<StreamFeedGenerics>>}
     * @example store.update("0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"name": "cheese burger","toppings": "cheese"})
     * @example store.update("cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
  }, {
    key: "update",
    value: function () {
      var _update = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee3() {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.store.update(this.collection, this.id, this.data);
            case 2:
              response = _context3.sent;
              this.data = response.data;
              this.full = response;
              return _context3.abrupt("return", response);
            case 6:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function update() {
        return _update.apply(this, arguments);
      }
      return update;
    }()
    /**
     * Delete item from collection
     * @link https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=js#removing-collections
     * @method delete
     * @memberof CollectionEntry.prototype
     * @return {Promise<APIResponse>}
     * @example collection.delete("cheese101")
     */
  }, {
    key: "delete",
    value: function () {
      var _delete2 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee4() {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return this.store.delete(this.collection, this.id);
            case 2:
              response = _context4.sent;
              this.data = null;
              this.full = null;
              return _context4.abrupt("return", response);
            case 6:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function _delete() {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }]);
  return CollectionEntry;
}();
var Collections = /*#__PURE__*/function () {
  /**
   * Initialize a feed object
   * @method constructor
   * @memberof Collections.prototype
   * @param {StreamCloudClient} client Stream client this collection is constructed from
   * @param {string} token JWT token
   */
  function Collections(client, token) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(this, Collections);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(this, "client", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(this, "token", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(this, "buildURL", function (collection, itemId) {
      var url = "collections/".concat(collection, "/");
      return itemId === undefined ? url : "".concat(url).concat(itemId, "/");
    });
    this.client = client;
    this.token = token;
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(Collections, [{
    key: "entry",
    value: function entry(collection, itemId, itemData) {
      return new CollectionEntry(this, collection, itemId, itemData);
    }

    /**
     * get item from collection
     * @link https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=js#retrieving-collections
     * @method get
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param  {string}   itemId  id for this entry
     * @return {Promise<CollectionEntry<StreamFeedGenerics>>}
     * @example collection.get("food", "0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     */
  }, {
    key: "get",
    value: function () {
      var _get2 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee5(collection, itemId) {
        var response, entry;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return this.client.get({
                url: this.buildURL(collection, itemId),
                token: this.token
              });
            case 2:
              response = _context5.sent;
              entry = this.entry(response.collection, response.id, response.data);
              entry.full = response;
              return _context5.abrupt("return", entry);
            case 6:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function get(_x, _x2) {
        return _get2.apply(this, arguments);
      }
      return get;
    }()
    /**
     * Add item to collection
     * @link https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=js#adding-collections
     * @method add
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param  {string | null}    itemId  entry id, if null a random id will be assigned to the item
     * @param  {CollectionType}   itemData  ObjectStore data
     * @return {Promise<CollectionEntry<StreamFeedGenerics>>}
     * @example collection.add("food", "cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
  }, {
    key: "add",
    value: function () {
      var _add2 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee6(collection, itemId, itemData) {
        var response, entry;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return this.client.post({
                url: this.buildURL(collection),
                body: {
                  id: itemId === null ? undefined : itemId,
                  data: itemData
                },
                token: this.token
              });
            case 2:
              response = _context6.sent;
              entry = this.entry(response.collection, response.id, response.data);
              entry.full = response;
              return _context6.abrupt("return", entry);
            case 6:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function add(_x3, _x4, _x5) {
        return _add2.apply(this, arguments);
      }
      return add;
    }()
    /**
     * Update entry in the collection
     * @link https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=js#updating-collections
     * @method update
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param  {string}   entryId  Collection object id
     * @param  {CollectionType}   data  ObjectStore data
     * @return {Promise<CollectionEntry<StreamFeedGenerics>>}
     * @example store.update("0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"name": "cheese burger","toppings": "cheese"})
     * @example store.update("food", "cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
  }, {
    key: "update",
    value: function () {
      var _update2 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee7(collection, entryId, data) {
        var response, entry;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return this.client.put({
                url: this.buildURL(collection, entryId),
                body: {
                  data: data
                },
                token: this.token
              });
            case 2:
              response = _context7.sent;
              entry = this.entry(response.collection, response.id, response.data);
              entry.full = response;
              return _context7.abrupt("return", entry);
            case 6:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function update(_x6, _x7, _x8) {
        return _update2.apply(this, arguments);
      }
      return update;
    }()
    /**
     * Delete entry from collection
     * @link https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=js#removing-collections
     * @method delete
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param  {string}   entryId  Collection entry id
     * @return {Promise<APIResponse>} Promise object
     * @example collection.delete("food", "cheese101")
     */
  }, {
    key: "delete",
    value: function _delete(collection, entryId) {
      return this.client.delete({
        url: this.buildURL(collection, entryId),
        token: this.token
      });
    }

    /**
     * Upsert one or more items within a collection.
     * @link https://getstream.io/activity-feeds/docs/node/collections_batch/?language=js#upsert
     * @method upsert
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param {NewCollectionEntry<StreamFeedGenerics> | NewCollectionEntry<StreamFeedGenerics>[]} data - A single json object or an array of objects
     * @return {Promise<UpsertCollectionAPIResponse<StreamFeedGenerics>>}
     */
  }, {
    key: "upsert",
    value: function upsert(collection, data) {
      if (!this.client.usingApiSecret) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__/* .SiteError */ .z4('This method can only be used server-side using your API Secret');
      }
      if (!Array.isArray(data)) data = [data];
      return this.client.post({
        url: 'collections/',
        serviceName: 'api',
        body: {
          data: (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)({}, collection, data)
        },
        token: this.client.getCollectionsToken()
      });
    }

    /**
     * UpsertMany one or more items into many collections.
     * @link https://getstream.io/activity-feeds/docs/node/collections_batch/?language=js#upsert
     * @method upsert
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param {UpsertManyCollectionRequest} items - A single json object that contains information of many collections
     * @return {Promise<UpsertCollectionAPIResponse<StreamFeedGenerics>>}
     */
  }, {
    key: "upsertMany",
    value: function upsertMany(items) {
      if (!this.client.usingApiSecret) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__/* .SiteError */ .z4('This method can only be used server-side using your API Secret');
      }
      return this.client.post({
        url: 'collections/',
        serviceName: 'api',
        body: {
          data: items
        },
        token: this.client.getCollectionsToken()
      });
    }

    /**
     * Select all objects with ids from the collection.
     * @link https://getstream.io/activity-feeds/docs/node/collections_batch/?language=js#select
     * @method select
     * @memberof Collections.prototype
     * @param {string} collection  collection name
     * @param {string | string[]} ids - A single object id or an array of ids
     * @return {Promise<SelectCollectionAPIResponse<StreamFeedGenerics>>}
     */
  }, {
    key: "select",
    value: function select(collection, ids) {
      if (!this.client.usingApiSecret) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__/* .SiteError */ .z4('This method can only be used server-side using your API Secret');
      }
      if (!Array.isArray(ids)) ids = [ids];
      return this.client.get({
        url: 'collections/',
        serviceName: 'api',
        qs: {
          foreign_ids: ids.map(function (id) {
            return "".concat(collection, ":").concat(id);
          }).join(',')
        },
        token: this.client.getCollectionsToken()
      });
    }

    /**
     * Remove all objects by id from the collection.
     * @link https://getstream.io/activity-feeds/docs/node/collections_batch/?language=js#delete_many
     * @method delete
     * @memberof Collections.prototype
     * @param {string} collection  collection name
     * @param {string | string[]} ids - A single object id or an array of ids
     * @return {Promise<APIResponse>}
     */
  }, {
    key: "deleteMany",
    value: function deleteMany(collection, ids) {
      if (!this.client.usingApiSecret) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__/* .SiteError */ .z4('This method can only be used server-side using your API Secret');
      }
      if (!Array.isArray(ids)) ids = [ids];
      var params = {
        collection_name: collection,
        ids: ids.map(function (id) {
          return id.toString();
        }).join(',')
      };
      return this.client.delete({
        url: 'collections/',
        serviceName: 'api',
        qs: params,
        token: this.client.getCollectionsToken()
      });
    }
  }]);
  return Collections;
}();

/***/ }),

/***/ 2631:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ connect)
/* harmony export */ });
/* harmony import */ var _client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3513);


/**
 * Create StreamClient
 * @link https://getstream.io/activity-feeds/docs/node/feeds_getting_started/?language=js#setup
 * @method connect
 * @param  {string} apiKey    API key
 * @param  {string} [apiSecret] API secret (only use this on the server)
 * @param  {string} [appId]     Application identifier
 * @param {ClientOptions} [options] - additional options
 * @param {string} [options.location] - which data center to use
 * @param {boolean} [options.expireTokens=false] - whether to use a JWT timestamp field (i.e. iat)
 * @param {string} [options.version] - advanced usage, custom api version
 * @param {boolean} [options.keepAlive] - axios keepAlive, default to true
 * @param {number} [options.timeout] - axios timeout in Ms, default to 10s
 * @return {StreamClient}     StreamClient
 * @example <caption>Basic usage</caption>
 * stream.connect(apiKey, apiSecret);
 * @example <caption>or if you want to be able to subscribe and listen</caption>
 * stream.connect(apiKey, apiSecret, appId);
 * @example <caption>or on Heroku</caption>
 * stream.connect(streamURL);
 * @example <caption>where streamURL looks like</caption>
 * "https://thierry:pass@gestream.io/?app=1"
 */
function connect(apiKey, apiSecret, appId, options) {
  var _process$env;
  if (typeof process !== 'undefined' && (_process$env = ({"PACKAGE_VERSION":"8.4.0"})) !== null && _process$env !== void 0 && _process$env.STREAM_URL && !apiKey) {
    var parts = /https:\/\/(\w+):(\w+)@([\w-]*).*\?app_id=(\d+)/.exec(({"PACKAGE_VERSION":"8.4.0"}).STREAM_URL) || [];
    apiKey = parts[1];
    apiSecret = parts[2];
    var location = parts[3];
    appId = parts[4];
    if (options === undefined) {
      options = {};
    }
    if (location !== 'getstream' && location !== 'stream-io-api') {
      options.location = location;
    }
  }
  return new _client__WEBPACK_IMPORTED_MODULE_0__/* .StreamClient */ .n(apiKey, apiSecret, appId, options);
}

/***/ }),

/***/ 2589:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  IY: () => (/* binding */ FeedError),
  uA: () => (/* binding */ MissingSchemaError),
  z4: () => (/* binding */ SiteError),
  eY: () => (/* binding */ StreamApiError)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
var createClass = __webpack_require__(3144);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
var classCallCheck = __webpack_require__(5671);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
var esm_typeof = __webpack_require__(1002);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js


function _possibleConstructorReturn(self, call) {
  if (call && ((0,esm_typeof/* default */.Z)(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/isNativeFunction.js
function _isNativeFunction(fn) {
  try {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  } catch (e) {
    return typeof fn === "function";
  }
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/construct.js


function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct.bind();
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js




function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;
  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;
    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);
      _cache.set(Class, Wrapper);
    }
    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };
  return _wrapNativeSuper(Class);
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__(4942);
;// CONCATENATED MODULE: ./src/errors.ts








function _createSuper(Derived) { var hasNativeReflectConstruct = errors_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function errors_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var canCapture = typeof Error.captureStackTrace === 'function';
var canStack = !!new Error().stack;

/**
 * Abstract error object
 * @class ErrorAbstract
 * @access private
 * @param  {string}      [msg]         Error message
 */
var ErrorAbstract = /*#__PURE__*/function (_Error) {
  _inherits(ErrorAbstract, _Error);
  var _super = _createSuper(ErrorAbstract);
  function ErrorAbstract(msg) {
    var _this;
    (0,classCallCheck/* default */.Z)(this, ErrorAbstract);
    _this = _super.call(this, msg);
    (0,defineProperty/* default */.Z)(_assertThisInitialized(_this), "message", void 0);
    _this.message = msg;
    if (canCapture) {
      Error.captureStackTrace(_assertThisInitialized(_this), ErrorAbstract.constructor);
    } else if (canStack) {
      _this.stack = new Error().stack;
    } else {
      _this.stack = '';
    }
    return _this;
  }
  return (0,createClass/* default */.Z)(ErrorAbstract);
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * FeedError
 * @class FeedError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param {String} [msg] - An error message that will probably end up in a log.
 */
var FeedError = /*#__PURE__*/function (_ErrorAbstract) {
  _inherits(FeedError, _ErrorAbstract);
  var _super2 = _createSuper(FeedError);
  function FeedError() {
    (0,classCallCheck/* default */.Z)(this, FeedError);
    return _super2.apply(this, arguments);
  }
  return (0,createClass/* default */.Z)(FeedError);
}(ErrorAbstract);

/**
 * SiteError
 * @class SiteError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param  {string}  [msg]  An error message that will probably end up in a log.
 */
var SiteError = /*#__PURE__*/function (_ErrorAbstract2) {
  _inherits(SiteError, _ErrorAbstract2);
  var _super3 = _createSuper(SiteError);
  function SiteError() {
    (0,classCallCheck/* default */.Z)(this, SiteError);
    return _super3.apply(this, arguments);
  }
  return (0,createClass/* default */.Z)(SiteError);
}(ErrorAbstract);

/**
 * MissingSchemaError
 * @method MissingSchemaError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param  {string} msg
 */
var MissingSchemaError = /*#__PURE__*/function (_ErrorAbstract3) {
  _inherits(MissingSchemaError, _ErrorAbstract3);
  var _super4 = _createSuper(MissingSchemaError);
  function MissingSchemaError() {
    (0,classCallCheck/* default */.Z)(this, MissingSchemaError);
    return _super4.apply(this, arguments);
  }
  return (0,createClass/* default */.Z)(MissingSchemaError);
}(ErrorAbstract);

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
var StreamApiError = /*#__PURE__*/function (_ErrorAbstract4) {
  _inherits(StreamApiError, _ErrorAbstract4);
  var _super5 = _createSuper(StreamApiError);
  function StreamApiError(msg, data, response) {
    var _this2;
    (0,classCallCheck/* default */.Z)(this, StreamApiError);
    _this2 = _super5.call(this, msg);
    (0,defineProperty/* default */.Z)(_assertThisInitialized(_this2), "error", void 0);
    (0,defineProperty/* default */.Z)(_assertThisInitialized(_this2), "response", void 0);
    _this2.error = data;
    _this2.response = response;
    return _this2;
  }
  return (0,createClass/* default */.Z)(StreamApiError);
}(ErrorAbstract);

/***/ }),

/***/ 7248:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   r: () => (/* binding */ StreamFeed)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5671);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3144);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4942);
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7878);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2589);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2637);



function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/// <reference path="../types/modules.d.ts" />




/**
 * Manage api calls for specific feeds
 * The feed object contains convenience functions such add activity, remove activity etc
 * @class StreamFeed
 */
var StreamFeed = /*#__PURE__*/function () {
  /**
   * Initialize a feed object
   * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js
   * @method constructor
   * @memberof StreamFeed.prototype
   * @param {StreamClient} client - The stream client this feed is constructed from
   * @param {string} feedSlug - The feed slug
   * @param {string} userId - The user id
   * @param {string} [token] - The authentication token
   */
  function StreamFeed(client, feedSlug, userId, token) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(this, StreamFeed);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this, "client", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this, "token", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this, "id", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this, "slug", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this, "userId", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this, "feedUrl", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this, "feedTogether", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this, "notificationChannel", void 0);
    if (!feedSlug || !userId) {
      throw new _errors__WEBPACK_IMPORTED_MODULE_2__/* .FeedError */ .IY('Please provide a feed slug and user id, ie client.feed("user", "1")');
    }
    if (feedSlug.indexOf(':') !== -1) {
      throw new _errors__WEBPACK_IMPORTED_MODULE_2__/* .FeedError */ .IY('Please initialize the feed using client.feed("user", "1") not client.feed("user:1")');
    }
    _utils__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.validateFeedSlug(feedSlug);
    _utils__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.validateUserId(userId);

    // raise an error if there is no token
    if (!token) {
      throw new _errors__WEBPACK_IMPORTED_MODULE_2__/* .FeedError */ .IY('Missing token, in client side mode please provide a feed secret');
    }
    this.client = client;
    this.slug = feedSlug;
    this.userId = userId;
    this.id = "".concat(this.slug, ":").concat(this.userId);
    this.token = token;
    this.feedUrl = this.id.replace(':', '/');
    this.feedTogether = this.id.replace(':', '');

    // faye setup
    this.notificationChannel = "site-".concat(this.client.appId, "-feed-").concat(this.feedTogether);
  }

  /**
   * Adds the given activity to the feed
   * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#adding-activities-basic
   * @method addActivity
   * @memberof StreamFeed.prototype
   * @param {NewActivity<StreamFeedGenerics>} activity - The activity to add
   * @return {Promise<Activity<StreamFeedGenerics>>}
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)(StreamFeed, [{
    key: "addActivity",
    value: function addActivity(activity) {
      activity = _utils__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.replaceStreamObjects(activity);
      if (!activity.actor && this.client.currentUser) {
        activity.actor = this.client.currentUser.ref();
      }
      return this.client.post({
        url: "feed/".concat(this.feedUrl, "/"),
        body: activity,
        token: this.token
      });
    }

    /**
     * Removes the activity by activityId or foreignId
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#removing-activities
     * @method removeActivity
     * @memberof StreamFeed.prototype
     * @param  {string} activityOrActivityId Identifier of activity to remove
     * @return {Promise<APIResponse & { removed: string }>}
     * @example feed.removeActivity(activityId);
     * @example feed.removeActivity({'foreign_id': foreignId});
     */
  }, {
    key: "removeActivity",
    value: function removeActivity(activityOrActivityId) {
      var foreign_id = activityOrActivityId.foreignId || activityOrActivityId.foreign_id;
      return this.client.delete({
        url: "feed/".concat(this.feedUrl, "/").concat(foreign_id || activityOrActivityId, "/"),
        qs: foreign_id ? {
          foreign_id: '1'
        } : {},
        token: this.token
      });
    }

    /**
     * Adds the given activities to the feed
     * @link https://getstream.io/activity-feeds/docs/node/add_many_activities/?language=js#batch-add-activities
     * @method addActivities
     * @memberof StreamFeed.prototype
     * @param  {NewActivity<StreamFeedGenerics>[]}   activities Array of activities to add
     * @return {Promise<Activity<StreamFeedGenerics>[]>}
     */
  }, {
    key: "addActivities",
    value: function addActivities(activities) {
      return this.client.post({
        url: "feed/".concat(this.feedUrl, "/"),
        body: {
          activities: _utils__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.replaceStreamObjects(activities)
        },
        token: this.token
      });
    }

    /**
     * Follows the given target feed
     * @link https://getstream.io/activity-feeds/docs/node/following/?language=js
     * @method follow
     * @memberof StreamFeed.prototype
     * @param  {string}   targetSlug   Slug of the target feed
     * @param  {string}   targetUserId User identifier of the target feed
     * @param  {object}   [options]      Additional options
     * @param  {number}   [options.limit] Limit the amount of activities copied over on follow
     * @return {Promise<APIResponse>}
     * @example feed.follow('user', '1');
     * @example feed.follow('user', '1');
     * @example feed.follow('user', '1', options);
     */
  }, {
    key: "follow",
    value: function follow(targetSlug, targetUserId) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (targetUserId instanceof _user__WEBPACK_IMPORTED_MODULE_1__/* .StreamUser */ .h) {
        targetUserId = targetUserId.id;
      }
      _utils__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.validateFeedSlug(targetSlug);
      _utils__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.validateUserId(targetUserId);
      var body = {
        target: "".concat(targetSlug, ":").concat(targetUserId)
      };
      if (typeof options.limit === 'number') body.activity_copy_limit = options.limit;
      return this.client.post({
        url: "feed/".concat(this.feedUrl, "/following/"),
        body: body,
        token: this.token
      });
    }

    /**
     * Unfollow the given feed
     * @link https://getstream.io/activity-feeds/docs/node/following/?language=js#unfollowing-feeds
     * @method unfollow
     * @memberof StreamFeed.prototype
     * @param  {string}   targetSlug   Slug of the target feed
     * @param  {string}   targetUserId User identifier of the target feed
     * @param  {object} [options]
     * @param  {boolean} [options.keepHistory] when provided the activities from target
     *                                                 feed will not be kept in the feed
     * @return {Promise<APIResponse>}
     * @example feed.unfollow('user', '2');
     */
  }, {
    key: "unfollow",
    value: function unfollow(targetSlug, targetUserId) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var qs = {};
      if (typeof options.keepHistory === 'boolean' && options.keepHistory) qs.keep_history = '1';
      _utils__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.validateFeedSlug(targetSlug);
      _utils__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z.validateUserId(targetUserId);
      var targetFeedId = "".concat(targetSlug, ":").concat(targetUserId);
      return this.client.delete({
        url: "feed/".concat(this.feedUrl, "/following/").concat(targetFeedId, "/"),
        qs: qs,
        token: this.token
      });
    }

    /**
     * List which feeds this feed is following
     * @link https://getstream.io/activity-feeds/docs/node/following/?language=js#reading-followed-feeds
     * @method following
     * @memberof StreamFeed.prototype
     * @param  {GetFollowOptions}   [options]  Additional options
     * @param  {string[]}   options.filter array of feed id to filter on
     * @param  {number}   options.limit pagination
     * @param  {number}   options.offset pagination
     * @return {Promise<GetFollowAPIResponse>}
     * @example feed.following({limit:10, filter: ['user:1', 'user:2']});
     */
  }, {
    key: "following",
    value: function following() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var extraOptions = {};
      if (options.filter) extraOptions.filter = options.filter.join(',');
      return this.client.get({
        url: "feed/".concat(this.feedUrl, "/following/"),
        qs: _objectSpread(_objectSpread({}, options), extraOptions),
        token: this.token
      });
    }

    /**
     * List the followers of this feed
     * @link https://getstream.io/activity-feeds/docs/node/following/?language=js#reading-feed-followers
     * @method followers
     * @memberof StreamFeed.prototype
     * @param  {GetFollowOptions}   [options]  Additional options
     * @param  {string[]}   options.filter array of feed id to filter on
     * @param  {number}   options.limit pagination
     * @param  {number}   options.offset pagination
     * @return {Promise<GetFollowAPIResponse>}
     * @example feed.followers({limit:10, filter: ['user:1', 'user:2']});
     */
  }, {
    key: "followers",
    value: function followers() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var extraOptions = {};
      if (options.filter) extraOptions.filter = options.filter.join(',');
      return this.client.get({
        url: "feed/".concat(this.feedUrl, "/followers/"),
        qs: _objectSpread(_objectSpread({}, options), extraOptions),
        token: this.token
      });
    }

    /**
     *  Retrieve the number of follower and following feed stats of the current feed.
     *  For each count, feed slugs can be provided to filter counts accordingly.
     * @link https://getstream.io/activity-feeds/docs/node/following/?language=js#reading-follow-stats
     * @method followStats
     * @param  {object}   [options]
     * @param  {string[]} [options.followerSlugs] find counts only on these slugs
     * @param  {string[]} [options.followingSlugs] find counts only on these slugs
     * @return {Promise<FollowStatsAPIResponse>}
     * @example feed.followStats();
     * @example feed.followStats({ followerSlugs:['user', 'news'], followingSlugs:['timeline'] });
     */
  }, {
    key: "followStats",
    value: function followStats() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var qs = {
        followers: this.id,
        following: this.id
      };
      if (options.followerSlugs && options.followerSlugs.length) qs.followers_slugs = options.followerSlugs.join(',');
      if (options.followingSlugs && options.followingSlugs.length) qs.following_slugs = options.followingSlugs.join(',');
      return this.client.get({
        url: 'stats/follow/',
        qs: qs,
        token: this.client.getOrCreateToken() || this.token
      });
    }

    /**
     * Reads the feed
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#retrieving-activities
     * @method get
     * @memberof StreamFeed.prototype
     * @param {GetFeedOptions} options  Additional options
     * @return {Promise<FeedAPIResponse>}
     * @example feed.get({limit: 10, id_lte: 'activity-id'})
     * @example feed.get({limit: 10, mark_seen: true})
     */
  }, {
    key: "get",
    value: function get() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var extraOptions = {};
      if (options.mark_read && options.mark_read.join) {
        extraOptions.mark_read = options.mark_read.join(',');
      }
      if (options.mark_seen && options.mark_seen.join) {
        extraOptions.mark_seen = options.mark_seen.join(',');
      }
      this.client.replaceReactionOptions(options);
      var path = this.client.shouldUseEnrichEndpoint(options) ? 'enrich/feed/' : 'feed/';
      return this.client.get({
        url: "".concat(path).concat(this.feedUrl, "/"),
        qs: _objectSpread(_objectSpread({}, options), extraOptions),
        token: this.token
      });
    }

    /**
     * Retrieves one activity from a feed and adds enrichment
     * @link https://getstream.io/activity-feeds/docs/node/adding_activities/?language=js#retrieving-activities
     * @method getActivityDetail
     * @memberof StreamFeed.prototype
     * @param  {string}   activityId Identifier of activity to retrieve
     * @param  {EnrichOptions}   options  Additional options
     * @return {Promise<FeedAPIResponse>}
     * @example feed.getActivityDetail(activityId)
     * @example feed.getActivityDetail(activityId, {withRecentReactions: true})
     * @example feed.getActivityDetail(activityId, {withReactionCounts: true})
     * @example feed.getActivityDetail(activityId, {withScoreVars: true})
     * @example feed.getActivityDetail(activityId, {withOwnReactions: true, withReactionCounts: true})
     */
  }, {
    key: "getActivityDetail",
    value: function getActivityDetail(activityId, options) {
      return this.get(_objectSpread({
        id_lte: activityId,
        id_gte: activityId,
        limit: 1
      }, options || {}));
    }

    /**
     * Returns the current faye client object
     * @method getFayeClient
     * @memberof StreamFeed.prototype
     * @access private
     * @return {Faye.Client} Faye client
     */
  }, {
    key: "getFayeClient",
    value: function getFayeClient() {
      return this.client.getFayeClient();
    }

    /**
     * Subscribes to any changes in the feed, return a promise
     * @link https://getstream.io/activity-feeds/docs/node/web_and_mobile/?language=js#subscribe-to-realtime-updates-via-api-client
     * @method subscribe
     * @memberof StreamFeed.prototype
     * @param  {function} Faye.Callback<RealTimeMessage<StreamFeedGenerics>> Callback to call on completion
     * @return {Promise<Faye.Subscription>}
     * @example
     * feed.subscribe(callback).then(function(){
     * 		console.log('we are now listening to changes');
     * });
     */
  }, {
    key: "subscribe",
    value: function subscribe(callback) {
      if (!this.client.appId) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_2__/* .SiteError */ .z4('Missing app id, which is needed to subscribe, use var client = stream.connect(key, secret, appId);');
      }
      var subscription = this.getFayeClient().subscribe("/".concat(this.notificationChannel), callback);
      this.client.subscriptions["/".concat(this.notificationChannel)] = {
        token: this.token,
        userId: this.notificationChannel,
        fayeSubscription: subscription
      };
      return subscription;
    }

    /**
     * Cancel updates created via feed.subscribe()
     * @link https://getstream.io/activity-feeds/docs/node/web_and_mobile/?language=js#subscribe-to-realtime-updates-via-api-client
     * @return void
     */
  }, {
    key: "unsubscribe",
    value: function unsubscribe() {
      var streamSubscription = this.client.subscriptions["/".concat(this.notificationChannel)];
      if (streamSubscription) {
        delete this.client.subscriptions["/".concat(this.notificationChannel)];
        streamSubscription.fayeSubscription.cancel();
      }
    }
  }, {
    key: "_validateToTargetInput",
    value: function _validateToTargetInput(foreignId, time, newTargets, addedTargets, removedTargets) {
      if (!foreignId) throw new Error('Missing `foreign_id` parameter!');
      if (!time) throw new Error('Missing `time` parameter!');
      if (!newTargets && !addedTargets && !removedTargets) {
        throw new Error('Requires you to provide at least one parameter for `newTargets`, `addedTargets`, or `removedTargets` - example: `updateActivityToTargets("foreignID:1234", new Date(), [newTargets...], [addedTargets...], [removedTargets...])`');
      }
      if (newTargets) {
        if (addedTargets || removedTargets) {
          throw new Error("Can't include add_targets or removedTargets if you're also including newTargets");
        }
      }
      if (addedTargets && removedTargets) {
        // brute force - iterate through added, check to see if removed contains that element
        addedTargets.forEach(function (addedTarget) {
          if (removedTargets.includes(addedTarget)) {
            throw new Error("Can't have the same feed ID in addedTargets and removedTargets.");
          }
        });
      }
    }

    /**
     * Updates an activity's "to" fields
     * @link https://getstream.io/activity-feeds/docs/node/targeting/?language=js
     * @param {string} foreignId The foreign_id of the activity to update
     * @param {string} time The time of the activity to update
     * @param {string[]} newTargets Set the new "to" targets for the activity - will remove old targets
     * @param {string[]} addedTargets Add these new targets to the activity
     * @param {string[]} removedTargets Remove these targets from the activity
     */
  }, {
    key: "updateActivityToTargets",
    value: function updateActivityToTargets(foreignId, time, newTargets, addedTargets, removedTargets) {
      return this._updateActivityToTargetsMany([{
        foreignId: foreignId,
        time: time,
        newTargets: newTargets,
        addedTargets: addedTargets,
        removedTargets: removedTargets
      }]);
    }

    // NOTE: it can change without notice
  }, {
    key: "_updateActivityToTargetsMany",
    value: function _updateActivityToTargetsMany(inputs) {
      if (!inputs || inputs.length === 0) {
        throw new Error('At least one input is required');
      }
      var body = [];
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        this._validateToTargetInput(input.foreignId, input.time, input.newTargets, input.addedTargets, input.removedTargets);
        var item = {
          foreign_id: input.foreignId,
          time: input.time
        };
        if (input.newTargets) item.new_targets = input.newTargets;
        if (input.addedTargets) item.added_targets = input.addedTargets;
        if (input.removedTargets) item.removed_targets = input.removedTargets;
        body.push(item);
      }
      return this.client.post({
        url: "feed_targets/".concat(this.feedUrl, "/activity_to_targets/"),
        token: this.token,
        body: body.length > 1 ? body : body[0]
      });
    }
  }]);
  return StreamFeed;
}();

/***/ }),

/***/ 448:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   h: () => (/* binding */ StreamFileStore)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5671);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3144);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4942);



var StreamFileStore = /*#__PURE__*/function () {
  function StreamFileStore(client, token) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this, StreamFileStore);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(this, "client", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(this, "token", void 0);
    this.client = client;
    this.token = token;
  }

  // React Native does not auto-detect MIME type, you need to pass that via contentType
  // param. If you don't then Android will refuse to perform the upload
  /**
   * upload a File instance or a readable stream of data
   * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#upload
   * @param {File|Buffer|NodeJS.ReadStream|string} uri - File object or stream or URI
   * @param {string} [name] - file name
   * @param {string} [contentType] - mime-type
   * @param {function} [onUploadProgress] - browser only, Function that is called with upload progress
   * @return {Promise<FileUploadAPIResponse>}
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(StreamFileStore, [{
    key: "upload",
    value: function upload(uri, name, contentType, onUploadProgress) {
      return this.client.upload('files/', uri, name, contentType, onUploadProgress);
    }

    /**
     * delete an uploaded file
     * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#delete
     * @param {string} uri
     */
  }, {
    key: "delete",
    value: function _delete(uri) {
      return this.client.delete({
        url: "files/",
        qs: {
          url: uri
        },
        token: this.token
      });
    }
  }]);
  return StreamFileStore;
}();

/***/ }),

/***/ 9082:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  $: () => (/* binding */ StreamImageStore)
});

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
var classCallCheck = __webpack_require__(5671);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
var createClass = __webpack_require__(3144);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__(4942);
;// CONCATENATED MODULE: ./src/images.ts




var StreamImageStore = /*#__PURE__*/function () {
  function StreamImageStore(client, token) {
    (0,classCallCheck/* default */.Z)(this, StreamImageStore);
    (0,defineProperty/* default */.Z)(this, "client", void 0);
    (0,defineProperty/* default */.Z)(this, "token", void 0);
    this.client = client;
    this.token = token;
  }

  // React Native does not auto-detect MIME type, you need to pass that via contentType
  // param. If you don't then Android will refuse to perform the upload
  /**
   * upload an Image File instance or a readable stream of data
   * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#upload
   * @param {File|Buffer|NodeJS.ReadStream|string} uri - File object or stream or URI
   * @param {string} [name] - file name
   * @param {string} [contentType] - mime-type
   * @param {function} [onUploadProgress] - browser only, Function that is called with upload progress
   * @return {Promise<FileUploadAPIResponse>}
   */
  (0,createClass/* default */.Z)(StreamImageStore, [{
    key: "upload",
    value: function upload(uri, name, contentType, onUploadProgress) {
      return this.client.upload('images/', uri, name, contentType, onUploadProgress);
    }

    /**
     * delete an uploaded image
     * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#delete
     * @param {string} uri
     */
  }, {
    key: "delete",
    value: function _delete(uri) {
      return this.client.delete({
        url: "images/",
        qs: {
          url: uri
        },
        token: this.token
      });
    }

    /**
     * Generate a diffrent variant of the uploaded image
     * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#image_processing
     * @param {string} uri
     * @param {ImageProcessOptions} options
     */
  }, {
    key: "process",
    value: function process(uri, options) {
      var params = _extends(options, {
        url: uri
      });
      if (Array.isArray(params.crop)) {
        params.crop = params.crop.join(',');
      }
      return this.client.get({
        url: "images/",
        qs: params,
        token: this.token
      });
    }

    /**
     * Generate a thumbnail for a given image
     * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#image_processing
     * @param {string} uri
     * @param {number|string} w
     * @param {number|string} h
     * @param {Object} [options]
     */
  }, {
    key: "thumbnail",
    value: function thumbnail(uri, w, h) {
      var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
          crop: 'center',
          resize: 'clip'
        },
        crop = _ref.crop,
        resize = _ref.resize;
      return this.process(uri, {
        w: w,
        h: h,
        crop: crop,
        resize: resize
      });
    }
  }]);
  return StreamImageStore;
}();

/***/ }),

/***/ 8039:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ Personalization)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5671);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3144);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4942);



/**
 * Manage api calls for personalization
 * The collection object contains convenience functions such as  get, post, delete
 * @class Personalization
 */

var Personalization = /*#__PURE__*/function () {
  /**
   * Initialize the Personalization class
   * @link https://getstream.io/activity-feeds/docs/node/personalization_introduction/?language=js
   * @method constructor
   * @memberof Personalization.prototype
   * @param {StreamClient} client - The stream client
   */
  function Personalization(client) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this, Personalization);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(this, "client", void 0);
    this.client = client;
  }

  /**
   * Get personalized activities for this feed
   *
   * @method get
   * @memberof Personalization.prototype
   * @param {string} resource - personalized resource endpoint i.e "follow_recommendations"
   * @param {object} options  Additional options
   * @return {Promise<PersonalizationAPIResponse<StreamFeedGenerics>>} Promise object. Personalized feed
   * @example client.personalization.get('follow_recommendations', {foo: 'bar', baz: 'qux'})
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(Personalization, [{
    key: "get",
    value: function get(resource) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.client.get({
        url: "".concat(resource, "/"),
        serviceName: 'personalization',
        qs: options,
        token: options.token || this.client.getPersonalizationToken()
      });
    }

    /**
     * Post data to personalization endpoint
     *
     * @method post
     * @memberof Personalization.prototype
     * @param {string} resource - personalized resource endpoint i.e "follow_recommendations"
     * @param {object} options - Additional options
     * @param {object} data - Data to send in the payload
     * @return {Promise<PersonalizationAPIResponse<StreamFeedGenerics>>} Promise object. Data that was posted if successful, or an error.
     * @example client.personalization.post('follow_recommendations', {foo: 'bar', baz: 'qux'})
     */
  }, {
    key: "post",
    value: function post(resource) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.client.post({
        url: "".concat(resource, "/"),
        serviceName: 'personalization',
        qs: options,
        body: data,
        token: this.client.getPersonalizationToken()
      });
    }

    /**
     * Delete metadata or activities
     *
     * @method delete
     * @memberof Personalization.prototype
     * @param {object} resource - personalized resource endpoint i.e "follow_recommendations"
     * @param {object} options - Additional options
     * @return {Promise<PersonalizationAPIResponse<StreamFeedGenerics>>} Promise object. Data that was deleted if successful, or an error.
     * @example client.personalization.delete('follow_recommendations', {foo: 'bar', baz: 'qux'})
     */
  }, {
    key: "delete",
    value: function _delete(resource) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.client.delete({
        url: "".concat(resource, "/"),
        serviceName: 'personalization',
        qs: options,
        token: this.client.getPersonalizationToken()
      });
    }
  }]);
  return Personalization;
}();

/***/ }),

/***/ 8824:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   R: () => (/* binding */ StreamReaction)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4925);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5671);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3144);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4942);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2589);




var _excluded = ["user_id", "activity_id", "reaction_id"];

var StreamReaction = /*#__PURE__*/function () {
  /**
   * Initialize a reaction object
   * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js
   * @method constructor
   * @memberof StreamReaction.prototype
   * @param {StreamClient} client Stream client this feed is constructed from
   * @param {string} token JWT token
   * @example new StreamReaction(client, "eyJhbGciOiJIUzI1...")
   */
  function StreamReaction(client, token) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(this, StreamReaction);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(this, "client", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(this, "token", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(this, "buildURL", function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return "".concat(['reaction'].concat(args).join('/'), "/");
    });
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(this, "_convertTargetFeeds", function () {
      var targetFeeds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return targetFeeds.map(function (elem) {
        return typeof elem === 'string' ? elem : elem.id;
      });
    });
    this.client = client;
    this.token = token;
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(StreamReaction, [{
    key: "add",
    value:
    /**
     * add reaction
     * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js#adding-reactions
     * @method add
     * @memberof StreamReaction.prototype
     * @param  {string}   kind  kind of reaction
     * @param  {string}   activity Activity or an ActivityID
     * @param  {ReactionType}   data  data related to reaction
     * @param  {ReactionAddOptions} [options]
     * @param  {string} [options.id] id associated with reaction
     * @param  {string[]} [options.targetFeeds] an array of feeds to which to send an activity with the reaction
     * @param  {string} [options.userId] useful for adding reaction with server token
     * @param  {object} [options.targetFeedsExtraData] extra data related to target feeds
     * @return {Promise<ReactionAPIResponse<ReactionType>>}
     * @example reactions.add("like", "0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     * @example reactions.add("comment", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"text": "love it!"},)
     */
    function add(kind, activity, data) {
      var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        id = _ref.id,
        _ref$targetFeeds = _ref.targetFeeds,
        targetFeeds = _ref$targetFeeds === void 0 ? [] : _ref$targetFeeds,
        userId = _ref.userId,
        targetFeedsExtraData = _ref.targetFeedsExtraData;
      var body = {
        id: id,
        activity_id: activity instanceof Object ? activity.id : activity,
        kind: kind,
        data: data || {},
        target_feeds: this._convertTargetFeeds(targetFeeds),
        user_id: userId
      };
      if (targetFeedsExtraData != null) {
        body.target_feeds_extra_data = targetFeedsExtraData;
      }
      return this.client.post({
        url: this.buildURL(),
        body: body,
        token: this.token
      });
    }

    /**
     * add child reaction
     * @link https://getstream.io/activity-feeds/docs/node/reactions_add_child/?language=js
     * @method addChild
     * @memberof StreamReaction.prototype
     * @param  {string}   kind  kind of reaction
     * @param  {string}   reaction Reaction or a ReactionID
     * @param  {ChildReactionType}   data  data related to reaction
     * @param  {ReactionAddChildOptions} [options]
     * @param  {string[]} [options.targetFeeds] an array of feeds to which to send an activity with the reaction
     * @param  {string} [options.userId] useful for adding reaction with server token
     * @param  {object} [options.targetFeedsExtraData] extra data related to target feeds
     * @return {Promise<ReactionAPIResponse<ChildReactionType>>}
     * @example reactions.add("like", "0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     * @example reactions.add("comment", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"text": "love it!"},)
     */
  }, {
    key: "addChild",
    value: function addChild(kind, reaction, data) {
      var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        _ref2$targetFeeds = _ref2.targetFeeds,
        targetFeeds = _ref2$targetFeeds === void 0 ? [] : _ref2$targetFeeds,
        userId = _ref2.userId,
        targetFeedsExtraData = _ref2.targetFeedsExtraData;
      var body = {
        parent: reaction instanceof Object ? reaction.id : reaction,
        kind: kind,
        data: data || {},
        target_feeds: this._convertTargetFeeds(targetFeeds),
        user_id: userId
      };
      if (targetFeedsExtraData != null) {
        body.target_feeds_extra_data = targetFeedsExtraData;
      }
      return this.client.post({
        url: this.buildURL(),
        body: body,
        token: this.token
      });
    }

    /**
     * get reaction
     * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js#retrieving-reactions
     * @method get
     * @memberof StreamReaction.prototype
     * @param  {string}   id Reaction Id
     * @return {Promise<EnrichedReactionAPIResponse<StreamFeedGenerics>>}
     * @example reactions.get("67b3e3b5-b201-4697-96ac-482eb14f88ec")
     */
  }, {
    key: "get",
    value: function get(id) {
      return this.client.get({
        url: this.buildURL(id),
        token: this.token
      });
    }

    /**
     * retrieve reactions by activity_id, user_id or reaction_id (to paginate children reactions), pagination can be done using id_lt, id_lte, id_gt and id_gte parameters
     * id_lt and id_lte return reactions order by creation descending starting from the reaction with the ID provided, when id_lte is used
     * the reaction with ID equal to the value provided is included.
     * id_gt and id_gte return reactions order by creation ascending (oldest to newest) starting from the reaction with the ID provided, when id_gte is used
     * the reaction with ID equal to the value provided is included.
     * results are limited to 25 at most and are ordered newest to oldest by default.
     * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js#retrieving-reactions
     * @method filter
     * @memberof StreamReaction.prototype
     * @param  {ReactionFilterConditions} conditions Reaction Id {activity_id|user_id|reaction_id:string, kind:string, limit:integer}
     * @return {Promise<ReactionFilterAPIResponse<StreamFeedGenerics>>}
     * @example reactions.filter({activity_id: "0c7db91c-67f9-11e8-bcd9-fe00a9219401", kind:"like"})
     * @example reactions.filter({user_id: "john", kinds:"like"})
     */
  }, {
    key: "filter",
    value: function filter(conditions) {
      var userId = conditions.user_id,
        activityId = conditions.activity_id,
        reactionId = conditions.reaction_id,
        qs = (0,_babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(conditions, _excluded);
      if (!qs.limit) {
        qs.limit = 10;
      }
      if ((userId ? 1 : 0) + (activityId ? 1 : 0) + (reactionId ? 1 : 0) !== 1) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__/* .SiteError */ .z4('Must provide exactly one value for one of these params: user_id, activity_id, reaction_id');
      }
      var lookupType = userId && 'user_id' || activityId && 'activity_id' || reactionId && 'reaction_id';
      var value = userId || activityId || reactionId;
      var url = conditions.kind ? this.buildURL(lookupType, value, conditions.kind) : this.buildURL(lookupType, value);
      return this.client.get({
        url: url,
        qs: qs,
        token: this.token
      });
    }

    /**
     * update reaction
     * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js#updating-reactions
     * @method update
     * @memberof StreamReaction.prototype
     * @param  {string}   id Reaction Id
     * @param  {ReactionType | ChildReactionType}   data  Data associated to reaction or childReaction
     * @param  {ReactionUpdateOptions} [options]
     * @param  {string[]} [options.targetFeeds] Optional feeds to post the activity to. If you sent this before and don't set it here it will be removed.
     * @param  {object} [options.targetFeedsExtraData] extra data related to target feeds
     * @return {Promise<ReactionAPIResponse<ReactionType | ChildReactionType>>}
     * @example reactions.update("67b3e3b5-b201-4697-96ac-482eb14f88ec", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", "like")
     * @example reactions.update("67b3e3b5-b201-4697-96ac-482eb14f88ec", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", "comment", {"text": "love it!"},)
     */
  }, {
    key: "update",
    value: function update(id, data) {
      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref3$targetFeeds = _ref3.targetFeeds,
        targetFeeds = _ref3$targetFeeds === void 0 ? [] : _ref3$targetFeeds,
        targetFeedsExtraData = _ref3.targetFeedsExtraData;
      var body = {
        data: data,
        target_feeds: this._convertTargetFeeds(targetFeeds)
      };
      if (targetFeedsExtraData != null) {
        body.target_feeds_extra_data = targetFeedsExtraData;
      }
      return this.client.put({
        url: this.buildURL(id),
        body: body,
        token: this.token
      });
    }

    /**
     * delete reaction
     * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js#removing-reactions
     * @method delete
     * @memberof StreamReaction.prototype
     * @param  {string}   id Reaction Id
     * @param  {bool}     soft Soft delete
     * @return {Promise<APIResponse>}
     * @example reactions.delete("67b3e3b5-b201-4697-96ac-482eb14f88ec")
     */
  }, {
    key: "delete",
    value: function _delete(id) {
      var soft = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return this.client.delete({
        url: this.buildURL(id),
        token: this.token,
        qs: soft ? {
          soft: 'true'
        } : undefined
      });
    }

    /**
     * restore deleted reaction
     * @link https://getstream.io/activity-feeds/docs/node/reactions_introduction/?language=js#removing-reactions
     * @method restore
     * @memberof StreamReaction.prototype
     * @param  {string}   id Reaction Id
     * @return {Promise<APIResponse>}
     * @example reactions.restore("67b3e3b5-b201-4697-96ac-482eb14f88ec")
     */
  }, {
    key: "restore",
    value: function restore(id) {
      return this.client.put({
        url: this.buildURL(id, 'restore'),
        token: this.token
      });
    }
  }]);
  return StreamReaction;
}();

/***/ }),

/***/ 6685:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ JWTUserSessionToken),
/* harmony export */   v: () => (/* binding */ JWTScopeToken)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4942);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1726);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }


// for a claim in jwt
function joinClaimValue(items) {
  var values = Array.isArray(items) ? items : [items];
  var claims = [];
  for (var i = 0; i < values.length; i += 1) {
    var s = values[i].trim();
    if (s === '*') return s;
    claims.push(s);
  }
  return claims.join(',');
}

/**
 * Creates the JWT token for feedId, resource and action using the apiSecret
 * @method JWTScopeToken
 * @memberof signing
 * @private
 * @param {string} apiSecret - API Secret key
 * @param {string | string[]} resource - JWT payload resource
 * @param {string | string[]} action - JWT payload action
 * @param {object} [options] - Optional additional options
 * @param {string | string[]} [options.feedId] - JWT payload feed identifier
 * @param {string} [options.userId] - JWT payload user identifier
 * @param {boolean} [options.expireTokens] - JWT noTimestamp
 * @return {string} JWT Token
 */
function JWTScopeToken(apiSecret, resource, action) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var noTimestamp = options.expireTokens ? !options.expireTokens : true;
  var payload = {
    resource: joinClaimValue(resource),
    action: joinClaimValue(action)
  };
  if (options.feedId) payload.feed_id = joinClaimValue(options.feedId);
  if (options.userId) payload.user_id = options.userId;
  return jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().sign(payload, apiSecret, {
    algorithm: 'HS256',
    noTimestamp: noTimestamp
  });
}

/**
 * Creates the JWT token that can be used for a UserSession
 * @method JWTUserSessionToken
 * @memberof signing
 * @private
 * @param {string} apiSecret - API Secret key
 * @param {string} userId - The user_id key in the JWT payload
 * @param {object} [extraData] - Extra that should be part of the JWT token
 * @param {object} [jwtOptions] - Options that can be past to jwt.sign
 * @return {string} JWT Token
 */
function JWTUserSessionToken(apiSecret, userId) {
  var extraData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var jwtOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  if (typeof userId !== 'string') {
    throw new TypeError('userId should be a string');
  }
  var payload = _objectSpread({
    user_id: userId
  }, extraData);
  var opts = _objectSpread({
    algorithm: 'HS256',
    noTimestamp: true
  }, jwtOptions);
  return jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().sign(payload, apiSecret, opts);
}

/***/ }),

/***/ 7878:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   h: () => (/* binding */ StreamUser)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5861);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5671);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3144);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4942);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4687);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);





function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var StreamUser = /*#__PURE__*/function () {
  /**
   * Initialize a user session object
   * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js
   * @method constructor
   * @memberof StreamUser.prototype
   * @param {StreamClient} client Stream client this collection is constructed from
   * @param {string} userId The ID of the user
   * @param {string} userAuthToken JWT token
   * @example new StreamUser(client, "123", "eyJhbGciOiJIUzI1...")
   */
  function StreamUser(client, userId, userAuthToken) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(this, StreamUser);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(this, "client", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(this, "token", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(this, "id", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(this, "data", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(this, "full", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(this, "url", void 0);
    this.client = client;
    this.id = userId;
    this.data = undefined;
    this.full = undefined;
    this.token = userAuthToken;
    this.url = "user/".concat(this.id, "/");
  }

  /**
   * Create a stream user ref
   * @return {string}
   */
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(StreamUser, [{
    key: "ref",
    value: function ref() {
      return "SU:".concat(this.id);
    }

    /**
     * Delete the user
     * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#removing-users
     * @return {Promise<APIResponse>}
     */
  }, {
    key: "delete",
    value: function _delete() {
      return this.client.delete({
        url: this.url,
        token: this.token
      });
    }

    /**
     * Get the user data
     * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#retrieving-users
     * @param {boolean} [options.with_follow_counts]
     * @return {Promise<StreamUser>}
     */
  }, {
    key: "get",
    value: function () {
      var _get = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee(options) {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.client.get({
                url: this.url,
                token: this.token,
                qs: options
              });
            case 2:
              response = _context.sent;
              this.full = _objectSpread({}, response);
              delete this.full.duration;
              this.data = this.full.data;
              return _context.abrupt("return", this);
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function get(_x) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
    /**
     * Create a new user in stream
     * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#adding-users
     * @param {object} data user date stored in stream
     * @param {boolean} [options.get_or_create] if user already exists return it
     * @return {Promise<StreamUser>}
     */
  }, {
    key: "create",
    value: function () {
      var _create = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2(data, options) {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.client.post({
                url: 'user/',
                body: {
                  id: this.id,
                  data: data || this.data || {}
                },
                qs: options,
                token: this.token
              });
            case 2:
              response = _context2.sent;
              this.full = _objectSpread({}, response);
              delete this.full.duration;
              this.data = this.full.data;
              return _context2.abrupt("return", this);
            case 7:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function create(_x2, _x3) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
    /**
     * Update the user
     * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#updating-users
     * @param {object} data user date stored in stream
     * @return {Promise<StreamUser>}
     */
  }, {
    key: "update",
    value: function () {
      var _update = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee3(data) {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.client.put({
                url: this.url,
                body: {
                  data: data || this.data || {}
                },
                token: this.token
              });
            case 2:
              response = _context3.sent;
              this.full = _objectSpread({}, response);
              delete this.full.duration;
              this.data = this.full.data;
              return _context3.abrupt("return", this);
            case 7:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function update(_x4) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
    /**
     * Get or Create a new user in stream
     * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#adding-users
     * @param {object} data user date stored in stream
     * @return {Promise<StreamUser>}
     */
  }, {
    key: "getOrCreate",
    value: function getOrCreate(data) {
      return this.create(data, {
        get_or_create: true
      });
    }

    /**
     * Get the user profile, it includes the follow counts by default
     * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#retrieving-users
     * @return {Promise<StreamUser>}
     */
  }, {
    key: "profile",
    value: function profile() {
      return this.get({
        with_follow_counts: true
      });
    }
  }]);
  return StreamUser;
}();

/***/ }),

/***/ 2637:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8152);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1002);
/* harmony import */ var form_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6230);
/* harmony import */ var form_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(form_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2589);




var validFeedSlugRe = /^[\w]+$/;
var validUserIdRe = /^[\w-]+$/;

/*
 * Validate that the feedSlug matches \w
 */
function validateFeedSlug(feedSlug) {
  if (!validFeedSlugRe.test(feedSlug)) {
    throw new _errors__WEBPACK_IMPORTED_MODULE_1__/* .FeedError */ .IY("Invalid feedSlug, please use letters, numbers or _: ".concat(feedSlug));
  }
  return feedSlug;
}

/*
 * Validate the userId matches \w
 */
function validateUserId(userId) {
  if (!validUserIdRe.test(userId)) {
    throw new _errors__WEBPACK_IMPORTED_MODULE_1__/* .FeedError */ .IY("Invalid userId, please use letters, numbers, - or _: ".concat(userId));
  }
  return userId;
}
function rfc3986(str) {
  return str.replace(/[!'()*]/g, function (c) {
    return "%".concat(c.charCodeAt(0).toString(16).toUpperCase());
  });
}
function isReadableStream(obj) {
  return obj !== null && (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(obj) === 'object' && (obj.readable || typeof obj._read === 'function');
}
function isBuffer(obj) {
  return obj != null && obj.constructor != null &&
  // @ts-expect-error
  typeof obj.constructor.isBuffer === 'function' &&
  // @ts-expect-error
  obj.constructor.isBuffer(obj);
}
function isFileWebAPI(uri) {
  return typeof window !== 'undefined' && 'File' in window && uri instanceof File;
}

/*
 * Validate that the feedId matches the spec user:1
 */
function validateFeedId(feedId) {
  var parts = feedId.split(':');
  if (parts.length !== 2) {
    throw new _errors__WEBPACK_IMPORTED_MODULE_1__/* .FeedError */ .IY("Invalid feedId, expected something like user:1 got ".concat(feedId));
  }
  var _parts = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(parts, 2),
    feedSlug = _parts[0],
    userId = _parts[1];
  validateFeedSlug(feedSlug);
  validateUserId(userId);
  return feedId;
}
function addFileToFormData(uri, name, contentType) {
  var data = new (form_data__WEBPACK_IMPORTED_MODULE_0___default())();
  if (isReadableStream(uri) || isBuffer(uri) || isFileWebAPI(uri)) {
    if (name) data.append('file', uri, name);else data.append('file', uri);
  } else {
    data.append('file', {
      uri: uri,
      name: name || uri.split('/').reverse()[0],
      type: contentType || undefined,
      contentType: contentType || undefined
    });
  }
  return data;
}

// TODO: refactor and add proper types
function replaceStreamObjects(obj) {
  // @ts-expect-error
  if (Array.isArray(obj)) return obj.map(function (v) {
    return replaceStreamObjects(v);
  });

  // @ts-expect-error
  if (Object.prototype.toString.call(obj) !== '[object Object]') return obj;

  // @ts-expect-error
  if (typeof obj.ref === 'function') return obj.ref();
  var cloned = {};
  Object.getOwnPropertyNames(obj).forEach(function (k) {
    // @ts-expect-error
    cloned[k] = replaceStreamObjects(obj[k]);
  });

  // @ts-expect-error
  return cloned;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  validateFeedId: validateFeedId,
  validateFeedSlug: validateFeedSlug,
  validateUserId: validateUserId,
  rfc3986: rfc3986,
  isReadableStream: isReadableStream,
  addFileToFormData: addFileToFormData,
  replaceStreamObjects: replaceStreamObjects
});

/***/ }),

/***/ 2965:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var constants = __webpack_require__(8742),
    Logging   = __webpack_require__(8782);

var Faye = {
  VERSION:    constants.VERSION,

  Client:     __webpack_require__(1955),
  Scheduler:  __webpack_require__(6148)
};

Logging.wrapper = Faye;

module.exports = Faye;


/***/ }),

/***/ 5890:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Promise   = __webpack_require__(4857);

module.exports = {
  then: function(callback, errback) {
    var self = this;
    if (!this._promise)
      this._promise = new Promise(function(resolve, reject) {
        self._resolve = resolve;
        self._reject  = reject;
      });

    if (arguments.length === 0)
      return this._promise;
    else
      return this._promise.then(callback, errback);
  },

  callback: function(callback, context) {
    return this.then(function(value) { callback.call(context, value) });
  },

  errback: function(callback, context) {
    return this.then(null, function(reason) { callback.call(context, reason) });
  },

  timeout: function(seconds, message) {
    this.then();
    var self = this;
    this._timer = __webpack_require__.g.setTimeout(function() {
      self._reject(message);
    }, seconds * 1000);
  },

  setDeferredStatus: function(status, value) {
    if (this._timer) __webpack_require__.g.clearTimeout(this._timer);

    this.then();

    if (status === 'succeeded')
      this._resolve(value);
    else if (status === 'failed')
      this._reject(value);
    else
      delete this._promise;
  }
};


/***/ }),

/***/ 8782:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var toJSON = __webpack_require__(9457);

var Logging = {
  LOG_LEVELS: {
    fatal:  4,
    error:  3,
    warn:   2,
    info:   1,
    debug:  0
  },

  writeLog: function(messageArgs, level) {
    var logger = Logging.logger || (Logging.wrapper || Logging).logger;
    if (!logger) return;

    var args   = Array.prototype.slice.apply(messageArgs),
        banner = '[Faye',
        klass  = this.className,

        message = args.shift().replace(/\?/g, function() {
          try {
            return toJSON(args.shift());
          } catch (error) {
            return '[Object]';
          }
        });

    if (klass) banner += '.' + klass;
    banner += '] ';

    if (typeof logger[level] === 'function')
      logger[level](banner + message);
    else if (typeof logger === 'function')
      logger(banner + message);
  }
};

for (var key in Logging.LOG_LEVELS)
  (function(level) {
    Logging[level] = function() {
      this.writeLog(arguments, level);
    };
  })(key);

module.exports = Logging;


/***/ }),

/***/ 4909:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var assign       = __webpack_require__(7088),
    EventEmitter = __webpack_require__(2356);

var Publisher = {
  countListeners: function(eventType) {
    return this.listeners(eventType).length;
  },

  bind: function(eventType, listener, context) {
    var slice   = Array.prototype.slice,
        handler = function() { listener.apply(context, slice.call(arguments)) };

    this._listeners = this._listeners || [];
    this._listeners.push([eventType, listener, context, handler]);
    return this.on(eventType, handler);
  },

  unbind: function(eventType, listener, context) {
    this._listeners = this._listeners || [];
    var n = this._listeners.length, tuple;

    while (n--) {
      tuple = this._listeners[n];
      if (tuple[0] !== eventType) continue;
      if (listener && (tuple[1] !== listener || tuple[2] !== context)) continue;
      this._listeners.splice(n, 1);
      this.removeListener(eventType, tuple[3]);
    }
  }
};

assign(Publisher, EventEmitter.prototype);
Publisher.trigger = Publisher.emit;

module.exports = Publisher;


/***/ }),

/***/ 2840:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = {
  addTimeout: function(name, delay, callback, context) {
    this._timeouts = this._timeouts || {};
    if (this._timeouts.hasOwnProperty(name)) return;
    var self = this;
    this._timeouts[name] = __webpack_require__.g.setTimeout(function() {
      delete self._timeouts[name];
      callback.call(context);
    }, 1000 * delay);
  },

  removeTimeout: function(name) {
    this._timeouts = this._timeouts || {};
    var timeout = this._timeouts[name];
    if (!timeout) return;
    __webpack_require__.g.clearTimeout(timeout);
    delete this._timeouts[name];
  },

  removeAllTimeouts: function() {
    this._timeouts = this._timeouts || {};
    for (var name in this._timeouts) this.removeTimeout(name);
  }
};


/***/ }),

/***/ 1762:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Class     = __webpack_require__(8702),
    assign    = __webpack_require__(7088),
    Publisher = __webpack_require__(4909),
    Grammar   = __webpack_require__(4710);

var Channel = Class({
  initialize: function(name) {
    this.id = this.name = name;
  },

  push: function(message) {
    this.trigger('message', message);
  },

  isUnused: function() {
    return this.countListeners('message') === 0;
  }
});

assign(Channel.prototype, Publisher);

assign(Channel, {
  HANDSHAKE:    '/meta/handshake',
  CONNECT:      '/meta/connect',
  SUBSCRIBE:    '/meta/subscribe',
  UNSUBSCRIBE:  '/meta/unsubscribe',
  DISCONNECT:   '/meta/disconnect',

  META:         'meta',
  SERVICE:      'service',

  expand: function(name) {
    var segments = this.parse(name),
        channels = ['/**', name];

    var copy = segments.slice();
    copy[copy.length - 1] = '*';
    channels.push(this.unparse(copy));

    for (var i = 1, n = segments.length; i < n; i++) {
      copy = segments.slice(0, i);
      copy.push('**');
      channels.push(this.unparse(copy));
    }

    return channels;
  },

  isValid: function(name) {
    return Grammar.CHANNEL_NAME.test(name) ||
           Grammar.CHANNEL_PATTERN.test(name);
  },

  parse: function(name) {
    if (!this.isValid(name)) return null;
    return name.split('/').slice(1);
  },

  unparse: function(segments) {
    return '/' + segments.join('/');
  },

  isMeta: function(name) {
    var segments = this.parse(name);
    return segments ? (segments[0] === this.META) : null;
  },

  isService: function(name) {
    var segments = this.parse(name);
    return segments ? (segments[0] === this.SERVICE) : null;
  },

  isSubscribable: function(name) {
    if (!this.isValid(name)) return null;
    return !this.isMeta(name) && !this.isService(name);
  },

  Set: Class({
    initialize: function() {
      this._channels = {};
    },

    getKeys: function() {
      var keys = [];
      for (var key in this._channels) keys.push(key);
      return keys;
    },

    remove: function(name) {
      delete this._channels[name];
    },

    hasSubscription: function(name) {
      return this._channels.hasOwnProperty(name);
    },

    subscribe: function(names, subscription) {
      var name;
      for (var i = 0, n = names.length; i < n; i++) {
        name = names[i];
        var channel = this._channels[name] = this._channels[name] || new Channel(name);
        channel.bind('message', subscription);
      }
    },

    unsubscribe: function(name, subscription) {
      var channel = this._channels[name];
      if (!channel) return false;
      channel.unbind('message', subscription);

      if (channel.isUnused()) {
        this.remove(name);
        return true;
      } else {
        return false;
      }
    },

    distributeMessage: function(message) {
      var channels = Channel.expand(message.channel);

      for (var i = 0, n = channels.length; i < n; i++) {
        var channel = this._channels[channels[i]];
        if (channel) channel.trigger('message', message);
      }
    }
  })
});

module.exports = Channel;


/***/ }),

/***/ 1955:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var asap            = __webpack_require__(9272),
    Class           = __webpack_require__(8702),
    Promise         = __webpack_require__(4857),
    array           = __webpack_require__(8722),
    browser         = __webpack_require__(8375),
    constants       = __webpack_require__(8742),
    assign          = __webpack_require__(7088),
    validateOptions = __webpack_require__(3978),
    Deferrable      = __webpack_require__(5890),
    Logging         = __webpack_require__(8782),
    Publisher       = __webpack_require__(4909),
    Channel         = __webpack_require__(1762),
    Dispatcher      = __webpack_require__(2630),
    Error           = __webpack_require__(5656),
    Extensible      = __webpack_require__(9983),
    Publication     = __webpack_require__(4347),
    Subscription    = __webpack_require__(5740);

var Client = Class({ className: 'Client',
  UNCONNECTED:  1,
  CONNECTING:   2,
  CONNECTED:    3,
  DISCONNECTED: 4,

  HANDSHAKE: 'handshake',
  RETRY:     'retry',
  NONE:      'none',

  CONNECTION_TIMEOUT: 60,

  DEFAULT_ENDPOINT: '/bayeux',
  INTERVAL:         0,

  initialize: function(endpoint, options) {
    this.info('New client created for ?', endpoint);
    options = options || {};

    validateOptions(options, ['interval', 'timeout', 'endpoints', 'proxy', 'retry', 'scheduler', 'websocketExtensions', 'tls', 'ca']);

    this._channels   = new Channel.Set();
    this._dispatcher = Dispatcher.create(this, endpoint || this.DEFAULT_ENDPOINT, options);

    this._messageId = 0;
    this._state     = this.UNCONNECTED;

    this._responseCallbacks = {};

    this._advice = {
      reconnect: this.RETRY,
      interval:  1000 * (options.interval || this.INTERVAL),
      timeout:   1000 * (options.timeout  || this.CONNECTION_TIMEOUT)
    };
    this._dispatcher.timeout = this._advice.timeout / 1000;

    this._dispatcher.bind('message', this._receiveMessage, this);

    if (browser.Event && __webpack_require__.g.onbeforeunload !== undefined)
      browser.Event.on(__webpack_require__.g, 'beforeunload', function() {
        if (array.indexOf(this._dispatcher._disabled, 'autodisconnect') < 0)
          this.disconnect();
      }, this);
  },

  addWebsocketExtension: function(extension) {
    return this._dispatcher.addWebsocketExtension(extension);
  },

  disable: function(feature) {
    return this._dispatcher.disable(feature);
  },

  setHeader: function(name, value) {
    return this._dispatcher.setHeader(name, value);
  },

  // Request
  // MUST include:  * channel
  //                * version
  //                * supportedConnectionTypes
  // MAY include:   * minimumVersion
  //                * ext
  //                * id
  //
  // Success Response                             Failed Response
  // MUST include:  * channel                     MUST include:  * channel
  //                * version                                    * successful
  //                * supportedConnectionTypes                   * error
  //                * clientId                    MAY include:   * supportedConnectionTypes
  //                * successful                                 * advice
  // MAY include:   * minimumVersion                             * version
  //                * advice                                     * minimumVersion
  //                * ext                                        * ext
  //                * id                                         * id
  //                * authSuccessful
  handshake: function(callback, context) {
    if (this._advice.reconnect === this.NONE) return;
    if (this._state !== this.UNCONNECTED) return;

    this._state = this.CONNECTING;
    var self = this;

    this.info('Initiating handshake with ?', this._dispatcher.endpoint.href);
    this._dispatcher.selectTransport(constants.MANDATORY_CONNECTION_TYPES);

    this._sendMessage({
      channel:                  Channel.HANDSHAKE,
      version:                  constants.BAYEUX_VERSION,
      supportedConnectionTypes: this._dispatcher.getConnectionTypes()

    }, {}, function(response) {

      if (response.successful) {
        this._state = this.CONNECTED;
        this._dispatcher.clientId  = response.clientId;

        this._dispatcher.selectTransport(response.supportedConnectionTypes);

        this.info('Handshake successful: ?', this._dispatcher.clientId);

        this.subscribe(this._channels.getKeys(), true);
        if (callback) asap(function() { callback.call(context) });

      } else {
        this.info('Handshake unsuccessful');
        __webpack_require__.g.setTimeout(function() { self.handshake(callback, context) }, this._dispatcher.retry * 1000);
        this._state = this.UNCONNECTED;
      }
    }, this);
  },

  // Request                              Response
  // MUST include:  * channel             MUST include:  * channel
  //                * clientId                           * successful
  //                * connectionType                     * clientId
  // MAY include:   * ext                 MAY include:   * error
  //                * id                                 * advice
  //                                                     * ext
  //                                                     * id
  //                                                     * timestamp
  connect: function(callback, context) {
    if (this._advice.reconnect === this.NONE) return;
    if (this._state === this.DISCONNECTED) return;

    if (this._state === this.UNCONNECTED)
      return this.handshake(function() { this.connect(callback, context) }, this);

    this.callback(callback, context);
    if (this._state !== this.CONNECTED) return;

    this.info('Calling deferred actions for ?', this._dispatcher.clientId);
    this.setDeferredStatus('succeeded');
    this.setDeferredStatus('unknown');

    if (this._connectRequest) return;
    this._connectRequest = true;

    this.info('Initiating connection for ?', this._dispatcher.clientId);

    this._sendMessage({
      channel:        Channel.CONNECT,
      clientId:       this._dispatcher.clientId,
      connectionType: this._dispatcher.connectionType

    }, {}, this._cycleConnection, this);
  },

  // Request                              Response
  // MUST include:  * channel             MUST include:  * channel
  //                * clientId                           * successful
  // MAY include:   * ext                                * clientId
  //                * id                  MAY include:   * error
  //                                                     * ext
  //                                                     * id
  disconnect: function() {
    if (this._state !== this.CONNECTED) return;
    this._state = this.DISCONNECTED;

    this.info('Disconnecting ?', this._dispatcher.clientId);
    var promise = new Publication();

    this._sendMessage({
      channel:  Channel.DISCONNECT,
      clientId: this._dispatcher.clientId

    }, {}, function(response) {
      if (response.successful) {
        this._dispatcher.close();
        promise.setDeferredStatus('succeeded');
      } else {
        promise.setDeferredStatus('failed', Error.parse(response.error));
      }
    }, this);

    this.info('Clearing channel listeners for ?', this._dispatcher.clientId);
    this._channels = new Channel.Set();

    return promise;
  },

  // Request                              Response
  // MUST include:  * channel             MUST include:  * channel
  //                * clientId                           * successful
  //                * subscription                       * clientId
  // MAY include:   * ext                                * subscription
  //                * id                  MAY include:   * error
  //                                                     * advice
  //                                                     * ext
  //                                                     * id
  //                                                     * timestamp
  subscribe: function(channel, callback, context) {
    if (channel instanceof Array)
      return array.map(channel, function(c) {
        return this.subscribe(c, callback, context);
      }, this);

    var subscription = new Subscription(this, channel, callback, context),
        force        = (callback === true),
        hasSubscribe = this._channels.hasSubscription(channel);

    if (hasSubscribe && !force) {
      this._channels.subscribe([channel], subscription);
      subscription.setDeferredStatus('succeeded');
      return subscription;
    }

    this.connect(function() {
      this.info('Client ? attempting to subscribe to ?', this._dispatcher.clientId, channel);
      if (!force) this._channels.subscribe([channel], subscription);

      this._sendMessage({
        channel:      Channel.SUBSCRIBE,
        clientId:     this._dispatcher.clientId,
        subscription: channel

      }, {}, function(response) {
        if (!response.successful) {
          subscription.setDeferredStatus('failed', Error.parse(response.error));
          return this._channels.unsubscribe(channel, subscription);
        }

        var channels = [].concat(response.subscription);
        this.info('Subscription acknowledged for ? to ?', this._dispatcher.clientId, channels);
        subscription.setDeferredStatus('succeeded');
      }, this);
    }, this);

    return subscription;
  },

  // Request                              Response
  // MUST include:  * channel             MUST include:  * channel
  //                * clientId                           * successful
  //                * subscription                       * clientId
  // MAY include:   * ext                                * subscription
  //                * id                  MAY include:   * error
  //                                                     * advice
  //                                                     * ext
  //                                                     * id
  //                                                     * timestamp
  unsubscribe: function(channel, subscription) {
    if (channel instanceof Array)
      return array.map(channel, function(c) {
        return this.unsubscribe(c, subscription);
      }, this);

    var dead = this._channels.unsubscribe(channel, subscription);
    if (!dead) return;

    this.connect(function() {
      this.info('Client ? attempting to unsubscribe from ?', this._dispatcher.clientId, channel);

      this._sendMessage({
        channel:      Channel.UNSUBSCRIBE,
        clientId:     this._dispatcher.clientId,
        subscription: channel

      }, {}, function(response) {
        if (!response.successful) return;

        var channels = [].concat(response.subscription);
        this.info('Unsubscription acknowledged for ? from ?', this._dispatcher.clientId, channels);
      }, this);
    }, this);
  },

  // Request                              Response
  // MUST include:  * channel             MUST include:  * channel
  //                * data                               * successful
  // MAY include:   * clientId            MAY include:   * id
  //                * id                                 * error
  //                * ext                                * ext
  publish: function(channel, data, options) {
    validateOptions(options || {}, ['attempts', 'deadline']);
    var publication = new Publication();

    this.connect(function() {
      this.info('Client ? queueing published message to ?: ?', this._dispatcher.clientId, channel, data);

      this._sendMessage({
        channel:  channel,
        data:     data,
        clientId: this._dispatcher.clientId

      }, options, function(response) {
        if (response.successful)
          publication.setDeferredStatus('succeeded');
        else
          publication.setDeferredStatus('failed', Error.parse(response.error));
      }, this);
    }, this);

    return publication;
  },

  _sendMessage: function(message, options, callback, context) {
    message.id = this._generateMessageId();

    var timeout = this._advice.timeout
                ? 1.2 * this._advice.timeout / 1000
                : 1.2 * this._dispatcher.retry;

    this.pipeThroughExtensions('outgoing', message, null, function(message) {
      if (!message) return;
      if (callback) this._responseCallbacks[message.id] = [callback, context];
      this._dispatcher.sendMessage(message, timeout, options || {});
    }, this);
  },

  _generateMessageId: function() {
    this._messageId += 1;
    if (this._messageId >= Math.pow(2,32)) this._messageId = 0;
    return this._messageId.toString(36);
  },

  _receiveMessage: function(message) {
    var id = message.id, callback;

    if (message.successful !== undefined) {
      callback = this._responseCallbacks[id];
      delete this._responseCallbacks[id];
    }

    this.pipeThroughExtensions('incoming', message, null, function(message) {
      if (!message) return;
      if (message.advice) this._handleAdvice(message.advice);
      this._deliverMessage(message);
      if (callback) callback[0].call(callback[1], message);
    }, this);
  },

  _handleAdvice: function(advice) {
    assign(this._advice, advice);
    this._dispatcher.timeout = this._advice.timeout / 1000;

    if (this._advice.reconnect === this.HANDSHAKE && this._state !== this.DISCONNECTED) {
      this._state = this.UNCONNECTED;
      this._dispatcher.clientId = null;
      this._cycleConnection();
    }
  },

  _deliverMessage: function(message) {
    if (!message.channel || message.data === undefined) return;
    this.info('Client ? calling listeners for ? with ?', this._dispatcher.clientId, message.channel, message.data);
    this._channels.distributeMessage(message);
  },

  _cycleConnection: function() {
    if (this._connectRequest) {
      this._connectRequest = null;
      this.info('Closed connection for ?', this._dispatcher.clientId);
    }
    var self = this;
    __webpack_require__.g.setTimeout(function() { self.connect() }, this._advice.interval);
  }
});

assign(Client.prototype, Deferrable);
assign(Client.prototype, Publisher);
assign(Client.prototype, Logging);
assign(Client.prototype, Extensible);

module.exports = Client;


/***/ }),

/***/ 2630:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Class     = __webpack_require__(8702),
    URI       = __webpack_require__(5655),
    cookies   = __webpack_require__(3754),
    assign    = __webpack_require__(7088),
    Logging   = __webpack_require__(8782),
    Publisher = __webpack_require__(4909),
    Transport = __webpack_require__(4713),
    Scheduler = __webpack_require__(6148);

var Dispatcher = Class({ className: 'Dispatcher',
  MAX_REQUEST_SIZE: 2048,
  DEFAULT_RETRY:    5,

  UP:   1,
  DOWN: 2,

  initialize: function(client, endpoint, options) {
    this._client     = client;
    this.endpoint    = URI.parse(endpoint);
    this._alternates = options.endpoints || {};

    this.cookies      = cookies.CookieJar && new cookies.CookieJar();
    this._disabled    = [];
    this._envelopes   = {};
    this.headers      = {};
    this.retry        = options.retry || this.DEFAULT_RETRY;
    this._scheduler   = options.scheduler || Scheduler;
    this._state       = 0;
    this.transports   = {};
    this.wsExtensions = [];

    this.proxy = options.proxy || {};
    if (typeof this._proxy === 'string') this._proxy = { origin: this._proxy };

    var exts = options.websocketExtensions;
    if (exts) {
      exts = [].concat(exts);
      for (var i = 0, n = exts.length; i < n; i++)
        this.addWebsocketExtension(exts[i]);
    }

    this.tls = options.tls || {};
    this.tls.ca = this.tls.ca || options.ca;

    for (var type in this._alternates)
      this._alternates[type] = URI.parse(this._alternates[type]);

    this.maxRequestSize = this.MAX_REQUEST_SIZE;
  },

  endpointFor: function(connectionType) {
    return this._alternates[connectionType] || this.endpoint;
  },

  addWebsocketExtension: function(extension) {
    this.wsExtensions.push(extension);
  },

  disable: function(feature) {
    this._disabled.push(feature);
    Transport.disable(feature);
  },

  setHeader: function(name, value) {
    this.headers[name] = value;
  },

  close: function() {
    var transport = this._transport;
    delete this._transport;
    if (transport) transport.close();
  },

  getConnectionTypes: function() {
    return Transport.getConnectionTypes();
  },

  selectTransport: function(transportTypes) {
    Transport.get(this, transportTypes, this._disabled, function(transport) {
      this.debug('Selected ? transport for ?', transport.connectionType, transport.endpoint.href);

      if (transport === this._transport) return;
      if (this._transport) this._transport.close();

      this._transport = transport;
      this.connectionType = transport.connectionType;
    }, this);
  },

  sendMessage: function(message, timeout, options) {
    options = options || {};

    var id       = message.id,
        attempts = options.attempts,
        deadline = options.deadline && new Date().getTime() + (options.deadline * 1000),
        envelope = this._envelopes[id],
        scheduler;

    if (!envelope) {
      scheduler = new this._scheduler(message, { timeout: timeout, interval: this.retry, attempts: attempts, deadline: deadline });
      envelope  = this._envelopes[id] = { message: message, scheduler: scheduler };
    }

    this._sendEnvelope(envelope);
  },

  _sendEnvelope: function(envelope) {
    if (!this._transport) return;
    if (envelope.request || envelope.timer) return;

    var message   = envelope.message,
        scheduler = envelope.scheduler,
        self      = this;

    if (!scheduler.isDeliverable()) {
      scheduler.abort();
      delete this._envelopes[message.id];
      return;
    }

    envelope.timer = __webpack_require__.g.setTimeout(function() {
      self.handleError(message);
    }, scheduler.getTimeout() * 1000);

    scheduler.send();
    envelope.request = this._transport.sendMessage(message);
  },

  handleResponse: function(reply) {
    var envelope = this._envelopes[reply.id];

    if (reply.successful !== undefined && envelope) {
      envelope.scheduler.succeed();
      delete this._envelopes[reply.id];
      __webpack_require__.g.clearTimeout(envelope.timer);
    }

    this.trigger('message', reply);

    if (this._state === this.UP) return;
    this._state = this.UP;
    this._client.trigger('transport:up');
  },

  handleError: function(message, immediate) {
    var envelope = this._envelopes[message.id],
        request  = envelope && envelope.request,
        self     = this;

    if (!request) return;

    request.then(function(req) {
      if (req && req.abort) req.abort();
    });

    var scheduler = envelope.scheduler;
    scheduler.fail();

    __webpack_require__.g.clearTimeout(envelope.timer);
    envelope.request = envelope.timer = null;

    if (immediate) {
      this._sendEnvelope(envelope);
    } else {
      envelope.timer = __webpack_require__.g.setTimeout(function() {
        envelope.timer = null;
        self._sendEnvelope(envelope);
      }, scheduler.getInterval() * 1000);
    }

    if (this._state === this.DOWN) return;
    this._state = this.DOWN;
    this._client.trigger('transport:down');
  }
});

Dispatcher.create = function(client, endpoint, options) {
  return new Dispatcher(client, endpoint, options);
};

assign(Dispatcher.prototype, Publisher);
assign(Dispatcher.prototype, Logging);

module.exports = Dispatcher;


/***/ }),

/***/ 5656:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Class   = __webpack_require__(8702),
    Grammar = __webpack_require__(4710);

var Error = Class({
  initialize: function(code, params, message) {
    this.code    = code;
    this.params  = Array.prototype.slice.call(params);
    this.message = message;
  },

  toString: function() {
    return this.code + ':' +
           this.params.join(',') + ':' +
           this.message;
  }
});

Error.parse = function(message) {
  message = message || '';
  if (!Grammar.ERROR.test(message)) return new Error(null, [], message);

  var parts   = message.split(':'),
      code    = parseInt(parts[0]),
      params  = parts[1].split(','),
      message = parts[2];

  return new Error(code, params, message);
};

// http://code.google.com/p/cometd/wiki/BayeuxCodes
var errors = {
  versionMismatch:  [300, 'Version mismatch'],
  conntypeMismatch: [301, 'Connection types not supported'],
  extMismatch:      [302, 'Extension mismatch'],
  badRequest:       [400, 'Bad request'],
  clientUnknown:    [401, 'Unknown client'],
  parameterMissing: [402, 'Missing required parameter'],
  channelForbidden: [403, 'Forbidden channel'],
  channelUnknown:   [404, 'Unknown channel'],
  channelInvalid:   [405, 'Invalid channel'],
  extUnknown:       [406, 'Unknown extension'],
  publishFailed:    [407, 'Failed to publish'],
  serverError:      [500, 'Internal server error']
};

for (var name in errors)
  (function(name) {
    Error[name] = function() {
      return new Error(errors[name][0], arguments, errors[name][1]).toString();
    };
  })(name);

module.exports = Error;


/***/ }),

/***/ 9983:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var assign  = __webpack_require__(7088),
    Logging = __webpack_require__(8782);

var Extensible = {
  addExtension: function(extension) {
    this._extensions = this._extensions || [];
    this._extensions.push(extension);
    if (extension.added) extension.added(this);
  },

  removeExtension: function(extension) {
    if (!this._extensions) return;
    var i = this._extensions.length;
    while (i--) {
      if (this._extensions[i] !== extension) continue;
      this._extensions.splice(i,1);
      if (extension.removed) extension.removed(this);
    }
  },

  pipeThroughExtensions: function(stage, message, request, callback, context) {
    this.debug('Passing through ? extensions: ?', stage, message);

    if (!this._extensions) return callback.call(context, message);
    var extensions = this._extensions.slice();

    var pipe = function(message) {
      if (!message) return callback.call(context, message);

      var extension = extensions.shift();
      if (!extension) return callback.call(context, message);

      var fn = extension[stage];
      if (!fn) return pipe(message);

      if (fn.length >= 3) extension[stage](message, request, pipe);
      else                extension[stage](message, pipe);
    };
    pipe(message);
  }
};

assign(Extensible, Logging);

module.exports = Extensible;


/***/ }),

/***/ 4710:
/***/ ((module) => {

"use strict";


module.exports = {
  CHANNEL_NAME:     /^\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*$/,
  CHANNEL_PATTERN:  /^(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*\/\*{1,2}$/,
  ERROR:            /^([0-9][0-9][0-9]:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*(,(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)*:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*|[0-9][0-9][0-9]::(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)$/,
  VERSION:          /^([0-9])+(\.(([a-z]|[A-Z])|[0-9])(((([a-z]|[A-Z])|[0-9])|\-|\_))*)*$/
};


/***/ }),

/***/ 4347:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Class      = __webpack_require__(8702),
    Deferrable = __webpack_require__(5890);

module.exports = Class(Deferrable);


/***/ }),

/***/ 6148:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var assign = __webpack_require__(7088);

var Scheduler = function(message, options) {
  this.message  = message;
  this.options  = options;
  this.attempts = 0;
};

assign(Scheduler.prototype, {
  getTimeout: function() {
    return this.options.timeout;
  },

  getInterval: function() {
    return this.options.interval;
  },

  isDeliverable: function() {
    var attempts = this.options.attempts,
        made     = this.attempts,
        deadline = this.options.deadline,
        now      = new Date().getTime();

    if (attempts !== undefined && made >= attempts)
      return false;

    if (deadline !== undefined && now > deadline)
      return false;

    return true;
  },

  send: function() {
    this.attempts += 1;
  },

  succeed: function() {},

  fail: function() {},

  abort: function() {}
});

module.exports = Scheduler;


/***/ }),

/***/ 5740:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Class      = __webpack_require__(8702),
    assign     = __webpack_require__(7088),
    Deferrable = __webpack_require__(5890);

var Subscription = Class({
  initialize: function(client, channels, callback, context) {
    this._client    = client;
    this._channels  = channels;
    this._callback  = callback;
    this._context   = context;
    this._cancelled = false;
  },

  withChannel: function(callback, context) {
    this._withChannel = [callback, context];
    return this;
  },

  apply: function(context, args) {
    var message = args[0];

    if (this._callback)
      this._callback.call(this._context, message.data);

    if (this._withChannel)
      this._withChannel[0].call(this._withChannel[1], message.channel, message.data);
  },

  cancel: function() {
    if (this._cancelled) return;
    this._client.unsubscribe(this._channels, this);
    this._cancelled = true;
  },

  unsubscribe: function() {
    this.cancel();
  }
});

assign(Subscription.prototype, Deferrable);

module.exports = Subscription;


/***/ }),

/***/ 4713:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Transport = __webpack_require__(2195);

Transport.register('websocket', __webpack_require__(5182));
Transport.register('eventsource', __webpack_require__(9591));
Transport.register('long-polling', __webpack_require__(3611));
Transport.register('cross-origin-long-polling', __webpack_require__(7045));
Transport.register('callback-polling', __webpack_require__(7890));

module.exports = Transport;


/***/ }),

/***/ 7045:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Class     = __webpack_require__(8702),
    Set       = __webpack_require__(8172),
    URI       = __webpack_require__(5655),
    assign    = __webpack_require__(7088),
    toJSON    = __webpack_require__(9457),
    Transport = __webpack_require__(2195);

var CORS = assign(Class(Transport, {
  encode: function(messages) {
    return 'message=' + encodeURIComponent(toJSON(messages));
  },

  request: function(messages) {
    var xhrClass = __webpack_require__.g.XDomainRequest ? XDomainRequest : XMLHttpRequest,
        xhr      = new xhrClass(),
        id       = ++CORS._id,
        headers  = this._dispatcher.headers,
        self     = this,
        key;

    xhr.open('POST', this.endpoint.href, true);
    xhr.withCredentials = true;

    if (xhr.setRequestHeader) {
      xhr.setRequestHeader('Pragma', 'no-cache');
      for (key in headers) {
        if (!headers.hasOwnProperty(key)) continue;
        xhr.setRequestHeader(key, headers[key]);
      }
    }

    var cleanUp = function() {
      if (!xhr) return false;
      CORS._pending.remove(id);
      xhr.onload = xhr.onerror = xhr.ontimeout = xhr.onprogress = null;
      xhr = null;
    };

    xhr.onload = function() {
      var replies;
      try { replies = JSON.parse(xhr.responseText) } catch (error) {}

      cleanUp();

      if (replies)
        self._receive(replies);
      else
        self._handleError(messages);
    };

    xhr.onerror = xhr.ontimeout = function() {
      cleanUp();
      self._handleError(messages);
    };

    xhr.onprogress = function() {};

    if (xhrClass === __webpack_require__.g.XDomainRequest)
      CORS._pending.add({ id: id, xhr: xhr });

    xhr.send(this.encode(messages));
    return xhr;
  }
}), {
  _id:      0,
  _pending: new Set(),

  isUsable: function(dispatcher, endpoint, callback, context) {
    if (URI.isSameOrigin(endpoint))
      return callback.call(context, false);

    if (__webpack_require__.g.XDomainRequest)
      return callback.call(context, endpoint.protocol === location.protocol);

    if (__webpack_require__.g.XMLHttpRequest) {
      var xhr = new XMLHttpRequest();
      return callback.call(context, xhr.withCredentials !== undefined);
    }
    return callback.call(context, false);
  }
});

module.exports = CORS;


/***/ }),

/***/ 9591:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Class      = __webpack_require__(8702),
    URI        = __webpack_require__(5655),
    copyObject = __webpack_require__(172),
    assign     = __webpack_require__(7088),
    Deferrable = __webpack_require__(5890),
    Transport  = __webpack_require__(2195),
    XHR        = __webpack_require__(3611);

var EventSource = assign(Class(Transport, {
  initialize: function(dispatcher, endpoint) {
    Transport.prototype.initialize.call(this, dispatcher, endpoint);
    if (!__webpack_require__.g.EventSource) return this.setDeferredStatus('failed');

    this._xhr = new XHR(dispatcher, endpoint);

    endpoint = copyObject(endpoint);
    endpoint.pathname += '/' + dispatcher.clientId;

    var socket = new __webpack_require__.g.EventSource(URI.stringify(endpoint)),
        self   = this;

    socket.onopen = function() {
      self._everConnected = true;
      self.setDeferredStatus('succeeded');
    };

    socket.onerror = function() {
      if (self._everConnected) {
        self._handleError([]);
      } else {
        self.setDeferredStatus('failed');
        socket.close();
      }
    };

    socket.onmessage = function(event) {
      var replies;
      try { replies = JSON.parse(event.data) } catch (error) {}

      if (replies)
        self._receive(replies);
      else
        self._handleError([]);
    };

    this._socket = socket;
  },

  close: function() {
    if (!this._socket) return;
    this._socket.onopen = this._socket.onerror = this._socket.onmessage = null;
    this._socket.close();
    delete this._socket;
  },

  isUsable: function(callback, context) {
    this.callback(function() { callback.call(context, true) });
    this.errback(function() { callback.call(context, false) });
  },

  encode: function(messages) {
    return this._xhr.encode(messages);
  },

  request: function(messages) {
    return this._xhr.request(messages);
  }

}), {
  isUsable: function(dispatcher, endpoint, callback, context) {
    var id = dispatcher.clientId;
    if (!id) return callback.call(context, false);

    XHR.isUsable(dispatcher, endpoint, function(usable) {
      if (!usable) return callback.call(context, false);
      this.create(dispatcher, endpoint).isUsable(callback, context);
    }, this);
  },

  create: function(dispatcher, endpoint) {
    var sockets = dispatcher.transports.eventsource = dispatcher.transports.eventsource || {},
        id      = dispatcher.clientId;

    var url = copyObject(endpoint);
    url.pathname += '/' + (id || '');
    url = URI.stringify(url);

    sockets[url] = sockets[url] || new this(dispatcher, endpoint);
    return sockets[url];
  }
});

assign(EventSource.prototype, Deferrable);

module.exports = EventSource;


/***/ }),

/***/ 7890:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Class      = __webpack_require__(8702),
    URI        = __webpack_require__(5655),
    copyObject = __webpack_require__(172),
    assign     = __webpack_require__(7088),
    toJSON     = __webpack_require__(9457),
    Transport  = __webpack_require__(2195);

var JSONP = assign(Class(Transport, {
 encode: function(messages) {
    var url = copyObject(this.endpoint);
    url.query.message = toJSON(messages);
    url.query.jsonp   = '__jsonp' + JSONP._cbCount + '__';
    return URI.stringify(url);
  },

  request: function(messages) {
    var head         = document.getElementsByTagName('head')[0],
        script       = document.createElement('script'),
        callbackName = JSONP.getCallbackName(),
        endpoint     = copyObject(this.endpoint),
        self         = this;

    endpoint.query.message = toJSON(messages);
    endpoint.query.jsonp   = callbackName;

    var cleanup = function() {
      if (!__webpack_require__.g[callbackName]) return false;
      __webpack_require__.g[callbackName] = undefined;
      try { delete __webpack_require__.g[callbackName] } catch (error) {}
      script.parentNode.removeChild(script);
    };

    __webpack_require__.g[callbackName] = function(replies) {
      cleanup();
      self._receive(replies);
    };

    script.type = 'text/javascript';
    script.src  = URI.stringify(endpoint);
    head.appendChild(script);

    script.onerror = function() {
      cleanup();
      self._handleError(messages);
    };

    return { abort: cleanup };
  }
}), {
  _cbCount: 0,

  getCallbackName: function() {
    this._cbCount += 1;
    return '__jsonp' + this._cbCount + '__';
  },

  isUsable: function(dispatcher, endpoint, callback, context) {
    callback.call(context, true);
  }
});

module.exports = JSONP;


/***/ }),

/***/ 2195:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Class    = __webpack_require__(8702),
    Cookie   = (__webpack_require__(3754).Cookie),
    Promise  = __webpack_require__(4857),
    array    = __webpack_require__(8722),
    assign   = __webpack_require__(7088),
    Logging  = __webpack_require__(8782),
    Timeouts = __webpack_require__(2840),
    Channel  = __webpack_require__(1762);

var Transport = assign(Class({ className: 'Transport',
  DEFAULT_PORTS: { 'http:': 80, 'https:': 443, 'ws:': 80, 'wss:': 443 },
  MAX_DELAY:     0,

  batching:  true,

  initialize: function(dispatcher, endpoint) {
    this._dispatcher = dispatcher;
    this.endpoint    = endpoint;
    this._outbox     = [];
    this._proxy      = assign({}, this._dispatcher.proxy);

    if (!this._proxy.origin)
      this._proxy.origin = this._findProxy();
  },

  close: function() {},

  encode: function(messages) {
    return '';
  },

  sendMessage: function(message) {
    this.debug('Client ? sending message to ?: ?',
               this._dispatcher.clientId, this.endpoint.href, message);

    if (!this.batching) return Promise.resolve(this.request([message]));

    this._outbox.push(message);
    this._flushLargeBatch();

    if (message.channel === Channel.HANDSHAKE)
      return this._publish(0.01);

    if (message.channel === Channel.CONNECT)
      this._connectMessage = message;

    return this._publish(this.MAX_DELAY);
  },

  _makePromise: function() {
    var self = this;

    this._requestPromise = this._requestPromise || new Promise(function(resolve) {
      self._resolvePromise = resolve;
    });
  },

  _publish: function(delay) {
    this._makePromise();

    this.addTimeout('publish', delay, function() {
      this._flush();
      delete this._requestPromise;
    }, this);

    return this._requestPromise;
  },

  _flush: function() {
    this.removeTimeout('publish');

    if (this._outbox.length > 1 && this._connectMessage)
      this._connectMessage.advice = { timeout: 0 };

    this._resolvePromise(this.request(this._outbox));

    this._connectMessage = null;
    this._outbox = [];
  },

  _flushLargeBatch: function() {
    var string = this.encode(this._outbox);
    if (string.length < this._dispatcher.maxRequestSize) return;
    var last = this._outbox.pop();

    this._makePromise();
    this._flush();

    if (last) this._outbox.push(last);
  },

  _receive: function(replies) {
    if (!replies) return;
    replies = [].concat(replies);

    this.debug('Client ? received from ? via ?: ?',
               this._dispatcher.clientId, this.endpoint.href, this.connectionType, replies);

    for (var i = 0, n = replies.length; i < n; i++)
      this._dispatcher.handleResponse(replies[i]);
  },

  _handleError: function(messages, immediate) {
    messages = [].concat(messages);

    this.debug('Client ? failed to send to ? via ?: ?',
               this._dispatcher.clientId, this.endpoint.href, this.connectionType, messages);

    for (var i = 0, n = messages.length; i < n; i++)
      this._dispatcher.handleError(messages[i]);
  },

  _getCookies: function() {
    var cookies = this._dispatcher.cookies,
        url     = this.endpoint.href;

    if (!cookies) return '';

    return array.map(cookies.getCookiesSync(url), function(cookie) {
      return cookie.cookieString();
    }).join('; ');
  },

  _storeCookies: function(setCookie) {
    var cookies = this._dispatcher.cookies,
        url     = this.endpoint.href,
        cookie;

    if (!setCookie || !cookies) return;
    setCookie = [].concat(setCookie);

    for (var i = 0, n = setCookie.length; i < n; i++) {
      cookie = Cookie.parse(setCookie[i]);
      cookies.setCookieSync(cookie, url);
    }
  },

  _findProxy: function() {
    if (typeof process === 'undefined') return undefined;

    var protocol = this.endpoint.protocol;
    if (!protocol) return undefined;

    var name   = protocol.replace(/:$/, '').toLowerCase() + '_proxy',
        upcase = name.toUpperCase(),
        env    = ({"PACKAGE_VERSION":"8.4.0"}),
        keys, proxy;

    if (name === 'http_proxy' && env.REQUEST_METHOD) {
      keys = Object.keys(env).filter(function(k) { return /^http_proxy$/i.test(k) });
      if (keys.length === 1) {
        if (keys[0] === name && env[upcase] === undefined)
          proxy = env[name];
      } else if (keys.length > 1) {
        proxy = env[name];
      }
      proxy = proxy || env['CGI_' + upcase];
    } else {
      proxy = env[name] || env[upcase];
      if (proxy && !env[name])
        console.warn('The environment variable ' + upcase +
                     ' is discouraged. Use ' + name + '.');
    }
    return proxy;
  }

}), {
  get: function(dispatcher, allowed, disabled, callback, context) {
    var endpoint = dispatcher.endpoint;

    array.asyncEach(this._transports, function(pair, resume) {
      var connType     = pair[0], klass = pair[1],
          connEndpoint = dispatcher.endpointFor(connType);

      if (array.indexOf(disabled, connType) >= 0)
        return resume();

      if (array.indexOf(allowed, connType) < 0) {
        klass.isUsable(dispatcher, connEndpoint, function() {});
        return resume();
      }

      klass.isUsable(dispatcher, connEndpoint, function(isUsable) {
        if (!isUsable) return resume();
        var transport = klass.hasOwnProperty('create') ? klass.create(dispatcher, connEndpoint) : new klass(dispatcher, connEndpoint);
        callback.call(context, transport);
      });
    }, function() {
      throw new Error('Could not find a usable connection type for ' + endpoint.href);
    });
  },

  register: function(type, klass) {
    this._transports.push([type, klass]);
    klass.prototype.connectionType = type;
  },

  getConnectionTypes: function() {
    return array.map(this._transports, function(t) { return t[0] });
  },

  disable: function(feature) {
    if (feature !== 'autodisconnect') return;

    for (var i = 0; i < this._transports.length; i++)
      this._transports[i][1]._unloaded = false;
  },

  _transports: []
});

assign(Transport.prototype, Logging);
assign(Transport.prototype, Timeouts);

module.exports = Transport;


/***/ }),

/***/ 5182:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Class      = __webpack_require__(8702),
    Promise    = __webpack_require__(4857),
    Set        = __webpack_require__(8172),
    URI        = __webpack_require__(5655),
    browser    = __webpack_require__(8375),
    copyObject = __webpack_require__(172),
    assign     = __webpack_require__(7088),
    toJSON     = __webpack_require__(9457),
    ws         = __webpack_require__(5003),
    Deferrable = __webpack_require__(5890),
    Transport  = __webpack_require__(2195);

var WebSocket = assign(Class(Transport, {
  UNCONNECTED:  1,
  CONNECTING:   2,
  CONNECTED:    3,

  batching:     false,

  isUsable: function(callback, context) {
    this.callback(function() { callback.call(context, true) });
    this.errback(function() { callback.call(context, false) });
    this.connect();
  },

  request: function(messages) {
    this._pending = this._pending || new Set();
    for (var i = 0, n = messages.length; i < n; i++) this._pending.add(messages[i]);

    var self = this;

    var promise = new Promise(function(resolve, reject) {
      self.callback(function(socket) {
        if (!socket || socket.readyState !== 1) return;
        socket.send(toJSON(messages));
        resolve(socket);
      });

      self.connect();
    });

    return {
      abort: function() { promise.then(function(ws) { ws.close() }) }
    };
  },

  connect: function() {
    if (WebSocket._unloaded) return;

    this._state = this._state || this.UNCONNECTED;
    if (this._state !== this.UNCONNECTED) return;
    this._state = this.CONNECTING;

    var socket = this._createSocket();
    if (!socket) return this.setDeferredStatus('failed');

    var self = this;

    socket.onopen = function() {
      if (socket.headers) self._storeCookies(socket.headers['set-cookie']);
      self._socket = socket;
      self._state = self.CONNECTED;
      self._everConnected = true;
      self.setDeferredStatus('succeeded', socket);
    };

    var closed = false;
    socket.onclose = socket.onerror = function() {
      if (closed) return;
      closed = true;

      var wasConnected = (self._state === self.CONNECTED);
      socket.onopen = socket.onclose = socket.onerror = socket.onmessage = null;

      delete self._socket;
      self._state = self.UNCONNECTED;

      var pending = self._pending ? self._pending.toArray() : [];
      delete self._pending;

      if (wasConnected || self._everConnected) {
        self.setDeferredStatus('unknown');
        self._handleError(pending, wasConnected);
      } else {
        self.setDeferredStatus('failed');
      }
    };

    socket.onmessage = function(event) {
      var replies;
      try { replies = JSON.parse(event.data) } catch (error) {}

      if (!replies) return;

      replies = [].concat(replies);

      for (var i = 0, n = replies.length; i < n; i++) {
        if (replies[i].successful === undefined) continue;
        self._pending.remove(replies[i]);
      }
      self._receive(replies);
    };
  },

  close: function() {
    if (!this._socket) return;
    this._socket.close();
  },

  _createSocket: function() {
    var url        = WebSocket.getSocketUrl(this.endpoint),
        headers    = this._dispatcher.headers,
        extensions = this._dispatcher.wsExtensions,
        cookie     = this._getCookies(),
        tls        = this._dispatcher.tls,
        options    = { extensions: extensions, headers: headers, proxy: this._proxy, tls: tls };

    if (cookie !== '') options.headers['Cookie'] = cookie;

    try {
      return ws.create(url, [], options);
    } catch (e) {
      // catch CSP error to allow transport to fallback to next connType
    }
  }

}), {
  PROTOCOLS: {
    'http:':  'ws:',
    'https:': 'wss:'
  },

  create: function(dispatcher, endpoint) {
    var sockets = dispatcher.transports.websocket = dispatcher.transports.websocket || {};
    sockets[endpoint.href] = sockets[endpoint.href] || new this(dispatcher, endpoint);
    return sockets[endpoint.href];
  },

  getSocketUrl: function(endpoint) {
    endpoint = copyObject(endpoint);
    endpoint.protocol = this.PROTOCOLS[endpoint.protocol];
    return URI.stringify(endpoint);
  },

  isUsable: function(dispatcher, endpoint, callback, context) {
    this.create(dispatcher, endpoint).isUsable(callback, context);
  }
});

assign(WebSocket.prototype, Deferrable);

if (browser.Event && __webpack_require__.g.onbeforeunload !== undefined) {
  browser.Event.on(__webpack_require__.g, 'beforeunload', function() {
    if (WebSocket._unloaded === undefined)
      WebSocket._unloaded = true;
  });
}

module.exports = WebSocket;


/***/ }),

/***/ 3611:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Class     = __webpack_require__(8702),
    URI       = __webpack_require__(5655),
    browser   = __webpack_require__(8375),
    assign    = __webpack_require__(7088),
    toJSON    = __webpack_require__(9457),
    Transport = __webpack_require__(2195);

var XHR = assign(Class(Transport, {
  encode: function(messages) {
    return toJSON(messages);
  },

  request: function(messages) {
    var href = this.endpoint.href,
        self = this,
        xhr;

    // Prefer XMLHttpRequest over ActiveXObject if they both exist
    if (__webpack_require__.g.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else if (__webpack_require__.g.ActiveXObject) {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    } else {
      return this._handleError(messages);
    }

    xhr.open('POST', href, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Pragma', 'no-cache');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    var headers = this._dispatcher.headers;
    for (var key in headers) {
      if (!headers.hasOwnProperty(key)) continue;
      xhr.setRequestHeader(key, headers[key]);
    }

    var abort = function() { xhr.abort() };
    if (__webpack_require__.g.onbeforeunload !== undefined)
      browser.Event.on(__webpack_require__.g, 'beforeunload', abort);

    xhr.onreadystatechange = function() {
      if (!xhr || xhr.readyState !== 4) return;

      var replies    = null,
          status     = xhr.status,
          text       = xhr.responseText,
          successful = (status >= 200 && status < 300) || status === 304 || status === 1223;

      if (__webpack_require__.g.onbeforeunload !== undefined)
        browser.Event.detach(__webpack_require__.g, 'beforeunload', abort);

      xhr.onreadystatechange = function() {};
      xhr = null;

      if (!successful) return self._handleError(messages);

      try {
        replies = JSON.parse(text);
      } catch (error) {}

      if (replies)
        self._receive(replies);
      else
        self._handleError(messages);
    };

    xhr.send(this.encode(messages));
    return xhr;
  }
}), {
  isUsable: function(dispatcher, endpoint, callback, context) {
    var usable = (navigator.product === 'ReactNative')
              || URI.isSameOrigin(endpoint);

    callback.call(context, usable);
  }
});

module.exports = XHR;


/***/ }),

/***/ 8722:
/***/ ((module) => {

"use strict";


module.exports = {
  commonElement: function(lista, listb) {
    for (var i = 0, n = lista.length; i < n; i++) {
      if (this.indexOf(listb, lista[i]) !== -1)
        return lista[i];
    }
    return null;
  },

  indexOf: function(list, needle) {
    if (list.indexOf) return list.indexOf(needle);

    for (var i = 0, n = list.length; i < n; i++) {
      if (list[i] === needle) return i;
    }
    return -1;
  },

  map: function(object, callback, context) {
    if (object.map) return object.map(callback, context);
    var result = [];

    if (object instanceof Array) {
      for (var i = 0, n = object.length; i < n; i++) {
        result.push(callback.call(context || null, object[i], i));
      }
    } else {
      for (var key in object) {
        if (!object.hasOwnProperty(key)) continue;
        result.push(callback.call(context || null, key, object[key]));
      }
    }
    return result;
  },

  filter: function(array, callback, context) {
    if (array.filter) return array.filter(callback, context);
    var result = [];
    for (var i = 0, n = array.length; i < n; i++) {
      if (callback.call(context || null, array[i], i))
        result.push(array[i]);
    }
    return result;
  },

  asyncEach: function(list, iterator, callback, context) {
    var n       = list.length,
        i       = -1,
        calls   = 0,
        looping = false;

    var iterate = function() {
      calls -= 1;
      i += 1;
      if (i === n) return callback && callback.call(context);
      iterator(list[i], resume);
    };

    var loop = function() {
      if (looping) return;
      looping = true;
      while (calls > 0) iterate();
      looping = false;
    };

    var resume = function() {
      calls += 1;
      loop();
    };
    resume();
  }
};


/***/ }),

/***/ 7088:
/***/ ((module) => {

"use strict";


var forEach = Array.prototype.forEach,
    hasOwn  = Object.prototype.hasOwnProperty;

module.exports = function(target) {
  forEach.call(arguments, function(source, i) {
    if (i === 0) return;

    for (var key in source) {
      if (hasOwn.call(source, key)) target[key] = source[key];
    }
  });

  return target;
};


/***/ }),

/***/ 8375:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Event = {
  _registry: [],

  on: function(element, eventName, callback, context) {
    var wrapped = function() { callback.call(context) };

    if (element.addEventListener)
      element.addEventListener(eventName, wrapped, false);
    else
      element.attachEvent('on' + eventName, wrapped);

    this._registry.push({
      _element:   element,
      _type:      eventName,
      _callback:  callback,
      _context:     context,
      _handler:   wrapped
    });
  },

  detach: function(element, eventName, callback, context) {
    var i = this._registry.length, register;
    while (i--) {
      register = this._registry[i];

      if ((element    && element    !== register._element)  ||
          (eventName  && eventName  !== register._type)     ||
          (callback   && callback   !== register._callback) ||
          (context    && context    !== register._context))
        continue;

      if (register._element.removeEventListener)
        register._element.removeEventListener(register._type, register._handler, false);
      else
        register._element.detachEvent('on' + register._type, register._handler);

      this._registry.splice(i,1);
      register = null;
    }
  }
};

if (__webpack_require__.g.onunload !== undefined)
  Event.on(__webpack_require__.g, 'unload', Event.detach, Event);

module.exports = {
  Event: Event
};


/***/ }),

/***/ 8702:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var assign = __webpack_require__(7088);

module.exports = function(parent, methods) {
  if (typeof parent !== 'function') {
    methods = parent;
    parent  = Object;
  }

  var klass = function() {
    if (!this.initialize) return this;
    return this.initialize.apply(this, arguments) || this;
  };

  var bridge = function() {};
  bridge.prototype = parent.prototype;

  klass.prototype = new bridge();
  assign(klass.prototype, methods);

  return klass;
};


/***/ }),

/***/ 8742:
/***/ ((module) => {

module.exports = {
  VERSION:          '1.4.0',

  BAYEUX_VERSION:   '1.0',
  ID_LENGTH:        160,
  JSONP_CALLBACK:   'jsonpcallback',
  CONNECTION_TYPES: ['long-polling', 'cross-origin-long-polling', 'callback-polling', 'websocket', 'eventsource', 'in-process'],

  MANDATORY_CONNECTION_TYPES: ['long-polling', 'callback-polling', 'in-process']
};


/***/ }),

/***/ 3754:
/***/ ((module) => {

"use strict";


module.exports = {};


/***/ }),

/***/ 172:
/***/ ((module) => {

"use strict";


var copyObject = function(object) {
  var clone, i, key;
  if (object instanceof Array) {
    clone = [];
    i = object.length;
    while (i--) clone[i] = copyObject(object[i]);
    return clone;
  } else if (typeof object === 'object') {
    clone = (object === null) ? null : {};
    for (key in object) clone[key] = copyObject(object[key]);
    return clone;
  } else {
    return object;
  }
};

module.exports = copyObject;


/***/ }),

/***/ 2356:
/***/ ((module) => {

/*
Copyright Joyent, Inc. and other Node contributors. All rights reserved.
Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

function EventEmitter() {}
module.exports = EventEmitter;

EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {
    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};


/***/ }),

/***/ 4857:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var asap = __webpack_require__(9272);

var PENDING   = -1,
    FULFILLED =  0,
    REJECTED  =  1;

var Promise = function(task) {
  this._state = PENDING;
  this._value = null;
  this._defer = [];

  execute(this, task);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  var promise = new Promise();

  var deferred = {
    promise:     promise,
    onFulfilled: onFulfilled,
    onRejected:  onRejected
  };

  if (this._state === PENDING)
    this._defer.push(deferred);
  else
    propagate(this, deferred);

  return promise;
};

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

var execute = function(promise, task) {
  if (typeof task !== 'function') return;

  var calls = 0;

  var resolvePromise = function(value) {
    if (calls++ === 0) resolve(promise, value);
  };

  var rejectPromise = function(reason) {
    if (calls++ === 0) reject(promise, reason);
  };

  try {
    task(resolvePromise, rejectPromise);
  } catch (error) {
    rejectPromise(error);
  }
};

var propagate = function(promise, deferred) {
  var state   = promise._state,
      value   = promise._value,
      next    = deferred.promise,
      handler = [deferred.onFulfilled, deferred.onRejected][state],
      pass    = [resolve, reject][state];

  if (typeof handler !== 'function')
    return pass(next, value);

  asap(function() {
    try {
      resolve(next, handler(value));
    } catch (error) {
      reject(next, error);
    }
  });
};

var resolve = function(promise, value) {
  if (promise === value)
    return reject(promise, new TypeError('Recursive promise chain detected'));

  var then;

  try {
    then = getThen(value);
  } catch (error) {
    return reject(promise, error);
  }

  if (!then) return fulfill(promise, value);

  execute(promise, function(resolvePromise, rejectPromise) {
    then.call(value, resolvePromise, rejectPromise);
  });
};

var getThen = function(value) {
  var type = typeof value,
      then = (type === 'object' || type === 'function') && value && value.then;

  return (typeof then === 'function')
         ? then
         : null;
};

var fulfill = function(promise, value) {
  settle(promise, FULFILLED, value);
};

var reject = function(promise, reason) {
  settle(promise, REJECTED, reason);
};

var settle = function(promise, state, value) {
  var defer = promise._defer, i = 0;

  promise._state = state;
  promise._value = value;
  promise._defer = null;

  if (defer.length === 0) return;
  while (i < defer.length) propagate(promise, defer[i++]);
};

Promise.resolve = function(value) {
  try {
    if (getThen(value)) return value;
  } catch (error) {
    return Promise.reject(error);
  }

  return new Promise(function(resolve, reject) { resolve(value) });
};

Promise.reject = function(reason) {
  return new Promise(function(resolve, reject) { reject(reason) });
};

Promise.all = function(promises) {
  return new Promise(function(resolve, reject) {
    var list = [], n = promises.length, i;

    if (n === 0) return resolve(list);

    var push = function(promise, i) {
      Promise.resolve(promise).then(function(value) {
        list[i] = value;
        if (--n === 0) resolve(list);
      }, reject);
    };

    for (i = 0; i < n; i++) push(promises[i], i);
  });
};

Promise.race = function(promises) {
  return new Promise(function(resolve, reject) {
    for (var i = 0, n = promises.length; i < n; i++)
      Promise.resolve(promises[i]).then(resolve, reject);
  });
};

Promise.deferred = function() {
  var tuple = {};

  tuple.promise = new Promise(function(resolve, reject) {
    tuple.resolve = resolve;
    tuple.reject  = reject;
  });
  return tuple;
};

module.exports = Promise;


/***/ }),

/***/ 8172:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Class = __webpack_require__(8702);

module.exports = Class({
  initialize: function() {
    this._index = {};
  },

  add: function(item) {
    var key = (item.id !== undefined) ? item.id : item;
    if (this._index.hasOwnProperty(key)) return false;
    this._index[key] = item;
    return true;
  },

  forEach: function(block, context) {
    for (var key in this._index) {
      if (this._index.hasOwnProperty(key))
        block.call(context, this._index[key]);
    }
  },

  isEmpty: function() {
    for (var key in this._index) {
      if (this._index.hasOwnProperty(key)) return false;
    }
    return true;
  },

  member: function(item) {
    for (var key in this._index) {
      if (this._index[key] === item) return true;
    }
    return false;
  },

  remove: function(item) {
    var key = (item.id !== undefined) ? item.id : item;
    var removed = this._index[key];
    delete this._index[key];
    return removed;
  },

  toArray: function() {
    var array = [];
    this.forEach(function(item) { array.push(item) });
    return array;
  }
});


/***/ }),

/***/ 9457:
/***/ ((module) => {

"use strict";


// http://assanka.net/content/tech/2009/09/02/json2-js-vs-prototype/

module.exports = function(object) {
  return JSON.stringify(object, function(key, value) {
    return (this[key] instanceof Array) ? this[key] : value;
  });
};


/***/ }),

/***/ 5655:
/***/ ((module) => {

"use strict";


module.exports = {
  isURI: function(uri) {
    return uri && uri.protocol && uri.host && uri.path;
  },

  isSameOrigin: function(uri) {
    return uri.protocol === location.protocol &&
           uri.hostname === location.hostname &&
           uri.port     === location.port;
  },

  parse: function(url) {
    if (typeof url !== 'string') return url;
    var uri = {}, parts, query, pairs, i, n, data;

    var consume = function(name, pattern) {
      url = url.replace(pattern, function(match) {
        uri[name] = match;
        return '';
      });
      uri[name] = uri[name] || '';
    };

    consume('protocol', /^[a-z]+\:/i);
    consume('host',     /^\/\/[^\/\?#]+/);

    if (!/^\//.test(url) && !uri.host)
      url = location.pathname.replace(/[^\/]*$/, '') + url;

    consume('pathname', /^[^\?#]*/);
    consume('search',   /^\?[^#]*/);
    consume('hash',     /^#.*/);

    uri.protocol = uri.protocol || location.protocol;

    if (uri.host) {
      uri.host = uri.host.substr(2);

      if (/@/.test(uri.host)) {
        uri.auth = uri.host.split('@')[0];
        uri.host = uri.host.split('@')[1];
      }
      parts        = uri.host.match(/^\[([^\]]+)\]|^[^:]+/);
      uri.hostname = parts[1] || parts[0];
      uri.port     = (uri.host.match(/:(\d+)$/) || [])[1] || '';
    } else {
      uri.host     = location.host;
      uri.hostname = location.hostname;
      uri.port     = location.port;
    }

    uri.pathname = uri.pathname || '/';
    uri.path = uri.pathname + uri.search;

    query = uri.search.replace(/^\?/, '');
    pairs = query ? query.split('&') : [];
    data  = {};

    for (i = 0, n = pairs.length; i < n; i++) {
      parts = pairs[i].split('=');
      data[decodeURIComponent(parts[0] || '')] = decodeURIComponent(parts[1] || '');
    }

    uri.query = data;

    uri.href = this.stringify(uri);
    return uri;
  },

  stringify: function(uri) {
    var auth   = uri.auth ? uri.auth + '@' : '',
        string = uri.protocol + '//' + auth + uri.host;

    string += uri.pathname + this.queryString(uri.query) + (uri.hash || '');

    return string;
  },

  queryString: function(query) {
    var pairs = [];
    for (var key in query) {
      if (!query.hasOwnProperty(key)) continue;
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]));
    }
    if (pairs.length === 0) return '';
    return '?' + pairs.join('&');
  }
};


/***/ }),

/***/ 3978:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var array = __webpack_require__(8722);

module.exports = function(options, validKeys) {
  for (var key in options) {
    if (array.indexOf(validKeys, key) < 0)
      throw new Error('Unrecognized option: ' + key);
  }
};


/***/ }),

/***/ 5003:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var WS = __webpack_require__.g.MozWebSocket || __webpack_require__.g.WebSocket;

module.exports = {
  create: function(url, protocols, options) {
    if (typeof WS !== 'function') return null;
    return new WS(url);
  }
};


/***/ }),

/***/ 6230:
/***/ ((module) => {

/* eslint-env browser */
module.exports = typeof self == 'object' ? self.FormData : window.FormData;


/***/ }),

/***/ 6793:
/***/ (() => {



/***/ }),

/***/ 7496:
/***/ (() => {



/***/ }),

/***/ 8854:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 5697:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 1726:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 7061:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(8698)["default"]);
function _regeneratorRuntime() {
  "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return e;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function define(t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function value(t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw new Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(_typeof(e) + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function stop() {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw new Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function complete(t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function finish(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    "catch": function _catch(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 8698:
/***/ ((module) => {

function _typeof(o) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 4687:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(7061)();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ 5861:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ _asyncToGenerator)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

/***/ }),

/***/ 5671:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ _classCallCheck)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ 3144:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ _createClass)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9142);

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

/***/ }),

/***/ 4942:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ _defineProperty)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9142);

function _defineProperty(obj, key, value) {
  key = (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/***/ }),

/***/ 4925:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Z: () => (/* binding */ _objectWithoutProperties)
});

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

/***/ }),

/***/ 8152:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Z: () => (/* binding */ _slicedToArray)
});

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js




function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

/***/ }),

/***/ 9142:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Z: () => (/* binding */ _toPropertyKey)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
var esm_typeof = __webpack_require__(1002);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js

function _toPrimitive(input, hint) {
  if ((0,esm_typeof/* default */.Z)(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if ((0,esm_typeof/* default */.Z)(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js


function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return (0,esm_typeof/* default */.Z)(key) === "symbol" ? key : String(key);
}

/***/ }),

/***/ 1002:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

/***/ }),

/***/ 4147:
/***/ ((module) => {

"use strict";
module.exports = {"i8":"8.4.0"};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CollectionEntry: () => (/* reexport safe */ _collections__WEBPACK_IMPORTED_MODULE_2__.R),
/* harmony export */   Collections: () => (/* reexport safe */ _collections__WEBPACK_IMPORTED_MODULE_2__.n),
/* harmony export */   FeedError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_10__.IY),
/* harmony export */   JWTScopeToken: () => (/* reexport safe */ _signing__WEBPACK_IMPORTED_MODULE_11__.v),
/* harmony export */   JWTUserSessionToken: () => (/* reexport safe */ _signing__WEBPACK_IMPORTED_MODULE_11__.c),
/* harmony export */   MissingSchemaError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_10__.uA),
/* harmony export */   Personalization: () => (/* reexport safe */ _personalization__WEBPACK_IMPORTED_MODULE_6__.S),
/* harmony export */   SiteError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_10__.z4),
/* harmony export */   StreamApiError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_10__.eY),
/* harmony export */   StreamClient: () => (/* reexport safe */ _client__WEBPACK_IMPORTED_MODULE_1__.n),
/* harmony export */   StreamFeed: () => (/* reexport safe */ _feed__WEBPACK_IMPORTED_MODULE_3__.r),
/* harmony export */   StreamFileStore: () => (/* reexport safe */ _files__WEBPACK_IMPORTED_MODULE_4__.h),
/* harmony export */   StreamImageStore: () => (/* reexport safe */ _images__WEBPACK_IMPORTED_MODULE_5__.$),
/* harmony export */   StreamReaction: () => (/* reexport safe */ _reaction__WEBPACK_IMPORTED_MODULE_7__.R),
/* harmony export */   StreamUser: () => (/* reexport safe */ _user__WEBPACK_IMPORTED_MODULE_8__.h),
/* harmony export */   connect: () => (/* reexport safe */ _connect__WEBPACK_IMPORTED_MODULE_0__.$)
/* harmony export */ });
/* harmony import */ var _connect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2631);
/* harmony import */ var _client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3513);
/* harmony import */ var _collections__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3709);
/* harmony import */ var _feed__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7248);
/* harmony import */ var _files__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(448);
/* harmony import */ var _images__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9082);
/* harmony import */ var _personalization__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8039);
/* harmony import */ var _reaction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8824);
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(7878);
/* harmony import */ var _batch_operations__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(6793);
/* harmony import */ var _batch_operations__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_batch_operations__WEBPACK_IMPORTED_MODULE_9__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _batch_operations__WEBPACK_IMPORTED_MODULE_9__) if(["default","connect","StreamClient","CollectionEntry","Collections","StreamFeed","StreamFileStore","StreamImageStore","Personalization","StreamReaction","StreamUser"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _batch_operations__WEBPACK_IMPORTED_MODULE_9__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(2589);
/* harmony import */ var _signing__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(6685);
/**
 * @module stream
 * @author Thierry Schellenbach
 * BSD License
 */

/*
 * typescript does not export the default exports here
 * useful for exposing exported internal types
 */












})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});