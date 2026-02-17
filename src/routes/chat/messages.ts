import { Router } from "express";
import { createMessage, getMessagesByChat } from "../../controllers/chats/messagesController";

const router = Router();

router.post("/create", createMessage);
router.get("/:chatId", getMessagesByChat);

export default router;
