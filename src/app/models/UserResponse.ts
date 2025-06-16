// models/user.model.ts
export interface UserResponse {
    nome: string | null;
    username: string;
    email: string | null;
    telefono: string | null;
    citta: string | null;
    indirizzoSpedizione: string | null;
    carrellos: any[];
    ordines: any[];
  }