import { ObjectId } from "mongodb";

export interface Completado {
  _id?: ObjectId;
  FechaCreacion: Date;
  Celular: string;
  CelularPawwer: string;
  Nombre: string;
  NombrePawwer: string;
  Perro: string;
  Anotaciones: string;
  Direccion: string;
  TipoServicio: string;
  TiempoServicio: number;
  Fecha: string;
  Hora: string;
  HoraInicio?: string; // <-- aquí opcional
  Precio: number;
  Estado: string;
  Strava?: string;
  MetodoPago: string;
  IdPawwer: string;

  // Nuevos campos
  GananciaPawwer: number;
  GananciaPawwi: number;
  Pagado: boolean;
}
