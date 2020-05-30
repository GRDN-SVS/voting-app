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
    seal(content, nonce, otherPublicKey) {
        return box(content, nonce, otherPublicKey, this.privateKey);
    }

    getIdAndNonce() {
        const req = this.http.get(`${NET_URL}/getNonce`).subscribe(
            res => {
                if (res['error'] == undefined) {
                    return res; // Return JSON with id and nonce
                }
                else {
                    return res;
                }
            }
        );
    }
}