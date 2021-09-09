import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { MainContentComponent } from '../main-content/main-content.component';

@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  userSub!: Subscription;
  onLoginPage: boolean = false;

  constructor(
    private authService: AuthService,
    private mainContent: MainContentComponent,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      // this.isAuthenticated = !user ? false: true;
      this.isAuthenticated = !!user;
      // console.log('nav: ' + this.isAuthenticated);
      this.mainContent.isAuthenticated = this.isAuthenticated;
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/main']);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  getLoginRoute() {
    if(this.router.url == '/auth') {
      return true;
    }
    return false;
  }
}
