import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is required");
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
