import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-details-card',
  templateUrl: './details-card.component.html',
  styleUrls: ['./details-card.component.css']
})
export class DetailsCardComponent implements OnChanges {
  @Input() film: any;
  safeUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['film'] && this.film) {
     
      if (this.film.urlTrailer) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.film.urlTrailer);
        const modifiedUrl = this.film.urlTrailer.replace("watch?v=", "v/");
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(modifiedUrl);
        console.log(this.film.urlTrailer);
      } else {
        console.error('URL del trailer non disponibile per il film', this.film
        );
      }
    }
  }
}
