import axios from 'axios';
import crypto from 'crypto';
import errors from './errors';
import Promise from './promise';

function addToMany(activity, feeds, callback) {
  /**
   * Add one activity to many feeds
   * @method addToMany
   * @memberof StreamClient.prototype
   * @since 2.3.0
   * @param  {object}   activity The activity to add
   * @param  {Array}   feeds    Array of objects describing the feeds to add to
   * @param  {requestCallback} callback Callback called on completion
   * @return {Promise}           Promise object
   */

  if (!this.usingApiSecret || this.apiKey == null) {
    throw new errors.SiteError(
      'This method can only be used server-side using your API Secret',
    );
  }

  return this.makeSignedRequest(
    {
      url: 'feed/add_to_many/',
      data: {
        activity: activity,
        feeds: feeds,
      },
    },
    callback,
  );
}

function followMany(follows, callbackOrActivityCopyLimit, callback) {
  /**
   * Follow multiple feeds with one API call
   * @method followMany
   * @memberof StreamClient.prototype
   * @since 2.3.0
   * @param  {Array}   follows  The follow relations to create
   * @param  {number}  [activityCopyLimit] How many activities should be copied from the target feed
   * @param  {requestCallback} [callback] Callback called on completion
   * @return {Promise}           Promise object
   */
  let activityCopyLimit;
  const qs = {};

  if (!this.usingApiSecret || this.apiKey == null) {
    throw new errors.SiteError(
      'This method can only be used server-side using your API Secret',
    );
  }

  if (typeof callbackOrActivityCopyLimit === 'number') {
    activityCopyLimit = callbackOrActivityCopyLimit;
  }

  if (
    callbackOrActivityCopyLimit &&
    typeof callbackOrActivityCopyLimit === 'function'
  ) {
    callback = callbackOrActivityCopyLimit;
  }

  if (typeof activityCopyLimit !== 'undefined') {
    qs['activity_copy_limit'] = activityCopyLimit;
  }

  return this.makeSignedRequest(
    {
      url: 'follow_many/',
      data: follows,
      params: qs,
    },
    callback,
  );
}

function unfollowMany(unfollows, callback) {
  /**
   * Unfollow multiple feeds with one API call
   * @method unfollowMany
   * @memberof StreamClient.prototype
   * @since 3.15.0
   * @param  {Array}   unfollows  The follow relations to remove
   * @param  {requestCallback} [callback] Callback called on completion
   * @return {Promise}           Promise object
   */

  if (!this.usingApiSecret || this.apiKey == null) {
    throw new errors.SiteError(
      'This method can only be used server-side using your API Secret',
    );
  }

  return this.makeSignedRequest(
    {
      url: 'unfollow_many/',
      data: unfollows,
    },
    callback,
  );
}

function makeSignedRequest(kwargs, cb) {
  /**
   * Method to create request to api with application level authentication
   * @method makeSignedRequest
   * @memberof StreamClient.prototype
   * @since 2.3.0
   * @access private
   * @param  {object}   kwargs Arguments for the request
   * @param  {requestCallback} cb     Callback to call on completion
   * @return {Promise}         Promise object
   */
  if (!this.apiSecret) {
    throw new errors.SiteError(
      'Missing secret, which is needed to perform signed requests, use var client = stream.connect(key, secret);',
    );
  }

  this.send('request', 'post', kwargs, cb);
  function generateSignature(apiSecret, apiKey, algorithm = 'SHA256') {
    const date = new Date().toUTCString();
    const value = `date: ${date}`;
    const signature = crypto
      .createHmac(algorithm, apiSecret)
      .update(value)
      .digest('base64');
    function setHeader() {
      kwargs.headers = {
        ...kwargs.headers,
        Date: date,
        Authorization: `Signature keyId="${apiKey}",algorithm="hmac-sha256",headers="date",signature="${signature}"`,
      };
    }
    setHeader();
  }
  kwargs.url = this.enrichUrl(kwargs.url);
  kwargs.method = 'POST';
  kwargs.headers = {
    'X-Api-Key': this.apiKey,
  };
  kwargs.withCredentials = false;
  generateSignature(this.apiSecret, this.apiKey);
  return axios(kwargs)
    .then(function (response) {
      return Promise.resolve(response.data);
    })
    .catch(function (error) {
      var errorMessage = new errors.StreamApiError(
        JSON.stringify(kwargs.data) +
          ' with HTTP status code ' +
          error.response.data.status_code,
      );
      return Promise.reject(errorMessage);
    });
}

export default {
  addToMany,
  followMany,
  unfollowMany,
  makeSignedRequest,
};
