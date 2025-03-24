import { StreamClient, APIResponse, UR, DefaultGenerics } from './client';
import { SiteError } from './errors';

export type AuditLog = {
  entity_type: string;
  entity_id: string;
  action: string;
  user_id: string;
  custom?: UR;
  created_at: string;
};

export type AuditLogAPIResponse = APIResponse & AuditLog;

export type AuditLogFilterAPIResponse = APIResponse & {
  audit_logs: AuditLogAPIResponse[];
  next: string;
  prev: string;
};

export type AuditLogFilterConditions = {
  entity_type?: string;
  entity_id?: string;
  user_id?: string;
  next?: string;
  prev?: string;
  limit?: number;
};

export class StreamAuditLogs<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> {
  client: StreamClient<StreamFeedGenerics>;
  token: string;

  /**
   * Initialize an audit logs object
   * @link https://getstream.io/activity-feeds/docs/node/audit_logs/?language=js
   * @method constructor
   * @memberof StreamAuditLogs.prototype
   * @param {StreamClient} client Stream client this feed is constructed from
   * @param {string} token JWT token
   * @example new StreamAuditLogs(client, "eyJhbGciOiJIUzI1...")
   */
  constructor(client: StreamClient<StreamFeedGenerics>, token: string) {
    this.client = client;
    this.token = token;
  }

  buildURL = (...args: string[]) => {
    return `${['audit_logs', ...args].join('/')}/`;
  };

  /**
   * Query audit logs with filters
   * @link https://getstream.io/activity-feeds/docs/node/audit_logs/?language=js#query-audit-logs
   * @method query
   * @memberof StreamAuditLogs.prototype
   * @param  {AuditLogFilterConditions} conditions Filter conditions
   * @return {Promise<AuditLogFilterAPIResponse>}
   * @example auditLogs.query({entity_type: "feed", entity_id: "user:123"})
   * @example auditLogs.query({user_id: "john", limit: 25})
   */
  query(conditions: AuditLogFilterConditions) {
    const { limit = 25, ...qs } = conditions;

    return this.client.get<AuditLogFilterAPIResponse>({
      url: this.buildURL(),
      qs: { ...qs, limit },
      token: this.token,
    });
  }
} 