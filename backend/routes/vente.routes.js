import express from "express";
import {
  validerVente,
  detailVente,
  listerVentes,
} from "../controllers/vente.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/valider", authenticate, validerVente);
router.get("/afficher", authenticate, listerVentes);
router.get("/afficher/:id_vente", authenticate, detailVente);

export default router;
