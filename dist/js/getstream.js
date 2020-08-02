(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["stream"] = factory();
	else
		root["stream"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 68);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(71);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(31);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(15);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(57);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(25);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(58);
/* harmony import */ var _babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_5__);







function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var canCapture = typeof Error.captureStackTrace === 'function';
var canStack = !!new Error().stack;
/**
 * Abstract error object
 * @class ErrorAbstract
 * @access private
 * @param  {string}      [msg]         Error message
 */

var ErrorAbstract = /*#__PURE__*/function (_Error) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default()(ErrorAbstract, _Error);

  var _super = _createSuper(ErrorAbstract);

  function ErrorAbstract(msg) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, ErrorAbstract);

    _this = _super.call(this, msg);
    _this.message = msg;

    if (canCapture) {
      Error.captureStackTrace(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_1___default()(_this), constructor);
    } else if (canStack) {
      _this.stack = new Error().stack;
    } else {
      _this.stack = '';
    }

    return _this;
  }

  return ErrorAbstract;
}( /*#__PURE__*/_babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_5___default()(Error));
/**
 * FeedError
 * @class FeedError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param {String} [msg] - An error message that will probably end up in a log.
 */


var FeedError = /*#__PURE__*/function (_ErrorAbstract) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default()(FeedError, _ErrorAbstract);

  var _super2 = _createSuper(FeedError);

  function FeedError() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, FeedError);

    return _super2.apply(this, arguments);
  }

  return FeedError;
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
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default()(SiteError, _ErrorAbstract2);

  var _super3 = _createSuper(SiteError);

  function SiteError() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, SiteError);

    return _super3.apply(this, arguments);
  }

  return SiteError;
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
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default()(MissingSchemaError, _ErrorAbstract3);

  var _super4 = _createSuper(MissingSchemaError);

  function MissingSchemaError() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, MissingSchemaError);

    return _super4.apply(this, arguments);
  }

  return MissingSchemaError;
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
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default()(StreamApiError, _ErrorAbstract4);

  var _super5 = _createSuper(StreamApiError);

  function StreamApiError(msg, data, response) {
    var _this2;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, StreamApiError);

    _this2 = _super5.call(this, msg);
    _this2.error = data;
    _this2.response = response;
    return _this2;
  }

  return StreamApiError;
}(ErrorAbstract);

/* harmony default export */ __webpack_exports__["a"] = ({
  FeedError: FeedError,
  SiteError: SiteError,
  MissingSchemaError: MissingSchemaError,
  StreamApiError: StreamApiError
});

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
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

module.exports = _defineProperty;

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(33);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var Base64__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(66);
/* harmony import */ var Base64__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(Base64__WEBPACK_IMPORTED_MODULE_3__);



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }



var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

function safeJsonParse(thing) {
  if (_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1___default()(thing) === 'object') return thing;

  try {
    return JSON.parse(thing);
  } catch (e) {
    return undefined;
  }
}

function padString(string) {
  var segmentLength = 4;
  var diff = string.length % segmentLength;
  if (!diff) return string;
  var padLength = segmentLength - diff;

  while (padLength--) {
    string += '=';
  }

  return string;
}

function toBase64(base64UrlString) {
  return padString(base64UrlString).replace(/\-/g, '+') // eslint-disable-line no-useless-escape
  .replace(/_/g, '/');
}

function decodeBase64Url(base64UrlString) {
  try {
    return Base64__WEBPACK_IMPORTED_MODULE_3___default.a.atob(toBase64(base64UrlString));
  } catch (e) {
    if (e.name === 'InvalidCharacterError') {
      return undefined;
    }

    throw e;
  }
}

function headerFromJWS(jwsSig) {
  var encodedHeader = jwsSig.split('.', 1)[0];
  return safeJsonParse(decodeBase64Url(encodedHeader));
}

function JWTScopeToken(apiSecret, resource, action, opts) {
  /**
   * Creates the JWT token for feedId, resource and action using the apiSecret
   * @method JWTScopeToken
   * @memberof signing
   * @private
   * @param {string} apiSecret - API Secret key
   * @param {string} resource - JWT payload resource
   * @param {string} action - JWT payload action
   * @param {object} [options] - Optional additional options
   * @param {string} [options.feedId] - JWT payload feed identifier
   * @param {string} [options.userId] - JWT payload user identifier
   * @return {string} JWT Token
   */
  var options = opts || {};
  var noTimestamp = options.expireTokens ? !options.expireTokens : true;
  var payload = {
    resource: resource,
    action: action
  };

  if (options.feedId) {
    payload.feed_id = options.feedId;
  }

  if (options.userId) {
    payload.user_id = options.userId;
  }

  return jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default.a.sign(payload, apiSecret, {
    algorithm: 'HS256',
    noTimestamp: noTimestamp
  });
}

function JWTUserSessionToken(apiSecret, userId) {
  var extraData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var jwtOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  /**
   * Creates the JWT token that can be used for a UserSession
   * @method JWTUserSessionToken
   * @memberof signing
   * @private
   * @param {string} apiSecret - API Secret key
   * @param {string} userId - The user_id key in the JWT payload
   * @param {string} [extraData] - Extra that should be part of the JWT token
   * @param {object} [jwtOptions] - Options that can be past to jwt.sign
   * @return {string} JWT Token
   */
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

  return jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default.a.sign(payload, apiSecret, opts);
}

function isJWTSignature(signature) {
  /**
   * check if token is a valid JWT token
   * @method isJWTSignature
   * @memberof signing
   * @private
   * @param {string} signature - Signature to check
   * @return {boolean}
   */
  if (signature == null || signature.length === 0) {
    return false;
  }

  var token = signature.split(' ')[1] || signature;
  return JWS_REGEX.test(token) && !!headerFromJWS(token);
}

/* harmony default export */ __webpack_exports__["a"] = ({
  JWTScopeToken: JWTScopeToken,
  headerFromJWS: headerFromJWS,
  JWTUserSessionToken: JWTUserSessionToken,
  isJWTSignature: isJWTSignature,
  isJWT: isJWTSignature
});

/***/ }),
/* 6 */
/***/ (function(module, exports) {

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

module.exports = _asyncToGenerator;

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(60);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var form_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(61);
/* harmony import */ var form_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(form_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1);




var validFeedSlugRe = /^[\w]+$/;
var validUserIdRe = /^[\w-]+$/;

function validateFeedSlug(feedSlug) {
  /*
   * Validate that the feedSlug matches \w
   */
  if (!validFeedSlugRe.test(feedSlug)) {
    throw new _errors__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].FeedError("Invalid feedSlug, please use letters, numbers or _: ".concat(feedSlug));
  }

  return feedSlug;
}

function validateUserId(userId) {
  /*
   * Validate the userId matches \w
   */
  if (!validUserIdRe.test(userId)) {
    throw new _errors__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].FeedError("Invalid userId, please use letters, numbers, - or _: ".concat(userId));
  }

  return userId;
}

function rfc3986(str) {
  return str.replace(/[!'()*]/g, function (c) {
    return "%".concat(c.charCodeAt(0).toString(16).toUpperCase());
  });
}

function isReadableStream(obj) {
  return obj && _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1___default()(obj) === 'object' && typeof obj._read === 'function' && _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1___default()(obj._readableState) === 'object';
}

function validateFeedId(feedId) {
  /*
   * Validate that the feedId matches the spec user:1
   */
  var parts = feedId.split(':');

  if (parts.length !== 2) {
    throw new _errors__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].FeedError("Invalid feedId, expected something like user:1 got ".concat(feedId));
  }

  var _parts = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(parts, 2),
      feedSlug = _parts[0],
      userId = _parts[1];

  validateFeedSlug(feedSlug);
  validateUserId(userId);
  return feedId;
}

function addFileToFormData(uri, name, contentType) {
  var data = new form_data__WEBPACK_IMPORTED_MODULE_2___default.a();
  var fileField;

  if (isReadableStream(uri) || uri && uri.toString && uri.toString() === '[object File]') {
    fileField = uri;
  } else {
    fileField = {
      uri: uri,
      name: name || uri.split('/').reverse()[0]
    };
    if (contentType != null) fileField.type = contentType;
  }

  data.append('file', fileField);
  return data;
}

function replaceStreamObjects(obj) {
  if (Array.isArray(obj)) return obj.map(function (v) {
    return replaceStreamObjects(v);
  });
  if (Object.prototype.toString.call(obj) !== '[object Object]') return obj;
  if (typeof obj.ref === 'function') return obj.ref();
  var cloned = {};
  Object.keys(obj).forEach(function (k) {
    cloned[k] = replaceStreamObjects(obj[k]);
  });
  return cloned;
}

