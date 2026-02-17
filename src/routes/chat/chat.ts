import { Router } from "express";
import { createChat } from "../../controllers/chats/chatController";

const router = Router();

router.post("/create", createChat);

export default router;
