import express from "express";
import { validerVente } from "../controllers/vente.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/valider", authenticate, validerVente);

export default router;
