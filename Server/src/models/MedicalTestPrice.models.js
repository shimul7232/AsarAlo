import mongoose from "mongoose";

const medicalTestPriceSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true }, // in currency units
  category: { type: String, default: "" }, // e.g., "Blood Test", "X-Ray"
}, { timestamps: true });

const MedicalTestPrice = mongoose.model("MedicalTestPrice", medicalTestPriceSchema);
export default MedicalTestPrice;