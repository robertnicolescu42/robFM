import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainContentComponent } from '../main-content/main-content.component';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css'],
})
export class AlbumDetailComponent implements OnInit {
  startAlbum!: { id: string };
  album: any;
  url: string =
    'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/albums/';
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private albums: MainContentComponent
  ) {}

  ngOnInit(): void {
    this.startAlbum = {
      id: this.route.snapshot.params['id'],
    };

    this.album = this.http
      .get(this.url + this.startAlbum.id + '.json')
      .subscribe((responseData) => {
        console.log(responseData);
        if (responseData) {
          this.album = responseData;
        }
      });

    // this.album = this.albums.filter(function(album) {
    //   return album.id == this.startAlbum.id;
    // })
  }
}
