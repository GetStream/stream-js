import { StreamClient } from './client';
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
export default function createRedirectUrl(this: StreamClient, targetUrl: string, userId: string, events: unknown[]): string;
//# sourceMappingURL=redirect_url.d.ts.map