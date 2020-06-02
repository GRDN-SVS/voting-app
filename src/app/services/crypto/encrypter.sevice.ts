import { box } from 'tweetnacl';
import { HttpClient } from '@angular/common/http';
import { NET_URL } from '../../env';

export class Encrypter {
    
    publicKey;
    privateKey;

    /**
     * Creates a new Encrypter instance, which contains a pair of
     * public and secret keys.
     */
    constructor(private http: HttpClient) {
        const keyPair = box.keyPair();

        this.publicKey = keyPair.publicKey;
        this.privateKey = keyPair.secretKey;
    }

    /**
     * Encrypts the specified content using the given nonce, the
     * recipients secret key and this intances public key.
     * 
     * @param content the content that will be encrypted. 
     * @param nonce the nonce used to encrypt the content.
     * @param otherPublicKey public key from the recipient.
     */
    seal(content, nonce: Uint8Array, otherPublicKey: Uint8Array) {
        let arr = [];
        arr.push(content);
        return box(Uint8Array.from(arr), Uint8Array.from(nonce), Uint8Array.from(otherPublicKey), Uint8Array.from(this.privateKey));
    }

    async getIdAndNonce() {
        const res = await this.http.get(`${NET_URL}/forward`).toPromise()

        if (res['error'] == undefined) {
            return res; // Return JSON with id and nonce
        }
        else {
            return res;
        }
    }
}