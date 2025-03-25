import expect from 'expect.js';
import * as td from 'testdouble';

import { StreamClient } from '../../../src';
import { beforeEachFn } from '../utils/hooks';

describe('[UNIT] Stream Audit Logs (node)', function () {
  let get;

  beforeEach(beforeEachFn);
  beforeEach(function () {
    get = td.function();
    td.replace(this.client, 'get', get);
  });

  afterEach(function () {
    td.reset();
  });

  describe('filter', function () {
    it('should send get request with no conditions', function () {
      const fakedJWT = 'Faked JWT';
      this.client.auditLogs.token = fakedJWT;
      
      this.client.auditLogs.filter();

      td.verify(
        get({
          url: 'audit_logs/',
          qs: undefined,
          token: fakedJWT,
        }),
      );
    });

    it('should send get request with all filter conditions', function () {
      const fakedJWT = 'Faked JWT';
      const conditions = {
        entity_type: 'activity',
        entity_id: '123',
        user_id: 'user1',
        limit: 10,
        next: 'next_cursor',
        prev: 'prev_cursor',
      };
      this.client.auditLogs.token = fakedJWT;
      
      this.client.auditLogs.filter(conditions);

      td.verify(
        get({
          url: 'audit_logs/',
          qs: conditions,
          token: fakedJWT,
        }),
      );
    });

    it('should handle partial filter conditions', function () {
      const fakedJWT = 'Faked JWT';
      const conditions = {
        entity_type: 'activity',
        limit: 10,
      };
      this.client.auditLogs.token = fakedJWT;
      
      this.client.auditLogs.filter(conditions);

      td.verify(
        get({
          url: 'audit_logs/',
          qs: conditions,
          token: fakedJWT,
        }),
      );
    });

    it('should return the correct response type', async function () {
      const fakedJWT = 'Faked JWT';
      const mockResponse = {
        duration: '0.1s',
        audit_logs: [
          {
            entity_type: 'activity',
            entity_id: '123',
            action: 'create',
            user_id: 'user1',
            custom: {},
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
        next: 'next_cursor',
        prev: 'prev_cursor',
      };
      this.client.auditLogs.token = fakedJWT;
      
      td.when(get({
        url: 'audit_logs/',
        qs: undefined,
        token: fakedJWT,
      })).thenResolve(mockResponse);

      const response = await this.client.auditLogs.filter();
      expect(response).to.eql(mockResponse);
    });
  });
}); 