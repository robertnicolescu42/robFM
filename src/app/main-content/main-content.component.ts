import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Component,
  Injectable,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Album } from '../album.model';
import { exhaustMap, map, take } from 'rxjs/operators';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css'],
})
export class MainContentComponent implements OnInit, OnDestroy {
  closeModal: string | undefined;
  isAuthenticated = false;
  userSub: Subscription | undefined;

  albums: Album[] = [];
  url: string =
    'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/albums.json';

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private router: Router,
    private authService: AuthService // private route: ActivatedRoute, // private nav: NavbarComponent
  ) {}

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

  onDelete(albumId: string, albumName: string) {
    // this.triggerModal('Deleted ' + albumName);
    return this.http
      .delete(
        'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/albums/' +
          albumId +
          '.json/'
      )
      .subscribe((responseData) => {
        console.log(responseData);
        // this.router.navigate(['main']);
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

  // onLogout() {
  //   this.isAuthenticated = false;
  //   // this.authService.user.next(null!);
  //   // this.ngOnDestroy();
  // }

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
    // this.isAuthenticated = this.nav.isAuthenticated;
    this.fetchAlbums();
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
    console.log('main: ' + this.isAuthenticated);
  }

  ngOnDestroy() {
    // if (this.userSub != null) {
    //   this.userSub.unsubscribe();
    // }
  }
}
