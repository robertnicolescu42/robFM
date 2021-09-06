import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { exhaustMap, map, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlbumService } from '../shared/album.service';
import { Album } from '../album.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  isAuthenticated = false;
  userSub!: Subscription;
  url: string =
    'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/users.json';
  users: {
    email: string;
    username: string;
    admin?: boolean;
    id: string;
  }[] = [];
  isAdmin: boolean = false;
  token: any;
  currentUserId: string = '';
  currentUser: {
    email: string;
    username: string;
    admin?: boolean;
    id: string;
  } = {
    email: 'no email',
    username: 'no username',
    admin: false,
    id: 'no-id',
  };
  closeModal: string | undefined;
  albums: Album[] = [];
  likedAlbums: Album[] = [];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private modalService: NgbModal,
    private albumService: AlbumService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      console.log('user mail:' + user.email);

      this.checkUserType(user.email);

      if (user) {
        this.token = user.token;
      } else {
        this.token = '';
      }
    });
  }

  checkUserType(currentUserEmail: string) {
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
          const userArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              userArray.push({ ...responseData[key], id: key });
            }
          }
          return userArray;
        })
      )
      .subscribe((users) => {
        this.users = users;

        for (var user of users) {
          if (currentUserEmail == user.email) {
            console.log('user: ', user);

            this.currentUserId = user.id;
            this.currentUser = user;

            this.albumService.fetchLikedAlbums(this.currentUserId);
            this.likedAlbums = this.albumService.likedAlbums;
            if (user.admin == true) {
              this.isAdmin = true;
            } else {
              this.isAdmin = false;
            }
          }
        }
      });
  }

  triggerModal(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (res: any) => {
          this.closeModal = `Closed with: ${res}`;
          this.ngOnInit();
        },
        (res: any) => {
          this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
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

  //firebase needs cloud functions to delete any user other than
  //the current user, so here i can only delete the user's info from
  //the realtime database (firebase limitation)
  onDeleteUser(userId: string) {
    return this.http
      .delete(
        'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/users/' +
          userId +
          '.json/',
        {
          params: new HttpParams().set('auth', this.token!),
        }
      )
      .subscribe((responseData) => {
        console.log(responseData);
        // this.router.navigate(['main']);
        this.ngOnInit();
      });
  }

  getAlbumRatingFn(album: Album) {
    return this.albumService.getAlbumRating(album);
  }

  getUsers() {
    return this.users.slice();
  }

  // fetchLikedAlbums() {
  //   return this.authService.user
  //     .pipe(
  //       take(1),
  //       exhaustMap((user) => {
  //         if (user) {
  //           this.isAuthenticated = true;
  //           return this.http.get(this.url, {
  //             params: new HttpParams().set('auth', user.token!),
  //           });
  //         } else {
  //           this.isAuthenticated = false;
  //           return this.http.get(this.url);
  //         }
  //       }),
  //       map((responseData: any) => {
  //         const albumArray: Album[] = [];
  //         for (const key in responseData) {
  //           if (responseData.hasOwnProperty(key)) {
  //             albumArray.push({ ...responseData[key], id: key });
  //           }
  //         }
  //         //   this.albumData.albums = albumArray;
  //         return albumArray;
  //       })
  //     )
  //     .subscribe((albums) => {
  //       console.log(albums);
  //       //   this.albumData.albums = albums;
  //       this.albums = albums;
  //     });
  // }

  getLikedAlbums() {}

  getAlbums() {
    console.log('liked albums: ' + this.likedAlbums.slice());

    // return this.likedAlbums.slice();
  }
}
