import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { Pool } from "pg";

function normalizeDatabaseUrl(connectionString) {
  try {
    const url = new URL(connectionString);
    const sslMode = url.searchParams.get("sslmode");
    const usesLibpqCompat = url.searchParams.get("uselibpqcompat");

    if (sslMode === "require" && usesLibpqCompat !== "true") {
      url.searchParams.set("sslmode", "verify-full");
      return url.toString();
    }

    return connectionString;
  } catch {
    return connectionString;
  }
}

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

const projectRoot = process.cwd();
loadEnvFile(path.join(projectRoot, ".env.local"));
loadEnvFile(path.join(projectRoot, ".env"));

const connectionString = normalizeDatabaseUrl(process.env.DATABASE_URL?.trim() ?? "");

if (!connectionString) {
  console.error("DATABASE_URL is required. Set it in .env.local or the shell environment.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  max: 2,
});

const sql = `
create table if not exists readings (
  id bigserial primary key,
  public_token text not null unique,
  concern text not null,
  cards_json jsonb not null,
  result_json jsonb not null,
  model text not null,
  created_at timestamptz not null default now()
);

create index if not exists readings_created_at_idx on readings (created_at desc);
`;

try {
  await pool.query(sql);
  console.log("readings table is ready");
} finally {
  await pool.end();
}
