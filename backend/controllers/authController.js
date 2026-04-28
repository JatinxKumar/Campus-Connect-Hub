import User from "../models/User.js";
import LoginHistory from "../models/LoginHistory.js";
import { isMongoReady } from "../config/db.js";
import { getNextId, loadLocalDb, saveLocalDb, getNextLocalId, removeMongooseMetadata } from "../utils/helpers.js";

const DISABLED_DEMO_EMAIL = "admin@campusconnect.demo";
const DISABLED_DEMO_PASSWORD = "admin123";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedPassword = typeof password === "string" ? password.trim() : "";

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (normalizedEmail === DISABLED_DEMO_EMAIL && normalizedPassword === DISABLED_DEMO_PASSWORD) {
      return res.status(400).json({ message: "Demo credentials are disabled" });
    }

    if (normalizedPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (!isMongoReady()) {
      const db = await loadLocalDb();
      const existingUser = db.users.find((user) => user.email === normalizedEmail);
      if (existingUser) {
        return res.status(409).json({ message: "An account with this email already exists" });
      }

      const createdUser = {
        id: getNextLocalId(db.users),
        name: normalizedName,
        email: normalizedEmail,
        password: normalizedPassword,
        provider: "credentials",
        createdAt: new Date().toISOString(),
      };

      db.users.push(createdUser);
      await saveLocalDb(db);

      return res.status(201).json({
        message: "Account created successfully",
        user: { name: createdUser.name, email: createdUser.email },
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const id = await getNextId(User);
    const createdUser = new User({
      id,
      name: normalizedName,
      email: normalizedEmail,
      password: normalizedPassword,
      provider: "credentials"
    });
    
    await createdUser.save();

    res.status(201).json({
      message: "Account created successfully",
      user: { name: createdUser.name, email: createdUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, name, provider } = req.body || {};
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedProvider = provider === "google" ? "google" : "credentials";

    if (!isMongoReady()) {
      const db = await loadLocalDb();

      if (normalizedProvider === "credentials") {
        if (normalizedEmail === DISABLED_DEMO_EMAIL && password === DISABLED_DEMO_PASSWORD) {
          return res.status(401).json({ message: "Demo credentials are disabled" });
        }

        const foundUser = db.users.find((user) => user.email === normalizedEmail);
        if (!foundUser || foundUser.password !== password) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const userDetail = { name: foundUser.name, email: foundUser.email, picture: undefined };
        db.loginHistory.unshift({
          id: getNextLocalId(db.loginHistory),
          user: userDetail,
          password: foundUser.password,
          provider: normalizedProvider,
          at: new Date().toISOString(),
        });
        await saveLocalDb(db);

        return res.json({ message: "Login recorded", user: userDetail });
      }

      if (!normalizedEmail || !name) {
        return res.status(400).json({ message: "Google login requires email and name" });
      }

      let existingGoogleUser = db.users.find((user) => user.email === normalizedEmail);
      if (!existingGoogleUser) {
        existingGoogleUser = {
          id: getNextLocalId(db.users),
          name: name.trim(),
          email: normalizedEmail,
          password: "",
          provider: "google",
          createdAt: new Date().toISOString(),
        };
        db.users.push(existingGoogleUser);
      }

      const userDetail = {
        name: typeof name === "string" && name.trim() ? name.trim() : "Google User",
        email: normalizedEmail,
        picture: typeof req.body?.picture === "string" ? req.body.picture : undefined,
      };

      db.loginHistory.unshift({
        id: getNextLocalId(db.loginHistory),
        user: userDetail,
        password: "",
        provider: normalizedProvider,
        at: new Date().toISOString(),
      });
      await saveLocalDb(db);

      return res.json({ message: "Login recorded", user: userDetail });
    }

    if (normalizedProvider === "credentials") {
      if (normalizedEmail === DISABLED_DEMO_EMAIL && password === DISABLED_DEMO_PASSWORD) {
        return res.status(401).json({ message: "Demo credentials are disabled" });
      }

      const foundUser = await User.findOne({ email: normalizedEmail });
      if (!foundUser || foundUser.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const userDetail = { name: foundUser.name, email: foundUser.email, picture: undefined };

      const historyId = await getNextId(LoginHistory);
      await new LoginHistory({
        id: historyId,
        user: userDetail,
        password: foundUser.password,
        provider: normalizedProvider
      }).save();

      return res.json({ message: "Login recorded", user: userDetail });
    }

    if (normalizedProvider === "google" && (!normalizedEmail || !name)) {
      return res.status(400).json({ message: "Google login requires email and name" });
    }

    if (normalizedProvider === "google") {
      let existingGoogleUser = await User.findOne({ email: normalizedEmail });
      if (!existingGoogleUser) {
        const id = await getNextId(User);
        existingGoogleUser = await new User({
          id,
          name: name.trim(),
          email: normalizedEmail,
          password: "",
          provider: "google"
        }).save();
      }
    }

    const userDetail = {
      name: typeof name === "string" && name.trim() ? name.trim() : "Google User",
      email: normalizedEmail,
      picture: typeof req.body?.picture === "string" ? req.body.picture : undefined,
    };

    const historyId = await getNextId(LoginHistory);
    await new LoginHistory({
      id: historyId,
      user: userDetail,
      password: "",
      provider: normalizedProvider
    }).save();

    res.json({ message: "Login recorded", user: userDetail });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const getLogins = async (req, res) => {
  try {
    if (!isMongoReady()) {
      const db = await loadLocalDb();
      return res.json({ logins: db.loginHistory });
    }

    const logins = await LoginHistory.find().sort({ at: -1 });
    res.json({ logins: logins.map(removeMongooseMetadata) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch logins", error: error.message });
  }
};
