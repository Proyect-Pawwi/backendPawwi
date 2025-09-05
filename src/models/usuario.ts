import { Document, ObjectId } from "mongodb";

export interface Usuario extends Document {
  _id?: ObjectId | string;
  celular: string;
  nombre: string;
  tipoUsuario: string;
  direccion: string;
  Direccion?: string;       // si quieres mantener ambos
  perros?: string[];        // array de IDs o nombres de perros
  agendamientos?: any[];    // puedes definir tipo específico más adelante
  creadoEn?: Date;
}
