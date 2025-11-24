import mongoose from "mongoose";

const careerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  position: String,
  message: String,
  cv: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Career", careerSchema);