/* harmony default export */ __webpack_exports__["a"] = ({
  validateFeedId: validateFeedId,
  validateFeedSlug: validateFeedSlug,
  validateUserId: validateUserId,
  rfc3986: rfc3986,
  isReadableStream: isReadableStream,
  addFileToFormData: addFileToFormData,
  replaceStreamObjects: replaceStreamObjects
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(34);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

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
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

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
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

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
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assign = __webpack_require__(8);

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
/* 11 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var Class    = __webpack_require__(10),
    Cookie   = __webpack_require__(46).Cookie,
    Promise  = __webpack_require__(23),
    array    = __webpack_require__(26),
    assign   = __webpack_require__(8),
    Logging  = __webpack_require__(16),
    Timeouts = __webpack_require__(94),
    Channel  = __webpack_require__(44);

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
        env    = process.env,
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(22)))

/***/ }),
/* 14 */
/***/ (function(module, exports) {

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(30);

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
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toJSON = __webpack_require__(17);

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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// http://assanka.net/content/tech/2009/09/02/json2-js-vs-prototype/

module.exports = function(object) {
  return JSON.stringify(object, function(key, value) {
    return (this[key] instanceof Array) ? this[key] : value;
  });
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Promise   = __webpack_require__(23);

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
    this._timer = global.setTimeout(function() {
      self._reject(message);
    }, seconds * 1000);
  },

  setDeferredStatus: function(status, value) {
    if (this._timer) global.clearTimeout(this._timer);

    this.then();

    if (status === 'succeeded')
      this._resolve(value);
    else if (status === 'failed')
      this._reject(value);
    else
      delete this._promise;
  }
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var objectWithoutPropertiesLoose = __webpack_require__(70);

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
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

module.exports = _objectWithoutProperties;

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StreamUser; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__);






function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var StreamUser = /*#__PURE__*/function () {
  function StreamUser(client, userId, userAuthToken) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, StreamUser);

    /**
     * Initialize a user session object
     * @method constructor
     * @memberof StreamUser.prototype
     * @param {StreamClient} client Stream client this collection is constructed from
     * @param {string} userId The ID of the user
     * @param {string} token JWT token
     * @example new StreamUser(client, "123", "eyJhbGciOiJIUzI1...")
     */
    this.client = client;
    this.id = userId;
    this.data = undefined;
    this.full = undefined;
    this.token = userAuthToken;
    this.url = "user/".concat(this.id, "/");
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(StreamUser, [{
    key: "ref",
    value: function ref() {
      return "SU:".concat(this.id);
    }
  }, {
    key: "delete",
    value: function _delete() {
      return this.client.delete({
        url: this.url,
        signature: this.token
      });
    }
  }, {
    key: "get",
    value: function () {
      var _get = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(options) {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.client.get({
                  url: this.url,
                  signature: this.token,
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
          }
        }, _callee, this);
      }));

      function get(_x) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "create",
    value: function () {
      var _create = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(data, options) {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.client.post({
                  url: 'user/',
                  body: {
                    id: this.id,
                    data: data || this.data || {}
                  },
                  qs: options,
                  signature: this.token
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
          }
        }, _callee2, this);
      }));

      function create(_x2, _x3) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(data) {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.client.put({
                  url: this.url,
                  body: {
                    data: data || this.data || {}
                  },
                  signature: this.token
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
          }
        }, _callee3, this);
      }));

      function update(_x4) {
        return _update.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: "getOrCreate",
    value: function getOrCreate(data) {
      return this.create(data, {
        get_or_create: true
      });
    }
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
/* 21 */
/***/ (function(module, exports) {



/***/ }),
/* 22 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var asap = __webpack_require__(43);

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
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(50);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(51);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var https__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(52);
/* harmony import */ var https__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(https__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var faye__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(53);
/* harmony import */ var faye__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(faye__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var jwt_decode__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(54);
/* harmony import */ var jwt_decode__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(jwt_decode__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _personalization__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(55);
/* harmony import */ var _batch_operations__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(21);
/* harmony import */ var _batch_operations__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_batch_operations__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _collections__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(56);
/* harmony import */ var _feed__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(59);
/* harmony import */ var _files__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(62);
/* harmony import */ var _images__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(63);
/* harmony import */ var _reaction__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(65);
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(20);
/* harmony import */ var _redirect_url__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(32);
/* harmony import */ var _redirect_url__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(_redirect_url__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var _signing__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(5);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(1);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(7);
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(67);
var _package_json__WEBPACK_IMPORTED_MODULE_23___namespace = /*#__PURE__*/__webpack_require__.t(67, 1);







function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }



















/**
 * Client to connect to Stream api
 * @class StreamClient
 */

var StreamClient = /*#__PURE__*/function () {
  function StreamClient(apiKey, apiSecretOrToken, appId) {
    var _this = this;

    var _options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, StreamClient);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(this, "replaceReactionOptions", function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      // Shortcut options for reaction enrichment
      if (options.reactions) {
        if (options.reactions.own != null) {
          options.withOwnReactions = options.reactions.own;
        }

        if (options.reactions.recent != null) {
          options.withRecentReactions = options.reactions.recent;
        }

        if (options.reactions.counts != null) {
          options.withReactionCounts = options.reactions.counts;
        }

        if (options.reactions.own_children != null) {
          options.withOwnChildren = options.reactions.own_children;
        }

        delete options.reactions;
      }
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(this, "handleResponse", function (response) {
      if (/^2/.test("".concat(response.status))) {
        _this.send('response', null, response, response.data);

        return response.data;
      }

      throw new _errors__WEBPACK_IMPORTED_MODULE_21__[/* default */ "a"].StreamApiError("".concat(JSON.stringify(response.data), " with HTTP status code ").concat(response.status), response.data, response);
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(this, "doAxiosRequest", /*#__PURE__*/function () {
      var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee(method, options) {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
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

                if (!_context.t0.response) {
                  _context.next = 12;
                  break;
                }

                return _context.abrupt("return", _this.handleResponse(_context.t0.response));

              case 12:
                throw new _errors__WEBPACK_IMPORTED_MODULE_21__[/* default */ "a"].SiteError(_context.t0.message);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 8]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());

    /**
     * Initialize a client
     * @method initialize
     * @memberof StreamClient.prototype
     * @param {string} apiKey - the api key
     * @param {string} [apiSecret] - the api secret
     * @param {string} [appId] - id of the app
     * @param {object} [options] - additional options
     * @param {string} [options.location] - which data center to use
     * @param {boolean} [options.expireTokens=false] - whether to use a JWT timestamp field (i.e. iat)
     * @example <caption>initialize is not directly called by via stream.connect, ie:</caption>
     * stream.connect(apiKey, apiSecret)
     * @example <caption>secret is optional and only used in server side mode</caption>
     * stream.connect(apiKey, null, appId);
     */
    this.baseUrl = 'https://api.stream-io-api.com/api/';
    this.baseAnalyticsUrl = 'https://analytics.stream-io-api.com/analytics/';
    this.apiKey = apiKey;
    this.usingApiSecret = apiSecretOrToken != null && !_signing__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].isJWT(apiSecretOrToken);
    this.apiSecret = this.usingApiSecret ? apiSecretOrToken : null;
    this.userToken = this.usingApiSecret ? null : apiSecretOrToken;
    this.enrichByDefault = !this.usingApiSecret;

    if (this.userToken != null) {
      var jwtBody = jwt_decode__WEBPACK_IMPORTED_MODULE_10___default()(this.userToken);

      if (!jwtBody.user_id) {
        throw new TypeError('user_id is missing in user token');
      }

      this.userId = jwtBody.user_id;
      this.currentUser = this.user(this.userId);
      this.authPayload = jwtBody;
    }

    this.appId = appId;
    this.options = _options;
    this.version = this.options.version || 'v1.0';
    this.fayeUrl = this.options.fayeUrl || 'https://faye-us-east.stream-io-api.com/faye';
    this.fayeClient = null; // track a source name for the api calls, ie get started or databrowser

    this.group = this.options.group || 'unspecified'; // track subscriptions made on feeds created by this client

    this.subscriptions = {};
    this.expireTokens = this.options.expireTokens ? this.options.expireTokens : false; // which data center to use

    this.location = this.options.location;
    this.baseUrl = this.getBaseUrl();

    if (typeof process !== 'undefined' && process.env.LOCAL_FAYE) {
      this.fayeUrl = 'http://localhost:9999/faye/';
    }

    if (typeof process !== 'undefined' && process.env.STREAM_ANALYTICS_BASE_URL) {
      this.baseAnalyticsUrl = process.env.STREAM_ANALYTICS_BASE_URL;
    }

    this.handlers = {};
    this.browser = typeof this.options.browser !== 'undefined' ? this.options.browser : typeof window !== 'undefined';
    this.node = !this.browser;

    if (this.node) {
      var keepAlive = this.options.keepAlive === undefined ? true : this.options.keepAlive;
      this.nodeOptions = {
        httpAgent: new http__WEBPACK_IMPORTED_MODULE_7___default.a.Agent({
          keepAlive: keepAlive,
          keepAliveMsecs: 3000
        }),
        httpsAgent: new https__WEBPACK_IMPORTED_MODULE_8___default.a.Agent({
          keepAlive: keepAlive,
          keepAliveMsecs: 3000
        })
      };
    }

    this.request = axios__WEBPACK_IMPORTED_MODULE_6___default.a.create(_objectSpread({
      timeout: this.options.timeout || 10 * 1000,
      // 10 seconds
      withCredentials: false
    }, this.nodeOptions || {}));
    this.personalization = new _personalization__WEBPACK_IMPORTED_MODULE_11__[/* default */ "a"](this);

    if (this.browser && this.usingApiSecret) {
      throw new _errors__WEBPACK_IMPORTED_MODULE_21__[/* default */ "a"].FeedError('You are publicly sharing your App Secret. Do not expose the App Secret in browsers, "native" mobile apps, or other non-trusted environments.');
    }

    this.collections = new _collections__WEBPACK_IMPORTED_MODULE_13__[/* default */ "a"](this, this.getOrCreateToken());
    this.files = new _files__WEBPACK_IMPORTED_MODULE_15__[/* default */ "a"](this, this.getOrCreateToken());
    this.images = new _images__WEBPACK_IMPORTED_MODULE_16__[/* default */ "a"](this, this.getOrCreateToken());
    this.reactions = new _reaction__WEBPACK_IMPORTED_MODULE_17__[/* default */ "a"](this, this.getOrCreateToken());
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(StreamClient, [{
    key: "_throwMissingApiSecret",
    value: function _throwMissingApiSecret() {
      if (!this.usingApiSecret) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_21__[/* default */ "a"].SiteError('This method can only be used server-side using your API Secret, use client = stream.connect(key, secret);');
      }
    }
  }, {
    key: "getPersonalizationToken",
    value: function getPersonalizationToken() {
      if (this._personalizationToken) return this._personalizationToken;

      this._throwMissingApiSecret();

      this._personalizationToken = _signing__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].JWTScopeToken(this.apiSecret, 'personalization', '*', {
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

      this._collectionsToken = _signing__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].JWTScopeToken(this.apiSecret, 'collections', '*', {
        feedId: '*',
        expireTokens: this.expireTokens
      });
      return this._collectionsToken;
    }
  }, {
    key: "getAnalyticsToken",
    value: function getAnalyticsToken() {
      this._throwMissingApiSecret();

      return _signing__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].JWTScopeToken(this.apiSecret, 'analytics', '*', {
        userId: '*',
        expireTokens: this.expireTokens
      });
    }
  }, {
    key: "getBaseUrl",
    value: function getBaseUrl(serviceName) {
      if (!serviceName) serviceName = 'api';
      if (this.options.urlOverride && this.options.urlOverride[serviceName]) return this.options.urlOverride[serviceName];
      var urlEnvironmentKey = serviceName === 'api' ? 'STREAM_BASE_URL' : "STREAM_".concat(serviceName.toUpperCase(), "_URL");
      if (typeof process !== 'undefined' && process.env[urlEnvironmentKey]) return process.env[urlEnvironmentKey];
      if (typeof process !== 'undefined' && process.env.LOCAL || this.options.local) return "http://localhost:8000/".concat(serviceName, "/");

      if (this.location) {
        var protocol = this.options.protocol || 'https';
        return "".concat(protocol, "://").concat(this.location, "-").concat(serviceName, ".stream-io-api.com/").concat(serviceName, "/");
      }

      if (serviceName !== 'api') return "https://".concat(serviceName, ".stream-io-api.com/").concat(serviceName, "/");
      return this.baseUrl;
    }
  }, {
    key: "on",
    value: function on(event, callback) {
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
      this.handlers[event] = callback;
    }
  }, {
    key: "off",
    value: function off(key) {
      /**
       * Remove one or more event handlers
       * @method off
       * @memberof StreamClient.prototype
       * @param {string} [key] - Name of the handler
       * @example
       * client.off() removes all handlers
       * client.off(name) removes the specified handler
       */
      if (key === undefined) {
        this.handlers = {};
      } else {
        delete this.handlers[key];
      }
    }
  }, {
    key: "send",
    value: function send(key) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      /**
       * Call the given handler with the arguments
       * @method send
       * @memberof StreamClient.prototype
       * @access private
       */
      if (this.handlers[key]) this.handlers[key].apply(this, args);
    }
  }, {
    key: "userAgent",
    value: function userAgent() {
      /**
       * Get the current user agent
       * @method userAgent
       * @memberof StreamClient.prototype
       * @return {string} current user agent
       */
      return "stream-javascript-client-".concat(this.node ? 'node' : 'browser', "-").concat(_package_json__WEBPACK_IMPORTED_MODULE_23__.version);
    }
  }, {
    key: "getReadOnlyToken",
    value: function getReadOnlyToken(feedSlug, userId) {
      /**
       * Returns a token that allows only read operations
       *
       * @method getReadOnlyToken
       * @memberof StreamClient.prototype
       * @param {string} feedSlug - The feed slug to get a read only token for
       * @param {string} userId - The user identifier
       * @return {string} token
       * @example
       * client.getReadOnlyToken('user', '1');
       */
      _utils__WEBPACK_IMPORTED_MODULE_22__[/* default */ "a"].validateFeedSlug(feedSlug);
      _utils__WEBPACK_IMPORTED_MODULE_22__[/* default */ "a"].validateUserId(userId);
      return _signing__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].JWTScopeToken(this.apiSecret, '*', 'read', {
        feedId: "".concat(feedSlug).concat(userId),
        expireTokens: this.expireTokens
      });
    }
  }, {
    key: "getReadWriteToken",
    value: function getReadWriteToken(feedSlug, userId) {
      /**
       * Returns a token that allows read and write operations
       *
       * @method getReadWriteToken
       * @memberof StreamClient.prototype
       * @param {string} feedSlug - The feed slug to get a read only token for
       * @param {string} userId - The user identifier
       * @return {string} token
       * @example
       * client.getReadWriteToken('user', '1');
       */
      _utils__WEBPACK_IMPORTED_MODULE_22__[/* default */ "a"].validateFeedSlug(feedSlug);
      _utils__WEBPACK_IMPORTED_MODULE_22__[/* default */ "a"].validateUserId(userId);
      return _signing__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].JWTScopeToken(this.apiSecret, '*', '*', {
        feedId: "".concat(feedSlug).concat(userId),
        expireTokens: this.expireTokens
      });
    }
  }, {
    key: "feed",
    value: function feed(feedSlug) {
      var userId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.userId;
      var token = arguments.length > 2 ? arguments[2] : undefined;

      /**
       * Returns a feed object for the given feed id and token
       * @method feed
       * @memberof StreamClient.prototype
       * @param {string} feedSlug - The feed slug
       * @param {string} userId - The user identifier
       * @param {string} [token] - The token (DEPRECATED), used for internal testing
       * @return {StreamFeed}
       * @example
       * client.feed('user', '1');
       */
      if (userId instanceof _user__WEBPACK_IMPORTED_MODULE_18__[/* default */ "a"]) userId = userId.id;

      if (token === undefined) {
        if (this.usingApiSecret) {
          token = _signing__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].JWTScopeToken(this.apiSecret, '*', '*', {
            feedId: "".concat(feedSlug).concat(userId)
          });
        } else {
          token = this.userToken;
        }
      }

      return new _feed__WEBPACK_IMPORTED_MODULE_14__[/* default */ "a"](this, feedSlug, userId, token);
    }
  }, {
    key: "enrichUrl",
    value: function enrichUrl(relativeUrl, serviceName) {
      /**
       * Combines the base url with version and the relative url
       * @method enrichUrl
       * @memberof StreamClient.prototype
       * @private
       * @param {string} relativeUrl
       */
      return "".concat(this.getBaseUrl(serviceName)).concat(this.version, "/").concat(relativeUrl);
    }
  }, {
    key: "shouldUseEnrichEndpoint",
    value: function shouldUseEnrichEndpoint() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (options.enrich) {
        var result = options.enrich;
        delete options.enrich;
        return result;
      }

      return this.enrichByDefault || options.ownReactions != null || options.withRecentReactions != null || options.withReactionCounts != null || options.withOwnChildren != null;
    }
  }, {
    key: "enrichKwargs",
    value: function enrichKwargs(_ref2) {
      var method = _ref2.method,
          kwargs = _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0___default()(_ref2, ["method"]);

      /**
       * Adds the API key and the signature
       * @method enrichKwargs
       * @memberof StreamClient.prototype
       * @param {object} kwargs
       * @private
       */
      var signature = kwargs.signature || this.signature;
      var isJWT = _signing__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].isJWTSignature(signature);
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
          'stream-auth-type': isJWT ? 'jwt' : 'simple',
          Authorization: isJWT ? signature.split(' ').reverse()[0] : signature
        }, kwargs.headers || {})
      }, kwargs.axiosOptions || {});
    }
  }, {
    key: "getFayeAuthorization",
    value: function getFayeAuthorization() {
      var _this2 = this;

      /**
       * Get the authorization middleware to use Faye with getstream.io
       * @method getFayeAuthorization
       * @memberof StreamClient.prototype
       * @private
       * @return {object} Faye authorization middleware
       */
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
  }, {
    key: "getFayeClient",
    value: function getFayeClient() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

      /**
       * Returns this client's current Faye client
       * @method getFayeClient
       * @memberof StreamClient.prototype
       * @private
       * @return {object} Faye client
       */
      if (this.fayeClient === null) {
        this.fayeClient = new faye__WEBPACK_IMPORTED_MODULE_9___default.a.Client(this.fayeUrl, {
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
      var fd = _utils__WEBPACK_IMPORTED_MODULE_22__[/* default */ "a"].addFileToFormData(uri, name, contentType);
      return this.doAxiosRequest('POST', {
        url: url,
        body: fd,
        headers: fd.getHeaders ? fd.getHeaders() : {},
        // node vs browser
        signature: this.getOrCreateToken(),
        axiosOptions: {
          timeout: 0,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          onUploadProgress: onUploadProgress
        }
      });
    }
  }, {
    key: "get",
    value: function get(kwargs) {
      /**
       * Shorthand function for get request
       * @method get
       * @memberof StreamClient.prototype
       * @private
       * @param  {object}    kwargs
       * @return {Promise}   Promise object
       */
      return this.doAxiosRequest('GET', kwargs);
    }
  }, {
    key: "post",
    value: function post(kwargs) {
      /**
       * Shorthand function for post request
       * @method post
       * @memberof StreamClient.prototype
       * @private
       * @param  {object}    kwargs
       * @return {Promise}   Promise object
       */
      return this.doAxiosRequest('POST', kwargs);
    }
  }, {
    key: "delete",
    value: function _delete(kwargs) {
      /**
       * Shorthand function for delete request
       * @method delete
       * @memberof StreamClient.prototype
       * @private
       * @param  {object}    kwargs
       * @return {Promise}   Promise object
       */
      return this.doAxiosRequest('DELETE', kwargs);
    }
  }, {
    key: "put",
    value: function put(kwargs) {
      /**
       * Shorthand function for put request
       * @method put
       * @memberof StreamClient.prototype
       * @private
       * @param  {object}    kwargs
       * @return {Promise}   Promise object
       */
      return this.doAxiosRequest('PUT', kwargs);
    }
    /**
     * @param {string} userId
     * @param {object} extraData
     */

  }, {
    key: "createUserToken",
    value: function createUserToken(userId) {
      var extraData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this._throwMissingApiSecret();

      return _signing__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].JWTUserSessionToken(this.apiSecret, userId, extraData, {
        noTimestamp: !this.expireTokens
      });
    }
  }, {
    key: "updateActivities",
    value: function updateActivities(activities) {
      /**
       * Updates all supplied activities on the getstream-io api
       * @since  3.1.0
       * @param  {array} activities list of activities to update
       * @return {Promise}
       */
      this._throwMissingApiSecret();

      if (!(activities instanceof Array)) {
        throw new TypeError('The activities argument should be an Array');
      }

      var authToken = _signing__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].JWTScopeToken(this.apiSecret, 'activities', '*', {
        feedId: '*',
        expireTokens: this.expireTokens
      });
      return this.post({
        url: 'activities/',
        body: {
          activities: activities
        },
        signature: authToken
      });
    }
  }, {
    key: "updateActivity",
    value: function updateActivity(activity) {
      /**
       * Updates one activity on the getstream-io api
       * @since  3.1.0
       * @param  {object} activity The activity to update
       * @return {Promise}
       */
      this._throwMissingApiSecret();

      return this.updateActivities([activity]);
    }
  }, {
    key: "getActivities",
    value: function getActivities(_ref3) {
      var ids = _ref3.ids,
          foreignIDTimes = _ref3.foreignIDTimes,
          params = _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0___default()(_ref3, ["ids", "foreignIDTimes"]);

      /**
       * Retrieve activities by ID or foreign ID and time
       * @since  3.19.0
       * @param  {object} params object containing either the list of activity IDs as {ids: ['...', ...]} or foreign IDs and time as {foreignIDTimes: [{foreignID: ..., time: ...}, ...]}
       * @return {Promise}
       */
      if (ids) {
        if (!(ids instanceof Array)) {
          throw new TypeError('The ids argument should be an Array');
        }

        params.ids = ids.join(',');
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

          foreignIDs.push(fidTime.foreignID);
          timestamps.push(fidTime.time);
        });
        params.foreign_ids = foreignIDs.join(',');
        params.timestamps = timestamps.join(',');
      } else {
        throw new TypeError('Missing ids or foreignIDTimes params');
      }

      var token = this.userToken;

      if (this.usingApiSecret) {
        token = _signing__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].JWTScopeToken(this.apiSecret, 'activities', '*', {
          feedId: '*',
          expireTokens: this.expireTokens
        });
      }

      this.replaceReactionOptions(params);
      var path = this.shouldUseEnrichEndpoint(params) ? 'enrich/activities/' : 'activities/';
      return this.get({
        url: path,
        qs: params,
        signature: token
      });
    }
  }, {
    key: "getOrCreateToken",
    value: function getOrCreateToken() {
      if (!this._getOrCreateToken) {
        this._getOrCreateToken = this.usingApiSecret ? _signing__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].JWTScopeToken(this.apiSecret, '*', '*', {
          feedId: '*'
        }) : this.userToken;
      }

      return this._getOrCreateToken;
    }
  }, {
    key: "user",
    value: function user(userId) {
      return new _user__WEBPACK_IMPORTED_MODULE_18__[/* default */ "a"](this, userId, this.getOrCreateToken());
    }
  }, {
    key: "setUser",
    value: function () {
      var _setUser = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee2(data) {
        var body, user;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.usingApiSecret) {
                  _context2.next = 2;
                  break;
                }

                throw new _errors__WEBPACK_IMPORTED_MODULE_21__[/* default */ "a"].SiteError('This method can only be used client-side using a user token');

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
        signature: this.getOrCreateToken()
      });
    }
  }, {
    key: "personalizedFeed",
    value: function personalizedFeed() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return this.get({
        url: 'enrich/personalization/feed/',
        qs: options,
        signature: this.getOrCreateToken()
      });
    }
  }, {
    key: "activityPartialUpdate",
    value: function () {
      var _activityPartialUpdate = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee3(data) {
        var response, activity;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.activitiesPartialUpdate([data]);

              case 2:
                response = _context3.sent;
                activity = response.activities[0];
                delete response.activities;
                return _context3.abrupt("return", _objectSpread(_objectSpread({}, activity), response));

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function activityPartialUpdate(_x4) {
        return _activityPartialUpdate.apply(this, arguments);
      }

      return activityPartialUpdate;
    }()
  }, {
    key: "activitiesPartialUpdate",
    value: function activitiesPartialUpdate(changes) {
      /**
       * Update multiple activities with partial operations.
       * @since v3.20.0
       * @param {array} changes array containing the changesets to be applied. Every changeset contains the activity identifier which is either the ID or the pair of of foreign ID and time of the activity. The operations to issue can be set:{...} and unset:[...].
       * @return {Promise}
       * @xample
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
       *     foreignID: "product:123",
       *     time: "2016-11-10T13:20:00.000000",
       *     set: {
       *       ...
       *     },
       *     unset: [
       *       ...
       *     ]
       *   },
       *   {
       *     foreignID: "product:321",
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
          throw new TypeError('missing id or foreign ID and time');
        }

        if (item.set && !(item.set instanceof Object)) {
          throw new TypeError('set field should be an Object');
        }

        if (item.unset && !(item.unset instanceof Array)) {
          throw new TypeError('unset field should be an Array');
        }
      });
      var authToken = this.userToken;

      if (this.usingApiSecret) {
        authToken = _signing__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].JWTScopeToken(this.apiSecret, 'activities', '*', {
          feedId: '*',
          expireTokens: this.expireTokens
        });
      }

      return this.post({
        url: 'activity/',
        body: {
          changes: changes
        },
        signature: authToken
      });
    }
  }]);

  return StreamClient;
}(); // If we are in a node environment and batchOperations is available add the methods to the prototype of StreamClient


if (_batch_operations__WEBPACK_IMPORTED_MODULE_12___default.a) {
  Object.keys(_batch_operations__WEBPACK_IMPORTED_MODULE_12___default.a).forEach(function (key) {
    if (Object.prototype.hasOwnProperty.call(_batch_operations__WEBPACK_IMPORTED_MODULE_12___default.a, key)) {
      StreamClient.prototype[key] = _batch_operations__WEBPACK_IMPORTED_MODULE_12___default.a[key];
    }
  });
} // If we are in a node environment and redirectUrl is available add the methods to the prototype of StreamClient


if (_redirect_url__WEBPACK_IMPORTED_MODULE_19___default.a) {
  StreamClient.prototype.createRedirectUrl = _redirect_url__WEBPACK_IMPORTED_MODULE_19___default.a;
}

/* harmony default export */ __webpack_exports__["a"] = (StreamClient);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(22)))

/***/ }),
/* 25 */
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

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

