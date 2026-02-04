import express from "express";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "Accès autorisé",
    Utilisateur: req.user,
    exp: new Date(req.user.exp * 1000),
  });
});

export default router;
