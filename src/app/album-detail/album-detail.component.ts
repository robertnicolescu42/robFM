import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Environment } from '../environment';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css'],
})
export class AlbumDetailComponent implements OnInit {
  startAlbum!: { id: string };
  album: any;
  lastFMurl: string | undefined;
  additionalAlbumData: any;
  messages: JSON | undefined;
  url: string =
    'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/albums/';
  albumSummary: string =
    'There is no additional description about this album available.';
  stringifiedData: any;
  parsedJSON: any;
  listeners: number = 0;
  artistLink: string = '';
  albumLink: any;
  playCount: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    // private albums: MainContentComponent,
    private environmentVars: Environment
  ) {}

  ngOnInit(): void {
    this.startAlbum = {
      id: this.route.snapshot.params['id'],
    };

    this.album = this.http
      .get(this.url + this.startAlbum.id + '.json')
      .subscribe((responseData) => {
        // console.log(responseData);
        if (responseData) {
          this.album = responseData;

          this.lastFMurl =
            'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=' +
            this.environmentVars.lastFMApiKey +
            '&artist=' +
            this.album.artist.split(' ').join('+') +
            '&album=' +
            this.album.name.split(' ').join('+') +
            '&format=json';

          this.artistLink =
            'https://last.fm/music/' + this.album.artist.split(' ').join('+');

          this.additionalAlbumData = this.http
            .get(this.lastFMurl)
            .subscribe((responseData) => {
              // console.log(responseData);

              this.parseData(responseData);
            });
        }
      });
  }

  parseData(responseData: any) {
    this.stringifiedData = JSON.stringify(responseData);
    this.parsedJSON = JSON.parse(this.stringifiedData);
    // console.log(this.stringifiedData);
    this.listeners = this.parsedJSON.album.listeners;
    this.playCount = this.parsedJSON.album.playcount;
    this.albumLink = this.parsedJSON.album.url;
    this.albumSummary = this.parsedJSON.album.wiki.summary;
  }

  // this.album = this.albums.filter(function(album) {
  //   return album.id == this.startAlbum.id;
  // })
}
