import { Router } from "express";
import {getMessages,createMessage,deleteMsg
} from "../controllers/msgController";

const router = Router();

// CRUD
router.get("/", getMessages);
router.post("/", createMessage);
router.delete("/:id", deleteMsg);

export default router;
