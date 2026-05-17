import { Router } from "express";
import { createMessage, getMessagesByChat, sendHelpMessage } from "../../controllers/chats/messagesController";

const router = Router();

router.post("/create", createMessage);
router.get("/:chatId", getMessagesByChat);
router.post("/help", sendHelpMessage);

export default router;
