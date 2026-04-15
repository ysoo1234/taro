import "server-only";

import { Pool, type QueryResult, type QueryResultRow } from "pg";

import { env, requireEnv } from "@/lib/env";

const globalForDb = globalThis as typeof globalThis & {
  __byeoldamPool?: Pool;
};

function getPool() {
  requireEnv("DATABASE_URL");

  if (!globalForDb.__byeoldamPool) {
    globalForDb.__byeoldamPool = new Pool({
      connectionString: env.DATABASE_URL,
      max: 10,
    });
  }

  return globalForDb.__byeoldamPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<QueryResult<T>> {
  const client = await getPool().connect();

  try {
    await client.query("set search_path to public");
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
}
