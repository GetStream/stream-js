import Url from 'url';
import qs from 'qs';

import { StreamClient } from './client';
import { MissingSchemaError } from './errors';
import utils from './utils';
import { JWTScopeToken } from './signing';

// TODO: userId is skipped here
/**
 * Creates a redirect url for tracking the given events in the context of
 * an email using Stream's analytics platform. Learn more at
 * getstream.io/personalization
 * @link https://getstream.io/activity-feeds/docs/node/analytics_email/?language=js
 * @method createRedirectUrl
 * @memberof StreamClient.prototype
 * @param  {string} targetUrl Target url
 * @param  {string} userId    User id to track
 * @param  {array} events     List of events to track
 * @return {string}           The redirect url
 */
export default function createRedirectUrl(this: StreamClient, targetUrl: string, userId: string, events: unknown[]) {
  const uri = Url.parse(targetUrl);

  if (!(uri.host || (uri.hostname && uri.port))) {
    throw new MissingSchemaError(`Invalid URI: "${Url.format(uri)}"`);
  }

  const authToken = JWTScopeToken(this.apiSecret as string, 'redirect_and_track', '*', {
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

  const qString = utils.rfc3986(qs.stringify(kwargs));

  return `${analyticsUrl}?${qString}`;
}
