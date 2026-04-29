import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  club: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  image: { type: String, required: true },
  registrationOpen: { type: Boolean, default: true },
  status: { 
    type: String, 
    enum: ["upcoming", "ongoing", "completed"], 
    default: "upcoming" 
  },
  currentParticipants: { type: Number, default: 0 },
  maxParticipants: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Event", EventSchema);
