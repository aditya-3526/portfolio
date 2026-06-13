import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import dotenv from "dotenv";

import contentRoutes from "./routes/content.js";
import { getDb } from "./config/db.js";

dotenv.config();

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport:
      process.env.NODE_ENV === "production"
        ? undefined
        : { target: "pino-pretty", options: { colorize: true } },
  },
});

const PORT = parseInt(process.env.PORT || "5000", 10);
const ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

async function start() {
  // CORS — allow the React frontend.
  await fastify.register(cors, {
    origin: ORIGIN === "*" ? true : ORIGIN.split(","),
    methods: ["GET", "POST"],
  });

  // Rate limit — basic protection against abuse of the public API.
  await fastify.register(rateLimit, {
    max: 30,
    timeWindow: "1 minute",
    allowList: (req) => req.url.startsWith("/api/health"),
  });

  // Routes
  await fastify.register(contentRoutes);

  fastify.get("/", async () => ({
    name: "Aditya Aryan — Portfolio API",
    endpoints: [
      "GET  /api/portfolio",
      "GET  /api/projects | /api/skills | /api/experience | /api/involvements | /api/honors | /api/about",
      "GET  /api/health",
    ],
  }));

  try {
    // Warm the DB connection on boot so the first request isn't slow.
    await getDb();
    fastify.log.info("✓ Connected to MongoDB Atlas");
  } catch (e) {
    fastify.log.error("✖ MongoDB connection failed on boot: " + e.message);
    fastify.log.error("  The server will still start; check your MONGO_URI in .env");
  }

  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
