import Doctor from "../models/Doctor.models.js";
import path from "path";
import fs from "fs";

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new doctor
export const createDoctor = async (req, res) => {
  try {
    const { name, email, specialization, experience, phone, address, bio, availability } = req.body;
    
    const doctorData = { name, email, specialization, experience, phone, address, bio, availability };
    
    // Add profile picture if file was uploaded
    if (req.file) {
      doctorData.profilePicture = `/uploads/${req.file.filename}`;
      console.log('File uploaded:', req.file.filename);
    }
    
    const doctor = new Doctor(doctorData);
    await doctor.save();
    res.status(201).json({ message: "Doctor created", doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update doctor
export const updateDoctor = async (req, res) => {
  try {
    const { name, email, specialization, experience, phone, address, bio, availability } = req.body;
    
    const updateData = { name, email, specialization, experience, phone, address, bio, availability };
    
    // Add profile picture if new file was uploaded
    if (req.file) {
      updateData.profilePicture = `/uploads/${req.file.filename}`;
      console.log('File updated:', req.file.filename);
    }
    
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor updated", doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    // Remove profile picture if exists
    if (doctor.profilePicture) {
      const oldPath = path.join(process.cwd(), doctor.profilePicture);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload doctor profile picture
export const uploadDoctorPicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Validate file type (image only)
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(req.file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(req.file.mimetype);

    if (!mimetype || !extname) {
      fs.unlinkSync(req.file.path); // Delete invalid file
      return res.status(400).json({ message: "Only image files are allowed" });
    }

    // Validate file size (e.g., 5MB max)
    if (req.file.size > 5 * 1024 * 1024) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "File size too large (max 5MB)" });
    }

    // Update doctor profile picture
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Remove old profile picture if exists
    if (doctor.profilePicture) {
      const oldPath = path.join(process.cwd(), doctor.profilePicture);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Set new profile picture path
    doctor.profilePicture = `/uploads/${req.file.filename}`;
    await doctor.save();

    res.json({ message: "Doctor picture updated", profilePicture: doctor.profilePicture });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};