import StreamClient, { APIResponse } from './client';
import * as errors from './errors';

type BaseCollection<CollectionType> = {
  collection: string;
  data: CollectionType;
  id: string;
};

export type CollectionResponse<CollectionType> = BaseCollection<CollectionType> & {
  created_at: Date;
  foregin_id: string;
  updated_at: Date;
};

export type NewCollectionEntry<CollectionType> = BaseCollection<CollectionType> & {
  user_id?: string;
};

export type CollectionAPIResponse<CollectionType> = APIResponse & CollectionResponse<CollectionType>;

export type SelectCollectionAPIResponse<CollectionType> = APIResponse & {
  response: {
    data: CollectionResponse<CollectionType>[];
  };
};

export type UpsertCollectionAPIResponse<CollectionType> = APIResponse & {
  data: {
    [key: string]: {
      data: CollectionType;
      id: string;
    }[];
  };
};

class CollectionEntry<CollectionType> {
  id: string;
  collection: string;
  store: Collections<CollectionType>;
  data: CollectionType | null;
  full?: unknown;

  constructor(store: Collections<CollectionType>, collection: string, id: string, data: CollectionType) {
    this.collection = collection;
    this.store = store;
    this.id = id;
    this.data = data;
  }

  ref() {
    return `SO:${this.collection}:${this.id}`;
  }

  async get() {
    /**
     * get item from collection and sync data
     * @method get
     * @memberof CollectionEntry.prototype
     * @return {Promise<CollectionEntry<CollectionType>>}
     * @example collection.get("0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     */
    const response = await this.store.get(this.collection, this.id);
    this.data = response.data;
    this.full = response;
    return response;
  }

  async add() {
    /**
     * Add item to collection
     * @method add
     * @memberof CollectionEntry.prototype
     * @return {Promise<CollectionEntry<CollectionType>>}
     * @example collection.add("cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    const response = await this.store.add(this.collection, this.id, this.data as CollectionType);
    this.data = response.data;
    this.full = response;
    return response;
  }

  async update() {
    /**
     * Update item in the object storage
     * @method update
     * @memberof CollectionEntry.prototype
     * @return {Promise<CollectionEntry<CollectionType>>}
     * @example store.update("0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"name": "cheese burger","toppings": "cheese"})
     * @example store.update("cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    const response = await this.store.update(this.collection, this.id, this.data as CollectionType);
    this.data = response.data;
    this.full = response;
    return response;
  }

  async delete() {
    /**
     * Delete item from collection
     * @method delete
     * @memberof CollectionEntry.prototype
     * @return {Promise<APIResponse>}
     * @example collection.delete("cheese101")
     */
    const response = await this.store.delete(this.collection, this.id);
    this.data = null;
    this.full = null;
    return response;
  }
}

export default class Collections<CollectionType> {
  client: StreamClient;
  token: string;

  /**
   * Initialize a feed object
   * @method constructor
   * @memberof Collections.prototype
   * @param {StreamCloudClient} client Stream client this collection is constructed from
   * @param {string} token JWT token
   */
  constructor(client: StreamClient, token: string) {
    this.client = client;
    this.token = token;
  }

  buildURL = (collection: string, itemId?: string) => {
    const url = `collections/${collection}/`;
    return itemId === undefined ? url : `${url}${itemId}/`;
  };

  entry(collection: string, itemId: string, itemData: CollectionType) {
    return new CollectionEntry<CollectionType>(this, collection, itemId, itemData);
  }

  async get(collection: string, itemId: string) {
    /**
     * get item from collection
     * @method get
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param  {string}   itemId  id for this entry
     * @return {Promise<CollectionEntry<CollectionType>>}
     * @example collection.get("food", "0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     */
    const response = await this.client.get<CollectionAPIResponse<CollectionType>>({
      url: this.buildURL(collection, itemId),
      signature: this.token,
    });

    const entry = this.entry(response.collection, response.id, response.data);
    entry.full = response;
    return entry;
  }

