import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Summary } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class GlobalService {

    constructor(
        private http: HttpClient
    ) { }

    getSummary() {
        return this.http.get<Summary[]>(`${environment.apiUrl}/summary`);
    }
}