import { StreamClient, APIResponse, DefaultGenerics } from './client';
import { SiteError } from './errors';

type BaseCollection<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = {
  collection: string;
  data: StreamFeedGenerics['collectionType'];
  id: string;
};

export type CollectionItem<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> =
  StreamFeedGenerics['collectionType'] & {
    id: string;
    user_id?: string;
  };

export type CollectionResponse<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> =
  BaseCollection<StreamFeedGenerics> & {
    created_at: string;
    foreign_id: string;
    updated_at: string;
  };

export type NewCollectionEntry<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> =
  BaseCollection<StreamFeedGenerics> & {
    user_id?: string;
  };

export type CollectionAPIResponse<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = APIResponse &
  CollectionResponse<StreamFeedGenerics>;

export type SelectCollectionAPIResponse<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = APIResponse & {
  response: {
    data: CollectionResponse<StreamFeedGenerics>[];
  };
};

export type UpsertCollectionAPIResponse<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = APIResponse & {
  data: {
    [key: string]: CollectionItem<StreamFeedGenerics>[];
  };
};

export type UpsertManyCollectionRequest<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = {
  [collection: string]: CollectionItem<StreamFeedGenerics>[];
};

export class CollectionEntry<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> {
  id: string;
  collection: string;
  store: Collections<StreamFeedGenerics>; // eslint-disable-line no-use-before-define
  data: StreamFeedGenerics['collectionType'] | null;
  full?: unknown;

  constructor(
    // eslint-disable-next-line no-use-before-define
    store: Collections<StreamFeedGenerics>,
    collection: string,
    id: string,
    data: StreamFeedGenerics['collectionType'],
  ) {
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
   * @return {Promise<CollectionEntry<StreamFeedGenerics>>}
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
   * @link https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=js#adding-collections
   * @method add
   * @memberof CollectionEntry.prototype
   * @return {Promise<CollectionEntry<StreamFeedGenerics>>}
   * @example collection.add("cheese101", {"name": "cheese burger","toppings": "cheese"})
   */
  async add() {
    const response = await this.store.add(this.collection, this.id, this.data as StreamFeedGenerics['collectionType']);
    this.data = response.data;
    this.full = response;
    return response;
  }

  /**
   * Update item in the object storage
   * @link https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=js#updating-collections
   * @method update
   * @memberof CollectionEntry.prototype
   * @return {Promise<CollectionEntry<StreamFeedGenerics>>}
   * @example store.update("0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"name": "cheese burger","toppings": "cheese"})
   * @example store.update("cheese101", {"name": "cheese burger","toppings": "cheese"})
   */
  async update() {
    const response = await this.store.update(
      this.collection,
      this.id,
      this.data as StreamFeedGenerics['collectionType'],
    );
    this.data = response.data;
    this.full = response;
    return response;
  }

  /**
   * Delete item from collection
   * @link https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=js#removing-collections
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

export class Collections<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> {
  client: StreamClient<StreamFeedGenerics>;
  token: string;

  /**
   * Initialize a feed object
   * @method constructor
   * @memberof Collections.prototype
   * @param {StreamCloudClient} client Stream client this collection is constructed from
   * @param {string} token JWT token
   */
  constructor(client: StreamClient<StreamFeedGenerics>, token: string) {
    this.client = client;
    this.token = token;
  }

  buildURL = (collection: string, itemId?: string) => {
    const url = `collections/${collection}/`;
    return itemId === undefined ? url : `${url}${itemId}/`;
  };

  entry(collection: string, itemId: string, itemData: StreamFeedGenerics['collectionType']) {
    return new CollectionEntry<StreamFeedGenerics>(this, collection, itemId, itemData);
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
  async get(collection: string, itemId: string) {
    const response = await this.client.get<CollectionAPIResponse<StreamFeedGenerics>>({
      url: this.buildURL(collection, itemId),
      token: this.token,
    });

    const entry = this.entry(response.collection, response.id, response.data);
    entry.full = response;
    return entry;
  }

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
  async add(collection: string, itemId: string | null, itemData: StreamFeedGenerics['collectionType']) {
    const response = await this.client.post<CollectionAPIResponse<StreamFeedGenerics>>({
      url: this.buildURL(collection),
      body: {
        id: itemId === null ? undefined : itemId,
        data: itemData,
      },
      token: this.token,
    });

    const entry = this.entry(response.collection, response.id, response.data);
    entry.full = response;
    return entry;
  }

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
  async update(collection: string, entryId: string, data: StreamFeedGenerics['collectionType']) {
    const response = await this.client.put<CollectionAPIResponse<StreamFeedGenerics>>({
      url: this.buildURL(collection, entryId),
      body: { data },
      token: this.token,
    });

    const entry = this.entry(response.collection, response.id, response.data);
    entry.full = response;
    return entry;
  }

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
  delete(collection: string, entryId: string) {
    return this.client.delete({
      url: this.buildURL(collection, entryId),
      token: this.token,
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
  upsert(collection: string, data: CollectionItem<StreamFeedGenerics> | CollectionItem<StreamFeedGenerics>[]) {
    if (!this.client.usingApiSecret) {
      throw new SiteError('This method can only be used server-side using your API Secret');
    }

    if (!Array.isArray(data)) data = [data];

    return this.client.post<UpsertCollectionAPIResponse<StreamFeedGenerics>>({
      url: 'collections/',
      serviceName: 'api',
      body: { data: { [collection]: data } },
      token: this.client.getCollectionsToken(),
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
  upsertMany(items: UpsertManyCollectionRequest) {
    if (!this.client.usingApiSecret) {
      throw new SiteError('This method can only be used server-side using your API Secret');
    }

    return this.client.post<UpsertCollectionAPIResponse<StreamFeedGenerics>>({
      url: 'collections/',
      serviceName: 'api',
      body: { data: items },
      token: this.client.getCollectionsToken(),
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
  select(collection: string, ids: string | string[]) {
    if (!this.client.usingApiSecret) {
      throw new SiteError('This method can only be used server-side using your API Secret');
    }

    if (!Array.isArray(ids)) ids = [ids];

    return this.client.get<SelectCollectionAPIResponse<StreamFeedGenerics>>({
      url: 'collections/',
      serviceName: 'api',
      qs: { foreign_ids: ids.map((id) => `${collection}:${id}`).join(',') },
      token: this.client.getCollectionsToken(),
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
      token: this.client.getCollectionsToken(),
    });
  }
}
