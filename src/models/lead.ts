import { ObjectId, Document } from "mongodb";

export interface Lead extends Document {
  _id?: ObjectId | string;
  celular: string;
  nombre: string;
  perro: string;
  anotaciones: string;
  direccion: string;
  tipoServicio: string;
  tiempoServicio: string;
  fecha: string; // formato DD/MM
  hora: string;  // formato HH:MM
  precio: number;
  estado: string; // "Pendiente", "Confirmar", "Validado", etc.
  pawwer?: string; // número celular del pawwer asignado
  metodoPago: string;
  fechaCreacion?: Date;
}
