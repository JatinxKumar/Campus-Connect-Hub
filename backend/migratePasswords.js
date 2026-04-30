import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import 'dotenv/config';

const migrate = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    const users = await User.find();
    console.log(`Found ${users.length} users. Checking for plain-text passwords...`);

    let updatedCount = 0;
    for (const user of users) {
      if (user.password && !user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")) {
        console.log(`Hashing password for user: ${user.email}`);
        // We trigger the pre-save hook by setting the password and saving
        // Actually, the pre-save hook in the model will handle it if we just save.
        // But to be sure, let's manually hash it or just save.
        // The model pre-save hook checks isModified('password').
        user.password = user.password; 
        user.markModified('password');
        await user.save();
        updatedCount++;
      }
    }

    console.log(`Migration complete. ${updatedCount} users updated.`);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrate();
