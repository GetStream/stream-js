import { StreamClient, OnUploadProgress, RefreshUrlAPIResponse } from './client';

export class StreamFileStore {
  client: StreamClient;
  token: string;

  constructor(client: StreamClient, token: string) {
    this.client = client;
    this.token = token;
  }

  // React Native does not auto-detect MIME type, you need to pass that via contentType
  // param. If you don't then Android will refuse to perform the upload
  /**
   * upload a File instance or a readable stream of data
   * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#upload
   * @param {File|Buffer|NodeJS.ReadStream|string} uri - File object or stream or URI
   * @param {string} [name] - file name
   * @param {string} [contentType] - mime-type
   * @param {function} [onUploadProgress] - browser only, Function that is called with upload progress
   * @return {Promise<FileUploadAPIResponse>}
   */
  upload(
    uri: string | File | Buffer | NodeJS.ReadStream,
    name?: string,
    contentType?: string,
    onUploadProgress?: OnUploadProgress,
  ) {
    return this.client.upload('files/', uri, name, contentType, onUploadProgress);
  }

  /**
   * delete an uploaded file
   * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#delete
   * @param {string} uri
   */
  delete(uri: string) {
    return this.client.delete({
      url: `files/`,
      qs: { url: uri },
      token: this.token,
    });
  }

  /**
   * Explicitly refresh CDN urls for uploaded files on the Stream CDN (only needed for files on the Stream CDN).
   * Note that Stream CDN is not enabled by default, if in doubt please contact us.
   * @param  {string} uri full uploaded file url that needs to be refreshed
   * @return {Promise<RefreshUrlAPIResponse>}
   */
  refreshUrl(uri: string) {
    return this.client.post<RefreshUrlAPIResponse>({
      url: 'files/refresh/',
      body: { url: uri },
      token: this.token,
    });
  }
}
