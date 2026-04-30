import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");
      req.user = await User.findOne({ id: decoded.userId }).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.email.toLowerCase().endsWith("@chitkara.edu.in")) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};
