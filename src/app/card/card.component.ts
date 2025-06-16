import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FilmsService } from '../../services/films.service';
import { TranslateModule } from '@ngx-translate/core';
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-card',
  imports: [CommonModule, RouterLink, TranslateModule],
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css', '../../styles.css'],
})
export class CardComponent {
 
 @Input() film!: any;
 @Input() customDescription: string = '';
 currentLang: string = '';
 filmService = inject(FilmsService);
 translate = inject(TranslateService);

 onImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/default.png';
}

 
}
