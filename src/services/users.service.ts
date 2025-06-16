import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public usernameChanged = new EventEmitter<string>();
  public authChanged = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private translate: TranslateService, private cookieService: CookieService) {}

  private apiUrl = 'https://localhost:7079/api/Users';

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; 
  }
  
  login(username: string, password: string): Observable<any> {
    const loginData = { 
      username: username,       
      password: password
    };
    
    return this.http.post<any>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', username);
            this.cookieService.set('token', response.token, 1); 
            this.cookieService.set('username', username, 1);
            this.authChanged.emit(true);
            this.usernameChanged.emit(username);
            
           
            this.handleAdminRedirect(response);
          }
        })
      );
}

private handleAdminRedirect(response: any) {
  
  if (response.ruolo === 'Admin' || response.isAdmin) {
    const authData = btoa(JSON.stringify({
      token: response.token,
      username: response.username,
      ruolo: response.ruolo || 'Admin',
      timestamp: Date.now()
    }));
    
    
    window.location.href = `http://localhost:4201?auth=${authData}`;
  }
}

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.authChanged.emit(false);
    this.usernameChanged.emit('');
  }

  delete(username: string): Observable<any> {
    console.log('Delete service called with:', username);
    return this.http.delete(`${this.apiUrl}/delete/${username}`).pipe(
      tap((response) => {
        console.log('Delete successful:', response); 
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.cookieService.delete('token');
        this.cookieService.delete('username');
        this.authChanged.emit(false);
        this.usernameChanged.emit('');
      }),
      
    );
  }
  

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }


  register(username: string, password: string): Observable<any> {
    console.log('Register service called with:', username, password); 
    const loginData = { 
      username: username,       
      password: password
    };
    
    return this.http.post<any>(`${this.apiUrl}/register`, loginData)
      .pipe(
        tap(response => {
          console.log('register response received:', response);
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', username);
            this.authChanged.emit(true);
            this.usernameChanged.emit(username);
          }
        }),
        
      );
  }

  getUserInfo(): Observable<any> {
    const username = this.getUsername();
    return this.http.get<any>(`${this.apiUrl}/api/utente/${username}`)
      .pipe(
        tap(response => {
          console.log('User info received:', response);
        }),
        
      );
  }


  updateUserInfo(userData: any): Observable<any> {
    const currentUsername = this.getUsername();
    return this.http.put<any>(`${this.apiUrl}/api/utente/${currentUsername}`, userData)
      .pipe(
        tap(response => {
          console.log('Update response received:', response);
          if (response && response.token && response.username) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.username);
            this.authChanged.emit(true);
            this.usernameChanged.emit(response.username);
          }
        }),
      );
  }
  
}


