import { StreamClient, APIResponse, UR } from './client';
import { SiteError } from './errors';

type BaseCollection<CollectionType> = {
  collection: string;
  data: CollectionType;
  id: string;
};

export type CollectionResponse<CollectionType extends UR = UR> = BaseCollection<CollectionType> & {
  created_at: string;
  foreign_id: string;
  updated_at: string;
};

export type NewCollectionEntry<CollectionType extends UR = UR> = BaseCollection<CollectionType> & {
  user_id?: string;
};

export type CollectionAPIResponse<CollectionType extends UR = UR> = APIResponse & CollectionResponse<CollectionType>;

export type SelectCollectionAPIResponse<CollectionType extends UR = UR> = APIResponse & {
  response: {
    data: CollectionResponse<CollectionType>[];
  };
};

export type UpsertCollectionAPIResponse<CollectionType extends UR = UR> = APIResponse & {
  data: {
    [key: string]: {
      data: CollectionType;
      id: string;
    }[];
  };
};

export class CollectionEntry<
  UserType extends UR = UR,
  ActivityType extends UR = UR,
  CollectionType extends UR = UR,
  ReactionType extends UR = UR,
  ChildReactionType extends UR = UR,
  PersonalizationType extends UR = UR
> {
  id: string;
  collection: string;
  store: Collections<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType, PersonalizationType>; // eslint-disable-line no-use-before-define
  data: CollectionType | null;
  full?: unknown;

  constructor(
    // eslint-disable-next-line no-use-before-define
    store: Collections<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType, PersonalizationType>,
    collection: string,
    id: string,
    data: CollectionType,
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
   * @link https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=js#adding-collections
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
   * @link https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=js#updating-collections
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

export class Collections<
  UserType extends UR = UR,
  ActivityType extends UR = UR,
  CollectionType extends UR = UR,
  ReactionType extends UR = UR,
  ChildReactionType extends UR = UR,
  PersonalizationType extends UR = UR
> {
  client: StreamClient<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType, PersonalizationType>;
  token: string;

  /**
   * Initialize a feed object
   * @method constructor
   * @memberof Collections.prototype
   * @param {StreamCloudClient} client Stream client this collection is constructed from
   * @param {string} token JWT token
   */
  constructor(
    client: StreamClient<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType, PersonalizationType>,
    token: string,
  ) {
    this.client = client;
    this.token = token;
  }

  buildURL = (collection: string, itemId?: string) => {
    const url = `collections/${collection}/`;
    return itemId === undefined ? url : `${url}${itemId}/`;
  };

  entry(collection: string, itemId: string, itemData: CollectionType) {
    return new CollectionEntry<
      UserType,
      ActivityType,
      CollectionType,
      ReactionType,
      ChildReactionType,
      PersonalizationType
    >(this, collection, itemId, itemData);
  }

  /**
   * get item from collection
   * @link https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=js#retrieving-collections
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
   * @return {Promise<CollectionEntry<CollectionType>>}
   * @example collection.add("food", "cheese101", {"name": "cheese burger","toppings": "cheese"})
   */
  async add(collection: string, itemId: string | null, itemData: CollectionType) {
    const response = await this.client.post<CollectionAPIResponse<CollectionType>>({
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
   * @return {Promise<CollectionEntry<CollectionType>>}
   * @example store.update("0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"name": "cheese burger","toppings": "cheese"})
   * @example store.update("food", "cheese101", {"name": "cheese burger","toppings": "cheese"})
   */
  async update(collection: string, entryId: string, data: CollectionType) {
    const response = await this.client.put<CollectionAPIResponse<CollectionType>>({
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
