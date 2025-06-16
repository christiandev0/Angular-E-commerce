import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, timeout } from 'rxjs';
import { Carrello } from '../app/models/CarrelloDTO';
import { DettagliCarrello } from '../app/models/CarrelloDTO';


@Injectable({
  providedIn: 'root'
})
export class CarrelloService {
  
  private apiUrl = 'https://localhost:7079/api/Carrello';


  constructor(private http: HttpClient) {}


  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  getCarrello(): Observable<Carrello> {
    const username = this.getUsername();
    console.log('Fetching cart', `${this.apiUrl}/${username}`); // Debugging line
    return this.http.get<Carrello>(`${this.apiUrl}/${username}`).pipe(
      tap((response) => {
        console.log('Cart fetched successfully:', response); // Debugging line
      }),
      
    ); 
  }

  

  removeFromCarrello(id: number): Observable<any> {
    const username = this.getUsername();
    return this.http.delete(`${this.apiUrl}/${username}/removeFromCart/${id}`, {
      
      responseType: 'text' 
    }).pipe(timeout(5000),
      tap((response) => {
        console.log('Item removed from cart:', response); 
      }),
      
    );
  }

  addFilmToCarrello(id: number, Idpuntovendita: number, quantita:number): Observable<any> {
    const username = this.getUsername();
    const dettaglioCarrelloDto: DettagliCarrello = {
      iDfilm: id,
      iDpuntovendita: Idpuntovendita,
      quantita: quantita,
      
    };
    console.log('Adding to cart:', dettaglioCarrelloDto);
    return this.http.post(`${this.apiUrl}/${username}/addToCart`, dettaglioCarrelloDto,{
      responseType: 'text' 
    }).pipe(timeout(2000),
      tap((response) => {
        console.log('Item added to cart:', response); 
      }),
      
    );
  }


  updateQuantitaCarrello( idFilm: number, nuovaQuantita: number , puntovendita:number): Observable<any> {
    const dettaglioCarrelloDto: DettagliCarrello = {
      iDfilm: idFilm,
      iDpuntovendita: puntovendita,
      quantita: nuovaQuantita,
      
    };
    console.log('Updating quantity in cart:', dettaglioCarrelloDto);
  return this.http.put(`${this.apiUrl}/update-quantita`, dettaglioCarrelloDto);

}

  checkoutCarrello(carrello: Carrello): Observable<any> {
  const apiUrl = 'https://localhost:7079/api/Ordine';

    const username = this.getUsername();
    return this.http.post(`${apiUrl}/checkout/${username}`, {}).pipe(
      tap({
        next: (response) => {
          console.log('Checkout successful:', response);
        },
        error: (error) => {
          console.error('Error during checkout:', error);
        }
      })
    );

  }
}
