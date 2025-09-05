import { Router } from "express";
import {
  createCompletado,
  getCompletados,
  getCompletadoById,
  updateCompletado,
  deleteCompletado,
  getGananciasPawwer,
} from "../controllers/completadosController";

const router = Router();

router.post("/", createCompletado);
router.get("/", getCompletados);
router.get("/:id", getCompletadoById);
router.put("/:id", updateCompletado);
router.delete("/:id", deleteCompletado);

// ✅ Ganancias por pawwer
router.get("/ganancias/:celular", getGananciasPawwer);

export default router;
