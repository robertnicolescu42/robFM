export class Album {
    public name: string;
    public artist: string;
    public year: number;
    public rating: number;
    public cover: string;
    public id: string

    constructor(name: string, artist: string, year: number, rating: number, cover: string, id: string){
        this.name = name;
        this.artist = artist
        this.year = year;
        this.rating = rating;
        this.cover = cover;
        this.id = id;
    }
}