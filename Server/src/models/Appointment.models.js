import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true }, // e.g., "10:00 AM"
  status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
  notes: { type: String, default: "" },
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;