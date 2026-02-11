import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import panierRoutes from "./routes/panier.routes.js";
import venteRoutes from "./routes/vente.routes.js";
import userRoute from "./routes/user.routes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // autorise les requêtes venant du front
    methods: ["GET", "POST"],
    credentials: true, // utile pour l'utilisation des cookies
  }),
);

// Routes

app.get("/health", async (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/paniers", panierRoutes);
app.use("/api/ventes", venteRoutes);
app.use("/api/users", userRoute);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${process.env.PORT}`);
});
