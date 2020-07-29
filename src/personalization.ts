import StreamClient, { APIResponse } from './client';

/**
 * Manage api calls for personalization
 * The collection object contains convenience functions such as  get, post, delete
 * @class Personalization
 */

export type PersonalizationAPIResponse<PersonalizationType> = APIResponse & {
  app_id: string;
  results: PersonalizationType[];
  next: string;
  offset?: number;
  limit?: number;
  version?: string;
};

export default class Personalization<PersonalizationType> {
  client: StreamClient;

  constructor(client: StreamClient) {
    /**
     * Initialize the Personalization class
     *
     * @method constructor
     * @memberof Personalization.prototype
     * @param {StreamClient} client - The stream client
     */
    this.client = client;
  }

  get(resource: string, options: Record<string, string> & { token?: string } = {}) {
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
    return this.client.get<PersonalizationAPIResponse<PersonalizationType>>({
      url: `${resource}/`,
      serviceName: 'personalization',
      qs: options,
      signature: options.token || this.client.getPersonalizationToken(),
    });
  }

  post(resource: string, options: Record<string, string> = {}, data: Record<string, unknown> = {}) {
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
    return this.client.post<PersonalizationAPIResponse<PersonalizationType>>({
      url: `${resource}/`,
      serviceName: 'personalization',
      qs: options,
      body: data,
      signature: this.client.getPersonalizationToken(),
    });
  }

  delete(resource: string, options: Record<string, string> = {}) {
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
    return this.client.delete<PersonalizationAPIResponse<PersonalizationType>>({
      url: `${resource}/`,
      serviceName: 'personalization',
      qs: options,
      signature: this.client.getPersonalizationToken(),
    });
  }
}
