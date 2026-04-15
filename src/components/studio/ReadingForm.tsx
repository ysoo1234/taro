"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { tarotPositions } from "@/lib/tarot";

const initialCards = tarotPositions.map((position) => ({
  position: position.key,
  label: "",
}));

export function ReadingForm() {
  const router = useRouter();
  const [concern, setConcern] = useState("");
  const [cards, setCards] = useState(initialCards);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateCard(position: (typeof initialCards)[number]["position"], label: string) {
    setCards((current) =>
      current.map((card) =>
        card.position === position ? { ...card, label } : card,
      ),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/readings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          concern,
          cards,
        }),
      });

      const payload = (await response.json()) as {
        receiptPath?: string;
        error?: string;
      };

      if (!response.ok || !payload.receiptPath) {
        setError(
          payload.error ??
            "결과를 생성하지 못했어요. 환경변수와 DB 초기화 여부를 확인해 주세요.",
        );
        return;
      }

      router.push(payload.receiptPath);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="byeoldam-panel rounded-[36px] p-5 sm:p-8"
    >
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="byeoldam-pill">운영자 입력 화면</div>
          <h2 className="mt-4 text-[2rem] font-black tracking-[-0.04em] text-[var(--navy)] sm:text-[2.4rem]">
            손님이 직접 뽑은 카드 3장과 고민을 넣으면,
            <br className="hidden sm:block" /> QR까지 한 번에 나옵니다.
          </h2>
          <p className="mt-4 max-w-[640px] text-[1.04rem] leading-7 text-[var(--navy-soft)]">
            실제 부스에서는 카드만 뽑고, 이 화면에서 운영자가 빠르게 입력하면
            됩니다. 생성된 결과는 DB에 저장되고, 손님은 나중에 QR을 다시 찍어도
            같은 결과를 확인할 수 있어요.
          </p>

          <div className="mt-8">
            <label className="byeoldam-label" htmlFor="concern">
              손님의 고민
            </label>
            <textarea
              id="concern"
              className="byeoldam-field min-h-[190px] resize-none"
              placeholder="예: 요즘 진로를 어떻게 정해야 할지 고민이에요. 잘하고 싶은데 조급한 마음도 있고, 지금 선택이 맞는지 알고 싶어요."
              value={concern}
              onChange={(event) => setConcern(event.target.value)}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="grid gap-4">
          {tarotPositions.map((position) => (
            <div key={position.key} className="byeoldam-card-slot p-5">
              <div className="relative z-10">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold-strong)]">
                  {position.label}
                </p>
                <p className="mt-2 text-lg font-black tracking-[-0.03em] text-[var(--navy)]">
                  {position.description}
                </p>
                <input
                  className="byeoldam-field relative z-10 mt-4"
                  value={cards.find((card) => card.position === position.key)?.label ?? ""}
                  onChange={(event) => updateCard(position.key, event.target.value)}
                  placeholder={`${position.label} 카드 이름 입력`}
                  disabled={isPending}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="byeoldam-button byeoldam-button-primary min-w-[190px]"
          disabled={isPending}
        >
          {isPending ? "해석과 QR 생성 중..." : "결과 만들기"}
        </button>
        <Link
          href="/"
          className="byeoldam-button byeoldam-button-secondary min-w-[150px] text-center"
        >
          소개로 돌아가기
        </Link>
      </div>

      {error ? (
        <p className="mt-4 rounded-[22px] bg-[rgba(214,71,90,0.1)] px-4 py-3 text-sm font-bold text-[#8f3042]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
