import { Router } from "express";
import {
  getPaseos,
  createPaseo,
  getPaseoById,
  updatePaseo,
  deletePaseo,
  registrarStrava,
  finalizarPaseo
} from "../controllers/paseosController";

const router = Router();

// CRUD
router.get("/", getPaseos);
router.post("/", createPaseo);
router.get("/:id", getPaseoById);
router.put("/:id", updatePaseo);
router.delete("/:id", deletePaseo);

// Registrar Strava y cambiar estado
router.post("/:id/strava", registrarStrava);
router.post("/:id/finalizar", finalizarPaseo);

export default router;
