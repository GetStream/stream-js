"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Collections = exports.CollectionEntry = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _errors = require("./errors");

var CollectionEntry = /*#__PURE__*/function () {
  // eslint-disable-line no-use-before-define
  function CollectionEntry( // eslint-disable-next-line no-use-before-define
  store, collection, id, data) {
    (0, _classCallCheck2.default)(this, CollectionEntry);
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "collection", void 0);
    (0, _defineProperty2.default)(this, "store", void 0);
    (0, _defineProperty2.default)(this, "data", void 0);
    (0, _defineProperty2.default)(this, "full", void 0);
    this.collection = collection;
    this.store = store;
    this.id = id;
    this.data = data;
  }

  (0, _createClass2.default)(CollectionEntry, [{
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
      var _get = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var response;
        return _regenerator.default.wrap(function _callee$(_context) {
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
      var _add = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var response;
        return _regenerator.default.wrap(function _callee2$(_context2) {
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
      var _update = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var response;
        return _regenerator.default.wrap(function _callee3$(_context3) {
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
      var _delete2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var response;
        return _regenerator.default.wrap(function _callee4$(_context4) {
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

exports.CollectionEntry = CollectionEntry;

var Collections = /*#__PURE__*/function () {
  /**
   * Initialize a feed object
   * @method constructor
   * @memberof Collections.prototype
   * @param {StreamCloudClient} client Stream client this collection is constructed from
   * @param {string} token JWT token
   */
  function Collections(client, token) {
    (0, _classCallCheck2.default)(this, Collections);
    (0, _defineProperty2.default)(this, "client", void 0);
    (0, _defineProperty2.default)(this, "token", void 0);
    (0, _defineProperty2.default)(this, "buildURL", function (collection, itemId) {
      var url = "collections/".concat(collection, "/");
      return itemId === undefined ? url : "".concat(url).concat(itemId, "/");
    });
    this.client = client;
    this.token = token;
  }

  (0, _createClass2.default)(Collections, [{
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
      var _get2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(collection, itemId) {
        var response, entry;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
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
      var _add2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(collection, itemId, itemData) {
        var response, entry;
        return _regenerator.default.wrap(function _callee6$(_context6) {
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
      var _update2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7(collection, entryId, data) {
        var response, entry;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
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
        throw new _errors.SiteError('This method can only be used server-side using your API Secret');
      }

      if (!Array.isArray(data)) data = [data];
      return this.client.post({
        url: 'collections/',
        serviceName: 'api',
        body: {
          data: (0, _defineProperty2.default)({}, collection, data)
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
        throw new _errors.SiteError('This method can only be used server-side using your API Secret');
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
        throw new _errors.SiteError('This method can only be used server-side using your API Secret');
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
        throw new _errors.SiteError('This method can only be used server-side using your API Secret');
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

exports.Collections = Collections;