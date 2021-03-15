import { StreamClient, APIResponse, UnknownRecord } from './client';

/**
 * Manage api calls for personalization
 * The collection object contains convenience functions such as  get, post, delete
 * @class Personalization
 */

export type PersonalizationAPIResponse<PersonalizationType extends UnknownRecord = UnknownRecord> = APIResponse & {
  app_id: string;
  next: string;
  results: PersonalizationType[];
  limit?: number;
  offset?: number;
  version?: string;
};

export class Personalization<
  UserType extends UnknownRecord = UnknownRecord,
  ActivityType extends UnknownRecord = UnknownRecord,
  CollectionType extends UnknownRecord = UnknownRecord,
  ReactionType extends UnknownRecord = UnknownRecord,
  ChildReactionType extends UnknownRecord = UnknownRecord,
  PersonalizationType extends UnknownRecord = UnknownRecord
> {
  client: StreamClient<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType, PersonalizationType>;

  /**
   * Initialize the Personalization class
   * @link https://getstream.io/activity-feeds/docs/node/personalization_introduction/?language=js
   * @method constructor
   * @memberof Personalization.prototype
   * @param {StreamClient} client - The stream client
   */
  constructor(
    client: StreamClient<UserType, ActivityType, CollectionType, ReactionType, ChildReactionType, PersonalizationType>,
  ) {
    this.client = client;
  }

  /**
   * Get personalized activities for this feed
   *
   * @method get
   * @memberof Personalization.prototype
   * @param {string} resource - personalized resource endpoint i.e "follow_recommendations"
   * @param {object} options  Additional options
   * @return {Promise<PersonalizationAPIResponse<PersonalizationType>>} Promise object. Personalized feed
   * @example client.personalization.get('follow_recommendations', {foo: 'bar', baz: 'qux'})
   */
  get(resource: string, options: Record<string, string> & { token?: string } = {}) {
    return this.client.get<PersonalizationAPIResponse<PersonalizationType>>({
      url: `${resource}/`,
      serviceName: 'personalization',
      qs: options,
      token: options.token || this.client.getPersonalizationToken(),
    });
  }

  /**
   * Post data to personalization endpoint
   *
   * @method post
   * @memberof Personalization.prototype
   * @param {string} resource - personalized resource endpoint i.e "follow_recommendations"
   * @param {object} options - Additional options
   * @param {object} data - Data to send in the payload
   * @return {Promise<PersonalizationAPIResponse<PersonalizationType>>} Promise object. Data that was posted if successful, or an error.
   * @example client.personalization.post('follow_recommendations', {foo: 'bar', baz: 'qux'})
   */
  post(resource: string, options: Record<string, string> = {}, data: UnknownRecord = {}) {
    return this.client.post<PersonalizationAPIResponse<PersonalizationType>>({
      url: `${resource}/`,
      serviceName: 'personalization',
      qs: options,
      body: data,
      token: this.client.getPersonalizationToken(),
    });
  }

  /**
   * Delete metadata or activities
   *
   * @method delete
   * @memberof Personalization.prototype
   * @param {object} resource - personalized resource endpoint i.e "follow_recommendations"
   * @param {object} options - Additional options
   * @return {Promise<PersonalizationAPIResponse<PersonalizationType>>} Promise object. Data that was deleted if successful, or an error.
   * @example client.personalization.delete('follow_recommendations', {foo: 'bar', baz: 'qux'})
   */
  delete(resource: string, options: Record<string, string> = {}) {
    return this.client.delete<PersonalizationAPIResponse<PersonalizationType>>({
      url: `${resource}/`,
      serviceName: 'personalization',
      qs: options,
      token: this.client.getPersonalizationToken(),
    });
  }
}
