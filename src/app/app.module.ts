import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainContentComponent } from './main-content/main-content.component';
import { MatIconModule } from '@angular/material/icon';
import { AddAlbumComponentComponent } from './add-album-component/add-album-component.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlbumDetailComponent } from './album-detail/album-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainContentComponent,
    AddAlbumComponentComponent,
    AlbumDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [MainContentComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
