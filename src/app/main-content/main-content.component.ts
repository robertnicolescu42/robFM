import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Album } from '../album.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css'],
})
export class MainContentComponent implements OnInit {
  albums: Album[] = [
    //   {
    //     name: 'The Social Network',
    //     artist: 'Trent Reznor and Atticus Ross',
    //     year: 2010,
    //     rating: 10,
    //     cover: 'https://upload.wikimedia.org/wikipedia/en/1/17/TSN-cover-CD.jpg',
    //   },
    //   {
    //     name: 'Lamentations',
    //     artist: 'William Basinski',
    //     year: 2020,
    //     rating: 8,
    //     cover: 'https://f4.bcbits.com/img/a2967895462_10.jpg',
    //   },
    //   {
    //     name: 'Demon Days',
    //     artist: 'Gorillaz',
    //     year: 2005,
    //     rating: 4.5,
    //     cover:
    //       'https://upload.wikimedia.org/wikipedia/en/d/df/Gorillaz_Demon_Days.PNG',
    // }
  ];
  // albums: Album[] = [];
  url: string =
    'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/albums.json';

  constructor(private http: HttpClient) {}
  getAlbums() {
    return this.albums.slice();
  }

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

  storeAlbums() {
    const albums = this.getAlbums();
    this.http.put(this.url, albums).subscribe((response) => {
      console.log(response);
    });
  }

  fetchAlbums() {
    this.http
      .get(this.url)
      .pipe(
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
        console.log(albums);
        //   this.albumData.albums = albums;
        this.albums = albums;
      });
  }

  onDelete(albumId: string) {
    return this.http
      .delete('https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/albums/' + albumId + '.json/')
      .subscribe((responseData) => console.log(responseData));
  }

  ngOnInit(): void {
    this.fetchAlbums();
  }
}
