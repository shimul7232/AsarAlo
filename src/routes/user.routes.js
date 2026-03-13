import express from "express";
import { getUserDashboard } from "../controllers/dashboard.controller.js";
import { getAllMedicalTestPrices } from "../controllers/medicalTestPrice.controller.js";
import { uploadProfilePicture } from "../controllers/upload.controller.js";
import { authenticateToken, requireUser } from "../middlewares/auth.middleware.js";
import upload from "../config/multer.js"; // Assuming multer config exists

const router = express.Router();

// User dashboard
router.get("/user/dashboard", authenticateToken, requireUser, getUserDashboard);

// Public: get medical test prices
router.get("/medical-test-prices", getAllMedicalTestPrices);

// Upload profile picture
router.post("/user/upload-profile-picture", authenticateToken, requireUser, upload.single("profilePicture"), uploadProfilePicture);

export default router;