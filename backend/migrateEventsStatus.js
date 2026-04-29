import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/Event.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas for migration...");

    const result = await Event.updateMany(
      { status: { $exists: false } },
      { $set: { status: "upcoming" } }
    );

    console.log(`Migration complete! Updated ${result.modifiedCount} events.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
