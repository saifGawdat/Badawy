/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * seed-if-empty.js
 * 
 * Runs the full seed ONLY if the database is empty (first deployment).
 * On subsequent restarts it detects existing data and skips silently.
 * This prevents wiping real production data (appointments, etc.) on restart.
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Use User table as sentinel — if any user exists, DB is already seeded
  const userCount = await prisma.user.count();

  if (userCount > 0) {
    console.log(`✅ Database already seeded (${userCount} user(s) found). Skipping seed.`);
    return;
  }

  console.log('🌱 Empty database detected. Running initial seed...');

  // Delegate to the full seed script
  const { execSync } = require('child_process');
  execSync('node prisma/seed.js', { stdio: 'inherit' });
}

main()
  .catch((e) => {
    console.error('❌ Seed check failed:', e.message);
    // Don't exit(1) — a seed failure should not crash the server startup
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
