import express from "express";
import fs from "fs";

const app = express();
const PORT = 3000;
const DB_FILE = new URL("./backend-db.json", import.meta.url);

const DEMO_EMAIL = "admin@campusconnect.demo";
const DEMO_PASSWORD = "admin123";

const defaultClubs = [
  {
    id: 1,
    name: "Coding Club",
    description: "Learn programming, participate in hackathons, and build amazing projects together.",
    category: "Technical",
    members: 145,
    coordinator: "Dr. Sarah Johnson",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
    featured: true,
  },
  {
    id: 2,
    name: "Robotics Club",
    description: "Design, build, and program robots for competitions and real-world applications.",
    category: "Technical",
    members: 87,
    coordinator: "Prof. Michael Chen",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
    featured: true,
  },
  {
    id: 3,
    name: "Drama Society",
    description: "Express yourself through theater, stage performances, and creative storytelling.",
    category: "Arts",
    members: 92,
    coordinator: "Ms. Emily Rodriguez",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    name: "Photography Club",
    description: "Capture moments, learn photography techniques, and showcase your creative vision.",
    category: "Arts",
    members: 76,
    coordinator: "Mr. David Lee",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop",
    featured: true,
  },
  {
    id: 5,
    name: "Environmental Club",
    description: "Make a difference through sustainability initiatives and environmental awareness campaigns.",
    category: "Social",
    members: 134,
    coordinator: "Dr. Rachel Green",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop",
  },
  {
    id: 6,
    name: "Music Society",
    description: "Create harmony through instrumental and vocal performances across all genres.",
    category: "Arts",
    members: 108,
    coordinator: "Prof. James Williams",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop",
  },
  {
    id: 7,
    name: "Debate Club",
    description: "Sharpen your argumentation skills and compete in inter-college debate competitions.",
    category: "Academic",
    members: 65,
    coordinator: "Ms. Patricia Brown",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop",
  },
  {
    id: 8,
    name: "Sports Club",
    description: "Stay fit, play various sports, and represent the college in athletic events.",
    category: "Sports",
    members: 201,
    coordinator: "Coach Mark Thompson",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop",
  },
];

const loadDatabase = () => {
  if (!fs.existsSync(DB_FILE)) {
    return {
      clubs: defaultClubs,
      loginHistory: [],
    };
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      clubs: Array.isArray(parsed.clubs) ? parsed.clubs : defaultClubs,
      loginHistory: Array.isArray(parsed.loginHistory) ? parsed.loginHistory : [],
    };
  } catch {
    return {
      clubs: defaultClubs,
      loginHistory: [],
    };
  }
};

const database = loadDatabase();
const clubs = database.clubs;
const loginHistory = database.loginHistory;

const persistDatabase = () => {
  const payload = {
    clubs,
    loginHistory,
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), "utf-8");
};

// Ensure DB file is always present after server startup.
persistDatabase();

const getNextId = (items) => {
  if (items.length === 0) {
    return 1;
  }
  return Math.max(...items.map((item) => item.id)) + 1;
};

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

app.get("/", (req, res) => {
  res.json({
    message: "Campus Connect backend is running",
    routes: [
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

app.post("/auth/login", (req, res) => {
  const { email, password, name, provider } = req.body || {};
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const normalizedProvider = provider === "google" ? "google" : "credentials";

  if (normalizedProvider === "credentials") {
    if (normalizedEmail !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
  }

  if (normalizedProvider === "google" && (!normalizedEmail || !name)) {
    res.status(400).json({ message: "Google login requires email and name" });
    return;
  }

  const user = {
    name: typeof name === "string" && name.trim() ? name.trim() : "Demo Admin",
    email: normalizedEmail || DEMO_EMAIL,
    picture: typeof req.body?.picture === "string" ? req.body.picture : undefined,
  };

  loginHistory.unshift({
    id: getNextId(loginHistory),
    user,
    provider: normalizedProvider,
    at: new Date().toISOString(),
  });

  persistDatabase();

  res.json({ message: "Login recorded", user });
});

app.get("/auth/logins", (req, res) => {
  res.json({ logins: loginHistory });
});

app.get("/api/clubs", (req, res) => {
  res.json({ clubs });
});

app.post("/api/clubs", (req, res) => {
  const { name, description, category, coordinator, image, featured } = req.body || {};

  if (!name || !description || !category || !coordinator) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const createdClub = {
    id: getNextId(clubs),
    name: String(name).trim(),
    description: String(description).trim(),
    category: String(category).trim(),
    members: 0,
    coordinator: String(coordinator).trim(),
    image: image
      ? String(image).trim()
      : "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
    featured: Boolean(featured),
  };

  clubs.push(createdClub);
  persistDatabase();
  res.status(201).json({ message: "Club created", club: createdClub });
});

app.put("/api/clubs/:id", (req, res) => {
  const clubId = Number(req.params.id);
  const index = clubs.findIndex((club) => club.id === clubId);

  if (index < 0) {
    res.status(404).json({ message: "Club not found" });
    return;
  }

  const current = clubs[index];
  const updatedClub = {
    ...current,
    ...req.body,
    id: current.id,
    members: Number.isInteger(req.body?.members) ? req.body.members : current.members,
  };

  clubs[index] = updatedClub;
  persistDatabase();
  res.json({ message: "Club updated", club: updatedClub });
});

app.delete("/api/clubs/:id", (req, res) => {
  const clubId = Number(req.params.id);
  const index = clubs.findIndex((club) => club.id === clubId);

  if (index < 0) {
    res.status(404).json({ message: "Club not found" });
    return;
  }

  const [removed] = clubs.splice(index, 1);
  persistDatabase();
  res.json({ message: "Club deleted", club: removed });
});

app.post("/api/clubs/:id/join", (req, res) => {
  const clubId = Number(req.params.id);
  const club = clubs.find((clubItem) => clubItem.id === clubId);

  if (!club) {
    res.status(404).json({ message: "Club not found" });
    return;
  }

  club.members += 1;
  persistDatabase();
  res.json({ message: "Club member count updated", club });
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
