import { Request, Response } from "express";
import { getCollection } from "../../db";

const colName = "chats";

export async function getChats(req: Request, res: Response) {
  try {
    const chats = await getCollection(colName)
      .find({})
      .sort({ creadoEn: -1 })
      .toArray();

    // Opcional: transformar _id a string
    const formatted = chats.map(chat => ({
      ...chat,
      _id: chat._id.toString()
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo chats" });
  }
}

export async function createChat(req: Request, res: Response) {
  try {
    const { clienteCode, empleadoCode } = req.body;

    if (!clienteCode || !empleadoCode) {
      return res.status(400).json({ message: "Datos requeridos" });
    }

    const doc = {
      clienteCode,
      empleadoCode,
      creadoEn: new Date(),
    };

    const result = await getCollection(colName).insertOne(doc);

    res.status(201).json({ id: result.insertedId.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando chat" });
  }
}
