import { Router } from "express";
import {
  getUsuarios,
  createUsuario,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  getUsuarioByCelular,
  getUsuariosByTipo
} from "../controllers/usuariosController";

const router = Router();

// CRUD
router.get("/", getUsuarios);
router.post("/", createUsuario);
router.get("/:id", getUsuarioById);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);

// Extras
router.get("/celular/:celular", getUsuarioByCelular);
router.get("/tipo/:tipoUsuario", getUsuariosByTipo);

export default router;
