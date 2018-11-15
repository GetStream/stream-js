var FrontendCollection = function() {
  this.initialize.apply(this, arguments);
};

FrontendCollection.prototype = {
  initialize: function(client, name, token) {
    /**
     * Initialize a feed object
     * @method intialize
     * @memberof FrontendCollection.prototype
     * @param {StreamCloudClient} client Stream client this collection is constructed from
     * @param {string} name ObjectStore name
     * @param {string} token JWT token
     * @example new FrontendCollection(client, "food", "eyJhbGciOiJIUzI1...")
     */
    this.client = client;
    this.collection = name;
    this.token = token;
  },

  buildURL: function(itemId) {
    var url = 'object_store/' + this.collection + '/';
    if (itemId === undefined) {
      return url;
    }
    return url + itemId + '/';
  },

  entry: function(itemId, itemData) {
    return new CollectionEntry(this, itemId, itemData);
  },

  object: function(itemId, itemData) {
    return new CollectionEntry(this, itemId, itemData);
  },

  items: function(options, callback) {
    /**
     * get all items from collection
     * @method items
     * @memberof FrontendCollection.prototype
     * @param  {object}   options  {limit:}
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.get()
     * @example collection.get({limit:100})
     */
    return this.client.get(
      {
        url: this.buildURL(),
        signature: this.token,
      },
      callback,
    );
  },

  get: function(itemId, callback) {
    /**
     * get item from collection
     * @method get
     * @memberof FrontendCollection.prototype
     * @param  {object}   itemId  ObjectStore object id
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.get("0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     */
    return this.client.get(
      {
        url: this.buildURL(itemId),
        signature: this.token,
      },
      callback,
    );
  },

  add: function(itemId, itemData, callback) {
    /**
     * Add item to collection
     * @method add
     * @memberof FrontendCollection.prototype
     * @param  {string}   itemId  ObjectStore id
     * @param  {object}   itemData  ObjectStore data
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.add("cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    if (itemId === null) {
      itemId = undefined;
    }
    var body = {
      id: itemId,
      data: itemData,
    };
    return this.client.post(
      {
        url: this.buildURL(),
        body: body,
        signature: this.token,
      },
      callback,
    );
  },

  update: function(itemId, objectData, callback) {
    /**
     * Update item in the object collection
     * @method update
     * @memberof FrontendCollection.prototype
     * @param  {object}   itemId  ObjectStore object id
     * @param  {object}   objectData  ObjectStore data
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example store.update("0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"name": "cheese burger","toppings": "cheese"})
     * @example store.update("cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    var body = {
      data: objectData,
    };
    return this.client.put(
      {
        url: this.buildURL(itemId),
        body: body,
        signature: this.token,
      },
      callback,
    );
  },

  delete: function(itemId, callback) {
    /**
     * Delete item from collection
     * @method delete
     * @memberof FrontendCollection.prototype
     * @param  {object}   itemId  ObjectStore object id
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.delete("cheese101")
     */
    return this.client['delete'](
      {
        url: this.buildURL(itemId),
        signature: this.token,
      },
      callback,
    );
  },
};

var CollectionEntry = function() {
  this.initialize.apply(this, arguments);
};

CollectionEntry.prototype = {
  initialize: function(store, id, data) {
    this.collection = store.collection;
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
    return this.store.get(this.id).then((response) => {
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
    return this.store.add(this.id, this.data).then((response) => {
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
    return this.store.update(this.id, this.data).then((response) => {
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
    return this.store.delete(this.id).then((response) => {
      this.data = null;
      this.full = null;
      if (callback) {
        callback(response);
      }
      return response;
    });
  },
};

module.exports = FrontendCollection;
