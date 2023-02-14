/// <reference types="node" />
import { StreamClient, FileUploadAPIResponse, OnUploadProgress } from './client';
export declare type ImageProcessOptions = {
    crop?: string | 'top' | 'bottom' | 'left' | 'right' | 'center';
    h?: number | string;
    resize?: string | 'clip' | 'crop' | 'scale' | 'fill';
    w?: number | string;
};
export declare class StreamImageStore {
    client: StreamClient;
    token: string;
    constructor(client: StreamClient, token: string);
    /**
     * upload an Image File instance or a readable stream of data
     * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#upload
     * @param {File|Buffer|NodeJS.ReadStream|string} uri - File object or stream or URI
     * @param {string} [name] - file name
     * @param {string} [contentType] - mime-type
     * @param {function} [onUploadProgress] - browser only, Function that is called with upload progress
     * @return {Promise<FileUploadAPIResponse>}
     */
    upload(uri: string | File | Buffer | NodeJS.ReadStream, name?: string, contentType?: string, onUploadProgress?: OnUploadProgress): Promise<FileUploadAPIResponse>;
    /**
     * delete an uploaded image
     * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#delete
     * @param {string} uri
     */
    delete(uri: string): Promise<import("./client").APIResponse>;
    /**
     * Generate a diffrent variant of the uploaded image
     * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#image_processing
     * @param {string} uri
     * @param {ImageProcessOptions} options
     */
    process(uri: string, options: ImageProcessOptions): Promise<FileUploadAPIResponse>;
    /**
     * Generate a thumbnail for a given image
     * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#image_processing
     * @param {string} uri
     * @param {number|string} w
     * @param {number|string} h
     * @param {Object} [options]
     */
    thumbnail(uri: string, w: number | string, h: number | string, { crop, resize }?: {
        crop: string;
        resize: string;
    }): Promise<FileUploadAPIResponse>;
}
//# sourceMappingURL=images.d.ts.map