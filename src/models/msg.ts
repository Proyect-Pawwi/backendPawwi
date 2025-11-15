import { ObjectId, Document } from "mongodb";

export interface msg extends Document {
  _id?: ObjectId | string;
  from: string;
  to: string;
  text: string;
}
