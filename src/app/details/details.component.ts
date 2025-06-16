import { Component, inject, input, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FilmsService } from '../../services/films.service';
import { CommonModule } from '@angular/common';
import { DetailsCardComponent } from '../details-card/details-card.component';
import { Observable, Subscription, map } from 'rxjs';
import { CarrelloService } from '../../services/carrello.service';
import { PuntovenditaService } from '../../services/puntovendita.service';
import { UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';
import { SpinnerService } from '../../services/spinner.service';
import { CastCardComponent } from '../cast-card/cast-card.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [DetailsCardComponent, TranslateModule, CommonModule,FormsModule, CastCardComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit, OnDestroy {
  FilmId = input.required<string>();
  isAuthenticated: boolean =false;
  private filmService = inject(FilmsService);
  private translate = inject(TranslateService);
  private carrello = inject(CarrelloService);
  private puntovendita = inject(PuntovenditaService)
  private user = inject(UsersService);
  private spinnerService = inject(SpinnerService);
  private langChangeSubscription!: Subscription;
  public Puntovendita$!: Observable<any>;
  public selectedPV:any;
  Film$!: Observable<any>;

   loginData = {
    username: '',
    password: ''
  };

  quantita:number=1;
  
selectedActor = {
  nome: '',
  cognome: '',
  castImg: '',
  id: 0,
  filmCollegati: [] as any[]
};


  ngOnInit() {
    this.spinnerService.show();
    const savedLang = localStorage.getItem('selectedLang') || 'it';
    this.translate.use(savedLang);
    this.loadFilm();
    this.isAuthenticated = this.user.isAuthenticated();
    this.spinnerService.hide();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(langEvent => {
    this.spinnerService.show();

      this.loadFilm();
    this.spinnerService.hide();

    });
  }

  loadFilm() {
    const filmIdValue = Number(this.FilmId());
    console.log('ID film richiesto:', filmIdValue); 
    this.Film$ = this.filmService.getFilmById(filmIdValue);
  }
  
  
  

  ngOnDestroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  quantitaError = false;

selectPuntoVendita(pv: any) {
  this.selectedPV = pv;
  this.quantita = 1;
  this.quantitaError = false;
}

getMaxQuantita(): number {
  console.log('Selected PV:', this.selectedPV);
  console.log('Disponibilita:', this.selectedPV?.disponibilitas);
  if (this.selectedPV && this.selectedPV.disponibilitas && this.selectedPV.disponibilitas.length > 0) {
    return this.selectedPV.disponibilitas[0].quantita;
  }
  return 0;
}

validateQuantita() {
  const maxQuantita = this.getMaxQuantita();
  if (this.quantita > maxQuantita) {
    this.quantitaError = true;
    this.quantita = maxQuantita;
  } else {
    this.quantitaError = false;
  }
}

  addToCart(filmId: number, puntovenditaId: number, quantita:number) {
    if(this.isAuthenticated){
      this.carrello.addFilmToCarrello(filmId, puntovenditaId, quantita).subscribe({});
    }
}



  getPuntovenditaById(filmId: number) {
    console.log('Fetching point of sale for film ID:', filmId);
    this.Puntovendita$ = this.puntovendita.getPuntovenditaByFilmId(filmId);
    console.log('Puntovendita$:', this.Puntovendita$);
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/default.png';
  }

  login(){
    this.user.login(this.loginData.username, this.loginData.password).subscribe(
      (response) => {
        console.log('Login successful:', response);
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }


  
}
