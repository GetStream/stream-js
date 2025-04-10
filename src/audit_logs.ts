import { StreamClient, UR, DefaultGenerics } from './client';

export interface AuditLog {
  action: string;
  created_at: string;
  custom: Record<string, unknown>;
  entity_id: string;
  entity_type: string;
  user_id: string;
}

export interface AuditLogFilterAPIResponse {
  audit_logs: AuditLog[];
  duration: string;
  next?: string;
  prev?: string;
}

export interface AuditLogFilterOptions extends UR {
  entity_id?: string;
  entity_type?: string;
  limit?: number;
  next?: string;
  prev?: string;
  user_id?: string;
}

export class StreamAuditLogs<StreamFeedGenerics extends DefaultGenerics = DefaultGenerics> {
  token: string;
  client: StreamClient<StreamFeedGenerics>;

  constructor(client: StreamClient<StreamFeedGenerics>, token: string) {
    this.client = client;
    this.token = token;
  }

  buildURL(...args: string[]): string {
    return `${['audit_logs', ...args].join('/')}/`;
  }

  async filter(options?: AuditLogFilterOptions): Promise<AuditLogFilterAPIResponse> {
    return this.client.get({
      url: this.buildURL(),
      qs: options,
      token: this.token,
    });
  }
}
