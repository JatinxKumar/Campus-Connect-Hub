import express from "express";
import { 
  registerUser, 
  loginUser, 
  getLogins, 
  getUserProfile, 
  updateUserProfile, 
  joinClub, 
  leaveClub,
  verifySession,
  logoutUser
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/verify", protect, verifySession);

router.get("/logins", protect, getLogins);
router.get("/profile/:email", protect, getUserProfile);
router.put("/profile/:email", protect, updateUserProfile);
router.post("/join-club", protect, joinClub);
router.post("/leave-club", protect, leaveClub);

export default router;

