import expect from 'expect.js';
import jwt from 'jsonwebtoken';
import url from 'url';
import qs from 'qs';
import request from 'request';

import { StreamClient, MissingSchemaError } from '../../../src';
import config from '../utils/config';

describe("[UNIT] Redirect URL's", function () {
  // beforeEach(beforeEachFn);

  it('should create email redirects (analytics.stream-io-api.com)', function () {
    const expectedParts = [
      'https://analytics.stream-io-api.com/analytics/redirect/',
      'auth_type=jwt',
      'url=http%3A%2F%2Fgoogle.com%2F%3Fa%3Db%26c%3Dd',
      'events=%5B%7B%22foreign_ids%22%3A%5B%22tweet%3A1%22%2C%22tweet%3A2%22%2C%22tweet%3A3%22%2C%22tweet%3A4%22%2C%22tweet%3A5%22%5D%2C%22user_id%22%3A%22tommaso%22%2C%22location%22%3A%22email%22%2C%22feed_id%22%3A%22user%3Aglobal%22%7D%2C%7B%22foreign_id%22%3A%22tweet%3A1%22%2C%22label%22%3A%22click%22%2C%22position%22%3A3%2C%22user_id%22%3A%22tommaso%22%2C%22location%22%3A%22email%22%2C%22feed_id%22%3A%22user%3Aglobal%22%7D%5D',
      `api_key=${config.API_KEY}`,
    ];
    const engagement = {
      foreign_id: 'tweet:1',
      label: 'click',
      position: 3,
      user_id: 'tommaso',
      location: 'email',
      feed_id: 'user:global',
    };
    const impression = {
      foreign_ids: ['tweet:1', 'tweet:2', 'tweet:3', 'tweet:4', 'tweet:5'],
      user_id: 'tommaso',
      location: 'email',
      feed_id: 'user:global',
    };
    const events = [impression, engagement];
    const userId = 'tommaso';
    const targetUrl = 'http://google.com/?a=b&c=d';

    this.client = new StreamClient(config.API_KEY, config.API_SECRET);
    const redirectUrl = this.client.createRedirectUrl(targetUrl, userId, events);

    const queryString = qs.parse(url.parse(redirectUrl).query);
    const decoded = jwt.verify(queryString.authorization, config.API_SECRET);

    expect(decoded).to.eql({
      resource: 'redirect_and_track',
      action: '*',
      user_id: '*',
    });

    for (let i = 0; i < expectedParts.length; i++) {
      expect(redirectUrl).to.contain(expectedParts[i]);
    }
  });

  it('should create email redirects (analytics.getstream.io)', function () {
    const expectedParts = [
      'https://analytics.getstream.io/analytics/redirect/',
      'auth_type=jwt',
      'url=http%3A%2F%2Fgoogle.com%2F%3Fa%3Db%26c%3Dd',
      'events=%5B%7B%22foreign_ids%22%3A%5B%22tweet%3A1%22%2C%22tweet%3A2%22%2C%22tweet%3A3%22%2C%22tweet%3A4%22%2C%22tweet%3A5%22%5D%2C%22user_id%22%3A%22tommaso%22%2C%22location%22%3A%22email%22%2C%22feed_id%22%3A%22user%3Aglobal%22%7D%2C%7B%22foreign_id%22%3A%22tweet%3A1%22%2C%22label%22%3A%22click%22%2C%22position%22%3A3%2C%22user_id%22%3A%22tommaso%22%2C%22location%22%3A%22email%22%2C%22feed_id%22%3A%22user%3Aglobal%22%7D%5D',
      `api_key=${config.API_KEY}`,
    ];
    const engagement = {
      foreign_id: 'tweet:1',
      label: 'click',
      position: 3,
      user_id: 'tommaso',
      location: 'email',
      feed_id: 'user:global',
    };
    const impression = {
      foreign_ids: ['tweet:1', 'tweet:2', 'tweet:3', 'tweet:4', 'tweet:5'],
      user_id: 'tommaso',
      location: 'email',
      feed_id: 'user:global',
    };
    const events = [impression, engagement];
    const userId = 'tommaso';
    const targetUrl = 'http://google.com/?a=b&c=d';
    process.env.STREAM_ANALYTICS_BASE_URL = 'https://analytics.getstream.io/analytics/';
    this.client = new StreamClient(config.API_KEY, config.API_SECRET);
    const redirectUrl = this.client.createRedirectUrl(targetUrl, userId, events);

    const queryString = qs.parse(url.parse(redirectUrl).query);
    const decoded = jwt.verify(queryString.authorization, config.API_SECRET);

    expect(decoded).to.eql({
      resource: 'redirect_and_track',
      action: '*',
      user_id: '*',
    });

    for (let i = 0; i < expectedParts.length; i++) {
      expect(redirectUrl).to.contain(expectedParts[i]);
    }
    delete process.env.STREAM_ANALYTICS_BASE_URL;
  });

  it('should follow redirect urls', function (done) {
    const events = [
      {
        content_list: ['tweet:1', 'tweet:2', 'tweet:3'],
        user_data: 'tommaso',
        location: 'email',
        feed_id: 'user:global',
      },
      {
        content: 'tweet:2',
        label: 'click',
        position: 1,
        user_data: 'tommaso',
        location: 'email',
        feed_id: 'user:global',
      },
    ];
    const userId = 'tommaso';
    const targetUrl = 'http://google.com/?a=b&c=d';

    const redirectUrl = this.client.createRedirectUrl(targetUrl, userId, events);

    request(redirectUrl, function (err, response) {
      if (err) {
        done(err);
      } else if (response.statusCode !== 200) {
        done(`Expecting a status code of 200 but got ${response.statusCode}`);
      } else if (response.request.uri.hostname.indexOf('google') === -1) {
        done('Did not follow redirect to google');
      } else {
        done();
      }
    });
  });

  it('should fail creating email redirects on invalid targets', function () {
    const self = this;
    expect(function () {
      self.client.createRedirectUrl('google.com', 'tommaso', []);
    }).to.throwException(new MissingSchemaError());
  });
});
