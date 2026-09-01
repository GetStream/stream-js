import expect from 'expect.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';

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

    const queryString = Object.fromEntries(new URL(redirectUrl).searchParams);
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

    const queryString = Object.fromEntries(new URL(redirectUrl).searchParams);
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

    axios
      .get(redirectUrl, { validateStatus: () => true })
      .then(function (response) {
        // axios follows redirects by default; res.responseUrl is the final URL
        const finalHostname = new URL(response.request.res.responseUrl).hostname;
        if (response.status !== 200) {
          done(`Expecting a status code of 200 but got ${response.status}`);
        } else if (finalHostname.indexOf('google') === -1) {
          done('Did not follow redirect to google');
        } else {
          done();
        }
      })
      .catch(done);
  });

  // Pins the exact query-string encoding of the redirect URL. The analytics
  // endpoint parses this URL, so the encoding is part of the wire contract:
  // spaces must be %20 (not +) and ~ must stay literal.
  it('should encode the query string exactly', function () {
    const client = new StreamClient(config.API_KEY, config.API_SECRET);
    const targetUrl = 'http://example.com/a b~c?x=1&y=2';
    const events = [{ foreign_id: 'tweet:1', label: "click!'()*", user_id: 'tom~my' }];

    const redirectUrl = client.createRedirectUrl(targetUrl, 'tommaso', events);
    const { search } = new URL(redirectUrl);

    expect(search).to.contain('url=http%3A%2F%2Fexample.com%2Fa%20b~c%3Fx%3D1%26y%3D2');
    expect(search).to.contain(
      'events=%5B%7B%22foreign_id%22%3A%22tweet%3A1%22%2C%22label%22%3A%22click%21%27%28%29%2A%22%2C%22user_id%22%3A%22tom~my%22%7D%5D',
    );
    expect(search).to.contain(`api_key=${config.API_KEY}`);
    expect(search.indexOf('+')).to.equal(-1);
    expect(search.indexOf('%7E')).to.equal(-1);
  });

  it('should fail creating email redirects on invalid targets', function () {
    const self = this;
    expect(function () {
      self.client.createRedirectUrl('google.com', 'tommaso', []);
    }).to.throwException(new MissingSchemaError());
  });
});
