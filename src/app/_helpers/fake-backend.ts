import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { dummyGroup, dummyEmployee } from '@app/_dummy';
import { isNullOrEmpty } from './utlis';
const usersKey = 'users-key';
let users: any[] = JSON.parse(localStorage.getItem(usersKey)!) || [
    {
        id: 1,
        username: "admin",
        password: "admin",
        firstName: "John",
        lastName: "Doe"
    }
];



@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/summary') && method === 'GET':
                    return getSummary();

                case url.indexOf("api/group") > -1 && method === 'GET':
                    return getListGroup();

                case url.indexOf("api/employee") > -1 && method === 'GET':
                    return getListEmployee();

                case url.indexOf("api/detail/employee") > -1 && method === 'GET':
                    return getDetailEmployee();
                case url.indexOf("api/update/employee") > -1 && method === 'POST':
                    return updateEmployee();
                case url.indexOf("api/create/employee") > -1 && method === 'POST':
                    return createEmployee();
                case url.indexOf("api/delete/employee") > -1 && method === 'DELETE':
                    return deleteEmployee();

                default:
                    return next.handle(request);
            }
        }

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                ...basicDetails(user),
                token: 'fake-jwt-token'
            })
        }

        function getSummary() {
            if (!isLoggedIn()) return unauthorized();
            const response: any[] = [];
            dummyGroup.map((_group: any) => {
                response.push({
                    counter: dummyEmployee.filter(emp => emp.group == _group.id).length,
                    name: _group.name
                })
            })
            return ok(response);
        }

        function getListEmployee() {
            if (!isLoggedIn()) return unauthorized();
            let employees = dummyEmployee;
            let queryParam = {
                limit: getParameterByName('limit', url),
                page: getParameterByName('page', url),
                sort: getParameterByName('sort', url),
                search: getParameterByName('search', url),
                filter: getParameterByName('filter', url)
            }
            if (queryParam.search) {
                let tempEmployee: any = []
                employees.map((emp: any) => {
                    if (checkMatchValue(`${emp.firstName.toLowerCase()} ${emp.lastName.toLowerCase()}`, queryParam?.search?.toLowerCase())) {
                        tempEmployee.push(emp)
                    }
                })
                employees = tempEmployee
            }
            if (queryParam.filter) {
                let filter = JSON.parse(queryParam.filter)
                let keys = Object.keys(filter)
                employees = employees.filter(function (el: any) {
                    let filtered = true
                    keys.forEach((key: any) => {
                        if (filtered && filter[key].includes(el[key])) {
                            filtered = true
                        } else {
                            filtered = false
                        }
                    });
                    return filtered
                });
            }
            if (queryParam.sort) {
                let sortData = JSON.parse(queryParam.sort)
                let sortKeys = Object.keys(sortData)
                let lastKey: any = (sortKeys.length - 1)
                let key: any = sortKeys[lastKey]
                let sortType = sortData[key]
                if (key == 'name') {
                    key = "firstName"
                } else {
                    key = sortKeys[key]
                }
                employees = sortBy(employees, key, sortType.toLowerCase())
            }

            const offset = Number(queryParam.limit) * (Number(queryParam.page) - 1);
            const paginatedItems = employees.slice(offset, Number(queryParam.limit) * Number(queryParam.page));
            paginatedItems.map((data: any) => {
                let groupData = dummyGroup.find(grp => grp.id == data.group)
                data.groupName = groupData?.name
            })
            const response = {
                data: paginatedItems,
                total: dummyEmployee.length,
                totalPage: Math.ceil(employees.length / Number(queryParam.limit))
            }


            return ok(response);
        }

        function updateEmployee() {
            if (!isLoggedIn()) return unauthorized();
            const urlParts = url.split('/');
            const username = urlParts[urlParts.length - 1]

            if (username != body.username) {
                const existUsername = dummyEmployee.find(emp => emp.username == body.username)
                if (existUsername) return error('Username already taken');
            }

            const existEmail = dummyEmployee.find(emp => emp.email == body.email && emp.username != username)
            if (existEmail) return error('Email already registered');

            const indexCurrentUser = dummyEmployee.findIndex(emp => emp.username == username)
            if (indexCurrentUser < 0) return error("not found username")

            dummyEmployee[indexCurrentUser] = body

            return ok()
        }
        function createEmployee() {
            if (!isLoggedIn()) return unauthorized();
            const existUsername = dummyEmployee.find(emp => emp.username == body.username)
            if (existUsername) return error('Username already taken');

            const existEmail = dummyEmployee.find(emp => emp.email == body.email)
            if (existEmail) return error('Username already registered');

            dummyEmployee.push(body)
            return ok()

        }
        function deleteEmployee() {
            const urlParts = url.split('/');
            const username = urlParts[urlParts.length - 1]
            const indexCurrentUser = dummyEmployee.findIndex(emp => emp.username == username)
            if (indexCurrentUser < 0) return error("not found username")
            dummyEmployee.splice(indexCurrentUser, 1);
            return ok()
        }

        function getDetailEmployee() {
            if (!isLoggedIn()) return unauthorized();
            const urlParts = url.split('/');
            const username = urlParts[urlParts.length - 1]
            const employee = dummyEmployee.find(emp => emp.username === username);
            return ok(employee);
        }

        function checkMatchValue(str: any, keyword: any) {
            if (!isNullOrEmpty(str.match(keyword)) && str.match(keyword).length > 0) {
                return true
            }
            return false
        }

        function getParameterByName(name: string, url: string) {
            if (!url) {
                url = window.location.href;
            }
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        };

        function sortBy(array: any, key: any, sort = "desc") {
            if (sort == "desc") {
                return array.sort((a: any, b: any) => b[key].localeCompare(a[key]))
            }
            return array.sort((a: any, b: any) => a[key].localeCompare(b[key]))
        }

        function getListGroup() {
            if (!isLoggedIn()) return unauthorized();
            return ok(dummyGroup);
        }


        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500));
        }

        function error(message: string) {
            return throwError(() => ({ error: { message } }))
                .pipe(materialize(), delay(500), dematerialize());
        }

        function unauthorized() {
            return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } }))
                .pipe(materialize(), delay(500), dematerialize());
        }

        function basicDetails(user: any) {
            const { id, username, firstName, lastName } = user;
            return { id, username, firstName, lastName };
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};