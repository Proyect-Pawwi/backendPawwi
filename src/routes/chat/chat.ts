import { Router } from "express";
import { createChat, getChats } from "../../controllers/chats/chatController";

const router = Router();

router.get("/", getChats);
router.post("/create", createChat);

export default router;
