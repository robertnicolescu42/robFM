import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { exhaustMap, map, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  }[] = [];
  isAdmin: boolean = false;
  currentUser: {
    email: string;
    username: string;
    admin?: boolean;
  } = {
    email: 'no email',
    username: 'no username',
    admin: false,
  };
  closeModal: string | undefined;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      // console.log('nav: ' + this.isAuthenticated);
      // console.log(user);
      this.checkUserType(user.email);
      // console.log('user.admin: ' + this.isAdmin);
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
          //   this.albumData.albums = albumArray;
          return userArray;
        })
      )
      .subscribe((users) => {
        // console.log(users);
        //   this.albumData.albums = albums;
        this.users = users;
        // console.log(currentUserEmail);

        for (var user of users) {
          if (currentUserEmail == user.email && user.admin == true) {
            // console.log('user.admin: ' + user.admin);
            this.isAdmin = true;
            this.currentUser = user;
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
          // this.router.navigate(['main']);
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
}
