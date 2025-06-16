export interface DettagliCarrello {
    quantitaError?: boolean;
    
    iDfilm: number 
    iDpuntovendita: number | null;
    prezzoTotale?: number | null;
    titoloFilm?: string | null;
    locandinaFilm?: string | null;
    quantita?: number | null;
  }
  
  export interface Carrello {
    idcarrello: number;
    idutente: number | null;
    dettagliCarrellos: DettagliCarrello[];

  }
  