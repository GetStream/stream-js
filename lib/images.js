"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StreamImageStore = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var StreamImageStore = /*#__PURE__*/function () {
  function StreamImageStore(client, token) {
    (0, _classCallCheck2.default)(this, StreamImageStore);
    (0, _defineProperty2.default)(this, "client", void 0);
    (0, _defineProperty2.default)(this, "token", void 0);
    this.client = client;
    this.token = token;
  } // React Native does not auto-detect MIME type, you need to pass that via contentType
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


  (0, _createClass2.default)(StreamImageStore, [{
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
      var params = (0, _extends2.default)(options, {
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

exports.StreamImageStore = StreamImageStore;