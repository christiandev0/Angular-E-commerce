import { Component, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { CarrelloService } from '../../services/carrello.service';
import { Carrello, DettagliCarrello } from '../models/CarrelloDTO';
import { RouterModule } from '@angular/router';
import { FilmsService } from '../../services/films.service';
import { finalize, Observable, Subscription } from 'rxjs';
import { PuntovenditaService } from '../../services/puntovendita.service';
import { SpinnerService } from '../../services/spinner.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carrello',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, FormsModule],
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.css', '../../styles.css'],
})
export class CarrelloComponent {
  carrello: Carrello | null = null;
  puntiVenditaMap: { [id: number]: any } = {};
  totale = signal(0);
  quantitaErrors: { [key: string]: boolean } = {};
  private langChangeSubscription!: Subscription;

  constructor(private translate: TranslateService, private carrelloService: CarrelloService,
     private film: FilmsService, private PV: PuntovenditaService, private spinnerService: SpinnerService) {}

  ngOnInit(): void {
    this.spinnerService.show();

    this.langChangeSubscription = this.translate.onLangChange.subscribe(langEvent => {
    this.spinnerService.show();

      this.refreshCarrello();
    

    });
    

    this.getCarrello();
    
    
  }

  getCarrello() {
  this.spinnerService.show();
  this.carrelloService.getCarrello().pipe(
    finalize(() => this.spinnerService.hide())
  ).subscribe({
    next: (response) => {
      this.carrello = response;
      this.totale.set(0);
      
      if (this.carrello?.dettagliCarrellos) {
        this.carrello.dettagliCarrellos.forEach((dettaglio) => {
          const idPV = dettaglio.iDpuntovendita;
          this.totale.update(value => value + (dettaglio.prezzoTotale ?? 0));
          
          // Inizializza l'errore di quantità per ogni item
          const itemKey = `${dettaglio.iDpuntovendita}_${dettaglio.iDfilm}`;
          dettaglio.quantitaError = false;
          this.quantitaErrors[itemKey] = false;
          
          if (idPV !== null && !this.puntiVenditaMap[idPV]) {
            this.PV.getPuntovenditaById(idPV).subscribe((pv) => {
              if (pv?.nome) {
                this.puntiVenditaMap[idPV] = pv;
              }
            });
          }
        });
      }
    },
    error: (err) => {
      console.error("Errore nel recupero del carrello:", err);
    }
  });
}



  
removeFilm(id: number) {
  this.carrelloService.removeFromCarrello(id).subscribe({
    next: () => {
      console.log(`Film con ID ${id} rimosso con successo`);
      
      if (this.carrello) {
        this.carrello.dettagliCarrellos = this.carrello.dettagliCarrellos.filter(
          (item) => item.iDfilm !== id
        );
      }
    },
    complete: () => {
      
      this.refreshCarrello();
    }
  });
}


refreshCarrello() {
  this.spinnerService.show();

  this.carrelloService.getCarrello().pipe(
    finalize(() => this.spinnerService.hide())
  ).subscribe({
    next: (response) => {
      this.carrello = response;
      this.totale.set(0);

      if (this.carrello?.dettagliCarrellos) {
        this.carrello.dettagliCarrellos.forEach((dettaglio) => {
          if (dettaglio.prezzoTotale) {
            this.totale.update(value => value + dettaglio.prezzoTotale!);
          }
        });
      }

      console.log('Carrello aggiornato');
    },
    error: (err) => {
      console.error("Errore nel refresh del carrello:", err);
    }
  });
}


Checkout(carrello: Carrello) {
  this.carrelloService.checkoutCarrello(carrello).subscribe({
    next: (response) => {
      console.log('Checkout effettuato con successo:', response);
      this.refreshCarrello(); 
    },
    error: (error) => {
      console.error('Errore nel checkout:', error);
    }
  });
}

ngOnDestroy() {
  if (this.langChangeSubscription) {
    this.langChangeSubscription.unsubscribe();
  }
  this.totale.set(0);
}





getMaxQuantitaForItem(dettaglio: any): number {
  const idPV = dettaglio.iDpuntovendita;
  const idFilm = dettaglio.iDfilm; 
  
  
  const puntoVendita = this.puntiVenditaMap[idPV];
  
  if (puntoVendita && puntoVendita.disponibilitas) {
    
    const disponibilita = puntoVendita.disponibilitas.find(
      (disp: any) => disp.iDfilm === idFilm && disp.iDpuntovendita === idPV
    );
    return disponibilita ? disponibilita.quantita : 0;
  }
  
  return 0;
}

validateAndUpdateQuantita(dettaglio: any) {
  const maxQuantita = this.getMaxQuantitaForItem(dettaglio);
  const itemKey = `${dettaglio.iDpuntovendita}_${dettaglio.iDfilm}`;
  
  if (dettaglio.quantita > maxQuantita) {
    this.quantitaErrors[itemKey] = true;
    dettaglio.quantita = maxQuantita;
    dettaglio.quantitaError = true;
  } else if (dettaglio.quantita < 1) {
    dettaglio.quantita = 1;
    this.quantitaErrors[itemKey] = false;
    dettaglio.quantitaError = false;
  } else {
    this.quantitaErrors[itemKey] = false;
    dettaglio.quantitaError = false;
  }
  
  
  this.updateCarrelloItem(dettaglio);
  
  
  this.calcolaTotale();
}

updateCarrelloItem(dettaglio: any) {
 
  console.log('Aggiornamento quantità per:', dettaglio);
  this.carrelloService.updateQuantitaCarrello(dettaglio.iDfilm, dettaglio.quantita, dettaglio.iDpuntovendita)
    .subscribe({
      next: (response) => {
        console.log('Quantità aggiornata con successo', response);
        dettaglio.prezzoTotale = dettaglio.prezzoUnitario * dettaglio.quantita;
        this.refreshCarrello();
      },
      error: (err) => {
        console.error('Errore nell\'aggiornamento della quantità:', err);
        this.getCarrello();
      }
    });
}

calcolaTotale() {
  this.totale.set(0);
  if (this.carrello?.dettagliCarrellos) {
    this.carrello.dettagliCarrellos.forEach((dettaglio) => {
      this.totale.update(value => value + (dettaglio.prezzoTotale ?? 0));
    });
  }
}


trackByDettaglio(index: number, dettaglio: any): any {
  return dettaglio.id || index;
}
}
