import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrdineService {

  private apiUrl = 'https://localhost:7079/api/Ordine';

  constructor(private http: HttpClient) { }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  getOrders() : Observable<any> {
  const username = this.getUsername();
  return this.http.get<any>(`${this.apiUrl}/GetAllOrders/${username}`)   
  }
}
