import express from "express";
import { registerUser, loginUser, getLogins, getUserProfile, updateUserProfile, joinClub, leaveClub } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logins", getLogins);
router.get("/profile/:email", getUserProfile);
router.put("/profile/:email", updateUserProfile);
router.post("/join-club", joinClub);
router.post("/leave-club", leaveClub);

export default router;
