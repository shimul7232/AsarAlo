import express from "express";
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  uploadDoctorPicture
} from "../controllers/doctor.controller.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";
import upload from "../config/multer.js";

const router = express.Router();

// Get all doctors - PUBLIC endpoint
router.get("/", getAllDoctors);

// Get doctor by ID - PUBLIC endpoint
router.get("/:id", getDoctorById);

// All other routes require admin
router.use(authenticateToken, requireAdmin);

// Create new doctor with image upload
router.post("/", upload.single('profilePicture'), createDoctor);

// Update doctor with image upload
router.put("/:id", upload.single('profilePicture'), updateDoctor);

// Delete doctor
router.delete("/:id", deleteDoctor);

// Upload doctor picture
router.post("/:id/upload-picture", upload.single('profilePicture'), uploadDoctorPicture);

export default router;