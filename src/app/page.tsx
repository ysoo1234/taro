import Link from "next/link";

const flowSteps = [
  {
    title: "카드 3장 촬영",
    description: "손님이 뽑은 카드를 과거, 현재, 미래 순서대로 올립니다.",
  },
  {
    title: "고민 입력",
    description: "손님이 지금 묻고 싶은 내용을 짧고 자연스럽게 적습니다.",
  },
  {
    title: "카드 인식",
    description: "사진에서 카드 이름과 놓인 방향을 읽고 해석에 반영합니다.",
  },
  {
    title: "결과 생성",
    description: "고민과 카드 흐름을 바탕으로 손님용 결과를 만듭니다.",
  },
  {
    title: "QR 인쇄",
    description: "미니 프린터용 QR 영수증을 뽑아 손님에게 전달합니다.",
  },
];

const valueCards = [
  {
    title: "운영은 빠르게",
    description:
      "카드 사진과 고민을 한 번에 입력하고 결과와 QR 인쇄까지 바로 이어집니다.",
  },
  {
    title: "카드는 사진으로",
    description:
      "카드 종류가 달라도 촬영한 이미지를 기준으로 카드명을 읽고 해석에 반영합니다.",
  },
  {
    title: "결과는 쉽게",
    description:
      "손님이 바로 이해할 수 있도록 어려운 표현보다 쉬운 말로 정리합니다.",
  },
];

export default function Home() {
  return (
    <main className="byeoldam-page px-3 py-4 sm:px-4 sm:py-6">
      <div className="byeoldam-shell grid gap-6">
        <section className="byeoldam-hero overflow-hidden rounded-[36px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <div className="byeoldam-pill">AI 타로카페 별담 MVP</div>
              <h1 className="byeoldam-title mt-5 text-[3rem] leading-[0.95] text-[var(--ink)] sm:text-[4.5rem] lg:text-[5.3rem]">
                별을 담은
                <br />
                QR 타로 리딩
              </h1>
              <p className="mt-6 max-w-[640px] text-[1.05rem] leading-8 text-[var(--ink-soft)] sm:text-[1.15rem]">
                손님이 고른 카드 사진 3장과 고민을 입력하면 카드 해석과 QR 영수증이 한 번에
                만들어집니다.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/studio"
                  className="byeoldam-button byeoldam-button-primary min-w-[170px]"
                >
                  운영 시작하기
                </Link>
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
                    <p className="text-sm font-black uppercase text-[var(--lilac-strong)]">
                      point 0{index + 1}
                    </p>
                    <h2 className="mt-3 text-[1.45rem] font-black text-[var(--ink)]">
                      {card.title}
                    </h2>
                    <p className="mt-3 text-[1rem] leading-7 text-[var(--ink-soft)]">
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
          className="byeoldam-panel rounded-[32px] px-5 py-6 sm:px-8 sm:py-7"
        >
          <details className="byeoldam-flow-details">
            <summary>
              <span className="byeoldam-pill">운영 흐름</span>
              <span className="flow-arrow" aria-hidden="true" />
            </summary>

            <div className="mt-6 grid gap-4 md:grid-cols-5">
              {flowSteps.map((step, index) => (
                <div key={step.title} className="byeoldam-reading-section">
                  <p className="text-sm font-black uppercase text-[var(--lilac-strong)]">
                    step {index + 1}
                  </p>
                  <h2 className="mt-3 text-[1rem] font-black text-[var(--ink)]">
                    {step.title}
                  </h2>
                  <p className="mt-2 text-[0.95rem] leading-6 text-[var(--ink-soft)]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </details>
        </section>
      </div>
    </main>
  );
}
