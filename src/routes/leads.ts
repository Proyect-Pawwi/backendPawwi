import { Router } from "express";
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
  validarLead,
  leadToPaseo
} from "../controllers/leadsController";

const router = Router();

// CRUD
router.get("/", getLeads);
router.post("/", createLead);
router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

// Validar lead
router.post("/:id/validar", validarLead);
router.post("/:id/toPaseo", leadToPaseo);

export default router;
