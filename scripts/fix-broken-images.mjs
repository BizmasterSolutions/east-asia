import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

// Read DATABASE_URL from .env
const envFile = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
const dbMatch = envFile.match(/^DATABASE_URL\s*=\s*"?([^"\n]+)"?/m);
if (!dbMatch) { console.error("DATABASE_URL not found in .env"); process.exit(1); }
const DATABASE_URL = dbMatch[1];

const pool = new Pool({ connectionString: DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `SELECT key, value FROM "SchoolSetting" WHERE value LIKE '/uploads/%'`
    );

    console.log(`Found ${rows.length} setting(s) with upload URLs:`);
    const toFix = [];

    for (const row of rows) {
      const filePath = path.join(PUBLIC, row.value);
      const exists = fs.existsSync(filePath);
      console.log(`  [${exists ? "OK" : "MISSING"}] ${row.key} => ${row.value}`);
      if (!exists) toFix.push(row.key);
    }

    if (toFix.length === 0) {
      console.log("\nAll upload references are valid. Nothing to fix.");
      return;
    }

    console.log(`\nClearing ${toFix.length} broken reference(s)...`);
    for (const key of toFix) {
      await client.query(
        `UPDATE "SchoolSetting" SET value = '' WHERE key = $1`,
        [key]
      );
      console.log(`  Cleared: ${key}`);
    }

    console.log("\nDone. Broken image references removed.");
    console.log("Re-upload images in Admin Panel → Home Content.");
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((e) => { console.error(e.message); process.exit(1); });
