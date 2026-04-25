import { randomBytes } from "node:crypto";

import { z } from "zod";

export const tarotPositions = [
  {
    key: "past",
    number: 1,
    label: "과거",
    description: "이미 지나온 흐름과 고민의 배경",
  },
  {
    key: "present",
    number: 2,
    label: "현재",
    description: "지금 가장 크게 작동하는 감정과 상황",
  },
  {
    key: "future",
    number: 3,
    label: "미래",
    description: "가까운 시기 안에 나타날 변화와 힌트",
  },
] as const;

export type TarotPosition = (typeof tarotPositions)[number]["key"];

export const tarotOrientations = ["upright", "reversed", "unknown"] as const;

export type TarotOrientation = (typeof tarotOrientations)[number];

export function getOrientationLabel(orientation?: TarotOrientation) {
  if (orientation === "reversed") {
    return "역방향";
  }

  if (orientation === "upright") {
    return "정방향";
  }

  return "방향 미확인";
}

const cardInputSchema = z
  .object({
    position: z.enum(["past", "present", "future"]),
    label: z.string().max(100, "카드 이름은 100자 이하로 적어주세요.").default(""),
    imageDataUrl: z
      .string()
      .regex(
        /^data:image\/(png|jpeg|jpg|webp);base64,/,
        "카드 사진 형식이 올바르지 않습니다.",
      )
      .max(900_000, "카드 사진 용량이 너무 큽니다. 다시 촬영해 주세요.")
      .optional(),
    cardName: z.string().max(100).optional(),
    orientation: z.enum(tarotOrientations).optional(),
    recognitionNote: z.string().max(180).optional(),
  })
  .refine((card) => card.label.trim().length > 0 || Boolean(card.imageDataUrl), {
    message: "카드 이름을 적거나 카드 사진을 올려주세요.",
    path: ["label"],
  });

export const createReadingInputSchema = z.object({
  concern: z
    .string()
    .min(8, "고민은 최소 8자 이상 적어주세요.")
    .max(600, "고민은 600자 이하로 적어주세요."),
  cards: z.array(cardInputSchema).length(3),
});

export type CreateReadingInput = z.infer<typeof createReadingInputSchema>;
export type CreateReadingCard = CreateReadingInput["cards"][number];

export function sanitizeCreateReadingInput(
  input: CreateReadingInput,
): CreateReadingInput {
  return {
    concern: input.concern.trim(),
    cards: input.cards.map((card) => ({
      position: card.position,
      label: card.label.trim(),
      imageDataUrl: card.imageDataUrl,
      cardName: card.cardName?.trim(),
      orientation: card.orientation,
      recognitionNote: card.recognitionNote?.trim(),
    })),
  };
}

export function createPublicToken() {
  return randomBytes(16).toString("hex");
}