if (global.onunload !== undefined)
  Event.on(global, 'unload', Event.detach, Event);

module.exports = {
  Event: Event
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assign       = __webpack_require__(8),
    EventEmitter = __webpack_require__(91);

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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

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
/* 30 */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;

/***/ }),
/* 31 */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;

/***/ }),
/* 32 */
/***/ (function(module, exports) {



/***/ }),
/* 33 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
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
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(9);
var normalizeHeaderName = __webpack_require__(77);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(38);
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(38);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
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
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
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

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(22)))

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);
var settle = __webpack_require__(78);
var buildURL = __webpack_require__(35);
var buildFullPath = __webpack_require__(80);
var parseHeaders = __webpack_require__(83);
var isURLSameOrigin = __webpack_require__(84);
var createError = __webpack_require__(39);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
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

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(85);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(79);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
  var defaultToConfig2Keys = [
    'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
    'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath'
  ];

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys);

  var otherKeys = Object
    .keys(config2)
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = {
  VERSION:          '1.3.0',

  BAYEUX_VERSION:   '1.0',
  ID_LENGTH:        160,
  JSONP_CALLBACK:   'jsonpcallback',
  CONNECTION_TYPES: ['long-polling', 'cross-origin-long-polling', 'callback-polling', 'websocket', 'eventsource', 'in-process'],

  MANDATORY_CONNECTION_TYPES: ['long-polling', 'callback-polling', 'in-process']
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// rawAsap provides everything we need except exception management.
var rawAsap = __webpack_require__(89);
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
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Class     = __webpack_require__(10),
    assign    = __webpack_require__(8),
    Publisher = __webpack_require__(28),
    Grammar   = __webpack_require__(45);

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
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  CHANNEL_NAME:     /^\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*$/,
  CHANNEL_PATTERN:  /^(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*\/\*{1,2}$/,
  ERROR:            /^([0-9][0-9][0-9]:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*(,(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)*:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*|[0-9][0-9][0-9]::(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)$/,
  VERSION:          /^([0-9])+(\.(([a-z]|[A-Z])|[0-9])(((([a-z]|[A-Z])|[0-9])|\-|\_))*)*$/
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Class = __webpack_require__(10);

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
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Class     = __webpack_require__(10),
    URI       = __webpack_require__(12),
    browser   = __webpack_require__(27),
    assign    = __webpack_require__(8),
    toJSON    = __webpack_require__(17),
    Transport = __webpack_require__(13);

var XHR = assign(Class(Transport, {
  encode: function(messages) {
    return toJSON(messages);
  },

  request: function(messages) {
    var href = this.endpoint.href,
        self = this,
        xhr;

    // Prefer XMLHttpRequest over ActiveXObject if they both exist
    if (global.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else if (global.ActiveXObject) {
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
    if (global.onbeforeunload !== undefined)
      browser.Event.on(global, 'beforeunload', abort);

    xhr.onreadystatechange = function() {
      if (!xhr || xhr.readyState !== 4) return;

      var replies    = null,
          status     = xhr.status,
          text       = xhr.responseText,
          successful = (status >= 200 && status < 300) || status === 304 || status === 1223;

      if (global.onbeforeunload !== undefined)
        browser.Event.detach(global, 'beforeunload', abort);

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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assign = __webpack_require__(8);

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
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(72);

/***/ }),
/* 51 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 52 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var constants = __webpack_require__(42),
    Logging   = __webpack_require__(16);

var Faye = {
  VERSION:    constants.VERSION,

  Client:     __webpack_require__(88),
  Scheduler:  __webpack_require__(49)
};

Logging.wrapper = Faye;

module.exports = Faye;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base64_url_decode = __webpack_require__(104);

function InvalidTokenError(message) {
  this.message = message;
}

InvalidTokenError.prototype = new Error();
InvalidTokenError.prototype.name = 'InvalidTokenError';

module.exports = function (token,options) {
  if (typeof token !== 'string') {
    throw new InvalidTokenError('Invalid token specified');
  }

  options = options || {};
  var pos = options.header === true ? 0 : 1;
  try {
    return JSON.parse(base64_url_decode(token.split('.')[pos]));
  } catch (e) {
    throw new InvalidTokenError('Invalid token specified: ' + e.message);
  }
};

module.exports.InvalidTokenError = InvalidTokenError;


/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Personalization; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);



/**
 * Manage api calls for personalization
 * The collection object contains convenience functions such as  get, post, delete
 * @class Personalization
 */
