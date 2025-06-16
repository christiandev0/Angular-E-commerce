export interface OrdineDTO {
  iDordine: number;
  iDpuntovendita: number;
  prezzoTotale: number;
  statoOrdine: string;
  quantita:number;
  dettagliOrdine: DettagliOrdineDTO[];
}

export interface DettagliOrdineDTO {
  nomePuntoVendita: any;
  indirizzoPuntoVendita: any;
  iDfilm: number;
  titoloFilm: string;
  urlLocandina: string;
  iDpuntovendita: number;
  quantitaFilm: number;
  prezzo: number;
}
