import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../db";
import { Paseo } from "../models/paseo";
import { Completado } from "../models/completado";

const colName = "paseos";

// Obtener todos
export async function getPaseos(_req: Request, res: Response) {
  try {
    const paseos = await getCollection<Paseo>(colName).find().toArray();
    res.json(paseos);
  } catch {
    res.status(500).json({ message: "Error al obtener paseos" });
  }
}

// Crear
export async function createPaseo(req: Request, res: Response) {
  try {
    const data = req.body as Partial<Paseo>;
    const doc: Paseo = {
      ...data,
      FechaCreacion: new Date(),
    } as Paseo;
    const result = await getCollection<Paseo>(colName).insertOne(doc);
    res.status(201).json({ id: result.insertedId.toString() });
  } catch {
    res.status(500).json({ message: "Error al crear paseo" });
  }
}

// Obtener por ID
export async function getPaseoById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const paseo = await getCollection<Paseo>(colName).findOne({ _id: new ObjectId(id) });
    if (!paseo) return res.status(404).json({ message: "Paseo no encontrado" });
    res.json(paseo);
  } catch {
    res.status(500).json({ message: "Error al buscar paseo" });
  }
}

// Actualizar por ID
export async function updatePaseo(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cambios = req.body as Partial<Paseo>;
    const result = await getCollection<Paseo>(colName).updateOne(
      { _id: new ObjectId(id) },
      { $set: cambios }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: "Paseo no encontrado" });
    res.json({ message: "Paseo actualizado" });
  } catch {
    res.status(500).json({ message: "Error al actualizar paseo" });
  }
}

// Eliminar por ID
export async function deletePaseo(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const result = await getCollection<Paseo>(colName).deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Paseo no encontrado" });
    res.json({ message: "Paseo eliminado" });
  } catch {
    res.status(500).json({ message: "Error al eliminar paseo" });
  }
}

// ✅ Cambiar estado con link Strava
export async function registrarStrava(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const { stravaLink } = req.body;

    // Validar link de Strava (ejemplo: https://www.strava.com/activities/1234567890)
    const stravaRegex = /^https:\/\/(www\.)?strava\.com\/activities\/[0-9]+$/;

    if (!stravaRegex.test(stravaLink)) {
      return res.status(400).json({ message: "El link de Strava no es válido" });
    }

    // Buscar paseo
    const paseo = await getCollection<Paseo>(colName).findOne({ _id: new ObjectId(id) });
    if (!paseo) return res.status(404).json({ message: "Paseo no encontrado" });

    if (paseo.Estado !== "Esperando Strava") {
      return res.status(400).json({ message: "El paseo no está en estado 'Esperando Strava'" });
    }

    // Actualizar estado y guardar link
    await getCollection<Paseo>(colName).updateOne(
      { _id: new ObjectId(id) },
      { $set: { Estado: "Esperando finalizacion", Strava: stravaLink } }
    );

    res.json({ message: "Strava registrado y estado actualizado a 'Esperando finalizacion'" });
  } catch {
    res.status(500).json({ message: "Error al registrar Strava" });
  }
}

export async function finalizarPaseo(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const paseosCol = getCollection<Paseo>("paseos");
    const completadosCol = getCollection<Completado>("completados");

    // Buscar paseo
    const paseo = await paseosCol.findOne({ _id: new ObjectId(id) });
    if (!paseo) {
      return res.status(404).json({ message: "Paseo no encontrado" });
    }

    // Validar estado
    if (paseo.Estado !== "Completado") {
      return res
        .status(400)
        .json({ message: "El paseo no está en estado 'Completado'" });
    }

    // Validar que tenga Strava
    if (!paseo.Strava) {
      return res
        .status(400)
        .json({ message: "El paseo no tiene link de Strava registrado" });
    }

    // Calcular ganancias
    const gananciaPawwer = paseo.Precio * 0.6;
    const gananciaPawwi = paseo.Precio * 0.4;

    // Excluir _id del paseo
    const { _id, ...restoPaseo } = paseo;

    // Crear registro en completados
    const completado: Completado = {
      ...restoPaseo,
      GananciaPawwer: gananciaPawwer,
      GananciaPawwi: gananciaPawwi,
      Pagado: false,
      FechaCreacion: new Date(),
    };

    await completadosCol.insertOne(completado);

    res.json({ message: "Paseo movido a completados", completado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error finalizando paseo" });
  }
}