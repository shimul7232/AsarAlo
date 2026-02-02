import Appointment from "../models/Appointment.models.js";

// Get all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctorId', 'name specialization');
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('doctorId', 'name specialization');
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new appointment
export const createAppointment = async (req, res) => {
  try {
    const { patientName, patientEmail, doctorId, appointmentDate, appointmentTime, notes } = req.body;
    const appointment = new Appointment({ patientName, patientEmail, doctorId, appointmentDate, appointmentTime, notes });
    await appointment.save();
    res.status(201).json({ message: "Appointment created", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update appointment
export const updateAppointment = async (req, res) => {
  try {
    const { patientName, patientEmail, doctorId, appointmentDate, appointmentTime, status, notes } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { patientName, patientEmail, doctorId, appointmentDate, appointmentTime, status, notes }, { new: true });
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment updated", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};