import mongoose from "mongoose";

const ClubSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  members: { type: Number, default: 0 },
  coordinator: { type: String, required: true },
  image: { type: String },
  featured: { type: Boolean, default: false }
});

export default mongoose.model("Club", ClubSchema);
