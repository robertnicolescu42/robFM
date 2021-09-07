import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Album } from '../album.model';
import { exhaustMap, map, take } from 'rxjs/operators';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AlbumService } from '../shared/album.service';

@Injectable()
@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css'],
})
export class MainContentComponent implements OnInit {
  closeModal: string | undefined;
  isAuthenticated = false;
  userSub: Subscription | undefined;
  token: any;
  albums: Album[] = [];
  currentUserId: string = '';
  url: string =
    'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/albums.json';
  wishlist: any;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private router: Router,
    private authService: AuthService,
    private albumService: AlbumService
  ) {}

  getAlbums() {
    return this.albums.slice();
  }

  getAlbumRatingFn(album: Album) {
    return this.albumService.getAlbumRating(album);
  }

  fetchAlbums() {
    return this.authService.user
      .pipe(
        take(1),
        exhaustMap((user) => {
          if (user) {
            this.isAuthenticated = true;
            return this.http.get(this.url, {
              params: new HttpParams().set('auth', user.token!),
            });
          } else {
            this.isAuthenticated = false;
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
        console.log(albums);
        this.albums = albums;
      });
  }

  onDelete(albumId: string, albumName: string) {
    return this.http
      .delete(
        'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/albums/' +
          albumId +
          '.json/',
        {
          params: new HttpParams().set('auth', this.token!),
        }
      )
      .subscribe((responseData) => {
        console.log(responseData);
        this.ngOnInit();
      });
  }

  triggerModal(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (res: any) => {
          this.closeModal = `Closed with: ${res}`;
          // this.router.navigate(['main']);
          this.ngOnInit();
        },
        (res: any) => {
          this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
          this.router.navigate(['main']);
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    this.fetchAlbums();
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      if (user) {
        this.token = user.token;
        this.authService.getUserId(user.email);
        this.currentUserId = this.authService.userDBid;
      } else {
        this.token = '';
      }
    });
    console.log('main: ' + this.isAuthenticated);
  }

  wishlistAlbum(albumId: string) {
    let formData: FormData = new FormData();
    var json: string;
    this.userSub = this.authService.user.subscribe((user) => {
      this.authService.getUserId(user.email);
      console.log('main user id: ' + this.authService.userDBid);
    });

    formData.append('userId', this.currentUserId);
    formData.append('albumId', albumId);
    var object: any = {};
    formData.forEach((value, key) => (object[key] = value));
    json = JSON.stringify(object);

    return this.http
      .post(
        'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/wishlist/' +
          '.json',
        json,
        {
          params: new HttpParams().set('auth', this.token!),
        }
      )
      .subscribe((responseData) => {
        console.log(responseData);
        console.warn('The album has been added to the wishlist!');
      });
  }

  inWishlist(): boolean {
    return false;
  }
}
