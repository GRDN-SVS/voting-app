import { HttpClient } from '@angular/common/http';
import { SCRUTINIZER_URL } from '../../env';

export class ScrutinizerService {

    constructor(private http: HttpClient) {

    }

    requestPublicKey() {
        return this.http.get(`${SCRUTINIZER_URL}/publicKey`);
    }
    
}