import * as _ from 'lodash';
import * as forge from 'node-forge';
import * as CryptoJS from 'crypto-js';
import { HttpRequest } from '@angular/common/http';

import { encryptionAPIsConst } from '../const/encryption-apis.const';
import { miscellaneousConst } from '../const/miscellaneous.const';

/**
 * @description Remove text headers and trailers from the RSA key
 */
export function removeHeaderTrailerFromKey(key: string): string {
    key = key.replace('-----BEGIN PUBLIC KEY-----', '');
    key = key.replace('-----END PUBLIC KEY-----', '');
    key = key.replace('-----BEGIN PRIVATE KEY-----', '');
    key = key.replace('-----END PRIVATE KEY-----', '');
    key = key.replace(/\r/g, ''); // MUST HAVE
    key = key.replace(/\n/g, ''); // MUST HAVE
    return key.trim();
}

/**
 * @description Main method to start encryption of RSA public key
 */
export function updateKey(keyOriginal: string): string {
    let key = _.cloneDeep(keyOriginal);

    const lengthOfKey = key.length;

    const K = Math.trunc((lengthOfKey / 10)); // Quotient

    let a = 2;
    let value = K;

    while (value < lengthOfKey) {
        key = changeCharacterAlgorithm(key, value, K);
        value = K * a;
        a++;
    }

    key = customTextToKey(key);

    return key;
}

/**
 * @description Change character based on custom logic
 */
function changeCharacterAlgorithm(key: string, value: number, K: number): string {
    const char = key[value];
    return replaceAt(key, value, replaceCharacterFromASCII(char, K));
}

/**
 * @description Replace character based on custom logic of ASCII code
 */
function replaceCharacterFromASCII(char: string, K: number): string {
    const minimum = 33;
    const maximum = 126;
    const charASCII = char.charCodeAt(0);
    let changedCharacter = charASCII + K;

    while (changedCharacter > maximum) {
        changedCharacter -= maximum;
        changedCharacter += minimum;
    }
    return String.fromCharCode(changedCharacter);
}

/**
 * @description To replace a character in string at specified place
 */
function replaceAt(str: string, index: number, newChar: string): string {
    function replacer(origChar, strIndex): any {
        if (strIndex === index) {
            return newChar;
        } else {
            return origChar;
        }
    }
    return str.replace(/./g, replacer);
}

/**
 * @description Add custom key to the key
 */
function customTextToKey(key: string): string {
    const str = miscellaneousConst.encryptCloudLabs;
    let changedCharacter = '';
    const strCharArray = str[Symbol.iterator]();
    for (const char of strCharArray) {
        changedCharacter += processCustomTextChracter(char);
    }
    return key + changedCharacter;
}

/**
 * @description process each character for custom text
 */
function processCustomTextChracter(char: string): string {
    const minimum = 33;
    const maximum = 126;
    let charASCII = char.charCodeAt(0);
    if (charASCII % 2 === 0) {
        charASCII += 5;
    } else {
        charASCII += 9;
    }
    while (charASCII > maximum) {
        charASCII -= maximum;
        charASCII += minimum;
    }
    return String.fromCharCode(charASCII);
}

/**
 * @description Decrypt API response using RSA private key and decrypt main content using AES
 */
export function decryptBackendResponse(encryptedContent: any, originalPrivateKey: string): any {
    const parsedEncryptedContent =  atob(encryptedContent);
    const array =  Uint8Array.from(parsedEncryptedContent, b => b.charCodeAt(0));

    const encryptedAESKey = array.slice(encryptionAPIsConst.keyIndex0, encryptionAPIsConst.keyIndex1);
    const encryptedAESIV = array.slice(encryptionAPIsConst.keyIndex1, encryptionAPIsConst.keyIndex2);
    const encryptedAESContent = array.slice(encryptionAPIsConst.keyIndex2, array.length);
    const AESContentBase64 = btoa(String.fromCharCode(...encryptedAESContent));

    const decryptRsa = forge.pki.privateKeyFromPem(originalPrivateKey);
    const decryptedAESKey = decryptRsa.decrypt(encryptedAESKey);
    const decryptedAESIV = decryptRsa.decrypt(encryptedAESIV);

    const parsedKey = CryptoJS.enc.Base64.parse(btoa(decryptedAESKey));
    const parsedIV = CryptoJS.enc.Base64.parse(btoa(decryptedAESIV));

    const decrypted = CryptoJS.AES.decrypt(AESContentBase64, parsedKey, {
        iv: parsedIV,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    }).toString(CryptoJS.enc.Utf8);

    return JSON.parse(decrypted);
}

/**
 * @description To check when Encryption public key needs to be added in HTTP call
 */
export function shouldEncryptionPublicKeyAdded(request: HttpRequest<any>): boolean {
    if (request.url.search(encryptionAPIsConst.sections) !== -1 || request.url.search(encryptionAPIsConst.result) !== -1 ) {
        if (!(request.url.search(encryptionAPIsConst.shouldNotInclude.inProgress) !== -1 ||
            request.url.search(encryptionAPIsConst.shouldNotInclude.labDetails) !== -1 ||
            request.url.search(encryptionAPIsConst.shouldNotInclude.submit) !== -1)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}





