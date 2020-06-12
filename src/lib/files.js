import fetch from '@stream-io/cross-fetch';
import FormData from 'form-data';
import { Headers } from '@stream-io/cross-fetch';

import utils from './utils';
import errors from './errors';

export default class StreamFileStore {
  constructor(client, token) {
    this.client = client;
    this.token = token;
  }

  // React Native does not auto-detect MIME type, you need to pass that via contentType
  // param. If you don't then Android will refuse to perform the upload
  upload(uri, name, contentType) {
    const data = new FormData();
    let fileField;

    if (utils.isReadableStream(uri)) {
      fileField = uri;
    } else {
      fileField = {
        uri: uri,
        name: name || uri.split('/').reverse()[0],
      };
      if (contentType != null) {
        fileField.type = contentType;
      }
    }

    data.append('file', fileField);

    return fetch(
      `${this.client.enrichUrl('files/')}?api_key=${this.client.apiKey}`,
      {
        method: 'post',
        body: data,
        headers: new Headers({
          Authorization: this.token,
        }),
      },
    ).then((r) => {
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
          JSON.stringify(responseData) + ' with HTTP status code ' + r.status,
          responseData,
          r,
        );
      });
    });
  }

  delete(uri) {
    return this.client.delete({
      url: `files/`,
      qs: { url: uri },
      signature: this.token,
    });
  }
}
