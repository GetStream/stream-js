// TypeScript Version: 3.2
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
  get(callback: RestCallback): void;

  // Add the entry to the Collection
  add(): Promise<object>;
  add(callback: RestCallback): void;

  // Update the entry in the object storage
  update(): Promise<object>;
  update(callback: RestCallback): void;

  // Delete the entry from the collection
  delete(): Promise<object>;
  delete(callback: RestCallback): void;
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
    callback: GenericCallback<CollectionEntry>,
  ): void;

  // Add a single entry to a collection
  add(collection: string, itemId: string, itemData?: object): Promise<object>;
  add(
    collection: string,
    itemId: string,
    itemData?: object,
    callback?: GenericCallback<CollectionEntry>,
  ): void;

  // Update a single collection entry
  update(collection: string, entryId: string, data?: object): Promise<object>;
  update(
    collection: string,
    entryId: string,
    data?: object,
    callback?: GenericCallback<CollectionEntry>,
  ): void;

  // Delete a single collection entry
  delete(collection: string, entryId: string): Promise<object>;
  delete(collection: string, entryId: string, callback: RestCallback): void;

  // Upsert one or more items within a collection.
  upsert(
    collectionName: string,
    data: object | object[],
    callback: RestCallback,
  ): void;
  upsert(collectionName: string, data: object | object[]): Promise<object>;

  // Select all objects with ids from the collection.
  select(
    collectionName: string,
    ids: object | object[],
    callback: RestCallback,
  ): void;
  select(collectionName: string, ids: object | object[]): Promise<object>;

  // Remove all objects by id from the collection.
  deleteMany(
    collectionName: string,
    ids: object | object[],
    callback: RestCallback,
  ): void;
  deleteMany(collectionName: string, ids: object | object[]): Promise<object>;
}

export class Personalization {
  /** Construct Personalization. */
  constructor(client: StreamClient);

  // Get personalized activities for this feed.
  get(resource: string, options: object, callback: RestCallback): void;
  get(resource: string, callback: RestCallback): void;
  get(resource: string, options?: object): Promise<object>;

  // Post data to personalization endpoint.
  post(resource: string, callback: RestCallback): void;
  post(resource: string, options: object, callback: RestCallback): void;
  post(
    resource: string,
    options: object,
    data: object,
    callback: RestCallback,
  ): void;
  post(resource: string, options?: object, data?: object): Promise<object>;

  // Delete metadata or activites
  delete(resource: string, callback: RestCallback): void;
  delete(resource: string, options: object, callback: RestCallback): void;
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
  addActivity(activity: Activity): Promise<object>;
  addActivity(activity: Activity, callback: RestCallback): void;

  // Remove activity
  removeActivity(activityId: string | Activity): Promise<object>;
  removeActivity(activityId: string | Activity, callback: RestCallback): void;

  // Add activities
  addActivities(activities: Activity[]): Promise<object>;
  addActivities(activities: Activity[], callback: RestCallback): void;

  // Follow feed
  follow(
    targetSlug: string,
    targetUserId: string,
    callback: RestCallback,
  ): void;
  follow(
    targetSlug: string,
    targetUserId: string,
    options: object,
    callback: RestCallback,
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
    callback: RestCallback,
  ): void;
  unfollow(
    targetSlug: string,
    targetUserId: string,
    options: object,
    callback: RestCallback,
  ): void;
  unfollow(
    targetSlug: string,
    targetUserId: string,
    options?: object,
  ): Promise<object>;

  // List followed feeds
  following(options: object): Promise<object>;
  following(options: object, callback: RestCallback): void;

  // List followers
  followers(options: object): Promise<object>;
  followers(options: object, callback: RestCallback): void;

  // Get feed
  get(options?: object): Promise<object>;
  get(options: object, callback: RestCallback): void;

  // Get tokens
  getReadOnlyToken(): string;
  getReadWriteToken(): string;

