import mongoose from "mongoose";

const ClubMembershipSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  clubId: { type: Number, required: true },
  clubName: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  rollNumber: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
  joinedAt: { type: Date, default: Date.now },
});

export default mongoose.model("ClubMembership", ClubMembershipSchema, "clubmemberships");
