import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../../db";

const colName = "messages";

export async function createMessage(req: Request, res: Response) {
  try {
    const { chatId, senderCode, texto } = req.body;

    if (!chatId || !senderCode || !texto) {
      return res.status(400).json({ message: "Datos requeridos" });
    }

    const doc = {
      chatId: new ObjectId(chatId),
      senderCode,
      texto,
      creadoEn: new Date(),
    };

    const result = await getCollection(colName).insertOne(doc);

    res.status(201).json({ id: result.insertedId.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando mensaje" });
  }
}

export async function getMessagesByChat(req: Request, res: Response) {
  try {
    const chatId = req.params.chatId;

    const mensajes = await getCollection("messages")
      .find({ chatId: new ObjectId(chatId) })
      .sort({ creadoEn: 1 })
      .toArray();

    res.json(mensajes);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo mensajes" });
  }
}
