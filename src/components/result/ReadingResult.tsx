import type { StoredReading } from "@/lib/readings";
import { tarotPositions } from "@/lib/tarot";

type ReadingResultProps = {
  reading: StoredReading;
  compact?: boolean;
};

export function ReadingResult({ reading, compact = false }: ReadingResultProps) {
  return (
    <div className="grid gap-5">
      <section className="byeoldam-reading-section">
        <div className="flex flex-wrap items-center gap-3">
          <span className="byeoldam-pill">AI 타로 해석</span>
          <span className="text-sm font-semibold text-[var(--navy-soft)]">
            생성 시각{" "}
            {new Intl.DateTimeFormat("ko-KR", {
              dateStyle: "medium",
              timeStyle: compact ? "short" : "medium",
            }).format(new Date(reading.createdAt))}
          </span>
        </div>
        <h1 className="mt-4 text-[2rem] font-black tracking-[-0.04em] text-[var(--navy)] sm:text-[2.5rem]">
          {reading.result.headline}
        </h1>
        <p className="mt-3 text-[1.04rem] leading-7 text-[var(--navy-soft)]">
          {reading.result.overview}
        </p>
      </section>

      <section className="byeoldam-reading-section">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold-strong)]">
          고민
        </p>
        <p className="mt-3 whitespace-pre-wrap leading-7 text-[var(--navy)]">
          {reading.concern}
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {reading.cards.map((card, index) => {
          const positionMeta = tarotPositions.find(
            (position) => position.key === card.position,
          );
          const insight = reading.result.cardInsights[index];

          return (
            <article key={`${card.position}-${card.label}`} className="byeoldam-card-slot p-5">
              <div className="relative z-10">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold-strong)]">
                  {positionMeta?.label}
                </p>
                <h2 className="mt-3 text-[1.45rem] font-black tracking-[-0.03em] text-[var(--navy)]">
                  {card.label}
                </h2>
                <p className="mt-2 text-sm font-bold text-[var(--emerald)]">
                  {insight.focus}
                </p>
                <p className="mt-4 text-[0.98rem] leading-7 text-[var(--navy-soft)]">
                  {insight.interpretation}
                </p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="byeoldam-reading-section">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--emerald)]">
            지금 살리면 좋은 흐름
          </p>
          <ul className="mt-4 grid gap-3">
            {reading.result.opportunities.map((item) => (
              <li
                key={item}
                className="rounded-[22px] bg-[var(--emerald-soft)] px-4 py-3 text-[0.98rem] leading-7 text-[var(--navy)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="byeoldam-reading-section">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b05f46]">
            조심하면 좋은 포인트
          </p>
          <ul className="mt-4 grid gap-3">
            {reading.result.cautions.map((item) => (
              <li
                key={item}
                className="rounded-[22px] bg-[rgba(246,215,212,0.64)] px-4 py-3 text-[0.98rem] leading-7 text-[var(--navy)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="byeoldam-reading-section bg-[linear-gradient(135deg,rgba(255,249,240,0.98),rgba(245,235,220,0.98))]">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold-strong)]">
          마지막 한마디
        </p>
        <p className="mt-4 text-[1.08rem] leading-8 text-[var(--navy)]">
          {reading.result.closingMessage}
        </p>
      </section>
    </div>
  );
}
