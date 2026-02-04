import Appointment from "../models/Appointment.models.js";

/* ================= USER ================= */

// Create appointment (USER)
export const createAppointment = async (req, res) => {
  try {
    const {
      patientName,
      patientEmail,
      doctorId,
      appointmentDate,
      appointmentTime,
      notes
    } = req.body;

    const appointment = new Appointment({
      userId: req.user.id,
      patientName,
      patientEmail,
      doctorId,
      appointmentDate,
      appointmentTime,
      notes
    });

    await appointment.save();

    res.status(201).json({
      message: "Appointment created successfully",
      appointment
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get logged-in user's appointments
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.user.id
    }).populate("doctorId", "name specialization");

    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADMIN ================= */

// Get all appointments (ADMIN)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctorId", "name specialization")
      .populate("userId", "name email");

    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("doctorId", "name specialization")
      .populate("userId", "name email");

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    res.json({ appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update appointment (ADMIN)
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    res.json({ message: "Appointment updated", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete appointment (ADMIN)
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
