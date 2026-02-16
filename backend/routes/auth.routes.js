import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

export default router;
