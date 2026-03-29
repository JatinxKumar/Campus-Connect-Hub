# Campus Connect Hub

A full-stack college club and event management application built with React + TypeScript (frontend) and Express (backend).

This project allows students to:

- Browse clubs and events.
- Filter/search clubs and events.
- Join clubs.
- Register for events.

It allows admins to:

- Sign in with demo credentials or optional Google Sign-In.
- Access a protected admin dashboard.
- Create, update, and delete clubs.
- Create, update, and delete events (frontend state).

## Table of Contents

- Overview
- Features
- Tech Stack
- Architecture
- Project Structure
- How Data Works
- Prerequisites
- Installation
- Environment Variables
- Running the Project
- Scripts Reference
- Frontend Routes
- Backend API Reference
- Demo Credentials
- Troubleshooting
- Deployment Notes
- Future Improvements

## Overview

Campus Connect Hub is designed as a practical campus management portal with a modern UI and a lightweight backend.

Core behavior:

- Frontend runs on Vite dev server (default port 5173).
- Backend runs on Express server (port 3000).
- Frontend calls backend using a configurable API base URL.
- Clubs and login history are persisted into a local JSON file.
- Events are currently managed in frontend memory only.

## Features

### Student-Facing Features

- Home page with hero section, featured clubs, and upcoming events.
- Clubs page with text search and category filters.
- Events page with text search, category filters, and "open registration" filter.
- Club join form page.
- Event registration form page.

### Admin Features

- Protected admin route.
- Login via:
	- Demo credentials.
	- Optional Google Sign-In (if configured).
- Admin dashboard includes:
	- Club management (create/edit/delete) via backend API.
	- Event management (create/edit/delete) in frontend state.
	- Summary cards for clubs, members, and open events.

### Backend Features

- CORS enabled for local development.
- Clubs CRUD endpoints.
- Club join endpoint (increments member count).
- Login endpoint and login history endpoint.
- JSON-file persistence with fallback seed data.

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- shadcn/ui + Radix UI
- TanStack React Query
- Lucide icons

### Backend

- Node.js
- Express 5
- Native file system (`fs`) for JSON persistence

### Tooling

- ESLint
- TypeScript compiler
- PostCSS + Autoprefixer

## Architecture

The app is split into two runtime services:

1. Frontend app (Vite)
2. Backend API (Express)

Data flow:

1. Frontend initializes with seed data from local data files.
2. On load, frontend attempts to fetch clubs from backend.
3. If backend is available, backend clubs replace local seed clubs.
4. Club mutations are sent to backend and persisted to `backend-db.json`.
5. Event mutations are currently local-only (not persisted in backend).

Auth flow:

1. User logs in from login page.
2. Login request is posted to backend.
3. Frontend stores auth state in `localStorage`.
4. Protected route checks this state before allowing `/admin`.

## Project Structure

High-level structure:

```text
campus-connect-hub/
|-- src/
|   |-- components/        # reusable UI and feature components
|   |-- context/           # auth and app state providers
|   |-- data/              # seed data (clubs/events)
|   |-- hooks/             # custom hooks
|   |-- lib/               # API utilities and helpers
|   |-- pages/             # route pages
|   |-- App.tsx            # route mapping and providers
|   `-- main.tsx           # React app entry point
|-- public/                # static assets
|-- server.js              # main backend API server
|-- static-server.js       # simple static express server for /public
|-- backend-db.json        # persisted clubs + login history
|-- package.json           # scripts and dependencies
`-- README.md
```

## How Data Works

### Persistent Data

Saved in `backend-db.json`:

- `clubs`
- `loginHistory`

Persistence behavior:

- On backend startup, if `backend-db.json` is missing or invalid, default data is used.
- Backend writes data to `backend-db.json` after club/login operations.

### Non-Persistent Data

`events` currently live in frontend context state and are seeded from `src/data/eventsData.ts`.

Result:

- Any event create/edit/delete made in admin dashboard is not saved after page reload.

## Prerequisites

- Node.js 18+ recommended
- npm (comes with Node.js)

Optional:

- Google Cloud OAuth Client ID for Google Sign-In

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root.

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=
```

Variable details:

- `VITE_API_BASE_URL`
	- Frontend base URL for backend API calls.
	- Default fallback in code: `http://localhost:3000`
