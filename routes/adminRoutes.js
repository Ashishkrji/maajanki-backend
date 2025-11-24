import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

// 🧩 Admin Registration (run once to create admin)
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering admin" });
  }
});

// 🧩 Admin Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || "mySecretKey",
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
});

export default router;
