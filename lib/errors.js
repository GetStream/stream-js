"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StreamApiError = exports.SiteError = exports.MissingSchemaError = exports.FeedError = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var canCapture = typeof Error.captureStackTrace === 'function';
var canStack = !!new Error().stack;
/**
 * Abstract error object
 * @class ErrorAbstract
 * @access private
 * @param  {string}      [msg]         Error message
 */

var ErrorAbstract = /*#__PURE__*/function (_Error) {
  (0, _inherits2.default)(ErrorAbstract, _Error);

  var _super = _createSuper(ErrorAbstract);

  function ErrorAbstract(msg) {
    var _this;

    (0, _classCallCheck2.default)(this, ErrorAbstract);
    _this = _super.call(this, msg);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "message", void 0);
    _this.message = msg;

    if (canCapture) {
      Error.captureStackTrace((0, _assertThisInitialized2.default)(_this), ErrorAbstract.constructor);
    } else if (canStack) {
      _this.stack = new Error().stack;
    } else {
      _this.stack = '';
    }

    return _this;
  }

  return (0, _createClass2.default)(ErrorAbstract);
}( /*#__PURE__*/(0, _wrapNativeSuper2.default)(Error));
/**
 * FeedError
 * @class FeedError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param {String} [msg] - An error message that will probably end up in a log.
 */


var FeedError = /*#__PURE__*/function (_ErrorAbstract) {
  (0, _inherits2.default)(FeedError, _ErrorAbstract);

  var _super2 = _createSuper(FeedError);

  function FeedError() {
    (0, _classCallCheck2.default)(this, FeedError);
    return _super2.apply(this, arguments);
  }

  return (0, _createClass2.default)(FeedError);
}(ErrorAbstract);
/**
 * SiteError
 * @class SiteError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param  {string}  [msg]  An error message that will probably end up in a log.
 */


exports.FeedError = FeedError;

var SiteError = /*#__PURE__*/function (_ErrorAbstract2) {
  (0, _inherits2.default)(SiteError, _ErrorAbstract2);

  var _super3 = _createSuper(SiteError);

  function SiteError() {
    (0, _classCallCheck2.default)(this, SiteError);
    return _super3.apply(this, arguments);
  }

  return (0, _createClass2.default)(SiteError);
}(ErrorAbstract);
/**
 * MissingSchemaError
 * @method MissingSchemaError
 * @access private
 * @extends ErrorAbstract
 * @memberof Stream.errors
 * @param  {string} msg
 */


exports.SiteError = SiteError;

var MissingSchemaError = /*#__PURE__*/function (_ErrorAbstract3) {
  (0, _inherits2.default)(MissingSchemaError, _ErrorAbstract3);

  var _super4 = _createSuper(MissingSchemaError);

  function MissingSchemaError() {
    (0, _classCallCheck2.default)(this, MissingSchemaError);
    return _super4.apply(this, arguments);
  }

  return (0, _createClass2.default)(MissingSchemaError);
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


exports.MissingSchemaError = MissingSchemaError;

var StreamApiError = /*#__PURE__*/function (_ErrorAbstract4) {
  (0, _inherits2.default)(StreamApiError, _ErrorAbstract4);

  var _super5 = _createSuper(StreamApiError);

  function StreamApiError(msg, data, response) {
    var _this2;

    (0, _classCallCheck2.default)(this, StreamApiError);
    _this2 = _super5.call(this, msg);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "error", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "response", void 0);
    _this2.error = data;
    _this2.response = response;
    return _this2;
  }

  return (0, _createClass2.default)(StreamApiError);
}(ErrorAbstract);

exports.StreamApiError = StreamApiError;