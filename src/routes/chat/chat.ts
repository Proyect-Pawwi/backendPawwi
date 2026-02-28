import { Router } from "express";
import { createChat, getChats, getChatById } from "../../controllers/chats/chatController";

const router = Router();

router.get("/", getChats);
router.get("/chats/:id", getChatById);
router.post("/create", createChat);

export default router;
