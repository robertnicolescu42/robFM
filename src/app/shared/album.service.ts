import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, take } from 'rxjs/operators';
import { Album } from '../album.model';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AlbumService {
  albums: Album[] = [];
  likedAlbums: Album[] = [];
  url: string =
    'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/albums.json';

  getAlbumRating(album: Album) {
    return {
      'list-group-item-success': album.rating >= 9,
      'list-group-item-warning': album.rating >= 5 && album.rating < 9,
      'list-group-item-danger': album.rating < 5,
    };
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchAlbums() {
    return this.authService.user
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
          const albumArray: Album[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              albumArray.push({ ...responseData[key], id: key });
            }
          }
          return albumArray;
        })
      )
      .subscribe((albums) => {
        this.albums = albums;
      });
  }

  fetchLikedAlbums(userId: string) {
    this.fetchAlbums();
    return this.authService.user
      .pipe(
        take(1),
        exhaustMap((user) => {
          if (user) {
            return this.http.get(
              'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/wishlist.json',
              {
                params: new HttpParams().set('auth', user.token!),
              }
            );
          } else {
            return this.http.get(
              'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/wishlist.json'
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
      .subscribe((wishlist) => {
        for (var item of wishlist) {
          if (userId == item.userId) {
            this.likedAlbums.push(item.albumId);
          }
        }
      });
  }
}
