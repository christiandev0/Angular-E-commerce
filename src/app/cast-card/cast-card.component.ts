import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FilmsService } from '../../services/films.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cast-card',
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './cast-card.component.html',
  styleUrl: './cast-card.component.css'
})
export class CastCardComponent {

  private filmService = inject(FilmsService);
  @Input() castData = {
  nome: '',
  cognome: '',
  castImg: '',
  registaImg:'',
  iDcast:0,
  iDregista:0,
  descrizione: '',
  eta: 0,
  dataNascita: '',
  filmCollegati: [] as any[]
};

showModal = false;



closeModal() {
  this.showModal = false;
}

openModal() {
  this.showModal = true;
  console.warn('Cast Details:', this.castData);
  const castId = this.castData.iDcast || this.castData.iDregista;
  const isCast= !!this.castData.iDcast;
  
  if (!castId) {
    console.warn('ID cast/regista non trovato:', this.castData);
    return;
  }

  this.filmService.getFilmByCastId(castId, isCast).subscribe(films => {
    this.castData.filmCollegati = films;
    console.log('Film collegati:', this.castData.filmCollegati);
  });
}

onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    if(this.castData.registaImg) {
      imgElement.src = this.castData.registaImg;
      
    }
    else
    imgElement.src = 'assets/default.png';
  }

}
