import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { exhaustMap, map, take } from 'rxjs/operators';
import { Album } from '../album.model';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AlbumService {
  albums: unknown;
  likedAlbums: Album[] = [];
  url: string =
    'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/albums.json';

  getAlbumRating(album: {
    name: string;
    artist: string;
    year: number;
    rating: number;
    cover: string;
  }) {
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
          //   this.albumData.albums = albumArray;
          return albumArray;
        })
      )
      .subscribe((albums) => {
        //   this.albumData.albums = albums;
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
        console.log('userId: ' + userId);
        
        for (var item of wishlist) {
          console.log('item.userId: ' + item.userId);
          console.log(item);

          if (userId == item.userId) {
            this.likedAlbums.push(item.albumId);
          }
        }
        console.log(this.likedAlbums);
      });
  }
}