var Personalization = /*#__PURE__*/function () {
  function Personalization(client) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Personalization);

    /**
     * Initialize the Personalization class
     *
     * @method constructor
     * @memberof Personalization.prototype
     * @param {StreamClient} client - The stream client
     */
    this.client = client;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Personalization, [{
    key: "get",
    value: function get(resource) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      /**
       * Get personalized activities for this feed
       *
       * @method get
       * @memberof Personalization.prototype
       * @param {object} resource - personalized resource endpoint i.e "follow_recommendations"
       * @param {object} options  Additional options
       * @return {Promise} Promise object. Personalized feed
       * @example client.personalization.get('follow_recommendations', {foo: 'bar', baz: 'qux'})
       */
      return this.client.get({
        url: "".concat(resource, "/"),
        serviceName: 'personalization',
        qs: options,
        signature: options.token || this.client.getPersonalizationToken()
      });
    }
  }, {
    key: "post",
    value: function post(resource) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      /**
       * Post data to personalization endpoint
       *
       * @method post
       * @memberof Personalization.prototype
       * @param {object} resource - personalized resource endpoint i.e "follow_recommendations"
       * @param {object} options - Additional options
       * @param {object} data - Data to send in the payload
       * @return {Promise} Promise object. Data that was posted if successful, or an error.
       * @example client.personalization.post('follow_recommendations', {foo: 'bar', baz: 'qux'})
       */
      return this.client.post({
        url: "".concat(resource, "/"),
        serviceName: 'personalization',
        qs: options,
        body: data,
        signature: this.client.getPersonalizationToken()
      });
    }
  }, {
    key: "delete",
    value: function _delete(resource) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      /**
       * Delete metadata or activities
       *
       * @method delete
       * @memberof Personalization.prototype
       * @param {object} resource - personalized resource endpoint i.e "follow_recommendations"
       * @param {object} options - Additional options
       * @return {Promise} Promise object. Data that was deleted if successful, or an error.
       * @example client.personalization.delete('follow_recommendations', {foo: 'bar', baz: 'qux'})
       */
      return this.client.delete({
        url: "".concat(resource, "/"),
        serviceName: 'personalization',
        qs: options,
        signature: this.client.getPersonalizationToken()
      });
    }
  }]);

  return Personalization;
}();



/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Collections; });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1);







