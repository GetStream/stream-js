import Url from 'url';
import qs from 'qs';

import errors from './errors';
import utils from './utils';
import signing from './signing';

export default function createRedirectUrl(targetUrl, userId, events) {
  /**
   * Creates a redirect url for tracking the given events in the context of
   * an email using Stream's analytics platform. Learn more at
   * getstream.io/personalization
   * @method createRedirectUrl
   * @memberof StreamClient.prototype
   * @param  {string} targetUrl Target url
   * @param  {string} userId    User id to track
   * @param  {array} events     List of events to track
   * @return {string}           The redirect url
   */
  const uri = Url.parse(targetUrl);

  if (!(uri.host || (uri.hostname && uri.port)) && !uri.isUnix) {
    throw new errors.MissingSchemaError(`Invalid URI: "${Url.format(uri)}"`);
  }

  const authToken = signing.JWTScopeToken(this.apiSecret, 'redirect_and_track', '*', {
    userId: '*',
    expireTokens: this.expireTokens,
  });
  const analyticsUrl = `${this.baseAnalyticsUrl}redirect/`;
  const kwargs = {
    auth_type: 'jwt',
    authorization: authToken,
    url: targetUrl,
    api_key: this.apiKey,
    events: JSON.stringify(events),
  };

  const qString = utils.rfc3986(qs.stringify(kwargs, null, null, {}));

  return `${analyticsUrl}?${qString}`;
}
