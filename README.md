# 🚀 Campus Connect Hub

Campus Connect Hub is a premium, full-stack student engagement platform designed to bridge the gap between students, clubs, and campus events. Built with a modern tech stack (MERN), it offers a seamless, real-time experience for discovering communities and tracking campus participation.

---

## ✨ Key Highlights

- **🎯 Personalized Experience**: Root-first landing page with interest-based club recommendations.
- **🛡️ Secure Access**: Integrated Google Sign-In and secure JWT-based authentication.
- **📡 Real-time Sync**: Instant event notifications and updates powered by Socket.io.
- **💎 Premium UI/UX**: Sophisticated design system featuring:
  - Animated mesh gradients and glassmorphism.
  - Smooth micro-animations using Framer Motion.
  - Custom `PageHeader` component for a unified, modern aesthetic.
- **📊 Admin Control Center**: Comprehensive dashboard for admins to manage campus activities with real-time CRUD operations.
- **👤 Student Command Center**: Personalized dashboard to track joined clubs, event tickets, attendance scores, and earn badges.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI & Radix UI
- **Real-time**: Socket.io Client
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Primary) & Mongoose ODM
- **Real-time**: Socket.io
- **Security**: JWT (JSON Web Tokens), Bcryptjs, Cookie-Parser
- **Persistence**: RESTful API architecture (MVC Pattern)

---

## 🚀 Main Features

### 🔐 Advanced Security & Identity
- **JWT & HttpOnly Cookies**: Secure session management that protects against XSS and CSRF attacks.
- **Bcrypt Hashing**: Industry-standard password encryption for credential-based login.
- **Session Persistence**: Initial session verification on load to keep users logged in securely.
- **Role-based access control**: Specialized views for Admins and Students.

### 🏛️ Club & Event Management
- **Real-time Notifications**: Instant toast notifications for new or updated events via Socket.io.
- **Discovery**: Advanced search and category-based filtering for clubs and events.
- **Participation**: One-click club joining and event registration.
- **Admin Tools**: Full CRUD (Create, Read, Update, Delete) for events with auto-sync to the database.
- **Status Tracking**: Intelligent event status management (Upcoming, Ongoing, Completed).

### 📈 Gamification & Rewards
- **Badge System**: Unlock achievements based on campus activity.
- **Attendance Tracking**: Real-time attendance scoring.
- **Certificates**: Generate and download participation certificates for completed events.

---

## ⚙️ Environment Setup

Create a `.env` file in the **backend** directory:

```env
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
PORT=3000
```

Create a `.env` file in the **frontend** directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 🛠️ Installation & Usage

1. **Install Dependencies**:
   ```bash
   # Backend directory
   cd backend
   npm install

   # Frontend directory
   cd frontend
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

## 🗺️ Project Structure

- `/` — Dynamic Landing Page
- `/clubs` — Interactive Club Explorer
- `/events` — Campus Events Calendar
- `/dashboard` — Personal Student Activity Hub
- `/admin` — Protected Administrator Dashboard
- `/login` & `/create-account` — Onboarding Flow

---

## 🚀 Roadmap & Future Improvements

- [x] **Secure Session Management**: JWT tokens and HttpOnly cookies implemented.
- [x] **Real-time Notifications**: Socket.io integration complete.
- [ ] **PDF Certificates**: High-quality PDF generation for event participation.
- [ ] **Enhanced Analytics**: Advanced data visualization for admin reporting.
- [ ] **Collaborative Tools**: Live chat and forum sections for clubs.

---

*Developed with ❤️ for a better campus experience.*
