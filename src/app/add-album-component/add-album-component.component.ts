import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Album } from '../album.model';

@Component({
  selector: 'app-add-album-component',
  templateUrl: './add-album-component.component.html',
  styleUrls: ['./add-album-component.component.css'],
})
export class AddAlbumComponentComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  url: string =
    'https://ng-complete-guide-c4d72-default-rtdb.europe-west1.firebasedatabase.app/albums.json';
  albumForm!: FormGroup;
  forbiddenTitles = ['googa', 'abooga'];

  ngOnInit(): void {
    this.albumForm = new FormGroup({
      name: new FormControl('name'),
      artist: new FormControl('artist'),
      year: new FormControl('year'),
      cover: new FormControl('cover'),
      rating: new FormControl('rating'),
    });
    this.albumForm.reset();
  }

  newAlbum() {
    console.warn('The album has been added succesfully!', this.albumForm.value);
    this.http.post(this.url, this.albumForm.value).subscribe((responseData) => {
      console.log(responseData);
    });
    this.albumForm.reset();
  }
}
