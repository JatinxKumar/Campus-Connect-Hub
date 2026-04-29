import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/Event.js";

dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const count = await Event.countDocuments();
  const first = await Event.findOne();
  console.log("Total events:", count);
  console.log("First event:", JSON.stringify(first, null, 2));
  process.exit(0);
}

check();
