import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../../db";
import { enviarNotificacion } from "../../services/twilio"; 

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

    const infoChat = await getCollection("chats").findOne({ 
      _id: new ObjectId(chatId) 
    });

    //Send to
    if(infoChat != null && senderCode == infoChat.clienteCode) {
      //Send to Pawwer
      console.log("Send to pawwer: " +  texto)
      if (infoChat != null) {
        enviarNotificacion(infoChat.pawwerNumber, texto, infoChat.empleadoCode)
          .catch(err => console.error("Error al enviar notificación de Twilio:", err));
      }
    }
    else {
      //Send to Client
      console.log("Send to client: " +  texto)
      if (infoChat != null) {
        enviarNotificacion(infoChat.clienteNumber, texto, infoChat.empleadoCode)
          .catch(err => console.error("Error al enviar notificación de Twilio:", err));
      }
    }

    if (infoChat) {
      console.log("--- Información del Chat para el nuevo mensaje ---");
      console.log(`ID Chat: ${infoChat._id}`);
      console.log(`Cliente: ${infoChat.clienteCode} (${infoChat.clienteNumber})`);
      console.log(`Empleado: ${infoChat.empleadoCode}`);
      console.log(`Texto enviado: "${texto}"`);
      console.log("--------------------------------------------------");
    } else {
      console.log("Mensaje creado, pero no se encontró información del chat asociado.");
    }
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
