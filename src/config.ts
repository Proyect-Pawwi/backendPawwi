// src/config.ts
import dotenv from "dotenv";
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const DB_NAME = process.env.DB_NAME || "pawwi_db";
export const PORT = Number(process.env.PORT) || 3000;

if (!MONGO_URI) {
  throw new Error("MONGO_URI no está definido en .env");
}
