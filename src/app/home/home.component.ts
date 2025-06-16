import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { FilmsService } from '../../services/films.service';
import { FilmFilterDto } from '../../app/models/FilmFilterDTO';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardComponent, TranslateModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  Films: any[] = [];
  private langChangeSub!: Subscription;
  groupedFilms: any[][] = [];

  constructor(
    private filmsService: FilmsService,
    private translate: TranslateService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.spinnerService.show();
    this.loadFilms();
    this.spinnerService.hide();
    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      this.spinnerService.show();
      this.loadFilms();
      this.spinnerService.hide();
    });
  }

  loadFilms() {
    const filter: FilmFilterDto = {
      lastUpdated: this.getOneMonthAgoDate()
    };

    this.filmsService.filterFilms(filter).subscribe({
      next: films => {
        this.Films = films;
        this.groupedFilms = this.chunkArray(films, 3);
      },
      error: err => console.error('Errore nel recupero dei film:', err)
    });
  }

  getOneMonthAgoDate(): Date {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    return currentDate;
  }

  trackById(index: number, film: any) {
    return film.iDfilm;
  }

  ngOnDestroy() {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }

  chunkArray(arr: any[], size: number): any[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }


  onImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/default.png';
}
}
