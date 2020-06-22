/**
 * Manage api calls for personalization
 * The collection object contains convenience functions such as  get, post, delete
 * @class Personalization
 */

export default class Personalization {
  constructor(client) {
    /**
     * Initialize the Personalization class
     *
     * @method constructor
     * @memberof Personalization.prototype
     * @param {StreamClient} client - The stream client
     */
    this.client = client;
  }

  get(resource, options = {}) {
    /**
     * Get personalized activities for this feed
     *
     * @method get
     * @memberof Personalization.prototype
     * @param {object} resource - personalized resource endpoint i.e "follow_recommendations"
     * @param {object} options  Additional options
     * @return {Promise} Promise object. Personalized feed
     * @example client.personalization.get('follow_recommendations', {foo: 'bar', baz: 'qux'})
     */

    return this.client.get({
      url: `${resource}/`,
      serviceName: 'personalization',
      qs: options,
      signature: options.token || this.client.getPersonalizationToken(),
    });
  }

  post(resource, options = {}, data = {}) {
    /**
     * Post data to personalization endpoint
     *
     * @method post
     * @memberof Personalization.prototype
     * @param {object} resource - personalized resource endpoint i.e "follow_recommendations"
     * @param {object} options - Additional options
     * @param {object} data - Data to send in the payload
     * @return {Promise} Promise object. Data that was posted if successful, or an error.
     * @example client.personalization.post('follow_recommendations', {foo: 'bar', baz: 'qux'})
     */

    return this.client.post({
      url: `${resource}/`,
      serviceName: 'personalization',
      qs: options,
      body: data,
      signature: this.client.getPersonalizationToken(),
    });
  }

  delete(resource, options = {}) {
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

    return this.client.delete({
      url: `${resource}/`,
      serviceName: 'personalization',
      qs: options,
      signature: this.client.getPersonalizationToken(),
    });
  }
}
