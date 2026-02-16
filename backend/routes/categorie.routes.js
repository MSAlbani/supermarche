import express from "express";
import { getAllCategorie } from "../controllers/categorie.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/afficher", authenticate, getAllCategorie);

export default router;
