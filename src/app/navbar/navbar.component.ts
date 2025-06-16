import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';  
import { Router } from '@angular/router';
import { AvatarModule } from 'ngx-avatars';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, TranslateModule, FormsModule, AvatarModule],  
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isAuthenticated: boolean= false;
  username: string='';
  loginData = {
    username: '',
    password: ''
  };
  

  constructor(private translate: TranslateService, private user: UsersService,private router: Router) {
    if (typeof window !== 'undefined' && localStorage.getItem('selectedLang') === null) {
      localStorage.setItem('selectedLang', 'it');
    }
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('selectedLang') : 'it';
    const languageToUse = savedLang || 'it';
    this.translate.addLangs(['it', 'en']);
    this.translate.setDefaultLang('it');
    this.translate.use(languageToUse);
    
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit() {
    this.isAuthenticated = this.user.isAuthenticated();
    this.username = this.user.getUsername();
    
    
    this.user.authChanged.subscribe(status => {
      this.isAuthenticated = status;
    });
    
    
    this.user.usernameChanged.subscribe(username => {
      this.username = username;
    });
    if (typeof window !== 'undefined' && this.translate.onLangChange) {
      this.translate.onLangChange.subscribe((event) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('selectedLang', event.lang);
          
        }
      });
    }
  }

  

  logout(){
    console.log('Logout eseguito');
    this.user.logout();
    this.router.navigate(['/homepage']);

    this.isAuthenticated = false;
    this.username = ''; 
  }


  

  login() {
    console.log('Login method called in component');
    
    this.user.login(this.loginData.username, this.loginData.password).subscribe(
      (response) => {
        console.log('Login successful:', response);
        if(response && response.token) {

          this.router.navigate(['/dashboard']);
        }
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }
  
}