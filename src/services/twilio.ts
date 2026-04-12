// src/services/twilio.ts
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const enviarNotificacion = async (to: string, body: string, sender: string) => {
    try {
        await client.messages.create({
            body: `🐾 Pawwi: ${sender} te envió un mensaje: "${body.substring(0, 50)}..."`,
            from: process.env.TWILIO_PHONE_NUMBER, // El número +16624934313
            to: to // El número del destinatario (+507...)
        });
        console.log("✅ Notificación enviada");
    } catch (error) {
        console.error("❌ Error en Twilio:", error);
    }
};