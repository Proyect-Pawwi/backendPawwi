import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../db";
import { msg } from "../models/msg";

const colName = "msgs";

// Obtener todos
export async function getMessages(_req: Request, res: Response) {
  try {
    const leads = await getCollection<msg>(colName).find().toArray();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener mensajes" });
  }
}

// Crear
export async function createMessage(req: Request, res: Response) {
  try {
    console.log("📥 Body recibido:", req.body);
    const data = req.body as Partial<msg>;
    const doc: msg = {
      ...data,
      fechaCreacion: new Date(),
    } as msg;
    const result = await getCollection<msg>(colName).insertOne(doc);
    res.status(201).json({ id: result.insertedId.toString() });
  } catch (err) {
    res.status(500).json({ message: "Error al crear msg" });
  }
}

// Eliminar por ID
export async function deleteMsg(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const result = await getCollection<msg>(colName).deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Lead no encontrado" });
    res.json({ message: "Mensaje eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar mensaje" });
  }
}