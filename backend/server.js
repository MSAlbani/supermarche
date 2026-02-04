import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import testRoute from "./routes/test.routes.js";
import panierRoutes from "./routes/panier.routes.js";
import venteRoutes from "./routes/vente.routes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

app.get("/health", async (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/test", testRoute);
app.use("/api/panier", panierRoutes);
app.use("/api/vente", venteRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${process.env.PORT}`);
});
