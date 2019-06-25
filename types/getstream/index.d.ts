// TypeScript Version: 2.4

export as namespace stream;

/**
 * Create StreamClient
 */
export function connect(
  apiKey: string,
  apiSecret: string | null,
  appId: string,
  options?: object,
): stream.Client;

export class CollectionEntry {
  constructor(store: Collections, collection: string, id: string, data: object);

  // Get the entry from the Collection
  get(): Promise<object>;
  get(
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;

  // Add the entry to the Collection
  add(): Promise<object>;
  add(
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;

  // Update the entry in the object storage
  update(): Promise<object>;
  update(
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;

  // Delete the entry from the collection
  delete(): Promise<object>;
  delete(
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;
}

export class Collections {
  /** Construct Collections. */
  constructor(client: StreamClient, token: string);

  // Build the URL for a collection or collection item
  buildURL(collection: string, itemId?: string): string;

  // Instantiate a collection entry object
  entry(
    collection: string,
    itemId?: string,
    itemData?: object,
  ): CollectionEntry;

  // Get a collection entry
  get(collection: string, itemId: string): Promise<object>;
  get(
    collection: string,
    itemId: string,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;

  // Add a single entry to a collection
  add(collection: string, itemId: string, itemData?: object): Promise<object>;
  add(
    collection: string,
    itemId: string,
    itemData?: object,
    callback?: (err: object, httpResponse: object, body: object) => void,
  ): void;

  // Update a single collection entry
  update(collection: string, entryId: string, data?: object): Promise<object>;
  update(
    collection: string,
    entryId: string,
    data?: object,
    callback?: (err: object, httpResponse: object, body: object) => void,
  ): void;

  // Delete a single collection entry
  delete(collection: string, entryId: string): Promise<object>;
  delete(
    collection: string,
    entryId: string,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;

  // Upsert one or more items within a collection.
  upsert(
    collectionName: string,
    data: object | object[],
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;
  upsert(collectionName: string, data: object | object[]): Promise<object>;

  // Select all objects with ids from the collection.
  select(
    collectionName: string,
    ids: object | object[],
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;
  select(collectionName: string, ids: object | object[]): Promise<object>;

  // Remove all objects by id from the collection.
  deleteMany(
    collectionName: string,
    ids: object | object[],
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;
  deleteMany(collectionName: string, ids: object | object[]): Promise<object>;
}

export class Personalization {
  /** Construct Personalization. */
  constructor(client: StreamClient);

  // Get personalized activities for this feed.
  get(
    resource: string,
    options: object,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;
  get(
    resource: string,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;
  get(resource: string, options?: object): Promise<object>;

  // Post data to personalization endpoint.
  post(
    resource: string,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;
  post(
    resource: string,
    options: object,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;
  post(
    resource: string,
    options: object,
    data: object,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;
  post(resource: string, options?: object, data?: object): Promise<object>;

  // Delete metadata or activites
  delete(
    resource: string,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;
  delete(
    resource: string,
    options: object,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;
  delete(resource: string, options?: object): Promise<object>;
}

export class Feed {
  /** Construct Feed. */
  constructor(
    client: StreamClient,
    feedSlug: string,
    userId: string,
    token: string,
  );

  // Add activity
  addActivity(activity: object): Promise<object>;
  addActivity(
    activity: object,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;

  // Remove activity
  removeActivity(activityId: string | object): Promise<object>;
  removeActivity(
    activityId: string | object,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;

  // Add activities
  addActivities(activities: object[]): Promise<object>;
  addActivities(
    activities: object[],
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;

  // Follow feed
  follow(
    targetSlug: string,
    targetUserId: string,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;
  follow(
    targetSlug: string,
    targetUserId: string,
    options: object,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;
  follow(
    targetSlug: string,
    targetUserId: string,
    options?: object,
  ): Promise<object>;

  // Unfollow feed
  unfollow(
    targetSlug: string,
    targetUserId: string,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;
  unfollow(
    targetSlug: string,
    targetUserId: string,
    options: object,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;
  unfollow(
    targetSlug: string,
    targetUserId: string,
    options?: object,
  ): Promise<object>;

  // List followed feeds
  following(options: object): Promise<object>;
  following(
    options: object,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;

  // List followers
  followers(options: object): Promise<object>;
  followers(
    options: object,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;

  // Get feed
  get(options?: object): Promise<object>;
  get(
    options: object,
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;

  // Subscribe to realtime
  /** Subscribe to Faye realtime source. */
  subscribe(callback: (data: object) => void): Promise<object>;

  // Get tokens
  getReadOnlyToken(): string;
  getReadWriteToken(): string;
}

export class StreamClient {
  /** Construct StreamClient */
  constructor(
    apiKey: string,
    apiSecret?: string,
    appId?: string,
    options?: object,
  );

  // Event subscriptions
  on(event: string, callback: (args: any[]) => void): void;
  off(key: string): void;

  // Get user agent
  userAgent(): string;

  // Get feed tokens
  getReadOnlyToken(feedSlug: string, userId: string): string;
  getReadWriteToken(feedSlug: string, userId: string): string;

  // Create feed
  feed(
    feedSlug: string,
    userId: string,
    token?: string,
    siteId?: string,
    options?: object,
  ): Feed;

  // Update activities
  updateActivities(
    activities: object[],
    callback: (args: object[]) => void,
  ): void;

  // Add activity to many feeds
  /**
   * addToMany.
   * Available in node environments with batchOperations enabled.
   */
  addToMany(activity: object, feeds: string[]): Promise<object>;
  /**
   * addToMany.
   * Available in node environments with batchOperations enabled.
   */
  addToMany(
    activity: object,
    feeds: string[],
    callback: (err: object, httpResponse: object, body: object) => void,
  ): void;

  // Collections sub-component
  collections: Collections;
  personalization: Personalization;

  // Follow many feeds
  /**
   * followMany.
   * Available in node environments with batchOperations enabled
   */
  followMany(follows: object[], activityCopyLimit?: number): Promise<object>;
  /**
   * followMany.
   * Available in node environments with batchOperations enabled
   */
  followMany(
    follows: object[],
    activityCopyLimit?: number,
    callback?: (err: object, httpResponse: object, body: object) => void,
  ): void;

  // Unfollow many feeds
  /**
   * unfollowMany.
   * Available in node environments with batchOperations enabled
   */
  unfollowMany(unfollows: object[]): Promise<object>;
  /**
   * unfollowMany.
   * Available in node environments with batchOperations enabled
   */
  unfollowMany(
    unfollows: object[],
    callback?: (err: object, httpResponse: object, body: object) => void,
  ): void;
}

// Export the Stream Client
export { StreamClient as Client };

// Export the Stream errors
export namespace errors {
  class MissingSchemaError {
    /**
     * Construct MissingSchemaError.
     * Not typically instantiated by app developers.
     */
  }

  class FeedError {
    /**
     * Construct FeedError.
     * Not typically instantiated by app developers.
     */
  }
  class SiteError {
    /**
     * Construct SiteError.
     * Not typically instantiated by app developers.
     */
  }
}
