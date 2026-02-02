import MedicalTestPrice from "../models/MedicalTestPrice.models.js";

// Get all medical test prices
export const getAllMedicalTestPrices = async (req, res) => {
  try {
    const tests = await MedicalTestPrice.find();
    res.json({ tests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get medical test price by ID
export const getMedicalTestPriceById = async (req, res) => {
  try {
    const test = await MedicalTestPrice.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json({ test });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new medical test price
export const createMedicalTestPrice = async (req, res) => {
  try {
    const { testName, description, price, category } = req.body;
    const test = new MedicalTestPrice({ testName, description, price, category });
    await test.save();
    res.status(201).json({ message: "Test price created", test });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update medical test price
export const updateMedicalTestPrice = async (req, res) => {
  try {
    const { testName, description, price, category } = req.body;
    const test = await MedicalTestPrice.findByIdAndUpdate(req.params.id, { testName, description, price, category }, { new: true });
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json({ message: "Test price updated", test });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete medical test price
export const deleteMedicalTestPrice = async (req, res) => {
  try {
    const test = await MedicalTestPrice.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json({ message: "Test price deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};