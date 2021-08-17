import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAlbumComponentComponent } from './add-album-component/add-album-component.component';
import { AlbumDetailComponent } from './album-detail/album-detail.component';
import { MainContentComponent } from './main-content/main-content.component';

const routes: Routes = [
  { path: 'add', component: AddAlbumComponentComponent },
  { path: 'main', component: MainContentComponent },
  { path: 'album/:id', component: AlbumDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
