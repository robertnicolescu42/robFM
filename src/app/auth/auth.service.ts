import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, exhaustMap, map, take, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';

import { Environment } from '../environment';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  username: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedIn = false;
  user = new BehaviorSubject<User>(null!);
  private tokenExpirationTimer: any;
  url: string =
    'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/users.json';
  userDBid = '';
  isAdmin: boolean = false;
  constructor(private http: HttpClient, private env: Environment) {}

  signup(emailSub: string, passwordSub: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          this.env.firebaseApiKey,
        {
          email: emailSub,
          password: passwordSub,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(emailSub: string, passwordSub: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          this.env.firebaseApiKey,
        {
          email: emailSub,
          password: passwordSub,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.loggedIn = true;
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  logout() {
    this.loggedIn = false;
    this.user.next(null!);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  autoLogin() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      return;
    }
    const parsedData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(userData);
    const loadedUser = new User(
      parsedData.email,
      parsedData.id,
      parsedData._token,
      new Date(parsedData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(parsedData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error has occured';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists';
        break;

      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        errorMessage = 'This email or password is wrong';
        break;
    }

    return throwError(errorMessage + '.');
  }

  isAuthenticated() {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.loggedIn);
      }, 800);
    });
    return promise;
  }

  getUserId(email: string) {
    return this.user
      .pipe(
        take(1),
        exhaustMap((user) => {
          if (user) {
            return this.http.get(this.url, {
              params: new HttpParams().set('auth', user.token!),
            });
          } else {
            return this.http.get(this.url);
          }
        }),
        map((responseData: any) => {
          const userArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              userArray.push({ ...responseData[key], id: key });
            }
          }

          return userArray;
        })
      )
      .subscribe((users) => {
        for (var user of users) {
          if (email == user.email) {
            this.userDBid = user.id;
          }
        }
      });
  }

  checkUserType(currentUserEmail: string) {
    return this.user
      .pipe(
        take(1),
        exhaustMap((user) => {
          if (user) {
            return this.http.get(
              'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/users.json',
              {
                params: new HttpParams().set('auth', user.token!),
              }
            );
          } else {
            return this.http.get(
              'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/users.json'
            );
          }
        }),
        map((responseData: any) => {
          const userArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              userArray.push({ ...responseData[key], id: key });
            }
          }
          return userArray;
        })
      )
      .subscribe((users) => {
        for (var user of users) {
          // console.log(user);
          
          if (currentUserEmail == user.email) {
            //still working on the logic
            if (user.admin == true) {
              // console.log("is admin");
              this.isAdmin = true;
            } else {
              this.isAdmin = false;
            }
            break;
          }
        }
      });
  }

  getAdminStatus(email: string) {
    this.checkUserType(email);
    return this.isAdmin;
  }
}
