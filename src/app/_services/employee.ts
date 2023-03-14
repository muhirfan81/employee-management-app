import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Employee, Summary } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class EmployeeService {

    constructor(
        private http: HttpClient
    ) { }

    getEmployeeList(params: any) {
        var query = new URLSearchParams(params);
        return this.http.get<Summary[]>(`${environment.apiUrl}/api/employee?${query.toString()}`);
    }

    getEmployeeByUsername(username: any) {
        return this.http.get<Summary[]>(`${environment.apiUrl}/api/detail/employee/${username}`);
    }
    updateEmployee(username: any, body: Employee) {
        return this.http.post<Employee>(`${environment.apiUrl}/api/update/employee/${username}`, body);
    }
    createEmployee(body: Employee) {
        return this.http.post<Employee>(`${environment.apiUrl}/api/create/employee`, body);
    }
    deleteEmployee(username: any) {
        return this.http.delete<Employee>(`${environment.apiUrl}/api/delete/employee/${username}`);
    }

    getListGroup() {
        return this.http.get<Summary[]>(`${environment.apiUrl}/api/group`);
    }

}