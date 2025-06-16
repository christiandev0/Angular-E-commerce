import { Component, inject, Input } from '@angular/core';
import { FilmsService } from '../../services/films.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CardComponent } from '../card/card.component';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../../services/spinner.service';


@Component({
  selector: 'app-catalogo',
  imports: [FormsModule, CommonModule, TranslateModule, CardComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent {
  private filmservice = inject(FilmsService);

  films: any[] = [];
  filteredFilm?: any;
  filteredFilms: any[] = [];
  loading: boolean = false;
  private langChangeSubscription!: Subscription;
  
  constructor(private translate: TranslateService, private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.spinnerService.show();

    this.langChangeSubscription = this.translate.onLangChange.subscribe(langEvent => {
    

      this.ngOnInit();
    

    });
    const savedLang = localStorage.getItem('selectedLang') || 'it';
    this.translate.use(savedLang);
    this.loading = true;
    this.filmservice.filterFilms({}).subscribe({
      next: films => {
        this.films = films;
        this.loading = false;
    this.spinnerService.hide();

      },
      error: err => {
        console.error('Errore:', err);
        this.films = [];
        this.loading = false;
      }
    })
    ;
  }

  onSubmit(form: NgForm) {
    this.loading = true;

    
    const searchText = form.value.searchInput.trim();  

    
    if (!searchText) {
        this.loading = false;
        return;
    }

    
    const filter: any = {};

    filter.searchText = searchText; 

    
    this.filmservice.filterFilms(filter).subscribe({
        next: films => {
            this.filteredFilms = films;
            this.loading = false;
           
        },
        error: err => {
            
            this.filteredFilms = [];
            this.loading = false;
        }
    });
    
}

  
  searchByGenre(genre: string) {
    this.loading = true;
    const filter = { genre };
  
    this.filmservice.filterFilms(filter).subscribe({
      next: films => {
        this.filteredFilms = films;
        this.loading = false;
         console.log('Films found:', this.filteredFilms);
      },
      error: err => {
        
        this.filteredFilms = [];
        this.loading = false;
      }
    });
  }
  
  filterByYear(year: string) {
    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear)) {
      this.filteredFilms = [];
      return;
    }
  
    const filter = { year: parsedYear };
  
    this.loading = true;
    this.filmservice.filterFilms(filter).subscribe({
      next: films => {
        this.filteredFilms = films;
        this.loading = false;
      },
      error: err => {
        this.filteredFilms = [];
        this.loading = false;
      }
    });
  }

  filterByFormato(formato: string) {
  if (!formato) {
    this.filteredFilms = [];
    return;
  }

  this.loading = true;
  this.filmservice.filterFilms({ formato }).subscribe({
    next: films => {
      this.filteredFilms = films;
      this.loading = false;
    },
    error: err => {
      this.filteredFilms = [];
      this.loading = false;
    }
  });
}

  resetFilters(form: NgForm) {
    form.reset();
    this.filteredFilms = [];
    this.filteredFilm = undefined;
    this.loading = true;
  
    this.filmservice.filterFilms({}).subscribe({
      next: films => {
        this.films = films;
        this.loading = false;
      },
      error: err => {
        this.films = [];
        this.loading = false;
      }
    });
  }
  
}  