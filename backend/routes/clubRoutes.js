import express from "express";
import { getClubs, createClub, updateClub, deleteClub, joinClub } from "../controllers/clubController.js";

const router = express.Router();

router.get("/", getClubs);
router.post("/", createClub);
router.put("/:id", updateClub);
router.delete("/:id", deleteClub);
router.post("/:id/join", joinClub);

export default router;
