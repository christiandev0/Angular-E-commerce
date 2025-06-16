import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { catchError, Observable, of } from 'rxjs';
import { FilmFilterDto } from '../app/models/FilmFilterDTO';  

@Injectable({
  providedIn: 'root'
})
export class FilmsService {

  
  private apiUrl = 'https://localhost:7079/api/Films';

  constructor(private http: HttpClient, private translate: TranslateService) {}

  filterFilms(filter: FilmFilterDto): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/getAllFilms`, filter);
  }

  getFilmById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
  }

  getFilmByCastId(id: any, isCast: boolean): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Cast/${id}?isCast=${isCast}`);
  }
}
