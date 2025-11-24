import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const createAdmin = async () => {
  try {
    const existing = await Admin.findOne({ username: "ashish@myagency.com" });
    if (existing) {
      console.log("Admin already exists!");
      mongoose.disconnect();
      return;
    }

    const hashed = await bcrypt.hash("Maajanki@2025", 10);

    const admin = new Admin({
      username: "ashish@myagency.com",
      password: hashed,
    });

    await admin.save();
    console.log("Admin created successfully!");
    console.log("Username: admin@example.com");
    console.log("Password: admin123");
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();
