import { Router } from "express";
import {getMessages,createMessage,updateMsg
} from "../controllers/msgController";

const router = Router();

// CRUD
router.get("/", getMessages);
router.post("/", createMessage);
router.patch("/:id", updateMsg);

export default router;
