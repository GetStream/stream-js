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

export class Personalization<PersonalizationType extends UnknownRecord = UnknownRecord> {
  client: StreamClient;

  /**
   * Initialize the Personalization class
   *
   * @method constructor
   * @memberof Personalization.prototype
   * @param {StreamClient} client - The stream client
   */
  constructor(client: StreamClient) {
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
      signature: options.token || this.client.getPersonalizationToken(),
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
      signature: this.client.getPersonalizationToken(),
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
      signature: this.client.getPersonalizationToken(),
    });
  }
}
