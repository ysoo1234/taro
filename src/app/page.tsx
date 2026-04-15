import Link from "next/link";

const flowSteps = [
  "현장에서 카드 3장과 고민 입력",
  "GPT가 해석 생성",
  "Neon DB 저장",
  "QR 영수증 인쇄",
  "나중에 QR 재조회",
];

const valueCards = [
  {
    title: "운영은 빠르게",
    description:
      "태블릿 하나로 카드와 고민만 넣으면 결과, 링크, QR까지 한 번에 생성됩니다.",
  },
  {
    title: "기록은 안전하게",
    description:
      "손님이 다시 QR을 찍어도 처음 생성된 결과를 그대로 확인하므로 비용과 결과 일관성을 함께 잡습니다.",
  },
  {
    title: "디자인은 별담답게",
    description:
      "송운노트의 안정적인 서버 패턴과 너도나도의 감성적인 카드 UI 결을 섞어 별담용으로 재해석했습니다.",
  },
];

export default function Home() {
  return (
    <main className="byeoldam-page px-3 py-4 sm:px-4 sm:py-6">
      <div className="byeoldam-shell grid gap-6">
        <section className="byeoldam-panel overflow-hidden rounded-[40px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <div className="byeoldam-pill">AI 타로카페 별담 MVP</div>
              <h1 className="byeoldam-title mt-5 text-[3rem] leading-[0.94] text-[var(--navy)] sm:text-[4.5rem] lg:text-[5.3rem]">
                별을 담은
                <br />
                QR 타로 리딩
              </h1>
              <p className="mt-6 max-w-[640px] text-[1.05rem] leading-8 text-[var(--navy-soft)] sm:text-[1.15rem]">
                현실에서 손님이 직접 카드 3장을 뽑고, 운영자는 고민과 함께
                입력합니다. 해석은 OpenAI로 생성하고 결과는 Neon DB에 저장한 뒤
                QR로 인쇄합니다. 손님은 언제든 다시 스캔해 본인 결과를 확인할 수
                있습니다.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/studio"
                  className="byeoldam-button byeoldam-button-primary min-w-[190px]"
                >
                  바로 운영 시작하기
                </Link>
                <a
                  href="#flow"
                  className="byeoldam-button byeoldam-button-secondary min-w-[170px]"
                >
                  흐름 보기
                </a>
              </div>
            </div>

            <div className="grid gap-4">
              {valueCards.map((card, index) => (
                <article
                  key={card.title}
                  className="byeoldam-card-slot p-5 sm:p-6"
                  style={{
                    transform:
                      index === 1
                        ? "translateX(18px)"
                        : index === 2
                          ? "translateX(4px)"
                          : "none",
                  }}
                >
                  <div className="relative z-10">
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold-strong)]">
                      point 0{index + 1}
                    </p>
                    <h2 className="mt-3 text-[1.45rem] font-black tracking-[-0.03em] text-[var(--navy)]">
                      {card.title}
                    </h2>
                    <p className="mt-3 text-[1rem] leading-7 text-[var(--navy-soft)]">
                      {card.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="flow"
          className="byeoldam-panel rounded-[40px] px-5 py-7 sm:px-8 sm:py-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="byeoldam-pill">운영 흐름</div>
              <h2 className="mt-4 text-[2rem] font-black tracking-[-0.04em] text-[var(--navy)]">
                계획서 요구사항을 그대로 살린 동선
              </h2>
            </div>
            <p className="max-w-[420px] text-[0.98rem] leading-7 text-[var(--navy-soft)]">
              Firebase와 Gemini는 기능 예시일 뿐입니다. 지금 구조는 Vercel 배포와
              Next.js 운영에 맞춰 OpenAI, Neon, QR 조합으로 단순화했습니다.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-5">
            {flowSteps.map((step, index) => (
              <div key={step} className="byeoldam-reading-section">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold-strong)]">
                  step {index + 1}
                </p>
                <p className="mt-3 text-[1rem] leading-7 text-[var(--navy)]">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
