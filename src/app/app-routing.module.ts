import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAlbumComponentComponent } from './add-album-component/add-album-component.component';
import { AlbumDetailComponent } from './album-detail/album-detail.component';
import { AuthGuard } from './auth/auth-guard.service';
import { AuthComponent } from './auth/auth.component';
import { MainContentComponent } from './main-content/main-content.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: '', component: MainContentComponent },
  { path: 'main', component: MainContentComponent },
  {
    path: 'add',
    component: AddAlbumComponentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:id',
    component: AddAlbumComponentComponent,
    canActivate: [AuthGuard],
  },
  { path: 'album/:id', component: AlbumDetailComponent },
  { path: 'auth', component: AuthComponent },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
