import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { EventEmitter } from "events";

import adminRoutes from "./routes/adminRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();
const app = express();

// Increase max event listeners to avoid warnings
EventEmitter.defaultMaxListeners = 20;

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files (PDFs, images, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve favicon (optional)
app.use("/favicon.ico", express.static(path.join(__dirname, "public", "favicon.ico")));

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/contact", contactRoutes);

// Serve React frontend build (if you have client/build folder)
app.use(express.static(path.join(__dirname, "client/build")));

// Catch-all route to serve SPA React frontend (after API routes)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
