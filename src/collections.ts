import StreamClient, { APIResponse } from './client';
import errors from './errors';

type BaseCollection<CollectionType> = {
  collection: string;
  id: string;
  data: CollectionType;
};

export type CollectionResponse<CollectionType> = BaseCollection<CollectionType> & {
  foregin_id: string;
  created_at: Date;
  updated_at: Date;
};

type NewCollectionEntry<CollectionType> = BaseCollection<CollectionType> & {
  user_id?: string;
};

type CollectionAPIResponse<CollectionType> = APIResponse & CollectionResponse<CollectionType>;

type SelectCollectionAPIResponse<CollectionType> = APIResponse & {
  response: {
    data: CollectionResponse<CollectionType>[];
  };
};

type UpsertCollectionAPIResponse<CollectionType> = APIResponse & {
  data: {
    [key: string]: {
      id: string;
      data: CollectionType;
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

  ref(): string {
    return `SO:${this.collection}:${this.id}`;
  }

  async get(): Promise<CollectionEntry<CollectionType>> {
    /**
     * get item from collection and sync data
     * @method get
     * @memberof CollectionEntry.prototype
     * @return {Promise} Promise object
     * @example collection.get("0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     */
    const response = await this.store.get(this.collection, this.id);
    this.data = response.data;
    this.full = response;
    return response;
  }

  async add(): Promise<CollectionEntry<CollectionType>> {
    /**
     * Add item to collection
     * @method add
     * @memberof CollectionEntry.prototype
     * @return {Promise} Promise object
     * @example collection.add("cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    const response = await this.store.add(this.collection, this.id, this.data as CollectionType);
    this.data = response.data;
    this.full = response;
    return response;
  }

  async update(): Promise<CollectionEntry<CollectionType>> {
    /**
     * Update item in the object storage
     * @method update
     * @memberof CollectionEntry.prototype
     * @return {Promise} Promise object
     * @example store.update("0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"name": "cheese burger","toppings": "cheese"})
     * @example store.update("cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    const response = await this.store.update(this.collection, this.id, this.data as CollectionType);
    this.data = response.data;
    this.full = response;
    return response;
  }

  async delete(): Promise<APIResponse> {
    /**
     * Delete item from collection
     * @method delete
     * @memberof CollectionEntry.prototype
     * @return {Promise} Promise object
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

  buildURL = (collection: string, itemId?: string): string => {
    const url = `collections/${collection}/`;
    return itemId === undefined ? url : `${url}${itemId}/`;
  };

  entry(collection: string, itemId: string, itemData: CollectionType): CollectionEntry<CollectionType> {
    return new CollectionEntry<CollectionType>(this, collection, itemId, itemData);
  }

  async get(collection: string, itemId: string): Promise<CollectionEntry<CollectionType>> {
    /**
     * get item from collection
     * @method get
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param  {object}   itemId  id for this entry
     * @return {Promise} Promise object
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

  async add(collection: string, itemId: string, itemData: CollectionType): Promise<CollectionEntry<CollectionType>> {
    /**
     * Add item to collection
     * @method add
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param  {string}   itemId  entry id
     * @param  {object}   itemData  ObjectStore data
     * @return {Promise} Promise object
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

  async update(collection: string, entryId: string, data: CollectionType): Promise<CollectionEntry<CollectionType>> {
    /**
     * Update entry in the collection
     * @method update
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param  {object}   entryId  Collection object id
     * @param  {object}   data  ObjectStore data
     * @return {Promise} Promise object
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

  delete(collection: string, entryId: string): Promise<APIResponse> {
    /**
     * Delete entry from collection
     * @method delete
     * @memberof Collections.prototype
     * @param  {object}   entryId  Collection entry id
     * @return {Promise} Promise object
     * @example collection.delete("food", "cheese101")
     */
    return this.client.delete<APIResponse>({
      url: this.buildURL(collection, entryId),
      signature: this.token,
    });
  }

  upsert(
    collection: string,
    data: NewCollectionEntry<CollectionType> | NewCollectionEntry<CollectionType>[],
  ): Promise<UpsertCollectionAPIResponse<CollectionType>> {
    /**
     * Upsert one or more items within a collection.
     *
     * @method upsert
     * @memberof Collections.prototype
     * @param {object|array} data - A single json object or an array of objects
     * @return {Promise} Promise object.
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

  select(collection: string, ids: string | string[]): Promise<SelectCollectionAPIResponse<CollectionType>> {
    /**
     * Select all objects with ids from the collection.
     *
     * @method select
     * @memberof Collections.prototype
     * @param {object|array} ids - A single json object or an array of objects
     * @return {Promise} Promise object.
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

  deleteMany(collection: string, ids: string | string[]): Promise<APIResponse> {
    /**
     * Remove all objects by id from the collection.
     *
     * @method delete
     * @memberof Collections.prototype
     * @param {object|array} ids - A single json object or an array of objects
     * @return {Promise} Promise object.
     */
    if (!this.client.usingApiSecret) {
      throw new errors.SiteError('This method can only be used server-side using your API Secret');
    }

    if (!Array.isArray(ids)) ids = [ids];

    const params = {
      collection_name: collection,
      ids: ids.map((id) => id.toString()).join(','),
    };

    return this.client.delete<APIResponse>({
      url: 'collections/',
      serviceName: 'api',
      qs: params,
      signature: this.client.getCollectionsToken(),
    });
  }
}
