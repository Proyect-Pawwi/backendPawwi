import { MongoClient, Db, Collection, Document } from "mongodb";
import { MONGO_URI, DB_NAME } from "./config";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDB(): Promise<Db> {
  if (db) return db;

  client = new MongoClient(MONGO_URI!);
  await client.connect();
  db = client.db(DB_NAME);
  console.log("MongoDB conectado:", DB_NAME);
  return db;
}

export function getCollection<T extends Document>(name: string): Collection<T> {
  if (!db) throw new Error("DB no inicializada. Llama a connectToDB primero.");
  return db.collection<T>(name);
}

export async function closeConnection() {
  await client?.close();
  db = null;
  client = null;
}
