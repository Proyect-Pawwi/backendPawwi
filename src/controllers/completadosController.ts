import { Request, Response } from "express";
import { getCollection } from "../db";
import { Completado } from "../models/completado";
import { ObjectId } from "mongodb";

// ✅ Crear completado
export async function createCompletado(req: Request, res: Response) {
  try {
    const col = getCollection<Completado>("completados");
    const completado: Completado = {
      ...req.body,
      FechaCreacion: new Date(),
    };
    const result = await col.insertOne(completado);
    res.status(201).json({ _id: result.insertedId, ...completado });
  } catch (err) {
    res.status(500).json({ message: "Error creando completado" });
  }
}

// ✅ Listar completados
export async function getCompletados(_req: Request, res: Response) {
  try {
    const col = getCollection<Completado>("completados");
    const result = await col.find().toArray();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error listando completados" });
  }
}

// ✅ Obtener completado por id
export async function getCompletadoById(req: Request, res: Response) {
  try {
    const col = getCollection<Completado>("completados");
    const result = await col.findOne({ _id: new ObjectId(req.params.id) });
    if (!result) return res.status(404).json({ message: "No encontrado" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo completado" });
  }
}

// ✅ Actualizar completado
export async function updateCompletado(req: Request, res: Response) {
  try {
    const col = getCollection<Completado>("completados");
    const result = await col.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "No encontrado" });
    }
    res.json({ message: "Actualizado" });
  } catch (err) {
    res.status(500).json({ message: "Error actualizando completado" });
  }
}

// ✅ Eliminar completado
export async function deleteCompletado(req: Request, res: Response) {
  try {
    const col = getCollection<Completado>("completados");
    const result = await col.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No encontrado" });
    }
    res.json({ message: "Eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error eliminando completado" });
  }
}

// ✅ Calcular ganancias de un Pawwer
export async function getGananciasPawwer(req: Request, res: Response) {
  try {
    const celularPawwer = req.params.celular;
    const pagado = req.query.pagado === "true"; // ?pagado=true o false

    const col = getCollection<Completado>("completados");

    const pipeline = [
      { $match: { CelularPawwer: celularPawwer, Pagado: pagado } },
      {
        $group: {
          _id: null,
          totalGanancia: { $sum: "$GananciaPawwer" },
        },
      },
    ];

    const result = await col.aggregate(pipeline).toArray();
    const totalGanancia = result[0]?.totalGanancia || 0;

    res.json({ celularPawwer, pagado, totalGanancia });
  } catch (err) {
    res.status(500).json({ message: "Error calculando ganancias" });
  }
}
