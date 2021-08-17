import { Component, OnInit } from '@angular/core';
import { MainContentComponent } from '../main-content/main-content.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private mainContent: MainContentComponent) {}

  ngOnInit(): void {}

  onGetData() {
    this.mainContent.fetchAlbums();
  }

  onSaveData() {
    this.mainContent.storeAlbums();
  }
}