  async add(collection: string, itemId: string, itemData: CollectionType) {
    /**
     * Add item to collection
     * @method add
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param  {string}   itemId  entry id
     * @param  {CollectionType}   itemData  ObjectStore data
     * @return {Promise<CollectionEntry<CollectionType>>}
     * @example collection.add("food", "cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    const response = await this.client.post<CollectionAPIResponse<CollectionType>>({
      url: this.buildURL(collection),
      body: {
        id: itemId === null ? undefined : itemId,
        data: itemData,
      },
      signature: this.token,
    });

    const entry = this.entry(response.collection, response.id, response.data);
    entry.full = response;
    return entry;
  }

  async update(collection: string, entryId: string, data: CollectionType) {
    /**
     * Update entry in the collection
     * @method update
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param  {string}   entryId  Collection object id
     * @param  {CollectionType}   data  ObjectStore data
     * @return {Promise<CollectionEntry<CollectionType>>}
     * @example store.update("0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"name": "cheese burger","toppings": "cheese"})
     * @example store.update("food", "cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    const response = await this.client.put<CollectionAPIResponse<CollectionType>>({
      url: this.buildURL(collection, entryId),
      body: { data },
      signature: this.token,
    });

    const entry = this.entry(response.collection, response.id, response.data);
    entry.full = response;
    return entry;
  }

  delete(collection: string, entryId: string) {
    /**
     * Delete entry from collection
     * @method delete
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param  {string}   entryId  Collection entry id
     * @return {Promise<APIResponse>} Promise object
     * @example collection.delete("food", "cheese101")
     */
    return this.client.delete({
      url: this.buildURL(collection, entryId),
      signature: this.token,
    });
  }

  upsert(collection: string, data: NewCollectionEntry<CollectionType> | NewCollectionEntry<CollectionType>[]) {
    /**
     * Upsert one or more items within a collection.
     *
     * @method upsert
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param {NewCollectionEntry<CollectionType> | NewCollectionEntry<CollectionType>[]} data - A single json object or an array of objects
     * @return {Promise<UpsertCollectionAPIResponse<CollectionType>>}
     */
    if (!this.client.usingApiSecret) {
      throw new errors.SiteError('This method can only be used server-side using your API Secret');
    }

    if (!Array.isArray(data)) data = [data];

    return this.client.post<UpsertCollectionAPIResponse<CollectionType>>({
      url: 'collections/',
      serviceName: 'api',
      body: { data: { [collection]: data } },
      signature: this.client.getCollectionsToken(),
    });
  }

  select(collection: string, ids: string | string[]) {
    /**
     * Select all objects with ids from the collection.
     *
     * @method select
     * @memberof Collections.prototype
     * @param {string} collection  collection name
     * @param {string | string[]} ids - A single object id or an array of ids
     * @return {Promise<SelectCollectionAPIResponse<CollectionType>>}
     */
    if (!this.client.usingApiSecret) {
      throw new errors.SiteError('This method can only be used server-side using your API Secret');
    }

    if (!Array.isArray(ids)) ids = [ids];

    return this.client.get<SelectCollectionAPIResponse<CollectionType>>({
      url: 'collections/',
      serviceName: 'api',
      qs: { foreign_ids: ids.map((id) => `${collection}:${id}`).join(',') },
      signature: this.client.getCollectionsToken(),
    });
  }

  deleteMany(collection: string, ids: string | string[]) {
    /**
     * Remove all objects by id from the collection.
     *
     * @method delete
     * @memberof Collections.prototype
     * @param {string} collection  collection name
     * @param {string | string[]} ids - A single object id or an array of ids
     * @return {Promise<APIResponse>}
     */
    if (!this.client.usingApiSecret) {
      throw new errors.SiteError('This method can only be used server-side using your API Secret');
    }

    if (!Array.isArray(ids)) ids = [ids];

    const params = {
      collection_name: collection,
      ids: ids.map((id) => id.toString()).join(','),
    };

    return this.client.delete({
      url: 'collections/',
      serviceName: 'api',
      qs: params,
      signature: this.client.getCollectionsToken(),
    });
  }
}
