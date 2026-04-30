# 🚀 Campus Connect Hub

Campus Connect Hub is a premium, full-stack student engagement platform designed to bridge the gap between students, clubs, and campus events. Built with a modern tech stack (MERN), it offers a seamless, real-time experience for discovering communities and tracking campus participation.

---

## ✨ Key Highlights

- **🎯 Personalized Experience**: Root-first landing page with interest-based club recommendations.
- **🛡️ Secure Access**: Integrated Google Sign-In and standard credential-based authentication.
- **💎 Premium UI/UX**: Sophisticated design system featuring:
  - Animated mesh gradients and glassmorphism.
  - Smooth micro-animations using Framer Motion.
  - Custom `PageHeader` component for a unified, modern aesthetic.
- **⚡ Real-time Sync**: Full database persistence with MongoDB Atlas for clubs, events, and user registrations.
- **📊 Admin Control Center**: Comprehensive dashboard for admins to manage campus activities with real-time CRUD operations.
- **👤 Student Command Center**: Personalized dashboard to track joined clubs, event tickets, attendance scores, and earn badges.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI & Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Primary) & Mongoose ODM
- **Persistence**: RESTful API architecture

---

## 🚀 Main Features

### 🔐 Authentication & Identity
- Multiple login methods (Google & Credentials).
- Persistent sessions with local storage (transitioning to secure HttpOnly cookies).
- Role-based access control (Admin vs. Student).

### 🏛️ Club & Event Management
- **Discovery**: Advanced search and category-based filtering for clubs and events.
- **Participation**: One-click club joining and event registration.
- **Admin Tools**: Full CRUD (Create, Read, Update, Delete) for events with auto-sync to the database.
- **Status Tracking**: Intelligent event status management (Upcoming, Ongoing, Completed).

### 📈 Gamification & Rewards
- **Badge System**: Unlock achievements based on campus activity.
- **Attendance Tracking**: Real-time attendance scoring.
- **Certificates**: Generate and download participation certificates for completed events.

---

## 🗺️ Project Structure

- `/` — Dynamic Landing Page
- `/clubs` — Interactive Club Explorer
- `/events` — Campus Events Calendar
- `/dashboard` — Personal Student Activity Hub
- `/admin` — Protected Administrator Dashboard
- `/login` & `/create-account` — Onboarding Flow

---

## ⚙️ Environment Setup

Create a `.env` file in the project root:

```env
MONGO_URI=your-mongodb-atlas-uri
PORT=3000
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 🛠️ Installation & Usage

1. **Install Dependencies**:
   ```bash
   # Root directory
   npm install
   ```

2. **Run Backend**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Run Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

---

## 🚀 Roadmap & Future Improvements

- [ ] **Secure Session Management**: Implement JWT tokens and HttpOnly cookies.
- [ ] **Real-time Notifications**: Integrate Socket.io for instant event updates.
- [ ] **PDF Certificates**: High-quality PDF generation for event participation.
- [ ] **Enhanced Analytics**: Advanced data visualization for admin reporting.
- [ ] **Collaborative Tools**: Live chat and forum sections for clubs.

---

*Developed with ❤️ for a better campus experience.*
