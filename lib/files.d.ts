/// <reference types="node" />
import { StreamClient, OnUploadProgress } from './client';
export declare class StreamFileStore {
    client: StreamClient;
    token: string;
    constructor(client: StreamClient, token: string);
    /**
     * upload a File instance or a readable stream of data
     * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#upload
     * @param {File|Buffer|NodeJS.ReadStream|string} uri - File object or stream or URI
     * @param {string} [name] - file name
     * @param {string} [contentType] - mime-type
     * @param {function} [onUploadProgress] - browser only, Function that is called with upload progress
     * @return {Promise<FileUploadAPIResponse>}
     */
    upload(uri: string | File | Buffer | NodeJS.ReadStream, name?: string, contentType?: string, onUploadProgress?: OnUploadProgress): Promise<import("./client").FileUploadAPIResponse>;
    /**
     * delete an uploaded file
     * @link https://getstream.io/activity-feeds/docs/node/files_introduction/?language=js#delete
     * @param {string} uri
     */
    delete(uri: string): Promise<import("./client").APIResponse>;
}
//# sourceMappingURL=files.d.ts.map