import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { afficher } from "../controllers/role.controller.js";

const router = express.Router();

router.get("/afficher", authenticate, afficher);

export default router;
