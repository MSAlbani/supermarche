import express from "express";
import {
  validerVente,
  detailVente,
  listerVentes,
  getProduitVente,
} from "../controllers/vente.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authenticate, validerVente);
router.get("/", authenticate, listerVentes);
// router.get("/:id_vente", authenticate, detailVente);
router.get("/produits", authenticate, getProduitVente);

export default router;
