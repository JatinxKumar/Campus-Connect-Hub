import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { corsMiddleware } from "./middleware/cors.js";

import authRoutes from "./routes/authRoutes.js";
import clubRoutes from "./routes/clubRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(corsMiddleware);

// API Routes
app.use("/auth", authRoutes);
app.use("/api/clubs", clubRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Campus Connect MongoDB Backend is running (MVC Architecture)",
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

app.post("/echo", (req, res) => {
  res.json({
    message: "Data received successfully",
    data: req.body,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
