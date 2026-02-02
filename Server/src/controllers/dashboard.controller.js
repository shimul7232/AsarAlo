import User from "../models/User.models.js";
import Appointment from "../models/Appointment.models.js";
import MedicalTestPrice from "../models/MedicalTestPrice.models.js";
import Doctor from "../models/Doctor.models.js";

// Admin Dashboard - List all users, appointments, tests, doctors
export const getAdminDashboard = async (req, res) => {
  try {
    const users = await User.find({}, "name email role profilePicture"); // Exclude password
    const appointments = await Appointment.find().populate('doctorId', 'name specialization');
    const tests = await MedicalTestPrice.find();
    const doctors = await Doctor.find();
    res.json({ users, appointments, tests, doctors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user (admin only)
export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, role }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User Dashboard - Get user info
export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "name email role profilePicture");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};