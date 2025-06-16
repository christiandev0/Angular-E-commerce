import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { UserResponse } from '../models/UserResponse';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  
  formAttivo: boolean = false;

  userFilter: UserResponse = {
    username: '',
    email: '',
    indirizzoSpedizione: '',
    nome: '',
    telefono: null,
    citta: '',
    carrellos: [],
    ordines: []
  };
  constructor(private user: UsersService, private router: Router) {
    
  }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  activateForm(): void {
    this.formAttivo = !this.formAttivo;
  }
  loadUserInfo(): void {
    
    this.user.getUserInfo().subscribe({
      next: (data: UserResponse) => {
        
        this.userFilter.username = data.username;
        this.userFilter.email = data.email;
        this.userFilter.indirizzoSpedizione = data.indirizzoSpedizione;
        this.userFilter.nome = data.nome;
        this.userFilter.telefono = data.telefono;
        this.userFilter.citta = data.citta;
        this.userFilter.carrellos = data.carrellos;
        this.userFilter.ordines = data.ordines;  
        
      },
    });
  }

  updateUserInfo(): void {
    this.user.updateUserInfo(this.userFilter).subscribe(
      (response) => {
        console.log('Update successful:', response);
        this.formAttivo = false; 
        this.loadUserInfo(); 
      },
      (error) => {
        console.error('Update failed:', error);
      }
    );
}

  delete() {
    this.user.delete(this.user.getUsername()).subscribe(
      (response) => {
        console.log('Delete successful:', response);
        this.user.logout();
        this.router.navigate(['/homepage']);
      },
      (error) => {
        console.error('Delete failed:', error);
      }
    );
  }
}