  // Activity details
  getActivityDetail(activityId: string, options?: object): Promise<object>;
  getActivityDetail(
    activityId: string,
    options: object,
    callback: RestCallback,
  ): void;

  // Subscriptions
  getFayeClient(): object; // would like to return `Faye.Client` here, but they haven't release any ts def files yet
  subscribe(callback: GenericCallback): Promise<object>;
  unsubscribe(): void;

  // Updates an activity's "to" fields
  updateActivityToTargets(
    foreign_id: string,
    time: string,
    new_targets: string[],
    added_targets: string[],
    removed_targets: string[],
  ): Promise<object>;
}

export class Reaction {
  /** Construct Reaction. */
  constructor(client: StreamClient);

  add(
    kind: string,
    activity: string | Activity,
    data?: object,
    targetFeeds?: string[],
  ): Promise<object>;
  add(
    kind: string,
    activity: string | Activity,
    data: object,
    targetFeeds: string[],
    callback: RestCallback,
  ): void;

  addChild(
    kind: string,
    reaction: string | Activity,
    data?: object,
    targetFeeds?: string[],
  ): Promise<object>;
  addChild(
    kind: string,
    reaction: string | Activity,
    data: object,
    targetFeeds: string[],
    callback: RestCallback,
  ): void;

  get(id: string): Promise<object>;
  get(id: string, callback: RestCallback): void;

  filter(conditions: object): Promise<object>;
  filter(conditions: object, callback: RestCallback): void;

  update(id: string, data: object, targetFeeds?: string[]): Promise<object>;
  update(
    id: string,
    data: object,
    targetFeeds: string[],
    callback: RestCallback,
  ): void;

  delete(id: string): Promise<object>;
  delete(id: string, callback: RestCallback): void;
}

export class User {
  /** Construct User. */
  constructor(client: StreamClient, userId: string);

  delete(): Promise<object>;
  delete(callback: GenericCallback): void;

  get(options: object): Promise<object>;
  get(options: object, callback: GenericCallback): void;

  create(data: object): Promise<object>;
  create(data: object, callback: GenericCallback): void;

  update(data: object): Promise<object>;
  update(data: object, callback: GenericCallback): void;

  getOrCreate(options: object): Promise<object>;
  getOrCreate(options: object, callback: GenericCallback): void;
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

  // Update activity
  updateActivity(activity: object, callback: RestCallback): void;
  updateActivity(activity: object): Promise<object>;

  // Retrieve activities by ID or foreign ID and time
  getActivities(params: object, callback: RestCallback): void;
  getActivities(params: object): Promise<object>;

  // Partially update activity
  activityPartialUpdate(data: object, callback: RestCallback): void;
  activityPartialUpdate(data: object): Promise<object>;

  // Partially update multiple activities
  activitiesPartialUpdate(changes: object, callback: RestCallback): void;
  activitiesPartialUpdate(changes: object): Promise<object>;

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
  addToMany(activity: Activity, feeds: string[]): Promise<object>;
  /**
   * addToMany.
   * Available in node environments with batchOperations enabled.
   */
  addToMany(activity: Activity, feeds: string[], callback: RestCallback): void;

  // Collections sub-component
  collections: Collections;
  personalization: Personalization;
  reactions: Reaction;

  // Instantiate a StreamUser class for the given user ID
  user(userId: string): User;

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

export interface Activity {
  actor: string;
  verb: string;
  object: string;
  time?: string;
  to?: string[];
  foreign_id?: string;
  [customFieldKey: string]: any;

  // reserved words
  activity_id?: never;
  activity?: never;
  analytics?: never;
  extra_context?: never;
  id?: never;
  is_read?: never;
  is_seen?: never;
  origin?: never;
  score?: never;
  site_id?: never;
}

export type RestCallback = (
  err: object,
  httpResponse: object,
  body: object,
) => void;

export type GenericCallback<T = any> = (data: T) => void;
