import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { createReading } from "@/lib/readings";
import { createReadingInputSchema } from "@/lib/tarot";

export async function POST(request: Request) {
  try {
    const payload = createReadingInputSchema.parse(await request.json());
    const reading = await createReading(payload);

    return NextResponse.json({
      token: reading.publicToken,
      receiptPath: `/receipt/${reading.publicToken}`,
      publicPath: `/r/${reading.publicToken}`,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues[0]?.message ?? "입력값을 다시 확인해 주세요.",
        },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      const message = error.message.includes('relation "readings" does not exist')
        ? "DB 테이블이 아직 없습니다. 먼저 `npm run db:init`을 실행해 주세요."
        : error.message;

      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json(
      {
        error: "알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
