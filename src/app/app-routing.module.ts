import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAlbumComponentComponent } from './add-album-component/add-album-component.component';
import { AlbumDetailComponent } from './album-detail/album-detail.component';
import { AuthComponent } from './auth/auth.component';
import { MainContentComponent } from './main-content/main-content.component';

const routes: Routes = [
  { path: 'add', component: AddAlbumComponentComponent },
  { path: 'edit/:id', component: AddAlbumComponentComponent },
  { path: 'main', component: MainContentComponent },
  { path: 'album/:id', component: AlbumDetailComponent },
  { path: 'auth', component: AuthComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
