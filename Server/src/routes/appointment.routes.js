import express from "express";
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from "../controllers/appointment.controller.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require admin
router.use(authenticateToken, requireAdmin);

// Get all appointments
router.get("/", getAllAppointments);

// Get appointment by ID
router.get("/:id", getAppointmentById);

// Create new appointment
router.post("/", createAppointment);

// Update appointment
router.put("/:id", updateAppointment);

// Delete appointment
router.delete("/:id", deleteAppointment);

export default router;