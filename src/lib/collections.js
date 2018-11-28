var errors = require('./errors');

var Collections = function() {
  this.initialize.apply(this, arguments);
};

Collections.prototype = {
  initialize: function(client, token) {
    /**
     * Initialize a feed object
     * @method intialize
     * @memberof Collections.prototype
     * @param {StreamCloudClient} client Stream client this collection is constructed from
     * @param {string} token JWT token
     */
    this.client = client;
    this.token = token;
  },

  buildURL: function(collection, itemId) {
    var url = 'collections/' + collection + '/';
    if (itemId === undefined) {
      return url;
    }
    return url + itemId + '/';
  },

  entry: function(collection, itemId, itemData) {
    return new CollectionEntry(this, collection, itemId, itemData);
  },

  get: function(collection, itemId, callback) {
    /**
     * get item from collection
     * @method get
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param  {object}   itemId  id for this entry
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.get("food", "0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     */
    var self = this;
    return this.client
      .get({
        url: this.buildURL(collection, itemId),
        signature: this.token,
      })
      .then((response) => {
        let entry = self.client.collections.entry(
          response.collection,
          response.id,
          response.data,
        );
        entry.full = response;
        if (callback) {
          callback(entry);
        }
        return entry;
      });
  },

  add: function(collection, itemId, itemData, callback) {
    /**
     * Add item to collection
     * @method add
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param  {string}   itemId  entry id
     * @param  {object}   itemData  ObjectStore data
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.add("food", "cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    var self = this;

    if (itemId === null) {
      itemId = undefined;
    }
    var body = {
      id: itemId,
      data: itemData,
    };
    return this.client
      .post({
        url: this.buildURL(collection),
        body: body,
        signature: this.token,
      })
      .then((response) => {
        let entry = self.client.collections.entry(
          response.collection,
          response.id,
          response.data,
        );
        entry.full = response;
        if (callback) {
          callback(entry);
        }
        return entry;
      });
  },

  update: function(collection, entryId, data, callback) {
    /**
     * Update entry in the collection
     * @method update
     * @memberof Collections.prototype
     * @param  {object}   entryId  Collection object id
     * @param  {object}   data  ObjectStore data
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example store.update("0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"name": "cheese burger","toppings": "cheese"})
     * @example store.update("food", "cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    var self = this;
    var body = {
      data,
    };
    return this.client
      .put({
        url: this.buildURL(collection, entryId),
        body: body,
        signature: this.token,
      })
      .then((response) => {
        let entry = self.client.collections.entry(
          response.collection,
          response.id,
          response.data,
        );
        entry.full = response;
        if (callback) {
          callback(entry);
        }
        return entry;
      });
  },

  delete: function(collection, entryId, callback) {
    /**
     * Delete entry from collection
     * @method delete
     * @memberof Collections.prototype
     * @param  {object}   entryId  Collection entry id
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.delete("food", "cheese101")
     */
    return this.client['delete'](
      {
        url: this.buildURL(collection, entryId),
        signature: this.token,
      },
      callback,
    );
  },

  upsert: function(collection, data, callback) {
    /**
     * Upsert one or more items within a collection.
     *
     * @method upsert
     * @memberof Collections.prototype
     * @param {object or array} data - A single json object or an array of objects
     * @param {requestCallback} callback - Callback to call on completion
     * @return {Promise} Promise object.
     */

    if (!this.client.usingApiSecret) {
      throw new errors.FeedError(
        'This method can only be used server-side using your API Secret',
      );
    }

    var last = arguments[arguments.length - 1];
    // callback is always the last argument
    callback = last.call ? last : undefined;

    if (!Array.isArray(data)) {
      data = [data];
    }
    var data_json = { data: {} };
    data_json['data'][collection] = data;

    return this.client.post(
      {
        url: 'collections/',
        serviceName: 'api',
        body: data_json,
        signature: this.client.getCollectionsToken(),
      },
      callback,
    );
  },

  select: function(collection, ids, callback) {
    /**
     * Select all objects with ids from the collection.
     *
     * @method select
     * @memberof Collections.prototype
     * @param {object or array} ids - A single json object or an array of objects
     * @param {requestCallback} callback - Callback to call on completion
     * @return {Promise} Promise object.
     */

    if (!this.client.usingApiSecret) {
      throw new errors.FeedError(
        'This method can only be used server-side using your API Secret',
      );
    }

    var last = arguments[arguments.length - 1];
    // callback is always the last argument
    callback = last.call ? last : undefined;

    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    var params = {
      foreign_ids: ids
        .map((id) => {
          return collection + ':' + id;
        })
        .join(','),
    };

    return this.client.get(
      {
        url: 'collections/',
        serviceName: 'api',
        qs: params,
        signature: this.client.getCollectionsToken(),
      },
      callback,
    );
  },

  deleteMany: function(collection, ids, callback) {
    /**
     * Remove all objects by id from the collection.
     *
     * @method delete
     * @memberof Collections.prototype
     * @param {object or array} ids - A single json object or an array of objects
     * @param {requestCallback} callback - Callback to call on completion
     * @return {Promise} Promise object.
     */

    if (!this.client.usingApiSecret) {
      throw new errors.FeedError(
        'This method can only be used server-side using your API Secret',
      );
    }

    var last = arguments[arguments.length - 1];
    // callback is always the last argument
    callback = last.call ? last : undefined;

    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    ids = ids
      .map(function(id) {
        return id.toString();
      })
      .join(',');

    var params = {
      collection_name: collection,
      ids: ids,
    };

    return this.client.delete(
      {
        url: 'collections/',
        serviceName: 'api',
        qs: params,
        signature: this.client.getCollectionsToken(),
      },
      callback,
    );
  },
};

var CollectionEntry = function() {
  this.initialize.apply(this, arguments);
};

CollectionEntry.prototype = {
  initialize: function(store, collection, id, data) {
    this.collection = collection;
    this.store = store;
    this.id = id;
    this.data = data;
  },

  _streamRef: function() {
    return `SO:${this.collection}:${this.id}`;
  },

  get: function(callback) {
    /**
     * get item from collection and sync data
     * @method get
     * @memberof CollectionEntry.prototype
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.get("0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     */
    return this.store.get(this.collection, this.id).then((response) => {
      this.data = response.data;
      this.full = response;
      if (callback) {
        callback(response);
      }
      return response;
    });
  },

  add: function(callback) {
    /**
     * Add item to collection
     * @method add
     * @memberof CollectionEntry.prototype
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.add("cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    return this.store
      .add(this.collection, this.id, this.data)
      .then((response) => {
        this.data = response.data;
        this.full = response;
        if (callback) {
          callback(response);
        }
        return response;
      });
  },

  update: function(callback) {
    /**
     * Update item in the object storage
     * @method update
     * @memberof CollectionEntry.prototype
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example store.update("0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"name": "cheese burger","toppings": "cheese"})
     * @example store.update("cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    return this.store
      .update(this.collection, this.id, this.data)
      .then((response) => {
        this.data = response.data;
        this.full = response;
        if (callback) {
          callback(response);
        }
        return response;
      });
  },

  delete: function(callback) {
    /**
     * Delete item from collection
     * @method delete
     * @memberof CollectionEntry.prototype
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.delete("cheese101")
     */
    return this.store.delete(this.collection, this.id).then((response) => {
      this.data = null;
      this.full = null;
      if (callback) {
        callback(response);
      }
      return response;
    });
  },
};

module.exports = Collections;
