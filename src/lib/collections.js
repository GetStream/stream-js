import errors from './errors';

class CollectionEntry {
  constructor(store, collection, id, data) {
    this.collection = collection;
    this.store = store;
    this.id = id;
    this.data = data;
  }

  _streamRef() {
    return `SO:${this.collection}:${this.id}`;
  }

  get(callback) {
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
  }

  add(callback) {
    /**
     * Add item to collection
     * @method add
     * @memberof CollectionEntry.prototype
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.add("cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    return this.store.add(this.collection, this.id, this.data).then((response) => {
      this.data = response.data;
      this.full = response;
      if (callback) {
        callback(response);
      }
      return response;
    });
  }

  update(callback) {
    /**
     * Update item in the object storage
     * @method update
     * @memberof CollectionEntry.prototype
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example store.update("0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"name": "cheese burger","toppings": "cheese"})
     * @example store.update("cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    return this.store.update(this.collection, this.id, this.data).then((response) => {
      this.data = response.data;
      this.full = response;
      if (callback) {
        callback(response);
      }
      return response;
    });
  }

  delete(callback) {
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
  }
}

export default class Collections {
  /**
   * Initialize a feed object
   * @method constructor
   * @memberof Collections.prototype
   * @param {StreamCloudClient} client Stream client this collection is constructed from
   * @param {string} token JWT token
   */
  constructor(client, token) {
    this.client = client;
    this.token = token;
  }

  buildURL = (collection, itemId) => {
    const url = `collections/${collection}/`;
    return itemId === undefined ? url : `${url + itemId}/`;
  };

  entry(collection, itemId, itemData) {
    return new CollectionEntry(this, collection, itemId, itemData);
  }

  get(collection, itemId, callback) {
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

    return this.client
      .get({
        url: this.buildURL(collection, itemId),
        signature: this.token,
      })
      .then((response) => {
        const entry = this.client.collections.entry(response.collection, response.id, response.data);
        entry.full = response;
        if (callback) {
          callback(entry);
        }
        return entry;
      });
  }

  add(collection, itemId, itemData, callback) {
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

    const body = {
      id: itemId === null ? undefined : itemId,
      data: itemData,
    };
    return this.client
      .post({
        url: this.buildURL(collection),
        body,
        signature: this.token,
      })
      .then((response) => {
        const entry = this.client.collections.entry(response.collection, response.id, response.data);
        entry.full = response;
        if (callback) {
          callback(entry);
        }
        return entry;
      });
  }

  update(collection, entryId, data, callback) {
    /**
     * Update entry in the collection
     * @method update
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param  {object}   entryId  Collection object id
     * @param  {object}   data  ObjectStore data
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example store.update("0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"name": "cheese burger","toppings": "cheese"})
     * @example store.update("food", "cheese101", {"name": "cheese burger","toppings": "cheese"})
     */

    return this.client
      .put({
        url: this.buildURL(collection, entryId),
        body: { data },
        signature: this.token,
      })
      .then((response) => {
        const entry = this.client.collections.entry(response.collection, response.id, response.data);
        entry.full = response;
        if (callback) {
          callback(entry);
        }
        return entry;
      });
  }

  delete(collection, entryId, callback) {
    /**
     * Delete entry from collection
     * @method delete
     * @memberof Collections.prototype
     * @param  {object}   entryId  Collection entry id
     * @param  {requestCallback} callback Callback to call on completion
     * @return {Promise} Promise object
     * @example collection.delete("food", "cheese101")
     */
    return this.client.delete(
      {
        url: this.buildURL(collection, entryId),
        signature: this.token,
      },
      callback,
    );
  }

  upsert(collection, data, callback) {
    /**
     * Upsert one or more items within a collection.
     *
     * @method upsert
     * @memberof Collections.prototype
     * @param {object|array} data - A single json object or an array of objects
     * @param {requestCallback} callback - Callback to call on completion
     * @return {Promise} Promise object.
     */

    if (!this.client.usingApiSecret) {
      throw new errors.SiteError('This method can only be used server-side using your API Secret');
    }

    if (!Array.isArray(data)) {
      data = [data];
    }

    const body = { data: { [collection]: data } };

    return this.client.post(
      {
        url: 'collections/',
        serviceName: 'api',
        body,
        signature: this.client.getCollectionsToken(),
      },
      callback instanceof Function ? callback : undefined,
    );
  }

  select(collection, ids, callback) {
    /**
     * Select all objects with ids from the collection.
     *
     * @method select
     * @memberof Collections.prototype
     * @param {object|array} ids - A single json object or an array of objects
     * @param {requestCallback} callback - Callback to call on completion
     * @return {Promise} Promise object.
     */

    if (!this.client.usingApiSecret) {
      throw new errors.SiteError('This method can only be used server-side using your API Secret');
    }

    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    const params = {
      foreign_ids: ids.map((id) => `${collection}:${id}`).join(','),
    };

    return this.client.get(
      {
        url: 'collections/',
        serviceName: 'api',
        qs: params,
        signature: this.client.getCollectionsToken(),
      },
      callback instanceof Function ? callback : undefined,
    );
  }

  deleteMany(collection, ids, callback) {
    /**
     * Remove all objects by id from the collection.
     *
     * @method delete
     * @memberof Collections.prototype
     * @param {object|array} ids - A single json object or an array of objects
     * @param {requestCallback} callback - Callback to call on completion
     * @return {Promise} Promise object.
     */

    if (!this.client.usingApiSecret) {
      throw new errors.SiteError('This method can only be used server-side using your API Secret');
    }

    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    const params = {
      collection_name: collection,
      ids: ids.map((id) => id.toString()).join(','),
    };

    return this.client.delete(
      {
        url: 'collections/',
        serviceName: 'api',
        qs: params,
        signature: this.client.getCollectionsToken(),
      },
      callback instanceof Function ? callback : undefined,
    );
  }
}
