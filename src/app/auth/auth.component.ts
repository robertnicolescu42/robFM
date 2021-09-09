import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MainContentComponent } from '../main-content/main-content.component';

import { AuthResponseData, AuthService } from './auth.service';

@Injectable()
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private main: MainContentComponent
  ) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const username = form.value.username;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;
    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      (res) => {
        if (!this.isLoginMode) {
          const resData = res;
          // console.log('resData from auth: ' + resData);

          let formData: FormData = new FormData();
          formData.append('email', res.email);
          formData.append('username', username);

          var object: any = {};
          formData.forEach((value, key) => (object[key] = value));
          var json = JSON.stringify(object);

          this.http
            .post(
              'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/users/' +
                // res.localId +
                '.json',
              json,
              {
                params: new HttpParams().set('auth', res.idToken!),
              }
            )
            .subscribe();
        }
        // console.log(res);
        this.isLoading = false;
        this.router.navigate(['/main']);
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.error = errorMessage;

        this.isLoading = false;
      }
    );

    form.reset();
  }

  ngOnInit(): void {}
}
