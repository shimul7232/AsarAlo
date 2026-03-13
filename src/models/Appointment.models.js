import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  patientName: String,
  patientEmail: String,

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

  appointmentDate: String,
  appointmentTime: String,

  status: {
    type: String,
    default: "pending"
  },

  notes: String
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
