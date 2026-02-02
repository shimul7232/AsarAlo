import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialization: { type: String, required: true },
  experience: { type: Number, default: 0 }, // years
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  profilePicture: { type: String, default: null }, // URL or path to image
  bio: { type: String, default: "" },
  availability: { type: [String], default: [] }, // e.g., ["Monday 9-5", "Tuesday 10-6"]
}, { timestamps: true });

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;