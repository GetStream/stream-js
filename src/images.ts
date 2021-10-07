import { StreamClient, FileUploadAPIResponse, OnUploadProgress } from './client';

export type ImageProcessOptions = {
  crop?: string | 'top' | 'bottom' | 'left' | 'right' | 'center';
  h?: number | string;
  resize?: string | 'clip' | 'crop' | 'scale' | 'fill';
  w?: number | string;
};

export class StreamImageStore {
  client: StreamClient;

  token: string;

  constructor(client: StreamClient, token: string) {
    this.client = client;
    this.token = token;
  }

  // React Native does not auto-detect MIME type, you need to pass that via contentType
  // param. If you don't then Android will refuse to perform the upload
  /**
   * upload an Image File instance or a readable stream of data
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
    return this.client.upload('images/', uri, name, contentType, onUploadProgress);
  }

  /**
   * delete an uploaded image
   * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#delete
   * @param {string} uri
   */
  delete(uri: string) {
    return this.client.delete({
      url: `images/`,
      qs: { url: uri },
      token: this.token,
    });
  }

  /**
   * Generate a diffrent variant of the uploaded image
   * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#image_processing
   * @param {string} uri
   * @param {ImageProcessOptions} options
   */
  process(uri: string, options: ImageProcessOptions) {
    const params = Object.assign(options, { url: uri });
    if (Array.isArray(params.crop)) {
      params.crop = params.crop.join(',');
    }

    return this.client.get<FileUploadAPIResponse>({
      url: `images/`,
      qs: params,
      token: this.token,
    });
  }

  /**
   * Generate a thumbnail for a given image
   * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#image_processing
   * @param {string} uri
   * @param {number|string} w
   * @param {number|string} h
   * @param {Object} [options]
   */
  thumbnail(
    uri: string,
    w: number | string,
    h: number | string,
    { crop, resize } = { crop: 'center', resize: 'clip' },
  ) {
    return this.process(uri, { w, h, crop, resize });
  }
}
