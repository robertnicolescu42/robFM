import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlbumService {
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
}
