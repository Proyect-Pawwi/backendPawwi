import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../db";
import { Lead } from "../models/lead";
import { Usuario } from "../models/usuario";
import { Paseo } from "../models/paseo";

const colName = "leads";

// Obtener todos
export async function getLeads(_req: Request, res: Response) {
  try {
    const leads = await getCollection<Lead>(colName).find().toArray();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener leads" });
  }
}

// Crear
export async function createLead(req: Request, res: Response) {
  try {
    console.log("📥 Body recibido:", req.body); // 👈 debug
    const data = req.body as Partial<Lead>;
    const doc: Lead = {
      ...data,
      fechaCreacion: new Date(),
    } as Lead;
    const result = await getCollection<Lead>(colName).insertOne(doc);
    res.status(201).json({ id: result.insertedId.toString() });
  } catch (err) {
    res.status(500).json({ message: "Error al crear lead" });
  }
}


// Obtener por ID
export async function getLeadById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const lead = await getCollection<Lead>(colName).findOne({ _id: new ObjectId(id) });
    if (!lead) return res.status(404).json({ message: "Lead no encontrado" });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: "Error al buscar lead" });
  }
}

// Actualizar por ID
export async function updateLead(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cambios = req.body as Partial<Lead>;
    const result = await getCollection<Lead>(colName).updateOne(
      { _id: new ObjectId(id) },
      { $set: cambios }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: "Lead no encontrado" });
    res.json({ message: "Lead actualizado" });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar lead" });
  }
}

// Eliminar por ID
export async function deleteLead(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const result = await getCollection<Lead>(colName).deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Lead no encontrado" });
    res.json({ message: "Lead eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar lead" });
  }
}

// ✅ Validar lead
export async function validarLead(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const lead = await getCollection<Lead>(colName).findOne({ _id: new ObjectId(id) });

    if (!lead) return res.status(404).json({ message: "Lead no encontrado" });

    // 1. Validar formato fecha (DD/MM) y hora (HH:MM)
    const fechaRegex = /^\d{2}\/\d{2}$/;
    const horaRegex = /^\d{2}:\d{2}$/;

    if (!fechaRegex.test(lead.fecha) || !horaRegex.test(lead.hora)) {
      return res.status(400).json({ message: "Formato de fecha u hora inválido" });
    }

    // 2. Estado debe ser "Confirmar"
    if (lead.estado !== "Confirmar") {
      return res.status(400).json({ message: "El lead no está en estado Confirmar" });
    }

    // 3. Verificar existencia del Pawwer
    if (!lead.pawwer) {
      return res.status(400).json({ message: "El lead no tiene pawwer asignado" });
    }

    const pawwer = await getCollection<Usuario>("usuarios").findOne({
      celular: lead.pawwer,
      tipoUsuario: "pawwer"
    });

    if (!pawwer) {
      return res.status(400).json({ message: "No existe un pawwer válido con ese número" });
    }

    // ✅ Actualizar estado a "Validado"
    await getCollection<Lead>(colName).updateOne(
      { _id: new ObjectId(id) },
      { $set: { estado: "Validado" } }
    );

    res.json({ message: "Lead validado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al validar lead" });
  }
}

export async function leadToPaseo(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const leadsCol = getCollection<Lead>("leads");
    const paseosCol = getCollection<Paseo>("paseos");

    // Buscar lead
    const lead = await leadsCol.findOne({ _id: new ObjectId(id) });
    if (!lead) return res.status(404).json({ message: "Lead no encontrado" });

    // Validación simple: debe tener estado "Validado"
    if (lead.estado !== "Validado") {
      return res.status(400).json({ message: "El lead no está validado" });
    }

    // Transformar lead a paseo
    const paseo: Paseo = {
      FechaCreacion: new Date(),
      Celular: lead.celular,
      CelularPawwer: lead.pawwer || "",
      Nombre: lead.nombre,
      NombrePawwer: "", // se puede completar con el nombre real del pawwer
      Perro: lead.perro,
      Anotaciones: lead.anotaciones,
      Direccion: lead.direccion,
      TipoServicio: lead.tipoServicio,
      TiempoServicio: parseInt(lead.tiempoServicio) || 0,
      Fecha: lead.fecha,
      Hora: lead.hora,
      HoraInicio: "",
      Precio: lead.precio,
      Estado: lead.estado, // se puede inicializar como "Pendiente" o "Programado"
      Strava: "",
      MetodoPago: lead.metodoPago,
      IdPawwer: lead.pawwer || ""
    };

    // Insertar en paseos
    const result = await paseosCol.insertOne(paseo);

    // Eliminar lead original (opcional)
    // await leadsCol.deleteOne({ _id: new ObjectId(id) });

    res.json({ message: "Lead convertido en paseo", idPaseo: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: "Error al convertir lead a paseo" });
  }
}