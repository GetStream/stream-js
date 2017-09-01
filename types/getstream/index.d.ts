// TypeScript Version: 2.2

export as namespace stream;

/**
 * Create StreamClient
 */
export function connect(
  apiKey: string,
  apiSecret: string|null,
  appId: string,
  options?: object
): stream.Client;

declare class Feed {
  /** Construct Feed. */
  constructor(
    client: StreamClient,
    feedSlug: string,
    userId: string,
    token: string
  );

  // Add activity
  addActivity(activity: object): Promise<object>;
  addActivity(
    activity: object,
    callback: (err: object, httpResponse: object, body: object) => void
  ): void;

  // Remove activity
  removeActivity(activityId: string|object): Promise<object>;
  removeActivity(
    activityId: string|object,
    callback: (err: object, httpResponse: object, body: object) => void
  ): void;

  // Add activities
  addActivities(activities: object[]): Promise<object>;
  addActivities(
    activities: object[],
    callback: (err: object, httpResponse: object, body: object) => void
  ): void;

  // Follow feed
  follow(
    targetSlug: string,
    targetUserId: string,
    options: object
  ): Promise<object>;
  follow(
    targetSlug: string,
    targetUserId: string,
    options: object,
    callback: (err: object, httpResponse: object, body: object) => void
  ): void;

  // Unfollow feed
  unfollow(
    targetSlug: string,
    targetUserId: string,
    options?: object
  ): Promise<object>;
  unfollow(
    targetSlug: string,
    targetUserId: string,
    options?: object,
    callback?: (err: object, httpResponse: object, body: object) => void
  ): void;

  // List followed feeds
  following(options: object): Promise<object>;
  following(
    options: object,
    callback: (err: object, httpResponse: object, body: object) => void
  ): void;

  // List followers
  followers(options: object): Promise<object>;
  followers(
    options: object,
    callback: (err: object, httpResponse: object, body: object) => void
  ): void;

  // Get feed
  get(options?: object): Promise<object>;
  get(
    options: object,
    callback: (err: object, httpResponse: object, body: object) => void
  ): void;

  // Subscribe to realtime
  /** Subscribe to Faye realtime source. */
  subscribe(callback: () => void): object;

  // Get tokens
  getReadOnlyToken(): string;
  getReadWriteToken(): string;
}

declare class StreamClient {
  /** Construct StreamClient */
  constructor(
    apiKey: string,
    apiSecret?: string,
    appId?: string,
    options?: object
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
    options?: object
  ): Feed;

  // Update activities
  updateActivities(
    activities: object[],
    callback: (args: object[]) => void
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
    callback: (err: object, httpResponse: object, body: object) => void
  ): void;

  // Follow many feeds
  /**
   * followMany.
   * Available in node environments with batchOperations enabled
   */
  followMany(follows: object[], activityCopyLimit?: number
  ): Promise<object>;
  /**
   * followMany.
   * Available in node environments with batchOperations enabled
   */
  followMany(
    follows: object[],
    activityCopyLimit?: number,
    callback?: (err: object, httpResponse: object, body: object) => void
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
    constructor();
  }
  class FeedError {
    /**
     * Construct FeedError.
     * Not typically instantiated by app developers.
     */
    constructor();
  }
  class SiteError {
    /**
     * Construct SiteError.
     * Not typically instantiated by app developers.
     */
    constructor();
  }
}
