import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-add-album-component',
  templateUrl: './add-album-component.component.html',
  styleUrls: ['./add-album-component.component.css'],
})
export class AddAlbumComponentComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}
  editAlbum!: { id: string } | any;
  editMode: boolean = false;
  url: string =
    'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/albums.json';
  albumForm!: FormGroup;
  forbiddenTitles = ['googa', 'abooga'];

  ngOnInit(): void {
    this.editAlbum = {
      id: this.route.snapshot.params['id'],
    };

    this.albumForm = new FormGroup({
      name: new FormControl('name'),
      artist: new FormControl('artist'),
      year: new FormControl('year'),
      cover: new FormControl('cover'),
      rating: new FormControl('rating'),
    });
    this.albumForm.reset();

    if (this.editAlbum.id) {
      console.log('edit mode true');
      this.editMode = true;

      this.editAlbum = this.http
        .get(
          'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/albums/' +
            this.editAlbum.id +
            '.json'
        )
        .subscribe((responseData) => {
          console.log(responseData);
          if (responseData) {
            this.editAlbum = responseData;
            this.albumForm = new FormGroup({
              name: new FormControl(this.editAlbum.name),
              artist: new FormControl(this.editAlbum.artist),
              year: new FormControl(this.editAlbum.year),
              cover: new FormControl(this.editAlbum.cover),
              rating: new FormControl(this.editAlbum.rating),
            });
          }
        });
    }
  }

  newAlbum() {
    if (this.editMode) {
      this.http
        .put(
          'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/albums/' +
            this.route.snapshot.params['id'] +
            '.json',
          this.albumForm.value
        )
        .subscribe((responseData) => {
          console.log('the album was updated!', this.albumForm.value);
          console.log(
            'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/albums/' +
              this.route.snapshot.params['id'] +
              '.json',
            this.albumForm.value
          );
        });
    } else {
      this.http
        .post(this.url, this.albumForm.value)
        .subscribe((responseData) => {
          console.log(responseData);
          console.warn(
            'The album has been added succesfully!',
            this.albumForm.value
          );
        });
      this.albumForm.reset();
    }
  }
}
