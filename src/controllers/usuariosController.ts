import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../db";
import { Perro, Usuario } from "../models/usuario";

const colName = "usuarios";

// Obtener todos
export async function getUsuarios(_req: Request, res: Response) {
  try {
    const usuarios = await getCollection<Usuario>(colName).find().toArray();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
}

// Crear
export async function createUsuario(req: Request, res: Response) {
  try {
    const data = req.body as Partial<Usuario>;
    const doc: Usuario = {
      ...data,
      creadoEn: new Date(),
    } as Usuario;
    const result = await getCollection<Usuario>(colName).insertOne(doc);
    res.status(201).json({ id: result.insertedId.toString() });
  } catch (err) {
    res.status(500).json({ message: "Error al crear usuario" });
  }
}

// Obtener por ID
export async function getUsuarioById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const usuario = await getCollection<Usuario>(colName).findOne({ _id: new ObjectId(id) });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ message: "Error al buscar usuario" });
  }
}

// Actualizar por ID
export async function updateUsuario(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cambios = req.body as Partial<Usuario>;

    let updateQuery: any = {};

    if (cambios.perros && Array.isArray(cambios.perros) && cambios.perros.length === 1) {
      // Si viene un perro en un array, lo agregamos sin borrar los existentes
      updateQuery = { $push: { perros: cambios.perros[0] } };
    } else {
      // Para cualquier otro campo, actualizamos con $set
      updateQuery = { $set: cambios };
    }

    const result = await getCollection<Usuario>(colName).updateOne(
      { _id: new ObjectId(id) },
      updateQuery
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario actualizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
}

// Agregar perro a un usuario existente
export async function addPerro(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const nuevoPerro = req.body; // viene un objeto perro

    const result = await getCollection<Usuario>(colName).updateOne(
      { _id: new ObjectId(id) },
      { $push: { perros: nuevoPerro } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Perro agregado exitosamente" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Error al agregar perro" });
  }
}




// Eliminar por ID
export async function deleteUsuario(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const result = await getCollection<Usuario>(colName).deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
}

// 🔍 Buscar por celular
export async function getUsuarioByCelular(req: Request, res: Response) {
  try {
    const celular = req.params.celular;
    const usuario = await getCollection<Usuario>(colName).findOne({ celular });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ message: "Error al buscar usuario por celular" });
  }
}

// 🔍 Buscar por tipoUsuario
export async function getUsuariosByTipo(req: Request, res: Response) {
  try {
    const tipoUsuario = req.params.tipoUsuario;
    const usuarios = await getCollection<Usuario>(colName).find({ tipoUsuario }).toArray();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: "Error al buscar usuarios por tipo" });
  }
}

// Editar un perro de un usuario
export async function updatePerro(req: Request, res: Response) {
  const usuarioId = req.params.id;
  const perroId = req.params.perroId;
  const cambios: Partial<Perro> = req.body;

  const usuario = await getCollection<Usuario>("usuarios").findOne({ _id: new ObjectId(usuarioId) });
  if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
  if (!usuario.perros) usuario.perros = [];

  const index = usuario.perros.findIndex(p => p._id === perroId);
  if (index === -1) return res.status(404).json({ message: "Perro no encontrado" });

  usuario.perros[index] = { ...usuario.perros[index], ...cambios };

  await getCollection<Usuario>("usuarios").updateOne(
    { _id: new ObjectId(usuarioId) },
    { $set: { perros: usuario.perros } }
  );

  res.json({ message: "Perro actualizado" });
}


export async function deletePerro(req: Request, res: Response) {
  try {
    const usuarioId = req.params.id;
    const perroId = req.params.perroId;

    // Obtener el usuario
    const usuario = await getCollection<Usuario>("usuarios").findOne({ _id: new ObjectId(usuarioId) });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    if (!usuario.perros || usuario.perros.length === 0) {
      return res.status(404).json({ message: "El usuario no tiene perros" });
    }

    // Filtrar el perro a eliminar
    const nuevaListaPerros = usuario.perros.filter(p => p._id !== perroId);

    if (nuevaListaPerros.length === usuario.perros.length) {
      return res.status(404).json({ message: "Perro no encontrado" });
    }

    // Actualizar en la base de datos
    await getCollection<Usuario>("usuarios").updateOne(
      { _id: new ObjectId(usuarioId) },
      { $set: { perros: nuevaListaPerros } }
    );

    res.json({ message: "Perro eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar perro" });
  }
}

