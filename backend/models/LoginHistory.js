import mongoose from "mongoose";

const LoginHistorySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  user: { type: Object, required: true },
  password: { type: String },
  provider: { type: String },
  at: { type: Date, default: Date.now }
});

export default mongoose.model("LoginHistory", LoginHistorySchema);
