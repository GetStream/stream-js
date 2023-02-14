import { StreamClient, APIResponse, DefaultGenerics } from './client';
export declare type EnrichedUser<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = {
    created_at: string;
    data: StreamFeedGenerics['userType'];
    id: string;
    updated_at: string;
};
export declare type UserAPIResponse<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = APIResponse & EnrichedUser<StreamFeedGenerics> & {
    followers_count?: number;
    following_count?: number;
};
export declare class StreamUser<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> {
    client: StreamClient<StreamFeedGenerics>;
    token: string;
    id: string;
    data?: StreamFeedGenerics['userType'];
    full?: UserAPIResponse<StreamFeedGenerics>;
    private url;
    /**
     * Initialize a user session object
     * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js
     * @method constructor
     * @memberof StreamUser.prototype
     * @param {StreamClient} client Stream client this collection is constructed from
     * @param {string} userId The ID of the user
     * @param {string} userAuthToken JWT token
     * @example new StreamUser(client, "123", "eyJhbGciOiJIUzI1...")
     */
    constructor(client: StreamClient<StreamFeedGenerics>, userId: string, userAuthToken: string);
    /**
     * Create a stream user ref
     * @return {string}
     */
    ref(): string;
    /**
     * Delete the user
     * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#removing-users
     * @return {Promise<APIResponse>}
     */
    delete(): Promise<APIResponse>;
    /**
     * Get the user data
     * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#retrieving-users
     * @param {boolean} [options.with_follow_counts]
     * @return {Promise<StreamUser>}
     */
    get(options?: {
        with_follow_counts?: boolean;
    }): Promise<this>;
    /**
     * Create a new user in stream
     * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#adding-users
     * @param {object} data user date stored in stream
     * @param {boolean} [options.get_or_create] if user already exists return it
     * @return {Promise<StreamUser>}
     */
    create(data?: StreamFeedGenerics['userType'], options?: {
        get_or_create?: boolean;
    }): Promise<this>;
    /**
     * Update the user
     * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#updating-users
     * @param {object} data user date stored in stream
     * @return {Promise<StreamUser>}
     */
    update(data?: Partial<StreamFeedGenerics['userType']>): Promise<this>;
    /**
     * Get or Create a new user in stream
     * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#adding-users
     * @param {object} data user date stored in stream
     * @return {Promise<StreamUser>}
     */
    getOrCreate(data: StreamFeedGenerics['userType']): Promise<this>;
    /**
     * Get the user profile, it includes the follow counts by default
     * @link https://getstream.io/activity-feeds/docs/node/users_introduction/?language=js#retrieving-users
     * @return {Promise<StreamUser>}
     */
    profile(): Promise<this>;
}
//# sourceMappingURL=user.d.ts.map