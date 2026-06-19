# Aditya Aryan — Portfolio

### 🔗 Live: **[aditya-aryan.vercel.app](https://aditya-aryan.vercel.app)**

A MERN-stack personal portfolio with a Three.js animated hero, Framer Motion transitions, and content served live from MongoDB.

## Sections
Hero · About · Skills · Projects · Experience · Honors & Involvements · Contact

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18 (Hooks), Framer Motion, Three.js, lucide-react |
| Backend | Node.js, **Fastify**, @fastify/cors, @fastify/rate-limit |
| Database | **MongoDB Atlas** |

The site renders instantly from bundled fallback content, then hydrates with live data from MongoDB when the backend is reachable.

## Project structure

```
portfolio/
├── package.json                 # root convenience scripts (install/seed/dev)
├── backend/
│   ├── server.js                # Fastify app, CORS, rate limit, routes
│   ├── .env.example             # copy → .env and fill in
│   ├── config/db.js             # Atlas connection (singleton) + collection names
│   ├── data/portfolioContent.js # ⭐ SINGLE SOURCE OF TRUTH for all content
│   ├── routes/content.js        # GET /api/portfolio, /api/projects, …
│   └── scripts/seedDatabase.js  # npm run seed → loads content into Mongo
└── frontend/
    ├── package.json             # has "proxy" → http://localhost:5000 for dev
    ├── public/index.html
    └── src/
        ├── App.js               # ties sections together; fetches live data
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ParticleField.jsx# Three.js hero background
        │   └── Reveal.jsx       # scroll-reveal wrapper
        ├── sections/            # Hero, About, Skills, Projects, Experience, Honors, Contact
        ├── data/fallbackContent.js  # renders before backend is up
        └── utils/api.js         # fetch client
```

## Setup

### Prerequisites
- **Node.js 18+**
- A **MongoDB Atlas** account (free M0 tier is fine) — optional; the site runs on bundled fallback content without it

### 1. Install dependencies
```bash
npm run install:all
```

### 2. (Optional) Configure + seed the backend
Only needed if you want content served from MongoDB rather than the bundled fallback.
```bash
cd backend
cp .env.example .env       # fill in MONGO_URI
npm run seed               # loads portfolioContent.js into MongoDB
```

### 3. Run it
Two terminals:
```bash
# terminal 1 — backend (http://localhost:5000)
cd backend && npm run dev

# terminal 2 — frontend (http://localhost:3000)
cd frontend && npm start
```
Open **http://localhost:3000**.

> The frontend works on its own using `frontend/src/data/fallbackContent.js`, so you can run just the frontend if you don't want to set up Mongo.

## Updating your portfolio
Everything flows from **`backend/data/portfolioContent.js`**. Edit it, then:
```bash
cd backend && npm run seed
```
Keep `frontend/src/data/fallbackContent.js` in sync if you rely on the no-backend mode.

## API reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/portfolio` | All sections in one payload |
| GET | `/api/projects` `/api/skills` `/api/experience` `/api/honors` `/api/involvements` `/api/about` | Individual sections |
| GET | `/api/health` | Liveness check |

## Deployment (Render-style)

**Backend (Web Service)** — Root: `backend/` · Build: `npm install` · Start: `npm start`. Set `.env` vars in the dashboard, and `CLIENT_ORIGIN` to your deployed frontend URL.

**Frontend (Static Site)** — Root: `frontend/` · Build: `npm run build` · Publish dir: `build`. Set `REACT_APP_API_BASE` to your deployed backend URL (so it stops using the dev proxy). If you skip the backend entirely, the site still runs on fallback content.

---

MIT © Aditya Aryan
