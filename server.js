import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus-connect";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_DB_PATH = path.join(__dirname, "backend-db.json");

// Demo Constraints
const DISABLED_DEMO_EMAIL = "admin@campusconnect.demo";
const DISABLED_DEMO_PASSWORD = "admin123";

// -------- Mongoose Definitions -------- //
const UserSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  provider: { type: String, default: "credentials" },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", UserSchema);

const ClubSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  members: { type: Number, default: 0 },
  coordinator: { type: String, required: true },
  image: { type: String },
  featured: { type: Boolean, default: false }
});
const Club = mongoose.model("Club", ClubSchema);

const LoginHistorySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  user: { type: Object, required: true },
  password: { type: String },
  provider: { type: String },
  at: { type: Date, default: Date.now }
});
const LoginHistory = mongoose.model("LoginHistory", LoginHistorySchema);

const isMongoReady = () => mongoose.connection.readyState === 1;

const loadLocalDb = async () => {
  const raw = await readFile(LOCAL_DB_PATH, "utf8");
  const parsed = JSON.parse(raw);
  return {
    clubs: Array.isArray(parsed.clubs) ? parsed.clubs : [],
    users: Array.isArray(parsed.users) ? parsed.users : [],
    loginHistory: Array.isArray(parsed.loginHistory) ? parsed.loginHistory : [],
  };
};

const saveLocalDb = async (db) => {
  await writeFile(LOCAL_DB_PATH, `${JSON.stringify(db, null, 2)}\n`, "utf8");
};

const getNextLocalId = (items) =>
  items.reduce((highest, item) => {
    const current = Number(item?.id) || 0;
    return current > highest ? current : highest;
  }, 0) + 1;

// Helper for generating sequential IDs safely against MongoDB
async function getNextId(Model) {
  const highest = await Model.findOne({}, 'id').sort('-id');
  return highest && highest.id ? highest.id + 1 : 1;
}

// Default Data Seed
const defaultClubs = [
  {
    id: 1, name: "Coding Club", description: "Learn programming, participate in hackathons, and build amazing projects together.",
    category: "Technical", members: 145, coordinator: "Dr. Sarah Johnson", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop", featured: true
  },
  {
    id: 2, name: "Robotics Club", description: "Design, build, and program robots for competitions and real-world applications.",
    category: "Technical", members: 87, coordinator: "Prof. Michael Chen", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop", featured: true
  },
  {
    id: 3, name: "Drama Society", description: "Express yourself through theater, stage performances, and creative storytelling.",
    category: "Arts", members: 92, coordinator: "Ms. Emily Rodriguez", image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop", featured: false
  },
  {
    id: 4, name: "Photography Club", description: "Capture moments, learn photography techniques, and showcase your creative vision.",
    category: "Arts", members: 76, coordinator: "Mr. David Lee", image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop", featured: true
  },
  {
    id: 5, name: "Environmental Club", description: "Make a difference through sustainability initiatives and environmental awareness campaigns.",
    category: "Social", members: 134, coordinator: "Dr. Rachel Green", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop", featured: false
  },
  {
    id: 6, name: "Music Society", description: "Create harmony through instrumental and vocal performances across all genres.",
    category: "Arts", members: 108, coordinator: "Prof. James Williams", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop", featured: false
  },
  {
    id: 7, name: "Debate Club", description: "Sharpen your argumentation skills and compete in inter-college debate competitions.",
    category: "Academic", members: 65, coordinator: "Ms. Patricia Brown", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop", featured: false
  },
  {
    id: 8, name: "Sports Club", description: "Stay fit, play various sports, and represent the college in athletic events.",
    category: "Sports", members: 201, coordinator: "Coach Mark Thompson", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop", featured: false
  }
];

