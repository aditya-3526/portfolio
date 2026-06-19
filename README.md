# Aditya Aryan — Portfolio

### 🔗 Live: **[aditya-aryan.vercel.app](https://aditya-aryan.vercel.app)**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?logo=three.js&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-API-202020?logo=fastify&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-3DA639)

A MERN-stack personal portfolio fronted by a hand-written WebGL hero: tens of thousands
of GPU particles assemble into the name, drift with simplex-noise turbulence, repel from
the cursor, and scatter into a galaxy as you scroll — all glazed with bloom. The interface
layers Lenis inertia scrolling, a custom cursor, magnetic buttons, masked text reveals, and
3D-tilt project cards on top.

The site renders **instantly from bundled content**, then hydrates with live data from
MongoDB when the (optional) backend is reachable — so it's fully functional even with no
server behind it.

## Highlights

- **Particle-morph hero** — ~24k points in a single `THREE.Points` cloud driven by a custom
  morph shader (no FBO ping-pong), rendered through an `UnrealBloom` composer.
- **Cinematic motion** — [Lenis](https://github.com/darkroomengineering/lenis) smooth scroll,
  word-by-word masked title reveals, magnetic CTAs, and a precise dot-and-ring custom cursor.
- **3D-tilt project cards** with a cursor-tracked spotlight and sheen.
- **Fallback-first data** — the UI ships with `fallbackContent.js`, so it never shows a blank
  state while (or if) the API is unavailable.
- **Accessible & considerate** — honors `prefers-reduced-motion`, keeps the native cursor on
  touch devices, and exposes an `sr-only` `<h1>` since the visible title is rendered as particles.

## Sections
Hero · About · Skills · Projects · Experience · Honors & Involvements · Contact

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18 (Hooks), Three.js + postprocessing (UnrealBloom), Framer Motion, Lenis, lucide-react |
| Backend | Node.js, **Fastify**, @fastify/cors, @fastify/rate-limit |
| Database | **MongoDB Atlas** (optional) |
| Hosting | **Vercel** (frontend static site); Render-ready backend |

## Architecture

```
React app  ──fetch /api/portfolio──►  Fastify API  ──►  MongoDB Atlas
   │                                       │
   └─ renders fallbackContent.js first ────┘  (hydrates with live data if reachable)
```

Content lives in **one source of truth** (`backend/data/portfolioContent.js`), seeded into
Mongo and mirrored into `frontend/src/data/fallbackContent.js` for the no-backend path.

## Project structure

```
portfolio/
├── package.json                  # root convenience scripts (install / dev / seed)
├── backend/
│   ├── server.js                 # Fastify app: CORS, rate limit, routes
│   ├── .env.example              # copy → .env and fill in
│   ├── config/db.js              # Atlas connection (singleton) + collection names
│   ├── data/portfolioContent.js  # ⭐ SINGLE SOURCE OF TRUTH for all content
│   ├── routes/content.js         # GET /api/portfolio, /api/projects, …
│   └── scripts/seedDatabase.js   # npm run seed → loads content into Mongo
└── frontend/
    ├── package.json              # "proxy" → http://localhost:5050 for dev
    └── src/
        ├── App.js                # composes sections; fetches + hydrates live data
        ├── components/
        │   ├── ParticleMorph.jsx # WebGL particle-morph hero (Three.js + bloom)
        │   ├── Cursor.jsx        # custom dot + ring cursor
        │   ├── Magnetic.jsx      # magnetic-hover wrapper
        │   ├── RevealText.jsx    # masked word-by-word title reveal
        │   ├── Reveal.jsx        # scroll-reveal wrapper
        │   └── Navbar.jsx        # scroll progress + active-section highlight
        ├── lib/smoothScroll.js   # Lenis inertia scroll singleton
        ├── sections/             # Hero, About, Skills, Projects, Experience, Honors, Contact
        ├── styles/index.css      # design tokens + global base
        ├── data/fallbackContent.js
        └── utils/api.js          # fetch client
```

## Local development

### Prerequisites
- **Node.js 18+**
- A **MongoDB Atlas** account (free M0 tier) — *optional*; the site runs on bundled content without it.

### 1. Install
```bash
npm run install:all
```

### 2. (Optional) Configure + seed the backend
Only needed to serve content from MongoDB instead of the bundled fallback.
```bash
cd backend
cp .env.example .env        # set MONGO_URI
npm run seed                # loads portfolioContent.js into Mongo
```

### 3. Run
```bash
# terminal 1 — backend (http://localhost:5050)
cd backend && PORT=5050 npm run dev

# terminal 2 — frontend (http://localhost:3000)
cd frontend && npm start
```
Open **http://localhost:3000**. The frontend's dev proxy points at `:5050`.

> Don't want Mongo? Just run the frontend — it renders from `frontend/src/data/fallbackContent.js`.

## Updating content
Everything flows from **`backend/data/portfolioContent.js`**. Edit it, then:
```bash
cd backend && npm run seed
```
Keep `frontend/src/data/fallbackContent.js` in sync to update the no-backend (and currently
deployed) view.

## API reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/portfolio` | All sections in one payload |
| GET | `/api/projects` · `/api/skills` · `/api/experience` · `/api/honors` · `/api/involvements` · `/api/about` | Individual sections |
| GET | `/api/health` | Liveness check |

## Deployment

**Frontend — Vercel (static, always-on, free).** Import the repo and set
**Root Directory = `frontend`**; Vercel auto-detects Create React App
(build `npm run build`, output `build`). Leave `REACT_APP_API_BASE` unset to run on bundled
content, or point it at your backend URL to hydrate from MongoDB. *(This is the live setup.)*

**Backend — Render (optional).** Web Service · Root `backend/` · Build `npm install` ·
Start `npm start`. Set `MONGO_URI`/`MONGO_DB_NAME` and `CLIENT_ORIGIN` in the dashboard.
A `render.yaml` Blueprint for both services is kept in git history if you want one-click setup.

---

MIT © Aditya Aryan
