import express from "express";
import {
  getAllMedicalTestPrices,
  getMedicalTestPriceById,
  createMedicalTestPrice,
  updateMedicalTestPrice,
  deleteMedicalTestPrice
} from "../controllers/medicalTestPrice.controller.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require admin
router.use(authenticateToken, requireAdmin);

// Get all medical test prices
router.get("/", getAllMedicalTestPrices);

// Get medical test price by ID
router.get("/:id", getMedicalTestPriceById);

// Create new medical test price
router.post("/", createMedicalTestPrice);

// Update medical test price
router.put("/:id", updateMedicalTestPrice);

// Delete medical test price
router.delete("/:id", deleteMedicalTestPrice);

export default router;