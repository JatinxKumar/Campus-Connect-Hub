import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import 'dotenv/config';

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = "manu@chitkara.edu.in";
    const newPassword = "123456789";

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found.");
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    console.log(`Password reset successfully for ${email}`);
    process.exit(0);
  } catch (error) {
    console.error("Reset failed:", error);
    process.exit(1);
  }
};

reset();
