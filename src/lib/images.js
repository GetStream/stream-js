import fetch, { Headers } from '@stream-io/cross-fetch';

import utils from './utils';
import errors from './errors';

export default class StreamImageStore {
  constructor(client, token) {
    this.client = client;
    this.token = token;
  }

  // React Native does not auto-detect MIME type, you need to pass that via contentType
  // param. If you don't then Android will refuse to perform the upload
  upload(uri, name, contentType) {
    const data = utils.addFileToFormData(uri, name, contentType);

    return fetch(`${this.client.enrichUrl('images/')}?api_key=${this.client.apiKey}`, {
      method: 'post',
      body: data,
      headers: new Headers({
        Authorization: this.token,
      }),
    }).then((r) => {
      if (r.ok) {
        return r.json();
      }
      // error
      return r.text().then((responseData) => {
        r.statusCode = r.status;

        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          // ignore json parsing errors
        }
        throw new errors.StreamApiError(
          `${JSON.stringify(responseData)} with HTTP status code ${r.status}`,
          responseData,
          r,
        );
      });
    });
  }

  delete(uri) {
    return this.client.delete({
      url: `images/`,
      qs: { url: uri },
      signature: this.token,
    });
  }

  process(uri, options) {
    const params = Object.assign(options, { url: uri });
    if (Array.isArray(params.crop)) {
      params.crop = params.crop.join(',');
    }

    return this.client.get({
      url: `images/`,
      qs: params,
      signature: this.token,
    });
  }

  thumbnail(uri, w, h, { crop, resize } = { crop: 'center', resize: 'clip' }) {
    return this.process(uri, { w, h, crop, resize });
  }
}
