import { randomBytes } from "node:crypto";

import { z } from "zod";

export const tarotPositions = [
  {
    key: "past",
    label: "과거",
    description: "지금 고민의 배경과 이미 지나온 흐름",
  },
  {
    key: "present",
    label: "현재",
    description: "지금 가장 크게 작동하는 감정과 상황",
  },
  {
    key: "future",
    label: "미래",
    description: "앞으로 가까운 시기 안에 나타날 변화와 힌트",
  },
] as const;

export type TarotPosition = (typeof tarotPositions)[number]["key"];

export const createReadingInputSchema = z.object({
  concern: z
    .string()
    .min(8, "고민은 최소 8자 이상 적어주세요.")
    .max(600, "고민은 600자 이하로 적어주세요."),
  cards: z
    .array(
      z.object({
        position: z.enum(["past", "present", "future"]),
        label: z
          .string()
          .min(1, "카드 이름을 적어주세요.")
          .max(100, "카드 이름은 100자 이하로 적어주세요."),
      }),
    )
    .length(3),
});

export type CreateReadingInput = z.infer<typeof createReadingInputSchema>;

export function sanitizeCreateReadingInput(
  input: CreateReadingInput,
): CreateReadingInput {
  return {
    concern: input.concern.trim(),
    cards: input.cards.map((card) => ({
      position: card.position,
      label: card.label.trim(),
    })),
  };
}

export function createPublicToken() {
  return randomBytes(16).toString("hex");
}
