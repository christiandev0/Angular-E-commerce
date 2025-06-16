
import { Component, input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [TranslateModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  loginData = {
    username: '',
    password: ''
  };

  
  constructor(private translate: TranslateService, private user: UsersService, private router: Router) {}
  

  register() {
    console.log('Register method called in component');
    
    this.user.register(this.loginData.username, this.loginData.password).subscribe(
      (response) => {
        console.log('Register successful:', response);
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


