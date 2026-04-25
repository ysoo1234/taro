import "server-only";

import type { TarotReadingResult } from "@/lib/ai/generate-reading";
import { generateReading, identifyCardsFromPhotos } from "@/lib/ai/generate-reading";
import { query } from "@/lib/db";
import {
  createPublicToken,
  sanitizeCreateReadingInput,
  type CreateReadingInput,
} from "@/lib/tarot";

type ReadingRow = {
  id: number;
  public_token: string;
  concern: string;
  cards_json: CreateReadingInput["cards"];
  result_json: TarotReadingResult;
  model: string;
  created_at: Date;
};

export type StoredReading = {
  id: number;
  publicToken: string;
  concern: string;
  cards: CreateReadingInput["cards"];
  result: TarotReadingResult;
  model: string;
  createdAt: string;
};

function normalizeReading(row: ReadingRow): StoredReading {
  return {
    id: row.id,
    publicToken: row.public_token,
    concern: row.concern,
    cards: row.cards_json,
    result: row.result_json,
    model: row.model,
    createdAt: row.created_at.toISOString(),
  };
}

export async function createReading(input: CreateReadingInput) {
  const sanitized = sanitizeCreateReadingInput(input);
  const token = createPublicToken();
  const identified = await identifyCardsFromPhotos(sanitized);
  const { model, result } = await generateReading(identified);

  const inserted = await query<ReadingRow>(
    `
      insert into readings (
        public_token,
        concern,
        cards_json,
        result_json,
        model
      )
      values ($1, $2, $3::jsonb, $4::jsonb, $5)
      returning id, public_token, concern, cards_json, result_json, model, created_at
    `,
    [token, identified.concern, JSON.stringify(identified.cards), JSON.stringify(result), model],
  );

  return normalizeReading(inserted.rows[0]);
}

export async function getReadingByToken(token: string) {
  const found = await query<ReadingRow>(
    `
      select id, public_token, concern, cards_json, result_json, model, created_at
      from readings
      where public_token = $1
      limit 1
    `,
    [token],
  );

  if (found.rowCount === 0) {
    return null;
  }

  return normalizeReading(found.rows[0]);
}
