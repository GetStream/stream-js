import { StreamClient, APIResponse, UR, DefaultGenerics } from './client';

/**
 * Manage api calls for personalization
 * The collection object contains convenience functions such as  get, post, delete
 * @class Personalization
 */

export type PersonalizationAPIResponse<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> = APIResponse & {
  app_id: string;
  next: string;
  results: Array<StreamFeedGenerics['personalizationType']>;
  limit?: number;
  offset?: number;
  version?: string;
};

export class Personalization<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> {
  client: StreamClient<StreamFeedGenerics>;

  /**
   * Initialize the Personalization class
   * @link https://getstream.io/activity-feeds/docs/node/personalization_introduction/?language=js
   * @method constructor
   * @memberof Personalization.prototype
   * @param {StreamClient} client - The stream client
   */
  constructor(client: StreamClient<StreamFeedGenerics>) {
    this.client = client;
  }

  /**
   * Get personalized activities for this feed
   *
   * @method get
   * @memberof Personalization.prototype
   * @param {string} resource - personalized resource endpoint i.e "follow_recommendations"
   * @param {object} options  Additional options
   * @return {Promise<PersonalizationAPIResponse<StreamFeedGenerics>>} Promise object. Personalized feed
   * @example client.personalization.get('follow_recommendations', {foo: 'bar', baz: 'qux'})
   */
  get(resource: string, options: Record<string, string> & { token?: string } = {}) {
    return this.client.get<PersonalizationAPIResponse<StreamFeedGenerics>>({
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
   * @return {Promise<PersonalizationAPIResponse<StreamFeedGenerics>>} Promise object. Data that was posted if successful, or an error.
   * @example client.personalization.post('follow_recommendations', {foo: 'bar', baz: 'qux'})
   */
  post(resource: string, options: Record<string, string> = {}, data: UR = {}) {
    return this.client.post<PersonalizationAPIResponse<StreamFeedGenerics>>({
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
   * @return {Promise<PersonalizationAPIResponse<StreamFeedGenerics>>} Promise object. Data that was deleted if successful, or an error.
   * @example client.personalization.delete('follow_recommendations', {foo: 'bar', baz: 'qux'})
   */
  delete(resource: string, options: Record<string, string> = {}) {
    return this.client.delete<PersonalizationAPIResponse<StreamFeedGenerics>>({
      url: `${resource}/`,
      serviceName: 'personalization',
      qs: options,
      token: this.client.getPersonalizationToken(),
    });
  }
}
