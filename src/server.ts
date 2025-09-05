import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectToDB } from "./db";
import { PORT } from "./config";

import usuariosRouter from "./routes/usuarios";
import leadsRouter from "./routes/leads";
import paseosRouter from "./routes/paseos";
import completadosRouter from "./routes/completados";

async function main() {
  try {
    await connectToDB();

    const app = express();
    app.use(cors());
    app.use(morgan("dev"));
    app.use(express.json());

    // Rutas
    app.use("/api/usuarios", usuariosRouter);
    app.use("/api/leads", leadsRouter);
    app.use("/api/paseos", paseosRouter);
    app.use("/api/completados", completadosRouter);

    app.get("/", (_req, res) => res.send("API pawwi OK"));

    const HOST = process.env.HOST || "0.0.0.0";

    app.listen(PORT, () => {
      const publicUrl = process.env.RAILWAY_STATIC_URL; // Railway la inyecta en algunos casos
      console.log("✅ API pawwi lista!");
      console.log(`   Local:   http://localhost:${PORT}`);
      console.log(`   Network: http://0.0.0.0:${PORT}`);
      if (publicUrl) {
        console.log(`   Public:  https://${publicUrl}`);
      } else {
        console.log("👉 En Railway, usa la URL pública que te asigna el dashboard.");
      }
    });

  } catch (err) {
    console.error("❌ Fallo al iniciar:", err);
    process.exit(1);
  }
}

main();
