import express from "express";
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getMyAppointments
} from "../controllers/appointment.controller.js";

import {
  authenticateToken,
  requireAdmin,
  requireUser
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes need login
router.use(authenticateToken);

// USER
router.post("/",createAppointment);
router.get("/my", requireUser, getMyAppointments);

// ADMIN
router.get("/", requireAdmin, getAllAppointments);
router.put("/:id", requireAdmin, updateAppointment);
router.delete("/:id", requireAdmin, deleteAppointment);

// SHARED
router.get("/:id", getAppointmentById);

export default router;
