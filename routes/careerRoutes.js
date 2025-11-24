import express from "express";
import multer from "multer";
import Career from "../models/Career.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

router.post("/", upload.single("cv"), async (req, res) => {
  try {
    const { name, email, phone, position, message } = req.body;
    const cvPath = req.file ? req.file.path : "";

    const newCareer = new Career({
      name,
      email,
      phone,
      position,
      message,
      cv: cvPath,
    });

    await newCareer.save();
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error("Error saving career:", error);
    res.status(500).json({ message: "Failed to submit application!" });
  }
});

// ---------- GET All Applications ----------
router.get("/", async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    res.json(careers);
  } catch (error) {
    console.error("Error fetching careers:", error);
    res.status(500).json({ message: "Failed to fetch applications!" });
  }
});

// Protected GET Route
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

export default router;
