"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StreamUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

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
    (0, _classCallCheck2.default)(this, StreamUser);
    (0, _defineProperty2.default)(this, "client", void 0);
    (0, _defineProperty2.default)(this, "token", void 0);
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "data", void 0);
    (0, _defineProperty2.default)(this, "full", void 0);
    (0, _defineProperty2.default)(this, "url", void 0);
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


  (0, _createClass2.default)(StreamUser, [{
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
      var _get = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(options) {
        var response;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
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
      var _create = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(data, options) {
        var response;
        return _regenerator.default.wrap(function _callee2$(_context2) {
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
      var _update = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(data) {
        var response;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
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

exports.StreamUser = StreamUser;