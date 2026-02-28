import { Request, Response } from "express";
import { getCollection } from "../../db";
import { ObjectId } from "mongodb";

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

export async function getChatById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID requerido" });
    }

    // Validar ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const chat = await getCollection(colName).findOne({
      _id: new ObjectId(id),
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat no encontrado" });
    }

    res.json({
      ...chat,
      _id: chat._id.toString(),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo chat" });
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