- `VITE_GOOGLE_CLIENT_ID`
	- Optional.
	- If present, Google Sign-In button is rendered on login page.
	- If absent, demo credential login still works.

## Running the Project

You normally run two terminals.

### Terminal 1: Start backend

```bash
npm run server
```

Backend URL:

- `http://localhost:3000`

### Terminal 2: Start frontend

```bash
npm run dev
```

Frontend URL (default Vite):

- `http://localhost:5173`

## Scripts Reference

Defined scripts:

- `npm run dev`
	- Starts Vite development server.
- `npm run server`
	- Starts Express backend (`server.js`).
- `npm run static-server`
	- Serves `public` directory at `http://localhost:3000` using `static-server.js`.
- `npm run build`
	- Production build with Vite.
- `npm run build:dev`
	- Development-mode build.
- `npm run lint`
	- Runs ESLint across project.
- `npm run preview`
	- Serves built app for preview.

## Frontend Routes

Application routes:

- `/` -> Home
- `/clubs` -> Clubs listing + filters
- `/clubs/:id/join` -> Club join form
- `/events` -> Events listing + filters
- `/events/:id/register` -> Event registration form
- `/login` -> Admin login
- `/logout` -> Logout page
- `/admin` -> Admin dashboard (protected)
- `*` -> Not found page

Protected access:

- `/admin` is blocked unless user is authenticated in frontend auth context.

## Backend API Reference

Base URL:

- `http://localhost:3000`

### Health/Info

#### `GET /`

Returns backend status and available routes.

### Auth

#### `POST /auth/login`

Supports two login modes:

1. Credentials mode (`provider: "credentials"`)
2. Google mode (`provider: "google"`)

Credentials request example:

```json
{
	"email": "admin@campusconnect.demo",
	"password": "admin123",
	"provider": "credentials"
}
```

Google request example:

```json
{
	"email": "user@example.com",
	"name": "User Name",
	"picture": "https://...",
	"provider": "google"
}
```

Success response includes user details and records login history.

#### `GET /auth/logins`

Returns all login records.

### Clubs

#### `GET /api/clubs`

Returns all clubs.

#### `POST /api/clubs`

Creates a club.

Required fields:

- `name`
- `description`
- `category`
- `coordinator`

Optional fields:

- `image`
- `featured`

#### `PUT /api/clubs/:id`

Updates a club by ID.

#### `DELETE /api/clubs/:id`

Deletes a club by ID.

#### `POST /api/clubs/:id/join`

Increments `members` count for the selected club.

### Utility

#### `POST /echo`

Returns posted body in response (simple testing endpoint).

## Demo Credentials

Use these for admin login in credentials mode:

- Email: `admin@campusconnect.demo`
- Password: `admin123`

## Additional Learning Files in This Repo

These are standalone Node examples and not part of the React app runtime:

- `fs-file-handling-example.js`
	- Demonstrates create/read/update/delete operations with async `fs.promises`.
- `fs-streaming-example.js`
	- Demonstrates stream-based reading of a large file and creates one if missing.
- `large-file.txt`
	- Sample large file used by streaming demo.

## Troubleshooting

### Frontend cannot reach backend

Checks:

1. Ensure backend is running on port 3000.
2. Ensure `VITE_API_BASE_URL` points to backend.
3. Restart frontend after changing `.env`.

### Login fails with demo credentials

Checks:

1. Use exact email/password values listed above.
2. Confirm backend server is running.
3. Confirm request is sent to correct API base URL.

### Google login button not visible

Checks:

1. Set `VITE_GOOGLE_CLIENT_ID` in `.env`.
2. Restart Vite dev server.
3. Confirm browser can load Google Identity script.

### Admin route redirects to login

Expected if not authenticated. Login first, then revisit `/admin`.

## Deployment Notes

Current setup is local-development friendly.

For production, recommended improvements:

1. Replace JSON-file storage with a real database.
2. Replace frontend-only auth state with secure backend sessions/JWT validation.
3. Add real user/role management.
4. Persist events through backend APIs.
5. Add request validation and stronger error handling.
6. Serve frontend and backend behind proper domain/reverse proxy.

## Future Improvements

- Backend CRUD APIs for events.
- Student profile and membership history.
- Club approval workflow.
- Pagination and server-side filtering.
- Unit and integration tests.
- CI pipeline for lint/build/test.
