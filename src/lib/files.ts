export default class StreamFileStore {
  constructor(client, token) {
    this.client = client;
    this.token = token;
  }

  // React Native does not auto-detect MIME type, you need to pass that via contentType
  // param. If you don't then Android will refuse to perform the upload
  upload(uri, name, contentType, onUploadProgress) {
    /**
     * upload a File instance or a readable stream of data
     * @param {File|Buffer|string} uri - File object or Buffer or URI
     * @param {string} [name] - file name
     * @param {string} [contentType] - mime-type
     * @param {function} [onUploadProgress] - browser only, Function that is called with upload progress
     * @return {Promise}
     */
    return this.client.upload('files/', uri, name, contentType, onUploadProgress);
  }

  delete(uri) {
    return this.client.delete({
      url: `files/`,
      qs: { url: uri },
      signature: this.token,
    });
  }
}
