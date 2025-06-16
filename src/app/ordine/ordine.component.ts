import { Component, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { OrdineService } from '../../services/ordine.service';
import { OrdineDTO, DettagliOrdineDTO } from '../models/OrderDTO'; 
import { PuntovenditaService } from '../../services/puntovendita.service';
import { RouterModule } from '@angular/router';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-ordine',
  standalone: true,
  imports: [TranslateModule, CommonModule, RouterModule],
  templateUrl: './ordine.component.html',
  styleUrls: ['./ordine.component.css', '../../styles.css'],
})
export class OrdineComponent {
  ordini: OrdineDTO[] = [];
  
  private langChangeSubscription!: Subscription;

  constructor(
    private translate: TranslateService,
    private ordiniService: OrdineService,
    private PV: PuntovenditaService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.spinnerService.show();
    
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.getOrders();
    this.spinnerService.hide();

    });
    this.spinnerService.show();

    this.getOrders();
    this.spinnerService.hide();

  }

  getOrders() {
  console.log("Caricamento ordini...");
  this.ordini = [];
  
  this.ordiniService.getOrders().subscribe({
    next: (response: OrdineDTO[]) => {
      this.ordini = response;
      console.log("Ordini caricati:", this.ordini);
    },
    error: (err) => {
      console.error("Errore nel recupero degli ordini:", err);
    }
  });
}

onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement | null;
    if (imgElement) {
      imgElement.src = 'assets/default.png';
    }
}


  ngOnDestroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
}
