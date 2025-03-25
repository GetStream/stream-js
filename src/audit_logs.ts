import { StreamClient, APIResponse, UR, DefaultGenerics } from './client';
import { SiteError } from './errors';

export type AuditLogFilterConditions = {
  entity_type?: string;
  entity_id?: string;
  user_id?: string;
  limit?: number;
  next?: string;
  prev?: string;
};

export type AuditLog = {
  entity_type: string;
  entity_id: string;
  action: string;
  user_id: string;
  custom: Record<string, unknown>;
  created_at: string;
};

export type AuditLogAPIResponse = APIResponse & AuditLog;

export type AuditLogFilterAPIResponse = APIResponse & {
  audit_logs: AuditLogAPIResponse[];
  next: string;
  prev: string;
};

export class StreamAuditLogs<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> {
  client: StreamClient<StreamFeedGenerics>;
  token: string;

  constructor(client: StreamClient<StreamFeedGenerics>, token: string) {
    this.client = client;
    this.token = token;
  }

  buildURL = (...args: string[]) => {
    return `${['audit_logs', ...args].join('/')}/`;
  };

  filter(conditions: AuditLogFilterConditions) {
    const url = this.buildURL();
    return this.client.get<AuditLogFilterAPIResponse>({
      url,
      qs: conditions,
      token: this.token,
    });
  }

  get(id: string) {
    const url = this.buildURL(id);
    return this.client.get<AuditLogAPIResponse>({
      url,
      token: this.token,
    });
  }
} 