

export interface FilmFilterDto {
  IDFilm?: number;
  title?: string;
  year?: number;
  genre?: string;
  formato?:string;
  searchtext?: string;
  lastUpdated?: Date;
}
