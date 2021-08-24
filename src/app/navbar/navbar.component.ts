import { Component, Injectable, OnInit } from '@angular/core';
import { AddAlbumComponentComponent } from '../add-album-component/add-album-component.component';
import { MainContentComponent } from '../main-content/main-content.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  displayButton: boolean = true;
  constructor(private mainContent: MainContentComponent, private add: AddAlbumComponentComponent) {}

  ngOnInit(): void {}

  onGetData() {
    this.mainContent.fetchAlbums();
  }

  onSaveData() {
    this.mainContent.storeAlbums();
  }

  // getEditMode() {
  //   return this.add.editMode;
  // }
}
