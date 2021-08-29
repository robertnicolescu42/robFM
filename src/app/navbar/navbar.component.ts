import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { MainContentComponent } from '../main-content/main-content.component';

@Injectable({providedIn: 'root'})
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userSub!: Subscription;

  constructor(private authService: AuthService, private mainContent: MainContentComponent) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      // this.isAuthenticated = !user ? false: true;
      this.isAuthenticated = !!user;
      console.log("nav: " + this.isAuthenticated);
      this.mainContent.isAuthenticated = this.isAuthenticated;
    });
  }

  onLogout(){
    this.authService.logout();
    // this.mainContent.isAuthenticated = false;
    // console.log(this.mainContent);
    
    // this.isAuthenticated = false;
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  // onGetData() {
  //   this.mainContent.fetchAlbums();
  // }

  // onSaveData() {
  //   this.mainContent.storeAlbums();
  // }

  // getEditMode() {
  //   return this.add.editMode;
  // }
}
