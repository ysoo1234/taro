import "server-only";

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

import { env, requireEnv } from "@/lib/env";
import type {
  CreateReadingCard,
  CreateReadingInput,
  TarotOrientation,
  TarotPosition,
} from "@/lib/tarot";
import { getOrientationLabel, tarotPositions } from "@/lib/tarot";

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
  opportunities: z.array(z.string().min(1)).length(3),
  cautions: z.array(z.string().min(1)).length(3),
  closingMessage: z.string().min(1),
});

const cardDetectionSchema = z.object({
  cards: z
    .array(
      z.object({
        position: z.enum(["past", "present", "future"]),
        cardName: z.string().min(1),
        orientation: z.enum(["upright", "reversed", "unknown"]),
        recognitionNote: z.string().min(1),
      }),
    )
    .length(3),
});

export type TarotReadingResult = z.infer<typeof readingSchema>;

let openaiClient: OpenAI | null = null;

function getSingleLineEnvValue(
  key: "OPENAI_API_KEY" | "OPENAI_MODEL",
  value: string | undefined,
) {
  const normalized = value?.trim();

  if (!normalized) {
    if (key === "OPENAI_API_KEY") {
      requireEnv("OPENAI_API_KEY");
    }

    throw new Error(`Missing required environment variable: ${key}`);
  }

  if (/[\r\n]/.test(normalized)) {
    throw new Error(
      `${key} contains a line break. Keep each environment variable on one line.`,
    );
  }

  if (key === "OPENAI_API_KEY" && /\bOPENAI_MODEL=/.test(normalized)) {
    throw new Error(
      "OPENAI_API_KEY appears to include OPENAI_MODEL. Store each variable separately.",
    );
  }

  return normalized;
}

function getOpenAI() {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: getSingleLineEnvValue("OPENAI_API_KEY", env.OPENAI_API_KEY),
    });
  }

  return openaiClient;
}

function getCardLabel(card: CreateReadingCard) {
  const name = card.cardName?.trim() || card.label.trim();
  const orientation =
    card.orientation && card.orientation !== "unknown"
      ? ` ${getOrientationLabel(card.orientation)}`
      : "";

  return `${name}${orientation}`.trim();
}

function buildPrompt(input: CreateReadingInput) {
  return [
    "너는 오프라인 타로 리딩 부스에서 손님에게 읽어주는 해석가다.",
    "말투는 따뜻하고 부드럽게 쓴다.",
    "과장된 예언보다 현재 선택을 돕는 조언 중심으로 쓴다.",
    "전문적인 타로 용어보다 누구나 이해할 수 있는 쉬운 말로 쓴다.",
    "한 문장 안에서 쉼표 사용을 최대한 피하고 짧은 문장으로 나눈다.",
    "연애, 건강, 법률, 투자에 대한 단정은 피하고 상담형 문장으로 답한다.",
    "카드 방향은 해석에만 조용히 반영한다. 정방향이나 역방향이라는 말은 결과 문장에 굳이 쓰지 않는다.",
    "",
    "[손님의 고민]",
    input.concern,
    "",
    "[사진 또는 입력으로 확인한 카드]",
    ...input.cards.map((card) => {
      const position = tarotPositions.find((item) => item.key === card.position);
      const note = card.recognitionNote ? ` / 식별 메모: ${card.recognitionNote}` : "";

      return `- ${position?.number}번 ${position?.label}: ${getCardLabel(card)} (${position?.description})${note}`;
    }),
    "",
    "[출력 규칙]",
    "- headline은 손님이 바로 이해할 수 있는 제목 한 줄로 쓴다.",
    "- shareSummary는 QR 영수증과 결과 맨 아래에 들어갈 한 문장 요약이다. 45자 안팎의 한 줄로 쓴다.",
    "- overview는 고민에 대한 전체 결과를 쉬운 말로 3~4문장 설명한다.",
    "- cardInsights는 카드 3장을 모두 포함하고 position은 past, present, future 중 하나만 쓴다.",
    "- focus는 내부용 핵심 주제다. 짧고 쉬운 말로 쓴다.",
    "- interpretation은 손님이 뽑은 카드 이미지와 전체 결과가 왜 연결되는지 2~3문장으로 설명한다.",
    "- interpretation에도 어려운 상징 설명은 피하고 쉬운 말로 쓴다.",
    "- opportunities는 지금 하면 좋은 일 3개로 쓴다.",
    "- cautions는 조심하면 좋은 일 3개로 쓴다.",
    "- closingMessage는 shareSummary와 중복되지 않게 짧게 쓴다.",
  ].join("\n");
}

export async function identifyCardsFromPhotos(
  input: CreateReadingInput,
): Promise<CreateReadingInput> {
  const cardsWithPhotos = input.cards.filter((card) => card.imageDataUrl);

  if (cardsWithPhotos.length === 0) {
    return input;
  }

  const content = [
    {
      type: "input_text" as const,
      text: [
        "타로 카드 사진을 보고 각 위치의 카드 이름과 정방향/역방향을 식별해 주세요.",
        "사진 속 카드가 거꾸로 놓였으면 orientation을 reversed로, 똑바로 놓였으면 upright로 답하세요.",
        "확신이 낮으면 가장 가까운 후보를 cardName에 쓰고 recognitionNote에 불확실한 이유를 짧게 적으세요.",
        "",
        ...input.cards.map((card) => {
          const position = tarotPositions.find((item) => item.key === card.position);
          const hint = card.label ? `, 운영자 입력 힌트: ${card.label}` : "";

          return `${position?.number}번 ${position?.label}${hint}`;
        }),
      ].join("\n"),
    },
    ...input.cards.flatMap((card) => {
      if (!card.imageDataUrl) {
        return [];
      }

      const position = tarotPositions.find((item) => item.key === card.position);

      return [
        {
          type: "input_text" as const,
          text: `${position?.number}번 ${position?.label} 카드 사진`,
        },
        {
          type: "input_image" as const,
          image_url: card.imageDataUrl,
          detail: "high" as const,
        },
      ];
    }),
  ];

  const response = await getOpenAI().responses.parse({
    model: getSingleLineEnvValue("OPENAI_MODEL", env.OPENAI_MODEL),
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: "한국어로 답하되, 반드시 구조화된 JSON만 반환한다.",
          },
        ],
      },
      {
        role: "user",
        content,
      },
    ],
    text: {
      format: zodTextFormat(cardDetectionSchema, "tarot_card_detection"),
    },
  });

  const parsed = response.output_parsed;

  if (!parsed) {
    return input;
  }

  const detections = new Map<TarotPosition, (typeof parsed.cards)[number]>(
    parsed.cards.map((card) => [card.position, card]),
  );

  return {
    ...input,
    cards: input.cards.map((card) => {
      const detected = detections.get(card.position);

      if (!detected || !card.imageDataUrl) {
        return card;
      }

      const orientation = detected.orientation as TarotOrientation;

      return {
        ...card,
        label: card.label || detected.cardName,
        cardName: detected.cardName,
        orientation,
        recognitionNote: detected.recognitionNote,
      };
    }),
  };
}

export async function generateReading(
  input: CreateReadingInput,
): Promise<{ model: string; result: TarotReadingResult }> {
  const model = getSingleLineEnvValue("OPENAI_MODEL", env.OPENAI_MODEL);
  const response = await getOpenAI().responses.parse({
    model,
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
    model,
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
