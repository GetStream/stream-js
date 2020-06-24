export default class StreamFileStore {
  constructor(client, token) {
    this.client = client;
    this.token = token;
  }

  // React Native does not auto-detect MIME type, you need to pass that via contentType
  // param. If you don't then Android will refuse to perform the upload
  upload(uri, name, contentType) {
    return this.client.upload('files/', uri, name, contentType);
  }

  delete(uri) {
    return this.client.delete({
      url: `files/`,
      qs: { url: uri },
      signature: this.token,
    });
  }
}
