import { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
  chatId: string;
  senderRole: "cliente" | "empleado";
  senderCode: string;
  message: string;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
  chatId: { type: String, required: true },
  senderRole: { 
    type: String, 
    enum: ["cliente", "empleado"], 
    required: true 
  },
  senderCode: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default model<IMessage>("Message", MessageSchema);
