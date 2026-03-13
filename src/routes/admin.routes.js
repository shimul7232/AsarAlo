import express from "express";
import { getAdminDashboard, updateUser, deleteUser } from "../controllers/dashboard.controller.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin dashboard
router.get("/admin/dashboard", authenticateToken, requireAdmin, getAdminDashboard);

// User management
router.put("/users/:id", authenticateToken, requireAdmin, updateUser);
router.delete("/users/:id", authenticateToken, requireAdmin, deleteUser);

export default router;