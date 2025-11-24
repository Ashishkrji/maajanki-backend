import express from "express";
import axios from "axios";
import Contact from "../models/ContactModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 1️⃣ Save to MongoDB
    const newContact = new Contact({ name, email, phone, service, message });
    await newContact.save();

    // 2️⃣ Save to Google Sheets
    try {
      await axios.post(process.env.GOOGLE_SHEET_WEBHOOK_URL, req.body, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (gsError) {
      console.error("Google Sheets error:", gsError.message);
    }

    res.status(201).json({ message: "Thank you! We’ll get back to you soon." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

export default router;
