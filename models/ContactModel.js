import mongoose from "mongoose";
import Contact from "../models/ContactModel.js";


const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
