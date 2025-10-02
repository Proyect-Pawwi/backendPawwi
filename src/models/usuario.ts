import { Document, ObjectId } from "mongodb";

export interface Perro {
  _id: string;
  nombre: string;
  raza: string;
  tamano: string;
  edad: string;
  vacunas: boolean;
  observaciones: string;
}

export interface Usuario extends Document {
  _id?: ObjectId | string;
  celular: string;
  nombre: string;
  tipoUsuario: string;
  direccion: string;
  perros?: Perro[];
  agendamientos?: any[];
  creadoEn?: Date;
}
