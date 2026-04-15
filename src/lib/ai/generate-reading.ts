import "server-only";

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

import { env, requireEnv } from "@/lib/env";
import type { CreateReadingInput, TarotPosition } from "@/lib/tarot";
import { tarotPositions } from "@/lib/tarot";

const readingSchema = z.object({
  headline: z.string().min(1),
  shareSummary: z.string().min(1),
  overview: z.string().min(1),
  cardInsights: z
    .array(
      z.object({
        position: z.enum(["past", "present", "future"]),
        focus: z.string().min(1),
        interpretation: z.string().min(1),
      }),
    )
    .length(3),
  opportunities: z.array(z.string().min(1)).min(2).max(3),
  cautions: z.array(z.string().min(1)).min(2).max(3),
  closingMessage: z.string().min(1),
});

export type TarotReadingResult = z.infer<typeof readingSchema>;

let openaiClient: OpenAI | null = null;

function getOpenAI() {
  requireEnv("OPENAI_API_KEY");

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  return openaiClient;
}

function buildPrompt(input: CreateReadingInput) {
  return [
    "너는 오프라인 타로카페에서 고객에게 읽어주는 해석가다.",
    "말투는 따뜻하고 부드럽게, 그러나 빈말 없이 핵심을 짚는다.",
    "단정적인 예언처럼 쓰지 말고 가능성, 흐름, 조언 중심으로 해석한다.",
    "연애, 건강, 법률, 투자에 대해 단정하지 말고 상담적 문장으로 쓴다.",
    "",
    "[고객의 고민]",
    input.concern,
    "",
    "[선택된 카드]",
    ...input.cards.map((card) => {
      const position = tarotPositions.find((item) => item.key === card.position);
      return `- ${position?.label}: ${card.label} (${position?.description})`;
    }),
    "",
    "[출력 규칙]",
    "- headline은 고객이 한눈에 이해할 수 있는 제목 한 줄로 쓴다.",
    "- shareSummary는 1문장 요약으로 쓴다.",
    "- overview는 전체 흐름을 3~4문장으로 설명한다.",
    "- cardInsights는 카드 3장 모두 포함하고 position은 past, present, future 중 하나만 쓴다.",
    "- focus는 카드가 무엇을 말하는지 짧은 주제로 쓴다.",
    "- interpretation은 카드별로 2~3문장으로 쓴다.",
    "- opportunities와 cautions는 각각 2~3개 항목으로 쓴다.",
    "- closingMessage는 고객에게 건네는 마지막 한마디로 쓴다.",
  ].join("\n");
}

export async function generateReading(
  input: CreateReadingInput,
): Promise<{ model: string; result: TarotReadingResult }> {
  const response = await getOpenAI().responses.parse({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: "한국어로 공감적이고 읽기 쉬운 타로 해석을 구조화된 JSON으로 작성한다.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: buildPrompt(input),
          },
        ],
      },
    ],
    text: {
      format: zodTextFormat(readingSchema, "byeoldam_reading"),
    },
  });

  const parsed = response.output_parsed;

  if (!parsed) {
    throw new Error("OpenAI returned no parsed tarot reading");
  }

  const insightsByPosition = new Map<TarotPosition, (typeof parsed.cardInsights)[number]>(
    parsed.cardInsights.map((item) => [item.position, item]),
  );

  return {
    model: env.OPENAI_MODEL,
    result: {
      ...parsed,
      cardInsights: input.cards.map((card) => {
        const insight = insightsByPosition.get(card.position);

        if (!insight) {
          throw new Error(`Missing insight for ${card.position}`);
        }

        return insight;
      }),
    },
  };
}