var CollectionEntry = /*#__PURE__*/function () {
  function CollectionEntry(store, collection, id, data) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, CollectionEntry);

    this.collection = collection;
    this.store = store;
    this.id = id;
    this.data = data;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(CollectionEntry, [{
    key: "ref",
    value: function ref() {
      return "SO:".concat(this.collection, ":").concat(this.id);
    }
  }, {
    key: "get",
    value: function () {
      var _get = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee() {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
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
          }
        }, _callee, this);
      }));

      function get() {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "add",
    value: function () {
      var _add = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee2() {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
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
          }
        }, _callee2, this);
      }));

      function add() {
        return _add.apply(this, arguments);
      }

      return add;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee3() {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
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
          }
        }, _callee3, this);
      }));

      function update() {
        return _update.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee4() {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
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
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, Collections);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(this, "buildURL", function (collection, itemId) {
      var url = "collections/".concat(collection, "/");
      return itemId === undefined ? url : "".concat(url).concat(itemId, "/");
    });

    this.client = client;
    this.token = token;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(Collections, [{
    key: "entry",
    value: function entry(collection, itemId, itemData) {
      return new CollectionEntry(this, collection, itemId, itemData);
    }
  }, {
    key: "get",
    value: function () {
      var _get2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee5(collection, itemId) {
        var response, entry;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.client.get({
                  url: this.buildURL(collection, itemId),
                  signature: this.token
                });

              case 2:
                response = _context5.sent;
                entry = this.client.collections.entry(response.collection, response.id, response.data);
                entry.full = response;
                return _context5.abrupt("return", entry);

              case 6:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function get(_x, _x2) {
        return _get2.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "add",
    value: function () {
      var _add2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee6(collection, itemId, itemData) {
        var response, entry;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.client.post({
                  url: this.buildURL(collection),
                  body: {
                    id: itemId === null ? undefined : itemId,
                    data: itemData
                  },
                  signature: this.token
                });

              case 2:
                response = _context6.sent;
                entry = this.client.collections.entry(response.collection, response.id, response.data);
                entry.full = response;
                return _context6.abrupt("return", entry);

              case 6:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function add(_x3, _x4, _x5) {
        return _add2.apply(this, arguments);
      }

      return add;
    }()
  }, {
    key: "update",
    value: function () {
      var _update2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee7(collection, entryId, data) {
        var response, entry;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.client.put({
                  url: this.buildURL(collection, entryId),
                  body: {
                    data: data
                  },
                  signature: this.token
                });

              case 2:
                response = _context7.sent;
                entry = this.client.collections.entry(response.collection, response.id, response.data);
                entry.full = response;
                return _context7.abrupt("return", entry);

              case 6:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function update(_x6, _x7, _x8) {
        return _update2.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: "delete",
    value: function _delete(collection, entryId) {
      /**
       * Delete entry from collection
       * @method delete
       * @memberof Collections.prototype
       * @param  {object}   entryId  Collection entry id
       * @return {Promise} Promise object
       * @example collection.delete("food", "cheese101")
       */
      return this.client.delete({
        url: this.buildURL(collection, entryId),
        signature: this.token
      });
    }
  }, {
    key: "upsert",
    value: function upsert(collection, data) {
      /**
       * Upsert one or more items within a collection.
       *
       * @method upsert
       * @memberof Collections.prototype
       * @param {object|array} data - A single json object or an array of objects
       * @return {Promise} Promise object.
       */
      if (!this.client.usingApiSecret) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].SiteError('This method can only be used server-side using your API Secret');
      }

      if (!Array.isArray(data)) data = [data];
      return this.client.post({
        url: 'collections/',
        serviceName: 'api',
        body: {
          data: _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()({}, collection, data)
        },
        signature: this.client.getCollectionsToken()
      });
    }
  }, {
    key: "select",
    value: function select(collection, ids) {
      /**
       * Select all objects with ids from the collection.
       *
       * @method select
       * @memberof Collections.prototype
       * @param {object|array} ids - A single json object or an array of objects
       * @return {Promise} Promise object.
       */
      if (!this.client.usingApiSecret) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].SiteError('This method can only be used server-side using your API Secret');
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
        signature: this.client.getCollectionsToken()
      });
    }
  }, {
    key: "deleteMany",
    value: function deleteMany(collection, ids) {
      /**
       * Remove all objects by id from the collection.
       *
       * @method delete
       * @memberof Collections.prototype
       * @param {object|array} ids - A single json object or an array of objects
       * @return {Promise} Promise object.
       */
      if (!this.client.usingApiSecret) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].SiteError('This method can only be used server-side using your API Secret');
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
        signature: this.client.getCollectionsToken()
      });
    }
  }]);

  return Collections;
}();



/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(14);

var assertThisInitialized = __webpack_require__(31);

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var getPrototypeOf = __webpack_require__(25);

var setPrototypeOf = __webpack_require__(30);

var isNativeFunction = __webpack_require__(106);

var construct = __webpack_require__(107);

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  module.exports = _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return construct(Class, arguments, getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

module.exports = _wrapNativeSuper;

/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StreamFeed; });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(20);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7);




function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }




/**
 * Manage api calls for specific feeds
 * The feed object contains convenience functions such add activity, remove activity etc
 * @class StreamFeed
 */

var StreamFeed = /*#__PURE__*/function () {
  function StreamFeed(client, feedSlug, userId, token) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, StreamFeed);

    /**
     * Initialize a feed object
     * @method constructor
     * @memberof StreamFeed.prototype
     * @param {StreamClient} client - The stream client this feed is constructed from
     * @param {string} feedSlug - The feed slug
     * @param {string} userId - The user id
     * @param {string} [token] - The authentication token
     */
    if (!feedSlug || !userId) {
      throw new _errors__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"].FeedError('Please provide a feed slug and user id, ie client.feed("user", "1")');
    }

    if (feedSlug.indexOf(':') !== -1) {
      throw new _errors__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"].FeedError('Please initialize the feed using client.feed("user", "1") not client.feed("user:1")');
    }

    _utils__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].validateFeedSlug(feedSlug);
    _utils__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].validateUserId(userId); // raise an error if there is no token

    if (!token) {
      throw new _errors__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"].FeedError('Missing token, in client side mode please provide a feed secret');
    }

    this.client = client;
    this.slug = feedSlug;
    this.userId = userId;
    this.id = "".concat(this.slug, ":").concat(this.userId);
    this.token = token;
    this.feedUrl = this.id.replace(':', '/');
    this.feedTogether = this.id.replace(':', '');
    this.signature = "".concat(this.feedTogether, " ").concat(this.token); // faye setup

    this.notificationChannel = "site-".concat(this.client.appId, "-feed-").concat(this.feedTogether);
    this.enrichByDefault = false;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(StreamFeed, [{
    key: "addActivity",
    value: function addActivity(activity) {
      /**
       * Adds the given activity to the feed
       * @method addActivity
       * @memberof StreamFeed.prototype
       * @param {object} activity - The activity to add
       * @return {Promise} Promise object
       */
      activity = _utils__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].replaceStreamObjects(activity);

      if (!activity.actor && this.client.currentUser) {
        activity.actor = this.client.currentUser.ref();
      }

      return this.client.post({
        url: "feed/".concat(this.feedUrl, "/"),
        body: activity,
        signature: this.signature
      });
    }
  }, {
    key: "removeActivity",
    value: function removeActivity(activityId) {
      /**
       * Removes the activity by activityId
       * @method removeActivity
       * @memberof StreamFeed.prototype
       * @param  {string}   activityId Identifier of activity to remove
       * @return {Promise} Promise object
       * @example
       * feed.removeActivity(activityId);
       * @example
       * feed.removeActivity({'foreignId': foreignId});
       */
      return this.client.delete({
        url: "feed/".concat(this.feedUrl, "/").concat(activityId.foreignId || activityId, "/"),
        qs: activityId.foreignId ? {
          foreign_id: '1'
        } : {},
        signature: this.signature
      });
    }
  }, {
    key: "addActivities",
    value: function addActivities(activities) {
      /**
       * Adds the given activities to the feed
       * @method addActivities
       * @memberof StreamFeed.prototype
       * @param  {Array}   activities Array of activities to add
       * @return {Promise}               XHR request object
       */
      return this.client.post({
        url: "feed/".concat(this.feedUrl, "/"),
        body: {
          activities: _utils__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].replaceStreamObjects(activities)
        },
        signature: this.signature
      });
    }
  }, {
    key: "follow",
    value: function follow(targetSlug, targetUserId) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      /**
       * Follows the given target feed
       * @method follow
       * @memberof StreamFeed.prototype
       * @param  {string}   targetSlug   Slug of the target feed
       * @param  {string}   targetUserId User identifier of the target feed
       * @param  {object}   options      Additional options
       * @param  {number}   options.activityCopyLimit Limit the amount of activities copied over on follow
       * @return {Promise}  Promise object
       * @example feed.follow('user', '1');
       * @example feed.follow('user', '1');
       * @example feed.follow('user', '1', options);
       */
      if (targetUserId instanceof _user__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"]) {
        targetUserId = targetUserId.id;
      }

      _utils__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].validateFeedSlug(targetSlug);
      _utils__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].validateUserId(targetUserId);
      var body = {
        target: "".concat(targetSlug, ":").concat(targetUserId)
      };
      if (typeof options.limit === 'number') body.activity_copy_limit = options.limit;
      return this.client.post({
        url: "feed/".concat(this.feedUrl, "/following/"),
        body: body,
        signature: this.signature
      });
    }
  }, {
    key: "unfollow",
    value: function unfollow(targetSlug, targetUserId) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      /**
       * Unfollow the given feed
       * @method unfollow
       * @memberof StreamFeed.prototype
       * @param  {string}   targetSlug   Slug of the target feed
       * @param  {string}   targetUserId [description]
       * @param  {object} options
       * @param  {boolean}  options.keepHistory when provided the activities from target
       *                                                 feed will not be kept in the feed
       * @return {object}                XHR request object
       * @example feed.unfollow('user', '2');
       */
      var qs = {};
      if (typeof options.keepHistory === 'boolean' && options.keepHistory) qs.keep_history = '1';
      _utils__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].validateFeedSlug(targetSlug);
      _utils__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].validateUserId(targetUserId);
      var targetFeedId = "".concat(targetSlug, ":").concat(targetUserId);
      return this.client.delete({
        url: "feed/".concat(this.feedUrl, "/following/").concat(targetFeedId, "/"),
        qs: qs,
        signature: this.signature
      });
    }
  }, {
    key: "following",
    value: function following() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      /**
       * List which feeds this feed is following
       * @method following
       * @memberof StreamFeed.prototype
       * @param  {object}   options  Additional options
       * @param  {string}   options.filter Filter to apply on search operation
       * @return {Promise} Promise object
       * @example feed.following({limit:10, filter: ['user:1', 'user:2']});
       */
      if (options.filter) {
        options.filter = options.filter.join(',');
      }

      return this.client.get({
        url: "feed/".concat(this.feedUrl, "/following/"),
        qs: options,
        signature: this.signature
      });
    }
  }, {
    key: "followers",
    value: function followers() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      /**
       * List the followers of this feed
       * @method followers
       * @memberof StreamFeed.prototype
       * @param  {object}   options  Additional options
       * @param  {string}   options.filter Filter to apply on search operation
       * @return {Promise} Promise object
       * @example
       * feed.followers({limit:10, filter: ['user:1', 'user:2']});
       */
      if (options.filter) {
        options.filter = options.filter.join(',');
      }

      return this.client.get({
        url: "feed/".concat(this.feedUrl, "/followers/"),
        qs: options,
        signature: this.signature
      });
    }
  }, {
    key: "get",
    value: function get() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      /**
       * Reads the feed
       * @method get
       * @memberof StreamFeed.prototype
       * @param  {object}   options  Additional options
       * @return {Promise} Promise object
       * @example feed.get({limit: 10, id_lte: 'activity-id'})
       * @example feed.get({limit: 10, mark_seen: true})
       */
      if (options.mark_read && options.mark_read.join) {
        options.mark_read = options.mark_read.join(',');
      }

      if (options.mark_seen && options.mark_seen.join) {
        options.mark_seen = options.mark_seen.join(',');
      }

      this.client.replaceReactionOptions(options);
      var path = this.client.shouldUseEnrichEndpoint(options) ? 'enrich/feed/' : 'feed/';
      return this.client.get({
        url: "".concat(path).concat(this.feedUrl, "/"),
        qs: options,
        signature: this.signature
      });
    }
  }, {
    key: "getActivityDetail",
    value: function getActivityDetail(activityId, options) {
      /**
       * Retrieves one activity from a feed and adds enrichment
       * @method getActivityDetail
       * @memberof StreamFeed.prototype
       * @param  {string}   activityId Identifier of activity to retrieve
       * @param  {object}   options  Additional options
       * @return {Promise} Promise object
       * @example feed.getActivityDetail(activityId)
       * @example feed.getActivityDetail(activityId, {withRecentReactions: true})
       * @example feed.getActivityDetail(activityId, {withReactionCounts: true})
       * @example feed.getActivityDetail(activityId, {withOwnReactions: true, withReactionCounts: true})
       */
      return this.get(_objectSpread({
        id_lte: activityId,
        id_gte: activityId,
        limit: 1
      }, options || {}));
    }
  }, {
    key: "getFayeClient",
    value: function getFayeClient() {
      /**
       * Returns the current faye client object
       * @method getFayeClient
       * @memberof StreamFeed.prototype
       * @access private
       * @return {object} Faye client
       */
      return this.client.getFayeClient();
    }
  }, {
    key: "subscribe",
    value: function subscribe(callback) {
      /**
       * Subscribes to any changes in the feed, return a promise
       * @method subscribe
       * @memberof StreamFeed.prototype
       * @param  {function} callback Callback to call on completion
       * @return {Promise}           Promise object
       * @example
       * feed.subscribe(callback).then(function(){
       * 		console.log('we are now listening to changes');
       * });
       */
      if (!this.client.appId) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"].SiteError('Missing app id, which is needed to subscribe, use var client = stream.connect(key, secret, appId);');
      }

      var subscription = this.getFayeClient().subscribe("/".concat(this.notificationChannel), callback);
      this.client.subscriptions["/".concat(this.notificationChannel)] = {
        token: this.token,
        userId: this.notificationChannel,
        fayeSubscription: subscription
      };
      return subscription;
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe() {
      /**
       * Cancel updates created via feed.subscribe()
       * @return void
       */
      var streamSubscription = this.client.subscriptions["/".concat(this.notificationChannel)];

      if (streamSubscription) {
        delete this.client.subscriptions["/".concat(this.notificationChannel)];
        streamSubscription.fayeSubscription.cancel();
      }
    }
  }, {
    key: "updateActivityToTargets",
    value: function updateActivityToTargets(foreignId, time, newTargets, addedTargets, removedTargets) {
      /**
       * Updates an activity's "to" fields
       * @since 3.10.0
       * @param {string} foreignId The foreign_id of the activity to update
       * @param {string} time The time of the activity to update
       * @param {array} newTargets Set the new "to" targets for the activity - will remove old targets
       * @param {array} added_targets Add these new targets to the activity
       * @param {array} removedTargets Remove these targets from the activity
       */
      if (!foreignId) {
        throw new Error('Missing `foreign_id` parameter!');
      } else if (!time) {
        throw new Error('Missing `time` parameter!');
      }

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

      var body = {
        foreign_id: foreignId,
        time: time
      };
      if (newTargets) body.new_targets = newTargets;
      if (addedTargets) body.added_targets = addedTargets;
      if (removedTargets) body.removed_targets = removedTargets;
      return this.client.post({
        url: "feed_targets/".concat(this.feedUrl, "/activity_to_targets/"),
        signature: this.signature,
        body: body
      });
    }
  }]);

  return StreamFeed;
}();



