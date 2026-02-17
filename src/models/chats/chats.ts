import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  clienteCode: string;
  empleadoCode: string;
  createdAt: Date;
}

const ChatSchema: Schema = new Schema(
  {
    clienteCode: { type: String, required: true },
    empleadoCode: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "chats", // 👈 FORZAMOS nombre exacto de colección
  }
);

// 👇 Esto evita duplicación de modelo con nodemon
export default mongoose.models.Chat ||
  mongoose.model<IChat>("Chat", ChatSchema);
