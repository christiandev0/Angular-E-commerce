import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuntovenditaService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'https://localhost:7079/api/Puntovendita';


  getPuntovendita(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(tap((response) => {
      console.log('Puntovendita fetched successfully:', response); 
    }));
  }

  getPuntovenditaByFilmId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(tap((response) => {
      console.log('Puntovendita fetched successfully by filmID:', response); 
    }));
  }

  getPuntovenditaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/byID/${id}`).pipe(tap((response) => {
      console.log('Puntovendita fetched successfully by IDpv:', response); 
    }));
  }
}