/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(109);

var iterableToArrayLimit = __webpack_require__(110);

var unsupportedIterableToArray = __webpack_require__(111);

var nonIterableRest = __webpack_require__(113);

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;

/***/ }),
/* 61 */
/***/ (function(module, exports) {

/* eslint-env browser */
module.exports = typeof self == 'object' ? self.FormData : window.FormData;


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StreamFileStore; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);



var StreamFileStore = /*#__PURE__*/function () {
  function StreamFileStore(client, token) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, StreamFileStore);

    this.client = client;
    this.token = token;
  } // React Native does not auto-detect MIME type, you need to pass that via contentType
  // param. If you don't then Android will refuse to perform the upload


  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(StreamFileStore, [{
    key: "upload",
    value: function upload(uri, name, contentType, onUploadProgress) {
      /**
       * upload a File instance or a readable stream of data
       * @param {File|Buffer|string} uri - File object or Buffer or URI
       * @param {string} [name] - file name
       * @param {string} [contentType] - mime-type
       * @param {function} [onUploadProgress] - browser only, Function that is called with upload progress
       * @return {Promise}
       */
      return this.client.upload('files/', uri, name, contentType, onUploadProgress);
    }
  }, {
    key: "delete",
    value: function _delete(uri) {
      return this.client.delete({
        url: "files/",
        qs: {
          url: uri
        },
        signature: this.token
      });
    }
  }]);

  return StreamFileStore;
}();



/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StreamImageStore; });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(64);
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);




var StreamImageStore = /*#__PURE__*/function () {
  function StreamImageStore(client, token) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, StreamImageStore);

    this.client = client;
    this.token = token;
  } // React Native does not auto-detect MIME type, you need to pass that via contentType
  // param. If you don't then Android will refuse to perform the upload


  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(StreamImageStore, [{
    key: "upload",
    value: function upload(uri, name, contentType, onUploadProgress) {
      /**
       * upload an Image File instance or a readable stream of data
       * @param {File|Buffer|string} uri - File object or Buffer or URI
       * @param {string} [name] - file name
       * @param {string} [contentType] - mime-type
       * @param {function} [onUploadProgress] - browser only, Function that is called with upload progress
       * @return {Promise}
       */
      return this.client.upload('images/', uri, name, contentType, onUploadProgress);
    }
  }, {
    key: "delete",
    value: function _delete(uri) {
      return this.client.delete({
        url: "images/",
        qs: {
          url: uri
        },
        signature: this.token
      });
    }
  }, {
    key: "process",
    value: function process(uri, options) {
      var params = _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()(options, {
        url: uri
      });

      if (Array.isArray(params.crop)) {
        params.crop = params.crop.join(',');
      }

      return this.client.get({
        url: "images/",
        qs: params,
        signature: this.token
      });
    }
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
/* 64 */
/***/ (function(module, exports) {

function _extends() {
  module.exports = _extends = Object.assign || function (target) {
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

module.exports = _extends;

/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StreamReaction; });
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1);






var StreamReaction = /*#__PURE__*/function () {
  function StreamReaction(client, token) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, StreamReaction);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "buildURL", function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return "".concat(['reaction'].concat(args).join('/'), "/");
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "_convertTargetFeeds", function () {
      var targetFeeds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return targetFeeds.map(function (elem) {
        return typeof elem === 'string' ? elem : elem.id;
      });
    });

    /**
     * Initialize a reaction object
     * @method constructor
     * @memberof StreamReaction.prototype
     * @param {StreamClient} client Stream client this feed is constructed from
     * @param {string} token JWT token
     * @example new StreamReaction(client, "eyJhbGciOiJIUzI1...")
     */
    this.client = client;
    this.token = token;
    this.signature = token;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(StreamReaction, [{
    key: "all",
    value: function all() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      /**
       * get all reactions
       * @method all
       * @memberof StreamReaction.prototype
       * @param  {object}   options  {limit:}
       * @return {Promise} Promise object
       * @example reactions.all()
       * @example reactions.all({limit:100})
       */
      return this.client.get({
        url: this.buildURL(),
        signature: this.signature,
        qs: options
      });
    }
  }, {
    key: "add",
    value: function add(kind, activity) {
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
          id = _ref.id,
          _ref$targetFeeds = _ref.targetFeeds,
          targetFeeds = _ref$targetFeeds === void 0 ? [] : _ref$targetFeeds,
          userId = _ref.userId,
          targetFeedsExtraData = _ref.targetFeedsExtraData;

      /**
       * add reaction
       * @method add
       * @memberof StreamReaction.prototype
       * @param  {string}   kind  kind of reaction
       * @param  {string}   activity Activity or an ActivityID
       * @param  {object}   data  data related to reaction
       * @param  {array}    targetFeeds  an array of feeds to which to send an activity with the reaction
       * @return {Promise} Promise object
       * @example reactions.add("like", "0c7db91c-67f9-11e8-bcd9-fe00a9219401")
       * @example reactions.add("comment", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"text": "love it!"},)
       */
      var body = {
        id: id,
        activity_id: activity instanceof Object ? activity.id : activity,
        kind: kind,
        data: data,
        target_feeds: this._convertTargetFeeds(targetFeeds),
        user_id: userId
      };

      if (targetFeedsExtraData != null) {
        body.target_feeds_extra_data = targetFeedsExtraData;
      }

      return this.client.post({
        url: this.buildURL(),
        body: body,
        signature: this.signature
      });
    }
  }, {
    key: "addChild",
    value: function addChild(kind, reaction) {
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
          _ref2$targetFeeds = _ref2.targetFeeds,
          targetFeeds = _ref2$targetFeeds === void 0 ? [] : _ref2$targetFeeds,
          userId = _ref2.userId,
          targetFeedsExtraData = _ref2.targetFeedsExtraData;

      /**
       * add reaction
       * @method add
       * @memberof StreamReaction.prototype
       * @param  {string}   kind  kind of reaction
       * @param  {string}   reaction Reaction or a ReactionID
       * @param  {object}   data  data related to reaction
       * @param  {array}    targetFeeds  an array of feeds to which to send an activity with the reaction
       * @return {Promise} Promise object
       * @example reactions.add("like", "0c7db91c-67f9-11e8-bcd9-fe00a9219401")
       * @example reactions.add("comment", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"text": "love it!"},)
       */
      var body = {
        parent: reaction instanceof Object ? reaction.id : reaction,
        kind: kind,
        data: data,
        target_feeds: this._convertTargetFeeds(targetFeeds),
        user_id: userId
      };

      if (targetFeedsExtraData != null) {
        body.target_feeds_extra_data = targetFeedsExtraData;
      }

      return this.client.post({
        url: this.buildURL(),
        body: body,
        signature: this.signature
      });
    }
  }, {
    key: "get",
    value: function get(id) {
      /**
       * get reaction
       * @method add
       * @memberof StreamReaction.prototype
       * @param  {string}   id Reaction Id
       * @return {Promise} Promise object
       * @example reactions.get("67b3e3b5-b201-4697-96ac-482eb14f88ec")
       */
      return this.client.get({
        url: this.buildURL(id),
        signature: this.signature
      });
    }
  }, {
    key: "filter",
    value: function filter(conditions) {
      /**
       * retrieve reactions by activity_id, user_id or reaction_id (to paginate children reactions), pagination can be done using id_lt, id_lte, id_gt and id_gte parameters
       * id_lt and id_lte return reactions order by creation descending starting from the reaction with the ID provided, when id_lte is used
       * the reaction with ID equal to the value provided is included.
       * id_gt and id_gte return reactions order by creation ascending (oldest to newest) starting from the reaction with the ID provided, when id_gte is used
       * the reaction with ID equal to the value provided is included.
       * results are limited to 25 at most and are ordered newest to oldest by default.
       * @method lookup
       * @memberof StreamReaction.prototype
       * @param  {object}   conditions Reaction Id {activity_id|user_id|foreign_id:string, kind:string, next:string, previous:string, limit:integer}
       * @return {Promise} Promise object
       * @example reactions.lookup({activity_id: "0c7db91c-67f9-11e8-bcd9-fe00a9219401", kind:"like"})
       * @example reactions.lookup({user_id: "john", kinds:"like"})
       */
      var userId = conditions.user_id,
          activityId = conditions.activity_id,
          reactionId = conditions.reaction_id,
          qs = _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0___default()(conditions, ["user_id", "activity_id", "reaction_id"]);

      if (!qs.limit) {
        qs.limit = 10;
      }

      if ((userId ? 1 : 0) + (activityId ? 1 : 0) + (reactionId ? 1 : 0) !== 1) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"].SiteError('Must provide exactly one value for one of these params: user_id, activity_id, reaction_id');
      }

      var lookupType = userId && 'user_id' || activityId && 'activity_id' || reactionId && 'reaction_id';
      var value = userId || activityId || reactionId;
      var url = conditions.kind ? this.buildURL(lookupType, value, conditions.kind) : this.buildURL(lookupType, value);
      return this.client.get({
        url: url,
        qs: qs,
        signature: this.signature
      });
    }
  }, {
    key: "update",
    value: function update(id, data) {
      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref3$targetFeeds = _ref3.targetFeeds,
          targetFeeds = _ref3$targetFeeds === void 0 ? [] : _ref3$targetFeeds,
          targetFeedsExtraData = _ref3.targetFeedsExtraData;

      /**
       * update reaction
       * @method add
       * @memberof StreamReaction.prototype
       * @param  {string}   id Reaction Id
       * @param  {object}   data  Data associated to reaction
       * @param  {array}   targetFeeds  Optional feeds to post the activity to. If you sent this before and don't set it here it will be removed.
       * @return {Promise} Promise object
       * @example reactions.update("67b3e3b5-b201-4697-96ac-482eb14f88ec", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", "like")
       * @example reactions.update("67b3e3b5-b201-4697-96ac-482eb14f88ec", "0c7db91c-67f9-11e8-bcd9-fe00a9219401", "comment", {"text": "love it!"},)
       */
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
        signature: this.signature
      });
    }
  }, {
    key: "delete",
    value: function _delete(id) {
      /**
       * delete reaction
       * @method delete
       * @memberof StreamReaction.prototype
       * @param  {string}   id Reaction Id
       * @return {Promise} Promise object
       * @example reactions.delete("67b3e3b5-b201-4697-96ac-482eb14f88ec")
       */
      return this.client.delete({
        url: this.buildURL(id),
        signature: this.signature
      });
    }
  }]);

  return StreamReaction;
}();



