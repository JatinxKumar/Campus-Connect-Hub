# Campus Connect Hub

An elegant, fully-featured college club and event management platform built with React, Vite, TypeScript, Express, and MongoDB.

Designed to orchestrate seamless campus involvement, the project natively supports dedicated student workflows and powerful administrative tracking systems.

---

## 🔥 Key Features

### Beautiful Modern GUI
- Implementation of the **60-30-10 UI Design System** ensuring a highly balanced color theme.
- Dynamic seamless **Dark / Light Mode** switching natively integrated into the navigation.
- Glassmorphism UI elements, micro-animations, and a highly polished Hero section.

### Dynamic Role-Based Routing
- Centralized `Welcome` page natively sorting users into **Student** or **Admin** pathways.
- Automatic Navbar filtering based on the configured environment constraints.
- Natively switch roles seamlessly inside the application for QA / testing environments.

### Robust Database Management
- Powered by a robust **MongoDB Backend Architecture** supported by `Mongoose`.
- Built-in data population seeds defaults effortlessly upon initial MongoDB connection.
- Auto-tracking `Users`, `Clubs`, and `LoginHistory` directly inside actual MongoDB Collections.

### Feature Sub-Systems
- **Clubs**: Comprehensive search, sort, category filtering, and direct backend integration.
- **Events**: Modular dynamic tracking inside the frontend for upcoming campus gatherings.
- **Authentication**: High-security local Credential mapping and Login tracking natively into the database.

---

## 💻 Tech Stack

**Frontend Environment:**
- React 18 & TypeScript
- Vite Build Tooling
- Tailwind CSS (Utilizing standard 60-30-10 Custom Variables)
- Shadcn/UI & Radix Utilities
- React Router DOM

**Backend Environment:**
- Node.js & Express 5
- MongoDB (via Mongoose)
- `dotenv` (Security Configuration)

---

## 🚀 Setup & Installation

### 1. Prerequisites
- [Node.js (v18+)](https://nodejs.org/)
- MongoDB Instance (either Local Daemon or MongoDB Atlas Cloud Cluster)

### 2. Environment Setup
Create a `.env` file at the root of the project with the following constraints:
```env
# Change this if you are using an Atlas Cloud Cluster!
MONGO_URI=mongodb://127.0.0.1:27017/campus-connect
PORT=3000
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID= # Optional
```

### 3. Installation
```bash
npm install
```

### 4. Running the Platform

You must run both the backend API and the frontend application concurrently.

**Terminal 1 (The Backend Database Router)**
```bash
npm run server
# You should see: "Successfully connected to MongoDB"
```

**Terminal 2 (The Frontend Client)**
```bash
npm run dev
```

Navigate to [http://localhost:5173/](http://localhost:5173/) or your Vite deployment port to begin interacting with the fully powered Campus Connect platform!

---

## 🗺️ Application Architecture

- **`/`**: The landing gateway onboarding the user as a Student or Admin.
- **`/home`**: The beautiful Hero and aggregate data display.
- **`/clubs`**: Discover, view, and interact with the campus ecosystem.
- **`/events`**: Manage specific RSVPs to local gatherings.
- **`/admin`**: The deeply-protected central control dashboard.
- **`/create-account`**: Adds user accounts permanently into the `users` collection.
- **`/login`**: Safely authenticates and persists tracking inside `loginhistories`.

---

## 🔮 Future Architecture Roadmap
- Backend native schema extensions for scalable `Events` API endpoints.
- High-level automated JWT (JSON Web Tokens) verification integration.
- Automated pipeline integrations for robust Unit testing natively using vitest.
