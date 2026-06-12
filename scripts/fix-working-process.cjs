/**
 * One-off maintenance script for the WorkingProcess table.
 *
 *   node scripts/fix-working-process.cjs           -> print current rows (safe, read-only)
 *   node scripts/fix-working-process.cjs --swap     -> swap title <-> description on every row
 *
 * Uses the `pg` driver directly (already a project dependency) and reads
 * DATABASE_URL from .env so it runs outside the Next.js runtime.
 */

const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

/** Minimal .env reader: returns the first uncommented DATABASE_URL value. */
function readDatabaseUrl() {
    if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

    const envPath = path.join(__dirname, "..", ".env");
    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const match = trimmed.match(/^DATABASE_URL\s*=\s*(.*)$/);
        if (match) {
            return match[1].replace(/^["']|["']$/g, ""); // strip surrounding quotes
        }
    }
    throw new Error("DATABASE_URL not found in environment or .env");
}

function needsSsl(connectionString) {
    if (/sslmode=disable/.test(connectionString)) return false;
    if (/localhost|127\.0\.0\.1/.test(connectionString)) return false;
    return true; // hosted DBs (Neon, Supabase, etc.) require SSL
}

function printRows(rows) {
    if (rows.length === 0) {
        console.log("(no rows in WorkingProcess)");
        return;
    }
    for (const row of rows) {
        console.log(`\n  id: ${row.id}`);
        console.log(`  title:       ${JSON.stringify(row.title)}`);
        console.log(`  description: ${JSON.stringify(row.description)}`);
    }
}

async function main() {
    const doSwap = process.argv.includes("--swap");
    const connectionString = readDatabaseUrl();
    const client = new Client({
        connectionString,
        ssl: needsSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
    });

    await client.connect();
    try {
        const before = await client.query(
            'SELECT id, title, description FROM "WorkingProcess" ORDER BY id ASC'
        );

        console.log("=== Current WorkingProcess rows ===");
        printRows(before.rows);

        if (!doSwap) {
            console.log(
                "\n(read-only) Run again with --swap to swap title <-> description on all rows."
            );
            return;
        }

        console.log("\n=== Swapping title <-> description ===");
        const result = await client.query(
            'UPDATE "WorkingProcess" SET title = description, description = title'
        );
        console.log(`Updated ${result.rowCount} row(s).`);

        const after = await client.query(
            'SELECT id, title, description FROM "WorkingProcess" ORDER BY id ASC'
        );
        console.log("\n=== Rows after swap ===");
        printRows(after.rows);
    } finally {
        await client.end();
    }
}

main().catch((err) => {
    console.error("Script failed:", err);
    process.exit(1);
});
