import { getDb, COLLECTIONS } from "../config/db.js";

/**
 * REST routes that serve portfolio content from MongoDB.
 * The React frontend hits these to render each section.
 */
export default async function contentRoutes(fastify) {
  // Helper to fetch a whole collection sorted by an "order" field if present.
  async function fetchAll(collectionName) {
    const db = await getDb();
    return db
      .collection(collectionName)
      .find({})
      .sort({ order: 1, _id: 1 })
      .project({ _id: 0 })
      .toArray();
  }

  fastify.get("/api/about", async () => {
    const db = await getDb();
    const doc = await db.collection(COLLECTIONS.ABOUT).findOne({}, { projection: { _id: 0 } });
    return doc || {};
  });

  fastify.get("/api/projects", async () => fetchAll(COLLECTIONS.PROJECTS));
  fastify.get("/api/skills", async () => fetchAll(COLLECTIONS.SKILLS));
  fastify.get("/api/experience", async () => fetchAll(COLLECTIONS.EXPERIENCE));
  fastify.get("/api/involvements", async () => fetchAll(COLLECTIONS.INVOLVEMENTS));
  fastify.get("/api/honors", async () => fetchAll(COLLECTIONS.HONORS));

  // One call to hydrate the entire site (fewer round-trips on first load).
  fastify.get("/api/portfolio", async () => {
    const db = await getDb();
    const [about, projects, skills, experience, involvements, honors] = await Promise.all([
      db.collection(COLLECTIONS.ABOUT).findOne({}, { projection: { _id: 0 } }),
      fetchAll(COLLECTIONS.PROJECTS),
      fetchAll(COLLECTIONS.SKILLS),
      fetchAll(COLLECTIONS.EXPERIENCE),
      fetchAll(COLLECTIONS.INVOLVEMENTS),
      fetchAll(COLLECTIONS.HONORS),
    ]);
    return { about, projects, skills, experience, involvements, honors };
  });

  fastify.get("/api/health", async () => ({ status: "ok", time: new Date().toISOString() }));
}
