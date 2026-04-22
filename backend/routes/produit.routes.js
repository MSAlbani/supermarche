import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/produit.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticate, getProducts);
router.post("/", authenticate, createProduct);
router.put("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;
