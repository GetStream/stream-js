import StreamClient, { APIResponse } from './client';

/**
 * Manage api calls for personalization
 * The collection object contains convenience functions such as  get, post, delete
 * @class Personalization
 */

export default class Personalization {
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

  get(resource: string, options: { token?: string } & { [key: string]: string } = {}): Promise<APIResponse> {
    /**
     * Get personalized activities for this feed
     *
     * @method get
     * @memberof Personalization.prototype
     * @param {string} resource - personalized resource endpoint i.e "follow_recommendations"
     * @param {object} options  Additional options
     * @return {Promise} Promise object. Personalized feed
     * @example client.personalization.get('follow_recommendations', {foo: 'bar', baz: 'qux'})
     */
    return this.client.get<APIResponse>({
      url: `${resource}/`,
      serviceName: 'personalization',
      qs: options,
      signature: options.token || this.client.getPersonalizationToken(),
    });
  }

  post(
    resource: string,
    options: { [key: string]: string } = {},
    data: { [key: string]: unknown } = {},
  ): Promise<APIResponse> {
    /**
     * Post data to personalization endpoint
     *
     * @method post
     * @memberof Personalization.prototype
     * @param {string} resource - personalized resource endpoint i.e "follow_recommendations"
     * @param {object} options - Additional options
     * @param {object} data - Data to send in the payload
     * @return {Promise} Promise object. Data that was posted if successful, or an error.
     * @example client.personalization.post('follow_recommendations', {foo: 'bar', baz: 'qux'})
     */
    return this.client.post<APIResponse>({
      url: `${resource}/`,
      serviceName: 'personalization',
      qs: options,
      body: data,
      signature: this.client.getPersonalizationToken(),
    });
  }

  delete(resource: string, options: { [key: string]: string } = {}): Promise<APIResponse> {
    /**
     * Delete metadata or activities
     *
     * @method delete
     * @memberof Personalization.prototype
     * @param {object} resource - personalized resource endpoint i.e "follow_recommendations"
     * @param {object} options - Additional options
     * @return {Promise} Promise object. Data that was deleted if successful, or an error.
     * @example client.personalization.delete('follow_recommendations', {foo: 'bar', baz: 'qux'})
     */
    return this.client.delete<APIResponse>({
      url: `${resource}/`,
      serviceName: 'personalization',
      qs: options,
      signature: this.client.getPersonalizationToken(),
    });
  }
}
