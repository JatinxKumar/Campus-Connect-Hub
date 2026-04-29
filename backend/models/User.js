import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  provider: { type: String, default: "credentials" },
  bio: { type: String, default: "" },
  interests: { type: [String], default: [] },
  socialLinks: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    portfolio: { type: String, default: "" },
  },
  joinedClubIds: { type: [Number], default: [] },
  eventRegistrations: [{
    eventId: { type: Number, required: true },
    ticketCode: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now },
    attendanceConfirmed: { type: Boolean, default: false },
    certificateIssuedAt: { type: Date }
  }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
