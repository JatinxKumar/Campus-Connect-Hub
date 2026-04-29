import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/Event.js";

dotenv.config();

const initialEvents = [
  {
    id: 1,
    title: "HackFest 2024",
    description: "24-hour hackathon featuring exciting challenges and amazing prizes. Build innovative solutions and network with industry professionals.",
    club: "Coding Club",
    date: "2024-03-15",
    time: "9:00 AM - 9:00 AM (Next Day)",
    venue: "Computer Science Building, Lab 301",
    registrationOpen: true,
    maxParticipants: 150,
    currentParticipants: 87,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
    category: "Competition",
    status: "upcoming"
  },
  {
    id: 2,
    title: "Robot Wars Championship",
    description: "Annual robotics competition where teams compete in combat, maze navigation, and creative challenges.",
    club: "Robotics Club",
    date: "2024-03-22",
    time: "10:00 AM - 5:00 PM",
    venue: "Engineering Auditorium",
    registrationOpen: true,
    maxParticipants: 30,
    currentParticipants: 22,
    image: "https://images.unsplash.com/photo-1563191911-e65f8655ebf9?w=800&h=600&fit=crop",
    category: "Competition",
    status: "upcoming"
  },
  {
    id: 3,
    title: "Annual Drama Performance",
    description: "Original theatrical production featuring talented student performers in a contemporary drama.",
    club: "Drama Society",
    date: "2024-03-18",
    time: "7:00 PM - 9:30 PM",
    venue: "Main Auditorium",
    registrationOpen: false,
    maxParticipants: 500,
    currentParticipants: 456,
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=600&fit=crop",
    category: "Performance",
    status: "upcoming"
  },
  {
    id: 4,
    title: "Photography Workshop",
    description: "Learn advanced photography techniques from professional photographers. Bring your camera!",
    club: "Photography Club",
    date: "2024-03-25",
    time: "2:00 PM - 5:00 PM",
    venue: "Arts Building, Room 205",
    registrationOpen: true,
    maxParticipants: 40,
    currentParticipants: 31,
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop",
    category: "Workshop",
    status: "upcoming"
  },
  {
    id: 5,
    title: "Campus Cleanup Drive",
    description: "Join us in making our campus greener and cleaner. Equipment and refreshments provided.",
    club: "Environmental Club",
    date: "2024-03-20",
    time: "8:00 AM - 12:00 PM",
    venue: "Main Campus Ground",
    registrationOpen: true,
    maxParticipants: 200,
    currentParticipants: 145,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=600&fit=crop",
    category: "Social",
    status: "upcoming"
  },
  {
    id: 6,
    title: "Battle of the Bands",
    description: "Showcase your musical talent in this electrifying competition. Winners get studio recording time!",
    club: "Music Society",
    date: "2024-04-05",
    time: "6:00 PM - 10:00 PM",
    venue: "Open Air Theater",
    registrationOpen: true,
    maxParticipants: 15,
    currentParticipants: 9,
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop",
    category: "Competition",
    status: "upcoming"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for full seeding...");
    await Event.deleteMany({});
    await Event.insertMany(initialEvents);
    console.log("Seeded all 6 initial events successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
