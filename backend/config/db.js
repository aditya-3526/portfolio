import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || "portfolio";

if (!uri) {
  console.error("✖  MONGO_URI is not set. Copy .env.example to .env and fill it in.");
}

let client;
let db;

/**
 * Lazily connect to MongoDB Atlas and cache the connection.
 * Reused across the whole backend so we never open duplicate pools.
 */
export async function getDb() {
  if (db) return db;
  if (!client) {
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    });
  }
  await client.connect();
  db = client.db(dbName);
  return db;
}

export async function closeDb() {
  if (client) {
    await client.close();
    client = undefined;
    db = undefined;
  }
}

// Collection name constants — single source of truth.
export const COLLECTIONS = {
  PROJECTS: "projects",
  EXPERIENCE: "experience",
  INVOLVEMENTS: "involvements",
  HONORS: "honors",
  SKILLS: "skills",
  ABOUT: "about",
};
