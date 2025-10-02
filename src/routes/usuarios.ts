import { Router } from "express";
import {
  getUsuarios,
  createUsuario,
  getUsuarioById,
  updateUsuario,
  addPerro,
  deleteUsuario,
  getUsuarioByCelular,
  getUsuariosByTipo,
  updatePerro,
  deletePerro
} from "../controllers/usuariosController";

const router = Router();

// CRUD
router.get("/", getUsuarios);
router.post("/", createUsuario);
router.get("/:id", getUsuarioById);
router.put("/:id", updateUsuario);
router.patch("/:id/perros", addPerro);
router.delete("/:id", deleteUsuario);

// CRUD Perros
router.patch("/:id/perros", addPerro);                // agregar
router.put("/:id/perros/index/:perroIndex", updatePerro);     // editar
router.delete("/:id/perros/index/:perroIndex", deletePerro);


// Extras
router.get("/celular/:celular", getUsuarioByCelular);
router.get("/tipo/:tipoUsuario", getUsuariosByTipo);

export default router;
