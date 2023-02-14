import { StreamClient, APIResponse, DefaultGenerics } from './client';
declare type BaseCollection<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = {
    collection: string;
    data: StreamFeedGenerics['collectionType'];
    id: string;
};
export declare type CollectionItem<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = StreamFeedGenerics['collectionType'] & {
    id: string;
    user_id?: string;
};
export declare type CollectionResponse<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = BaseCollection<StreamFeedGenerics> & {
    created_at: string;
    foreign_id: string;
    updated_at: string;
};
export declare type NewCollectionEntry<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = BaseCollection<StreamFeedGenerics> & {
    user_id?: string;
};
export declare type CollectionAPIResponse<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = APIResponse & CollectionResponse<StreamFeedGenerics>;
export declare type SelectCollectionAPIResponse<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = APIResponse & {
    response: {
        data: CollectionResponse<StreamFeedGenerics>[];
    };
};
export declare type UpsertCollectionAPIResponse<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = APIResponse & {
    data: {
        [key: string]: CollectionItem<StreamFeedGenerics>[];
    };
};
export declare type UpsertManyCollectionRequest<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = {
    [collection: string]: CollectionItem<StreamFeedGenerics>[];
};
export declare class CollectionEntry<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> {
    id: string;
    collection: string;
    store: Collections<StreamFeedGenerics>;
    data: StreamFeedGenerics['collectionType'] | null;
    full?: unknown;
    constructor(store: Collections<StreamFeedGenerics>, collection: string, id: string, data: StreamFeedGenerics['collectionType']);
    ref(): string;
    /**
     * get item from collection and sync data
     * @method get
     * @memberof CollectionEntry.prototype
     * @return {Promise<CollectionEntry<StreamFeedGenerics>>}
     * @example collection.get("0c7db91c-67f9-11e8-bcd9-fe00a9219401")
     */
    get(): Promise<CollectionEntry<StreamFeedGenerics>>;
    /**
     * Add item to collection
     * @link https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=js#adding-collections
     * @method add
     * @memberof CollectionEntry.prototype
     * @return {Promise<CollectionEntry<StreamFeedGenerics>>}
     * @example collection.add("cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    add(): Promise<CollectionEntry<StreamFeedGenerics>>;
    /**
     * Update item in the object storage
     * @link https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=js#updating-collections
     * @method update
     * @memberof CollectionEntry.prototype
     * @return {Promise<CollectionEntry<StreamFeedGenerics>>}
     * @example store.update("0c7db91c-67f9-11e8-bcd9-fe00a9219401", {"name": "cheese burger","toppings": "cheese"})
     * @example store.update("cheese101", {"name": "cheese burger","toppings": "cheese"})
     */
    update(): Promise<CollectionEntry<StreamFeedGenerics>>;
    /**
     * Delete item from collection
     * @link https://getstream.io/activity-feeds/docs/node/collections_introduction/?language=js#removing-collections
     * @method delete
     * @memberof CollectionEntry.prototype
     * @return {Promise<APIResponse>}
     * @example collection.delete("cheese101")
     */
    delete(): Promise<APIResponse>;
}
export declare class Collections<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> {
    client: StreamClient<StreamFeedGenerics>;
    token: string;
    /**
     * Initialize a feed object
     * @method constructor
     * @memberof Collections.prototype
     * @param {StreamCloudClient} client Stream client this collection is constructed from
     * @param {string} token JWT token
     */
    constructor(client: StreamClient<StreamFeedGenerics>, token: string);
    buildURL: (collection: string, itemId?: string | undefined) => string;
    entry(collection: string, itemId: string, itemData: StreamFeedGenerics['collectionType']): CollectionEntry<StreamFeedGenerics>;
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
    get(collection: string, itemId: string): Promise<CollectionEntry<StreamFeedGenerics>>;
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
    add(collection: string, itemId: string | null, itemData: StreamFeedGenerics['collectionType']): Promise<CollectionEntry<StreamFeedGenerics>>;
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
    update(collection: string, entryId: string, data: StreamFeedGenerics['collectionType']): Promise<CollectionEntry<StreamFeedGenerics>>;
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
    delete(collection: string, entryId: string): Promise<APIResponse>;
    /**
     * Upsert one or more items within a collection.
     * @link https://getstream.io/activity-feeds/docs/node/collections_batch/?language=js#upsert
     * @method upsert
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param {NewCollectionEntry<StreamFeedGenerics> | NewCollectionEntry<StreamFeedGenerics>[]} data - A single json object or an array of objects
     * @return {Promise<UpsertCollectionAPIResponse<StreamFeedGenerics>>}
     */
    upsert(collection: string, data: CollectionItem<StreamFeedGenerics> | CollectionItem<StreamFeedGenerics>[]): Promise<UpsertCollectionAPIResponse<StreamFeedGenerics>>;
    /**
     * UpsertMany one or more items into many collections.
     * @link https://getstream.io/activity-feeds/docs/node/collections_batch/?language=js#upsert
     * @method upsert
     * @memberof Collections.prototype
     * @param  {string}   collection  collection name
     * @param {UpsertManyCollectionRequest} items - A single json object that contains information of many collections
     * @return {Promise<UpsertCollectionAPIResponse<StreamFeedGenerics>>}
     */
    upsertMany(items: UpsertManyCollectionRequest): Promise<UpsertCollectionAPIResponse<StreamFeedGenerics>>;
    /**
     * Select all objects with ids from the collection.
     * @link https://getstream.io/activity-feeds/docs/node/collections_batch/?language=js#select
     * @method select
     * @memberof Collections.prototype
     * @param {string} collection  collection name
     * @param {string | string[]} ids - A single object id or an array of ids
     * @return {Promise<SelectCollectionAPIResponse<StreamFeedGenerics>>}
     */
    select(collection: string, ids: string | string[]): Promise<SelectCollectionAPIResponse<StreamFeedGenerics>>;
    /**
     * Remove all objects by id from the collection.
     * @link https://getstream.io/activity-feeds/docs/node/collections_batch/?language=js#delete_many
     * @method delete
     * @memberof Collections.prototype
     * @param {string} collection  collection name
     * @param {string | string[]} ids - A single object id or an array of ids
     * @return {Promise<APIResponse>}
     */
    deleteMany(collection: string, ids: string | string[]): Promise<APIResponse>;
}
export {};
//# sourceMappingURL=collections.d.ts.map