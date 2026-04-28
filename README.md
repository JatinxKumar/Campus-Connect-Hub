# Campus Connect Hub

Campus Connect Hub is a college community platform built with React, Vite, TypeScript, Express, and MongoDB-ready backend logic. It helps students discover clubs, register for events, manage their profile activity, and interact with a cleaner campus dashboard experience.

## Highlights

- Root landing page now opens directly on `/` instead of `/home`
- Google Sign-In flow integrated on the login page
- Logged-in navbar with user menu, notifications, category explorer, and logout confirmation
- Dashboard/Profile page with:
  - joined clubs
  - registered event tickets
  - attendance score
  - editable bio, interests, GitHub, LinkedIn, and portfolio links
  - badges and downloadable certificate section
- Interest-based club recommendations shown on the home page
- Club join and event registration flows tied to the signed-in user
- Admin route protected by login only
- Backend fallback support using `backend-db.json` when MongoDB is unavailable

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Radix UI
- React Router DOM
- Framer Motion

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- dotenv

## Main Features

### Authentication

- Credential login
- Google login
- Local auth persistence
- User-aware redirects after login

### Student Dashboard

- Personal profile dashboard at `/dashboard`
- Activity overview based on actual joins and registrations
- Ticket view for registered events
- Attendance tracking
- Badge system
- Certificate download generation

### Clubs and Events

- Browse clubs by category
- Search and filter club listings
- Join clubs as a signed-in user
- Register for events
- Interest-based recommendation flow

### Navigation and UX

- Root-first landing page on `/`
- `/home` automatically redirects to `/`
- Logged-in user chip in navbar
- Bell notifications UI
- Explore dropdown for quick club category access
- Logout confirmation dialog

## Routes

- `/` - main landing page
- `/home` - redirects to `/`
- `/clubs` - club listing and filters
- `/clubs/:id/join` - join a club
- `/events` - event listing
- `/events/:id/register` - register for an event
- `/login` - login page
- `/create-account` - account creation
- `/dashboard` - student activity dashboard
- `/profile` - profile dashboard alias
- `/admin` - protected admin area

## Environment Setup

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://127.0.0.1:27017/campus-connect
PORT=3000
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Installation

```bash
npm install
```

## Run Locally

Terminal 1:

```bash
npm run server
```

Terminal 2:

```bash
npm run dev
```

Open:

```text
http://localhost:8080/
```

## Notes

- If MongoDB is not running, the backend can still work using `backend-db.json` for fallback persistence.
- `.env` is intentionally excluded from GitHub pushes.
- If you previously saw `/home` on localhost, that was caused by a stale build/dev process. The current routing is root-first.

## Current Project Direction

This project has moved beyond a simple club listing site and now behaves more like a student engagement platform:

- identity-aware navigation
- dashboard-driven profile experience
- event participation tracking
- gamified engagement
- recommendation-oriented home feed

## Future Improvements

- real notification persistence
- downloadable PDF certificates
- actual attendance verification workflow
- backend APIs for user profile and dashboard activity
- better analytics inside admin dashboard