mongoose.connect(MONGO_URI).then(async () => {
  console.log("Successfully connected to MongoDB");
  const count = await Club.countDocuments();
  if (count === 0) {
    console.log("Database empty. Seeding default clubs...");
    await Club.insertMany(defaultClubs);
  }
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// -------- Express Configuration -------- //
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

// A helper function to cast mongoose documents accurately back to plain objects exactly like JSON
const removeMongooseMetadata = (doc) => {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : doc;
  delete obj._id;
  delete obj.__v;
  return obj;
}

// -------- Endpoints -------- //
app.get("/", (req, res) => {
  res.json({
    message: "Campus Connect MongoDB Backend is running",
    routes: [
      "POST /auth/register",
      "POST /auth/login",
      "GET /auth/logins",
      "GET /api/clubs",
      "POST /api/clubs",
      "PUT /api/clubs/:id",
      "DELETE /api/clubs/:id",
      "POST /api/clubs/:id/join",
    ],
  });
});

app.post("/auth/register", async (req, res) => {
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
});

app.post("/auth/login", async (req, res) => {
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
});

app.get("/auth/logins", async (req, res) => {
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
});

app.get("/api/clubs", async (req, res) => {
  try {
    if (!isMongoReady()) {
      const db = await loadLocalDb();
      return res.json({ clubs: db.clubs.sort((a, b) => a.id - b.id) });
    }

    const clubs = await Club.find().sort({ id: 1 });
    res.json({ clubs: clubs.map(removeMongooseMetadata) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch clubs", error: error.message });
  }
});

app.post("/api/clubs", async (req, res) => {
  try {
    const { name, description, category, coordinator, image, featured } = req.body || {};

    if (!name || !description || !category || !coordinator) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isMongoReady()) {
      const db = await loadLocalDb();
      const createdClub = {
        id: getNextLocalId(db.clubs),
        name: String(name).trim(),
        description: String(description).trim(),
        category: String(category).trim(),
        members: 0,
        coordinator: String(coordinator).trim(),
        image: image ? String(image).trim() : "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
        featured: Boolean(featured),
      };

      db.clubs.push(createdClub);
      await saveLocalDb(db);
      return res.status(201).json({ message: "Club created", club: createdClub });
    }

    const id = await getNextId(Club);
    const createdClub = new Club({
      id,
      name: String(name).trim(),
      description: String(description).trim(),
      category: String(category).trim(),
      members: 0,
      coordinator: String(coordinator).trim(),
      image: image ? String(image).trim() : "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
      featured: Boolean(featured),
    });

    await createdClub.save();
    res.status(201).json({ message: "Club created", club: removeMongooseMetadata(createdClub) });
  } catch (error) {
    res.status(500).json({ message: "Failed to create club", error: error.message });
  }
});

app.put("/api/clubs/:id", async (req, res) => {
  try {
    const clubId = Number(req.params.id);

    if (!isMongoReady()) {
      const db = await loadLocalDb();
      const clubIndex = db.clubs.findIndex((club) => club.id === clubId);
      if (clubIndex === -1) {
        return res.status(404).json({ message: "Club not found" });
      }

      const updatedClub = {
        ...db.clubs[clubIndex],
        ...Object.fromEntries(
          Object.entries(req.body || {}).filter(([key]) => key !== "id" && key !== "_id")
        ),
      };

      if (Number.isInteger(req.body?.members)) {
        updatedClub.members = req.body.members;
      }

      db.clubs[clubIndex] = updatedClub;
      await saveLocalDb(db);
      return res.json({ message: "Club updated", club: updatedClub });
    }

    const existingClub = await Club.findOne({ id: clubId });
    if (!existingClub) {
      return res.status(404).json({ message: "Club not found" });
    }
    
    // Assign fields except ID
    Object.keys(req.body).forEach(key => {
        if(key !== 'id' && key !== '_id') {
            existingClub[key] = req.body[key];
        }
    })
    
    // Explicitly validate membership to avoid NaN or invalid types if sent incorrectly
    if (Number.isInteger(req.body?.members)) {
        existingClub.members = req.body.members;
    }

    await existingClub.save();
    res.json({ message: "Club updated", club: removeMongooseMetadata(existingClub) });
  } catch (error) {
    res.status(500).json({ message: "Failed to update club", error: error.message });
  }
});

app.delete("/api/clubs/:id", async (req, res) => {
  try {
    const clubId = Number(req.params.id);

    if (!isMongoReady()) {
      const db = await loadLocalDb();
      const clubIndex = db.clubs.findIndex((club) => club.id === clubId);
      if (clubIndex === -1) {
        return res.status(404).json({ message: "Club not found" });
      }

      const [removedClub] = db.clubs.splice(clubIndex, 1);
      await saveLocalDb(db);
      return res.json({ message: "Club deleted", club: removedClub });
    }

    const removedClub = await Club.findOneAndDelete({ id: clubId });

    if (!removedClub) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.json({ message: "Club deleted", club: removeMongooseMetadata(removedClub) });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete club", error: error.message });
  }
});

app.post("/api/clubs/:id/join", async (req, res) => {
  try {
    const clubId = Number(req.params.id);

    if (!isMongoReady()) {
      const db = await loadLocalDb();
      const club = db.clubs.find((entry) => entry.id === clubId);
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }

      club.members += 1;
      await saveLocalDb(db);
      return res.json({ message: "Club member count updated", club });
    }

    const club = await Club.findOne({ id: clubId });

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    club.members += 1;
    await club.save();
    res.json({ message: "Club member count updated", club: removeMongooseMetadata(club) });
  } catch (error) {
    res.status(500).json({ message: "Failed to join club", error: error.message });
  }
});

app.post("/echo", (req, res) => {
  res.json({
    message: "Data received successfully",
    data: req.body,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