/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f) {

  'use strict';

  /* istanbul ignore else */
  if ( true && exports != null &&
      typeof exports.nodeType !== 'number') {
    module.exports = f ();
  } else if ( true && __webpack_require__(114) != null) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (f),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {
    var base64 = f ();
    var global = typeof self !== 'undefined' ? self : $.global;
    if (typeof global.btoa !== 'function') global.btoa = base64.btoa;
    if (typeof global.atob !== 'function') global.atob = base64.atob;
  }

} (function() {

  'use strict';

  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  function InvalidCharacterError(message) {
    this.message = message;
  }
  InvalidCharacterError.prototype = new Error ();
  InvalidCharacterError.prototype.name = 'InvalidCharacterError';

  // encoder
  // [https://gist.github.com/999166] by [https://github.com/nignag]
  function btoa(input) {
    var str = String (input);
    for (
      // initialize result and counter
      var block, charCode, idx = 0, map = chars, output = '';
      // if the next str index does not exist:
      //   change the mapping table to "="
      //   check if d has no fractional digits
      str.charAt (idx | 0) || (map = '=', idx % 1);
      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
      output += map.charAt (63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = str.charCodeAt (idx += 3 / 4);
      if (charCode > 0xFF) {
        throw new InvalidCharacterError ("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }
      block = block << 8 | charCode;
    }
    return output;
  }

  // decoder
  // [https://gist.github.com/1020396] by [https://github.com/atk]
  function atob(input) {
    var str = (String (input)).replace (/[=]+$/, ''); // #31: ExtendScript bad parse of /=
    if (str.length % 4 === 1) {
      throw new InvalidCharacterError ("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = str.charAt (idx++); // eslint-disable-line no-cond-assign
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode (255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf (buffer);
    }
    return output;
  }

  return {btoa: btoa, atob: atob};

}));


/***/ }),
/* 67 */
/***/ (function(module) {

module.exports = JSON.parse("{\"author\":{\"name\":\"Thierry Schellenbach\",\"company\":\"Stream.io Inc\"},\"name\":\"getstream\",\"description\":\"The official low-level GetStream.io client for Node.js and the browser.\",\"main\":\"./lib/getstream.js\",\"module\":\"./lib/getstream.js\",\"types\":\"./types/getstream/index.d.ts\",\"homepage\":\"https://getstream.io/docs/?language=js\",\"email\":\"support@getstream.io\",\"license\":\"BSD-3-Clause\",\"version\":\"5.0.5\",\"scripts\":{\"build\":\"babel src --out-dir lib\",\"dtslint\":\"dtslint types/getstream\",\"eslint\":\"eslint '**/*.js' --max-warnings 0\",\"prettier\":\"prettier --list-different '**/*.{js,ts}'\",\"lint\":\"yarn run prettier && yarn run eslint\",\"lint-fix\":\"prettier --write '**/*.{js,ts}' && eslint --fix '**/*.js'\",\"test\":\"yarn run test-unit-node\",\"test-unit-node\":\"mocha --require @babel/register test/unit/common test/unit/node\",\"test-integration-node\":\"mocha --require @babel/register test/integration/common test/integration/node --exit\",\"test-cloud\":\"mocha --require @babel/register test/integration/cloud --timeout 40000\",\"test-cloud-local\":\"LOCAL=true mocha --require @babel/register test/integration/cloud --timeout 40000 -i --grep 'Files|Images'\",\"test-browser\":\"karma start karma.config.js\",\"generate-docs\":\"jsdoc -c .jsdoc\",\"coverage\":\"nyc yarn run test-unit-node && nyc report --reporter=text-lcov | codecov --pipe\",\"preversion\":\"yarn run test-unit-node\",\"dist\":\"webpack && webpack --minify\",\"version\":\"yarn run dist && yarn run build && git add dist\",\"postversion\":\"git push && git push --tags\"},\"husky\":{\"hooks\":{\"pre-commit\":\"dotgit/hooks/pre-commit-format.sh && dotgit/hooks/pre-commit-reject-binaries.py\"}},\"browser\":{\"crypto\":false,\"jsonwebtoken\":false,\"./lib/lib/batch_operations.js\":false,\"qs\":false,\"url\":false,\"http\":false,\"https\":false},\"react-native\":{\"crypto\":false,\"jsonwebtoken\":false,\"./lib/lib/batch_operations.js\":false,\"qs\":false,\"url\":false},\"devDependencies\":{\"@babel/cli\":\"^7.10.4\",\"@babel/core\":\"^7.10.4\",\"@babel/node\":\"^7.10.4\",\"@babel/plugin-proposal-class-properties\":\"^7.10.4\",\"@babel/plugin-transform-object-assign\":\"^7.10.4\",\"@babel/plugin-transform-runtime\":\"^7.10.4\",\"@babel/preset-env\":\"^7.10.4\",\"@babel/register\":\"^7.10.4\",\"@types/node\":\"^14.0.14\",\"babel-eslint\":\"^10.1.0\",\"babel-loader\":\"^8.1.0\",\"chai\":\"^4.2.0\",\"codecov\":\"^3.7.1\",\"dtslint\":\"^3.6.12\",\"eslint\":\"^7.3.1\",\"eslint-config-airbnb-base\":\"^14.2.0\",\"eslint-config-prettier\":\"^6.11.0\",\"eslint-plugin-chai-friendly\":\"^0.6.0\",\"eslint-plugin-import\":\"^2.22.0\",\"eslint-plugin-prettier\":\"^3.1.4\",\"eslint-plugin-sonarjs\":\"^0.5.0\",\"expect.js\":\"^0.3.1\",\"husky\":\"^4.2.5\",\"jsdoc\":\"^3.6.4\",\"json-loader\":\"~0.5.7\",\"karma\":\"^5.1.0\",\"karma-chrome-launcher\":\"^3.1.0\",\"karma-mocha\":\"^2.0.1\",\"karma-mocha-reporter\":\"~2.2.5\",\"karma-sauce-launcher\":\"^4.1.5\",\"karma-sourcemap-loader\":\"~0.3.7\",\"karma-webpack\":\"^4.0.2\",\"mocha\":\"^8.0.1\",\"null-loader\":\"^4.0.0\",\"nyc\":\"^15.1.0\",\"prettier\":\"^2.0.5\",\"request\":\"^2.88.2\",\"testdouble\":\"^3.16.0\",\"typescript\":\"^3.9.5\",\"uglifyjs-webpack-plugin\":\"^2.2.0\",\"webpack\":\"^4.43.0\",\"webpack-cli\":\"^3.3.12\"},\"dependencies\":{\"@babel/runtime\":\"^7.10.4\",\"Base64\":\"^1.1.0\",\"axios\":\"^0.19.2\",\"faye\":\"^1.3.0\",\"form-data\":\"^3.0.0\",\"jsonwebtoken\":\"^8.5.1\",\"jwt-decode\":\"^2.2.0\",\"qs\":\"^6.9.4\"},\"repository\":{\"type\":\"git\",\"url\":\"git://github.com/GetStream/stream-js.git\"},\"files\":[\"dist\",\"lib\",\"types\"],\"engines\":{\"node\":\"10 || 12 || >=14\"}}");

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(69);


/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "connect", function() { return connect; });
/* harmony import */ var _lib_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Client", function() { return _lib_client__WEBPACK_IMPORTED_MODULE_0__["a"]; });

/* harmony import */ var _lib_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "errors", function() { return _lib_errors__WEBPACK_IMPORTED_MODULE_1__["a"]; });

/* harmony import */ var _lib_signing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "signing", function() { return _lib_signing__WEBPACK_IMPORTED_MODULE_2__["a"]; });

/**
 * @module stream
 * @author Thierry Schellenbach
 * BSD License
 */




function connect(apiKey, apiSecret, appId, options) {
  /**
   * Create StreamClient
   * @method connect
   * @param  {string} apiKey    API key
   * @param  {string} [apiSecret] API secret (only use this on the server)
   * @param  {string} [appId]     Application identifier
   * @param  {object} [options]   Additional options
   * @param  {string} [options.location] Datacenter location
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
  if (typeof process !== 'undefined' && process.env && process.env.STREAM_URL && !apiKey) {
    var parts = /https:\/\/(\w+):(\w+)@([\w-]*).*\?app_id=(\d+)/.exec(process.env.STREAM_URL);
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

  return new _lib_client__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"](apiKey, apiSecret, appId, options);
}


/* deprecated default export */

/* harmony default export */ __webpack_exports__["default"] = ({
  connect: connect,
  errors: _lib_errors__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"],
  signing: _lib_signing__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"],
  Client: _lib_client__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"]
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(22)))

/***/ }),
/* 70 */
/***/ (function(module, exports) {

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

module.exports = _objectWithoutPropertiesLoose;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);
var bind = __webpack_require__(34);
var Axios = __webpack_require__(73);
var mergeConfig = __webpack_require__(40);
var defaults = __webpack_require__(37);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(41);
axios.CancelToken = __webpack_require__(86);
axios.isCancel = __webpack_require__(36);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(87);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);
var buildURL = __webpack_require__(35);
var InterceptorManager = __webpack_require__(74);
var dispatchRequest = __webpack_require__(75);
var mergeConfig = __webpack_require__(40);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);

