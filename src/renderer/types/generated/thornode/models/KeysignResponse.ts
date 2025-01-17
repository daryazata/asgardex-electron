// tslint:disable
/**
 * Thornode API
 * Thornode REST API.
 *
 * The version of the OpenAPI document: 1.97.2
 * Contact: devs@thorchain.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    KeysignInfo,
} from './';

/**
 * @export
 * @interface KeysignResponse
 */
export interface KeysignResponse {
    /**
     * @type {KeysignInfo}
     * @memberof KeysignResponse
     */
    keysign?: KeysignInfo;
    /**
     * @type {string}
     * @memberof KeysignResponse
     */
    signature?: string;
}
