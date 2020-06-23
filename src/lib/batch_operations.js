import httpSignature from 'http-signature';

import errors from './errors';

function addToMany(activity, feeds) {
  /**
   * Add one activity to many feeds
   * @method addToMany
   * @memberof StreamClient.prototype
   * @since 2.3.0
   * @param  {object}   activity The activity to add
   * @param  {Array}   feeds    Array of objects describing the feeds to add to
   * @return {Promise}           Promise object
   */

  if (!this.usingApiSecret || this.apiKey == null) {
    throw new errors.SiteError('This method can only be used server-side using your API Secret');
  }

  return this.makeSignedRequest({
    url: 'feed/add_to_many/',
    body: {
      activity,
      feeds,
    },
  });
}

function followMany(follows, activityCopyLimit) {
  /**
   * Follow multiple feeds with one API call
   * @method followMany
   * @memberof StreamClient.prototype
   * @since 2.3.0
   * @param  {Array}   follows  The follow relations to create
   * @param  {number}  [activityCopyLimit] How many activities should be copied from the target feed
   * @return {Promise}           Promise object
   */
  const qs = {};

  if (!this.usingApiSecret || this.apiKey == null) {
    throw new errors.SiteError('This method can only be used server-side using your API Secret');
  }

  if (typeof activityCopyLimit === 'number') {
    qs.activity_copy_limit = activityCopyLimit;
  }

  return this.makeSignedRequest({
    url: 'follow_many/',
    body: follows,
    qs,
  });
}

function unfollowMany(unfollows) {
  /**
   * Unfollow multiple feeds with one API call
   * @method unfollowMany
   * @memberof StreamClient.prototype
   * @since 3.15.0
   * @param  {Array}   unfollows  The follow relations to remove
   * @return {Promise}           Promise object
   */

  if (!this.usingApiSecret || this.apiKey == null) {
    throw new errors.SiteError('This method can only be used server-side using your API Secret');
  }

  return this.makeSignedRequest({
    url: 'unfollow_many/',
    body: unfollows,
  });
}

function makeSignedRequest(kwargs) {
  /**
   * Method to create request to api with application level authentication
   * @method makeSignedRequest
   * @memberof StreamClient.prototype
   * @since 2.3.0
   * @access private
   * @param  {object}   kwargs Arguments for the request
   * @return {Promise}         Promise object
   */
  if (!this.apiSecret) {
    throw new errors.SiteError(
      'Missing secret, which is needed to perform signed requests, use var client = stream.connect(key, secret);',
    );
  }

  return new Promise((fulfill, reject) => {
    this.send('request', 'post', kwargs);

    kwargs.url = this.enrichUrl(kwargs.url);
    kwargs.json = true;
    kwargs.method = 'POST';
    kwargs.headers = { 'X-Api-Key': this.apiKey };
    // Make sure withCredentials is not enabled, different browser
    // fallbacks handle it differently by default (meteor)
    kwargs.withCredentials = false;

    const callback = this.wrapPromiseTask(fulfill, reject);
    const req = this.request(kwargs, callback);

    httpSignature.sign(req, {
      algorithm: 'hmac-sha256',
      key: this.apiSecret,
      keyId: this.apiKey,
    });
  });
}

export default {
  addToMany,
  followMany,
  unfollowMany,
  makeSignedRequest,
};
