/**
 * Seed MongoDB with the canonical portfolio content.
 * Run: npm run seed
 *
 * Idempotent: clears each collection then re-inserts, so you can run it
 * any time you edit data/portfolioContent.js.
 */
import { getDb, COLLECTIONS, closeDb } from "../config/db.js";
import { about, skills, projects, experience, involvements, honors } from "../data/portfolioContent.js";

async function seed() {
  const db = await getDb();

  const ops = [
    [COLLECTIONS.ABOUT, [about]],
    [COLLECTIONS.SKILLS, skills.map((s, i) => ({ ...s, order: i }))],
    [COLLECTIONS.PROJECTS, projects.map((p, i) => ({ ...p, order: i }))],
    [COLLECTIONS.EXPERIENCE, experience.map((e, i) => ({ ...e, order: i }))],
    [COLLECTIONS.INVOLVEMENTS, involvements.map((x, i) => ({ ...x, order: i }))],
    [COLLECTIONS.HONORS, honors.map((h, i) => ({ ...h, order: i }))],
  ];

  for (const [coll, docs] of ops) {
    await db.collection(coll).deleteMany({});
    if (docs.length) await db.collection(coll).insertMany(docs);
    console.log(`✓ Seeded ${docs.length} doc(s) into "${coll}"`);
  }

  console.log("\n✅ Seed complete.");
  await closeDb();
}

seed().catch((e) => {
  console.error("✖ Seed failed:", e);
  process.exit(1);
});
