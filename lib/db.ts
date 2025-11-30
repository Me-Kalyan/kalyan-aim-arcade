import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment");
}

// `sql` is a tagged template: await sql`SELECT 1`
export const sql = neon(connectionString);

