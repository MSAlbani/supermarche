import { getAllUsers } from "../controllers/user.controller.js";
import express from "express";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/allUsers", authenticate, getAllUsers);

export default router;
