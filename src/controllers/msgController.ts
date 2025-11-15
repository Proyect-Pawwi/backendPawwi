import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../db";
import { msg } from "../models/msg";

const colName = "msgs";

// Obtener solo los mensajes NO chequeados
export async function getMessages(_req: Request, res: Response) {
  try {
    const leads = await getCollection<msg>(colName)
      .find({ $or: [{ checked: false }, { checked: { $exists: false } }] })
      .toArray();

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
      checked: false,           // 🔹 Nuevo
      fechaCreacion: new Date(),
    } as msg;

    const result = await getCollection<msg>(colName).insertOne(doc);
    res.status(201).json({ id: result.insertedId.toString() });
  } catch (err) {
    res.status(500).json({ message: "Error al crear msg" });
  }
}

// 🔄 Actualizar mensaje (antes deleteMsg)
export async function updateMsg(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const result = await getCollection<msg>(colName).updateOne(
      { _id: new ObjectId(id) },
      { $set: { checked: true, fechaActualizacion: new Date() } } // 🔥 Marca como actualizado
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Mensaje no encontrado" });

    res.json({ message: "Mensaje actualizado" });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar mensaje" });
  }
}