function InterceptorManager() {
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
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);
var transformData = __webpack_require__(76);
var isCancel = __webpack_require__(36);
var defaults = __webpack_require__(37);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(39);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
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
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(81);
var combineURLs = __webpack_require__(82);

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

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
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

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
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(9);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
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
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
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
    })()
);


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(41);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var asap            = __webpack_require__(43),
    Class           = __webpack_require__(10),
    Promise         = __webpack_require__(23),
    array           = __webpack_require__(26),
    browser         = __webpack_require__(27),
    constants       = __webpack_require__(42),
    assign          = __webpack_require__(8),
    validateOptions = __webpack_require__(90),
    Deferrable      = __webpack_require__(18),
    Logging         = __webpack_require__(16),
    Publisher       = __webpack_require__(28),
    Channel         = __webpack_require__(44),
    Dispatcher      = __webpack_require__(92),
    Error           = __webpack_require__(100),
    Extensible      = __webpack_require__(101),
    Publication     = __webpack_require__(102),
    Subscription    = __webpack_require__(103);

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

    if (browser.Event && global.onbeforeunload !== undefined)
      browser.Event.on(global, 'beforeunload', function() {
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
        global.setTimeout(function() { self.handshake(callback, context) }, this._dispatcher.retry * 1000);
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
    global.setTimeout(function() { self.connect() }, this._advice.interval);
  }
});

assign(Client.prototype, Deferrable);
assign(Client.prototype, Publisher);
assign(Client.prototype, Logging);
assign(Client.prototype, Extensible);

module.exports = Client;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

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
var scope = typeof global !== "undefined" ? global : self;
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var array = __webpack_require__(26);

module.exports = function(options, validKeys) {
  for (var key in options) {
    if (array.indexOf(validKeys, key) < 0)
      throw new Error('Unrecognized option: ' + key);
  }
};


/***/ }),
/* 91 */
/***/ (function(module, exports) {

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
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Class     = __webpack_require__(10),
    URI       = __webpack_require__(12),
    cookies   = __webpack_require__(46),
    assign    = __webpack_require__(8),
    Logging   = __webpack_require__(16),
    Publisher = __webpack_require__(28),
    Transport = __webpack_require__(93),
    Scheduler = __webpack_require__(49);

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

    envelope.timer = global.setTimeout(function() {
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
      global.clearTimeout(envelope.timer);
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

    global.clearTimeout(envelope.timer);
    envelope.request = envelope.timer = null;

    if (immediate) {
      this._sendEnvelope(envelope);
    } else {
      envelope.timer = global.setTimeout(function() {
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Transport = __webpack_require__(13);

Transport.register('websocket', __webpack_require__(95));
Transport.register('eventsource', __webpack_require__(97));
Transport.register('long-polling', __webpack_require__(48));
Transport.register('cross-origin-long-polling', __webpack_require__(98));
Transport.register('callback-polling', __webpack_require__(99));

module.exports = Transport;


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

module.exports = {
  addTimeout: function(name, delay, callback, context) {
    this._timeouts = this._timeouts || {};
    if (this._timeouts.hasOwnProperty(name)) return;
    var self = this;
    this._timeouts[name] = global.setTimeout(function() {
      delete self._timeouts[name];
      callback.call(context);
    }, 1000 * delay);
  },

  removeTimeout: function(name) {
    this._timeouts = this._timeouts || {};
    var timeout = this._timeouts[name];
    if (!timeout) return;
    global.clearTimeout(timeout);
    delete this._timeouts[name];
  },

  removeAllTimeouts: function() {
    this._timeouts = this._timeouts || {};
    for (var name in this._timeouts) this.removeTimeout(name);
  }
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Class      = __webpack_require__(10),
    Promise    = __webpack_require__(23),
    Set        = __webpack_require__(47),
    URI        = __webpack_require__(12),
    browser    = __webpack_require__(27),
    copyObject = __webpack_require__(29),
    assign     = __webpack_require__(8),
    toJSON     = __webpack_require__(17),
    ws         = __webpack_require__(96),
    Deferrable = __webpack_require__(18),
    Transport  = __webpack_require__(13);

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

if (browser.Event && global.onbeforeunload !== undefined) {
  browser.Event.on(global, 'beforeunload', function() {
    if (WebSocket._unloaded === undefined)
      WebSocket._unloaded = true;
  });
}

module.exports = WebSocket;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var WS = global.MozWebSocket || global.WebSocket;

module.exports = {
  create: function(url, protocols, options) {
    if (typeof WS !== 'function') return null;
    return new WS(url);
  }
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Class      = __webpack_require__(10),
    URI        = __webpack_require__(12),
    copyObject = __webpack_require__(29),
    assign     = __webpack_require__(8),
    Deferrable = __webpack_require__(18),
    Transport  = __webpack_require__(13),
    XHR        = __webpack_require__(48);

var EventSource = assign(Class(Transport, {
  initialize: function(dispatcher, endpoint) {
    Transport.prototype.initialize.call(this, dispatcher, endpoint);
    if (!global.EventSource) return this.setDeferredStatus('failed');

    this._xhr = new XHR(dispatcher, endpoint);

    endpoint = copyObject(endpoint);
    endpoint.pathname += '/' + dispatcher.clientId;

    var socket = new global.EventSource(URI.stringify(endpoint)),
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Class     = __webpack_require__(10),
    Set       = __webpack_require__(47),
    URI       = __webpack_require__(12),
    assign    = __webpack_require__(8),
    toJSON    = __webpack_require__(17),
    Transport = __webpack_require__(13);

var CORS = assign(Class(Transport, {
  encode: function(messages) {
    return 'message=' + encodeURIComponent(toJSON(messages));
  },

  request: function(messages) {
    var xhrClass = global.XDomainRequest ? XDomainRequest : XMLHttpRequest,
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

    if (xhrClass === global.XDomainRequest)
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

    if (global.XDomainRequest)
      return callback.call(context, endpoint.protocol === location.protocol);

    if (global.XMLHttpRequest) {
      var xhr = new XMLHttpRequest();
      return callback.call(context, xhr.withCredentials !== undefined);
    }
    return callback.call(context, false);
  }
});

module.exports = CORS;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var Class      = __webpack_require__(10),
    URI        = __webpack_require__(12),
    copyObject = __webpack_require__(29),
    assign     = __webpack_require__(8),
    toJSON     = __webpack_require__(17),
    Transport  = __webpack_require__(13);

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
      if (!global[callbackName]) return false;
      global[callbackName] = undefined;
      try { delete global[callbackName] } catch (error) {}
      script.parentNode.removeChild(script);
    };

    global[callbackName] = function(replies) {
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Class   = __webpack_require__(10),
    Grammar = __webpack_require__(45);

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
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assign  = __webpack_require__(8),
    Logging = __webpack_require__(16);

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
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Class      = __webpack_require__(10),
    Deferrable = __webpack_require__(18);

module.exports = Class(Deferrable);


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Class      = __webpack_require__(10),
    assign     = __webpack_require__(8),
    Deferrable = __webpack_require__(18);

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
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

var atob = __webpack_require__(105);

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
    var code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = '0' + code;
    }
    return '%' + code;
  }));
}

module.exports = function(str) {
  var output = str.replace(/-/g, "+").replace(/_/g, "/");
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
      throw "Illegal base64url string!";
  }

  try{
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
};


/***/ }),
/* 105 */
/***/ (function(module, exports) {

/**
 * The code was extracted from:
 * https://github.com/davidchambers/Base64.js
 */

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function InvalidCharacterError(message) {
  this.message = message;
}

InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

function polyfill (input) {
  var str = String(input).replace(/=+$/, '');
  if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}


module.exports = typeof window !== 'undefined' && window.atob && window.atob.bind(window) || polyfill;


/***/ }),
/* 106 */
/***/ (function(module, exports) {

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

module.exports = _isNativeFunction;

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(30);

var isNativeReflectConstruct = __webpack_require__(108);

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    module.exports = _construct = Reflect.construct;
  } else {
    module.exports = _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

module.exports = _construct;

/***/ }),
/* 108 */
/***/ (function(module, exports) {

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = _isNativeReflectConstruct;

/***/ }),
/* 109 */
/***/ (function(module, exports) {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;

/***/ }),
/* 110 */
/***/ (function(module, exports) {

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(112);

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;

/***/ }),
/* 112 */
/***/ (function(module, exports) {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;

/***/ }),
/* 113 */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;

/***/ }),
/* 114 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ })
/******/ ]);
});