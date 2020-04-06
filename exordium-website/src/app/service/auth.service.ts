import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

// Variables
import { API } from './shared/api';
import { User } from './shared/user';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private endpoint = new API().endpoint;
    private headers = new API().headers;
    public getCurrentUser = {};

    constructor (
        private http: HttpClient,
        public router: Router
    ) { }

    // Handle Errors
    handleError (error: HttpErrorResponse) {
        let msg = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            msg = error.error.message;
        } else {
            // server-side error
            msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        return throwError(msg);
    }

    // Register Account
    register (user: User): Observable<any> {
        let api = `${this.endpoint}/auth/register`;
        
        return this.http.post (api, user).pipe(
            catchError(this.handleError)
        )
    }

    // Sign in
    signin (user: User): Observable<any> {
        let api = `${this.endpoint}/auth/signin`; 

        return this.http.post (api, user).pipe(
            catchError(this.handleError)
        )
    }

    // Sign out
    signout () {
        let removeToken = localStorage.removeItem('access_token');
        if (removeToken == null) {
            this.router.navigate(['members/signin']);
        }
    }

    // User Profile
    getUserProfile (id): Observable<any> {
        let api = `${this.endpoint}/auth/user/${id}`;
        return this.http.get(api, { headers: this.headers }).pipe(
            map(
                (res: Response) => {
                    return res || {}
                }
            ),
            catchError(this.handleError)
        )
    }

    // Get User Token
    getToken () {
        return localStorage.getItem('access_token');
    }

    currentUser (): Observable<any> {
        let api = `${this.endpoint}/auth/user/me`;
        return this.http.get(api, { headers: this.headers }).pipe(
            map(
                (res: Response) => {
                    return res || {};
                }
            ),
            catchError(this.handleError)
        )
    }

    // Are we logged in?
    get isSignedIn(): boolean {
        let authToken = localStorage.getItem('access_token');
        return (authToken !== null) ? true: false;
    }
}