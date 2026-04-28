import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  provider: { type: String, default: "credentials" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
