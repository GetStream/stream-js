import { StreamClient, APIResponse, UnknownRecord } from './client';
import { SiteError } from './errors';

type BaseCollection<CollectionType> = {
  collection: string;
  data: CollectionType;
  id: string;
};

export type CollectionResponse<CollectionType extends UnknownRecord = UnknownRecord> = BaseCollection<
  CollectionType
> & {
  created_at: string;
  foreign_id: string;
  updated_at: string;
};

export type NewCollectionEntry<CollectionType extends UnknownRecord = UnknownRecord> = BaseCollection<
  CollectionType
> & {
  user_id?: string;
};

export type CollectionAPIResponse<CollectionType extends UnknownRecord = UnknownRecord> = APIResponse &
  CollectionResponse<CollectionType>;

export type SelectCollectionAPIResponse<CollectionType extends UnknownRecord = UnknownRecord> = APIResponse & {
  response: {
    data: CollectionResponse<CollectionType>[];
  };
};

export type UpsertCollectionAPIResponse<CollectionType extends UnknownRecord = UnknownRecord> = APIResponse & {
  data: {
    [key: string]: {
      data: CollectionType;
      id: string;
    }[];
  };
};

export class CollectionEntry<CollectionType extends UnknownRecord = UnknownRecord> {
  id: string;
  collection: string;
  store: Collections<CollectionType>; // eslint-disable-line no-use-before-define
  data: CollectionType | null;
  full?: unknown;

  // eslint-disable-next-line no-use-before-define
  constructor(store: Collections<CollectionType>, collection: string, id: string, data: CollectionType) {
    this.collection = collection;
    this.store = store;
    this.id = id;
    this.data = data;
  }

  ref() {
    return `SO:${this.collection}:${this.id}`;
  }

  /**
   * get item from collection and sync data
   * @method get
   * @memberof CollectionEntry.prototype
   * @return {Promise<CollectionEntry<CollectionType>>}
   * @example collection.get("0c7db91c-67f9-11e8-bcd9-fe00a9219401")
   */
  async get() {
    const response = await this.store.get(this.collection, this.id);
    this.data = response.data;
    this.full = response;
    return response;
  }

  /**
   * Add item to collection
   * @method add
   * @memberof CollectionEntry.prototype
   * @return {Promise<CollectionEntry<CollectionType>>}
   * @example collection.add("cheese101", {"name": "cheese burger","toppings": "cheese"})
   */
  async add() {
    const response = await this.store.add(this.collection, this.id, this.data as CollectionType);
    this.data = response.data;
    this.full = response;
    return response;
  }

  /**
   * Update item in the object storage
   * @method update
   * @memberof CollectionEntry.prototype
   * @return {Promise<CollectionEntry<CollectionType>>}
   * @example store.update("0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"name": "cheese burger","toppings": "cheese"})
   * @example store.update("cheese101", {"name": "cheese burger","toppings": "cheese"})
   */
  async update() {
    const response = await this.store.update(this.collection, this.id, this.data as CollectionType);
    this.data = response.data;
    this.full = response;
    return response;
  }

  /**
   * Delete item from collection
   * @method delete
   * @memberof CollectionEntry.prototype
   * @return {Promise<APIResponse>}
   * @example collection.delete("cheese101")
   */
  async delete() {
    const response = await this.store.delete(this.collection, this.id);
    this.data = null;
    this.full = null;
    return response;
  }
}

export class Collections<CollectionType extends UnknownRecord = UnknownRecord> {
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

  /**
   * get item from collection
   * @method get
   * @memberof Collections.prototype
   * @param  {string}   collection  collection name
   * @param  {string}   itemId  id for this entry
   * @return {Promise<CollectionEntry<CollectionType>>}
   * @example collection.get("food", "0c7db91c-67f9-11e8-bcd9-fe00a9219401")
   */
  async get(collection: string, itemId: string) {
    const response = await this.client.get<CollectionAPIResponse<CollectionType>>({
      url: this.buildURL(collection, itemId),
      signature: this.token,
    });

    const entry = this.entry(response.collection, response.id, response.data);
    entry.full = response;
    return entry;
  }

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
  async add(collection: string, itemId: string, itemData: CollectionType) {
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
  async update(collection: string, entryId: string, data: CollectionType) {
    const response = await this.client.put<CollectionAPIResponse<CollectionType>>({
      url: this.buildURL(collection, entryId),
      body: { data },
      signature: this.token,
    });

    const entry = this.entry(response.collection, response.id, response.data);
    entry.full = response;
    return entry;
  }

  /**
   * Delete entry from collection
   * @method delete
   * @memberof Collections.prototype
   * @param  {string}   collection  collection name
   * @param  {string}   entryId  Collection entry id
   * @return {Promise<APIResponse>} Promise object
   * @example collection.delete("food", "cheese101")
   */
  delete(collection: string, entryId: string) {
    return this.client.delete({
      url: this.buildURL(collection, entryId),
      signature: this.token,
    });
  }

  /**
   * Upsert one or more items within a collection.
   *
   * @method upsert
   * @memberof Collections.prototype
   * @param  {string}   collection  collection name
   * @param {NewCollectionEntry<CollectionType> | NewCollectionEntry<CollectionType>[]} data - A single json object or an array of objects
   * @return {Promise<UpsertCollectionAPIResponse<CollectionType>>}
   */
  upsert(collection: string, data: NewCollectionEntry<CollectionType> | NewCollectionEntry<CollectionType>[]) {
    if (!this.client.usingApiSecret) {
      throw new SiteError('This method can only be used server-side using your API Secret');
    }

    if (!Array.isArray(data)) data = [data];

    return this.client.post<UpsertCollectionAPIResponse<CollectionType>>({
      url: 'collections/',
      serviceName: 'api',
      body: { data: { [collection]: data } },
      signature: this.client.getCollectionsToken(),
    });
  }

  /**
   * Select all objects with ids from the collection.
   *
   * @method select
   * @memberof Collections.prototype
   * @param {string} collection  collection name
   * @param {string | string[]} ids - A single object id or an array of ids
   * @return {Promise<SelectCollectionAPIResponse<CollectionType>>}
   */
  select(collection: string, ids: string | string[]) {
    if (!this.client.usingApiSecret) {
      throw new SiteError('This method can only be used server-side using your API Secret');
    }

    if (!Array.isArray(ids)) ids = [ids];

    return this.client.get<SelectCollectionAPIResponse<CollectionType>>({
      url: 'collections/',
      serviceName: 'api',
      qs: { foreign_ids: ids.map((id) => `${collection}:${id}`).join(',') },
      signature: this.client.getCollectionsToken(),
    });
  }

  /**
   * Remove all objects by id from the collection.
   *
   * @method delete
   * @memberof Collections.prototype
   * @param {string} collection  collection name
   * @param {string | string[]} ids - A single object id or an array of ids
   * @return {Promise<APIResponse>}
   */
  deleteMany(collection: string, ids: string | string[]) {
    if (!this.client.usingApiSecret) {
      throw new SiteError('This method can only be used server-side using your API Secret');
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
