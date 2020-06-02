import { HttpClient } from '@angular/common/http';
import { SCRUTINIZER_URL } from '../../env';

export class ScrutinizerService {

    constructor(private http: HttpClient) {

    }

    async requestPublicKey() {
        let res = await this.http.get(`${SCRUTINIZER_URL}/boxPublicKey`).toPromise()
        return res['key'];        
    }
    
}