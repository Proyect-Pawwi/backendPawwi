import { ObjectId, Document } from "mongodb";

export interface msg extends Document {
  _id?: ObjectId | string;
  to: string;
  text: string;
}
