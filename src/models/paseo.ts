import { ObjectId, Document } from "mongodb";

export interface Paseo extends Document {
  _id?: ObjectId | string;
  FechaCreacion?: Date;
  Celular: string;            // Cliente
  CelularPawwer: string;      // Pawwer
  Nombre: string;
  NombrePawwer: string;
  Perro: string;
  Anotaciones: string;
  Direccion: string;
  TipoServicio: string;       // paseo
  TiempoServicio: number;     // minutos
  Fecha: string;              // formato DD/MM
  Hora: string;               // formato HH:MM
  HoraInicio?: string;
  Precio: number;
  Estado: string;             // Cancelado, Esperando Strava, Esperando finalización, etc.
  Strava?: string;            // link strava
  MetodoPago: string;         // efectivo, nequi, etc.
  IdPawwer: string;           // referencia al _id del pawwer
}
