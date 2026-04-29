import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Models
import Club from "./models/Club.js";
import User from "./models/User.js";
import LoginHistory from "./models/LoginHistory.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const JSON_FILE_PATH = path.join(__dirname, "backend-db.json");

async function migrate() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI not found in .env file");
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("Successfully connected to MongoDB Atlas!");

    // Read JSON data
    if (!fs.existsSync(JSON_FILE_PATH)) {
      throw new Error("backend-db.json not found");
    }
    const rawData = fs.readFileSync(JSON_FILE_PATH, "utf8");
    const data = JSON.parse(rawData);

    // Migrate Clubs
    if (data.clubs && data.clubs.length > 0) {
      console.log(`Migrating ${data.clubs.length} clubs...`);
      await Club.deleteMany({}); // Optional: clear existing data
      await Club.insertMany(data.clubs);
      console.log("Clubs migrated successfully.");
    }

    // Migrate Users
    if (data.users && data.users.length > 0) {
      console.log(`Migrating ${data.users.length} users...`);
      await User.deleteMany({});
      await User.insertMany(data.users);
      console.log("Users migrated successfully.");
    }

    // Migrate Login History
    if (data.loginHistory && data.loginHistory.length > 0) {
      console.log(`Migrating ${data.loginHistory.length} login history records...`);
      await LoginHistory.deleteMany({});
      await LoginHistory.insertMany(data.loginHistory);
      console.log("Login history migrated successfully.");
    }

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  }
}

migrate();
