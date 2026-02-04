import express from "express";
import {
  addToPanier,
  afficherPanier,
} from "../controllers/panier.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/ajouter", authenticate, addToPanier);
router.get("/afficher", authenticate, afficherPanier);

export default router;
