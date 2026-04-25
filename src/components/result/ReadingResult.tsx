import Image from "next/image";

import { TarotCardVisual } from "@/components/tarot/TarotCardVisual";
import type { StoredReading } from "@/lib/readings";
import { tarotPositions } from "@/lib/tarot";

type ReadingResultProps = {
  reading: StoredReading;
  compact?: boolean;
};

export function ReadingResult({ reading, compact = false }: ReadingResultProps) {
  return (
    <div className="reading-result grid gap-5">
      <section className="byeoldam-reading-section result-intro">
        <div className="flex flex-wrap items-center gap-3">
          <span className="byeoldam-pill">AI 타로 리딩</span>
          <span className="text-sm font-semibold text-[var(--ink-soft)]">
            생성시각{" "}
            {new Intl.DateTimeFormat("ko-KR", {
              dateStyle: "medium",
              timeStyle: compact ? "short" : "medium",
            }).format(new Date(reading.createdAt))}
          </span>
        </div>

        <div className="mt-5 rounded-[18px] bg-white/70 p-4">
          <p className="text-sm font-black uppercase text-[var(--lilac-strong)]">
            오늘의 고민
          </p>
          <p className="mt-2 whitespace-pre-wrap leading-7 text-[var(--ink)]">
            {reading.concern}
          </p>
        </div>

        <h1 className="mt-6 text-[2.1rem] font-black leading-tight text-[var(--ink)] sm:text-[2.8rem]">
          {reading.result.headline}
        </h1>
        <p className="mt-4 text-[1.08rem] leading-8 text-[var(--ink-soft)]">
          {reading.result.overview}
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {reading.cards.map((card, index) => {
          const positionMeta = tarotPositions.find(
            (position) => position.key === card.position,
          );
          const insight = reading.result.cardInsights[index];
          const cardTitle = card.cardName || card.label || `${positionMeta?.label} 카드`;

          return (
            <article key={`${card.position}-${card.label}`} className="byeoldam-card-slot result-card p-4">
              <div className="relative z-10 grid gap-4">
                <div>
                  <p className="text-sm font-black uppercase text-[var(--lilac-strong)]">
                    {positionMeta?.number} / {positionMeta?.label}
                  </p>
                  <h2 className="mt-2 text-[1.32rem] font-black text-[var(--ink)]">
                    {cardTitle}
                  </h2>
                </div>

                <div className="card-photo-frame result-photo-frame">
                  {card.imageDataUrl ? (
                    <Image
                      src={card.imageDataUrl}
                      alt={`${positionMeta?.label} 카드 사진`}
                      width={420}
                      height={540}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <TarotCardVisual
                      title={cardTitle}
                      subtitle={positionMeta?.label}
                      compact
                    />
                  )}
                </div>

                <div className="rounded-[16px] bg-white/72 p-4">
                  <p className="text-sm font-black text-[var(--teal)]">
                    이 카드가 말해주는 이유
                  </p>
                  <p className="mt-2 text-[0.98rem] leading-7 text-[var(--ink-soft)]">
                    {insight.interpretation}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="byeoldam-reading-section">
          <p className="text-sm font-black uppercase text-[var(--teal)]">
            지금 하면 좋은 일
          </p>
          <ul className="mt-4 grid gap-3">
            {reading.result.opportunities.map((item) => (
              <li
                key={item}
                className="rounded-[18px] bg-[rgba(107,214,196,0.18)] px-4 py-3 text-[0.98rem] leading-7 text-[var(--ink)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="byeoldam-reading-section">
          <p className="text-sm font-black uppercase text-[var(--rose-strong)]">
            조심하면 좋은 일
          </p>
          <ul className="mt-4 grid gap-3">
            {reading.result.cautions.map((item) => (
              <li
                key={item}
                className="rounded-[18px] bg-[rgba(255,178,206,0.22)] px-4 py-3 text-[0.98rem] leading-7 text-[var(--ink)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="byeoldam-reading-section result-closing">
        <p className="text-sm font-black uppercase text-[var(--lilac-strong)]">
          한 줄 정리
        </p>
        <p className="mt-3 text-[1.18rem] font-black leading-8 text-[var(--ink)]">
          {reading.result.shareSummary}
        </p>
      </section>
    </div>
  );
}
