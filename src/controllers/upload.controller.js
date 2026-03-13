import User from "../models/User.models.js";
import path from "path";
import fs from "fs";

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
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

    // Update user profile picture
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove old profile picture if exists
    if (user.profilePicture) {
      const oldPath = path.join(process.cwd(), user.profilePicture);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Set new profile picture path
    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: "Profile picture updated", profilePicture: user.profilePicture });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};