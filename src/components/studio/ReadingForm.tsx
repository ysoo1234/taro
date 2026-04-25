"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { TarotCardVisual } from "@/components/tarot/TarotCardVisual";
import { tarotPositions } from "@/lib/tarot";

const initialCards = tarotPositions.map((position) => ({
  position: position.key,
  label: "",
  imageDataUrl: undefined as string | undefined,
}));

type CardState = (typeof initialCards)[number];

async function fileToCompressedDataUrl(file: File) {
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new window.Image();
    element.onload = () => resolve(element);
    element.onerror = reject;
    element.src = source;
  });

  const maxSide = 760;
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return source;
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", 0.72);
}

export function ReadingForm() {
  const router = useRouter();
  const [concern, setConcern] = useState("");
  const [cards, setCards] = useState<CardState[]>(initialCards);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const allPhotosReady = useMemo(
    () => cards.every((card) => Boolean(card.imageDataUrl)),
    [cards],
  );
  const canSubmit = allPhotosReady && concern.trim().length >= 8 && !isPending;

  function updateCard(
    position: CardState["position"],
    patch: Partial<Omit<CardState, "position">>,
  ) {
    setCards((current) =>
      current.map((card) =>
        card.position === position ? { ...card, ...patch } : card,
      ),
    );
  }

  async function handlePhotoChange(
    position: CardState["position"],
    file: File | undefined,
  ) {
    if (!file) {
      return;
    }

    setError(null);

    try {
      const imageDataUrl = await fileToCompressedDataUrl(file);
      updateCard(position, { imageDataUrl });
    } catch {
      setError("사진을 불러오지 못했어요. 다시 촬영하거나 다른 이미지를 선택해 주세요.");
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!allPhotosReady) {
      setError("카드 사진 3장을 모두 올려주세요.");
      return;
    }

    if (concern.trim().length < 8) {
      setError("오늘의 고민을 8자 이상 적어주세요.");
      return;
    }

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
            "결과를 생성하지 못했어요. 카드 사진과 고민 입력을 다시 확인해 주세요.",
        );
        return;
      }

      router.push(payload.receiptPath);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="byeoldam-panel studio-panel rounded-[32px] p-5 sm:p-7"
    >
      <div className="studio-header">
        <div>
          <h1 className="text-[2.2rem] font-black leading-tight text-[var(--ink)] sm:text-[3rem]">
            카드 사진 3장과 고민을 입력해 주세요.
          </h1>
          <p className="mt-3 max-w-[780px] text-[1.02rem] leading-7 text-[var(--ink-soft)]">
            과거, 현재, 미래 순서로 촬영하면 카드 이름과 방향을 자동으로 읽어 해석에
            반영합니다. 카드명이 사진에 잘 보이지 않으면 직접 적어도 됩니다.
          </p>
        </div>
        <Link
          href="/"
          className="byeoldam-button byeoldam-button-secondary shrink-0 px-5 py-3"
        >
          메인으로
        </Link>
      </div>

      <section className="mt-6">
        <label className="byeoldam-label" htmlFor="concern">
          오늘의 고민
        </label>
        <textarea
          id="concern"
          className="byeoldam-field studio-concern resize-none"
          placeholder="별에게 묻고 싶은 것을 자유롭게 적어주세요..."
          value={concern}
          onChange={(event) => setConcern(event.target.value)}
          disabled={isPending}
        />
      </section>

      <section className="studio-card-grid mt-6">
        {tarotPositions.map((position) => {
          const card = cards.find((item) => item.position === position.key);
          const inputId = `card-photo-${position.key}`;

          return (
            <article key={position.key} className="studio-card byeoldam-card-slot p-4">
              <div className="relative z-10 grid h-full gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase text-[var(--lilac-strong)]">
                      {position.number} / {position.label}
                    </p>
                    <h2 className="mt-2 text-[1.08rem] font-black leading-6 text-[var(--ink)]">
                      {position.description}
                    </h2>
                  </div>
                  {card?.imageDataUrl ? (
                    <span className="studio-ready-badge">업로드 완료</span>
                  ) : null}
                </div>

                <label htmlFor={inputId} className="card-photo-frame studio-photo-frame">
                  {card?.imageDataUrl ? (
                    <Image
                      src={card.imageDataUrl}
                      alt={`${position.number}번 카드 사진`}
                      width={360}
                      height={460}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="studio-photo-placeholder">
                      <TarotCardVisual
                        title={`${position.number}번 카드`}
                        subtitle={position.label}
                        compact
                      />
                      <span>사진 선택하기</span>
                    </div>
                  )}
                </label>

                <input
                  id={inputId}
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(event) =>
                    handlePhotoChange(position.key, event.target.files?.[0])
                  }
                  disabled={isPending}
                />

                <div className="grid gap-2">
                  <input
                    className="byeoldam-field"
                    value={card?.label ?? ""}
                    onChange={(event) =>
                      updateCard(position.key, { label: event.target.value })
                    }
                    placeholder="카드명 선택 입력"
                    disabled={isPending}
                  />
                  {card?.imageDataUrl ? (
                    <button
                      type="button"
                      className="byeoldam-button byeoldam-button-ghost w-full px-4 py-3 text-sm"
                      onClick={() => updateCard(position.key, { imageDataUrl: undefined })}
                      disabled={isPending}
                    >
                      사진 다시 선택
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <div className="studio-submit-row mt-6">
        <p className="text-sm font-bold text-[var(--ink-soft)]">
          {!allPhotosReady
            ? "카드 사진 3장을 모두 올리면 생성할 수 있어요."
            : concern.trim().length < 8
              ? "고민을 8자 이상 적으면 생성할 수 있어요."
              : "카드 사진 3장과 고민이 준비됐어요."}
        </p>
        <button
          type="submit"
          className="byeoldam-button byeoldam-button-primary min-w-[190px]"
          disabled={!canSubmit}
        >
          {isPending ? "카드 인식과 결과 생성 중..." : "생성하기"}
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-[18px] bg-[rgba(211,88,132,0.14)] px-4 py-3 text-sm font-bold text-[#8a2d52]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
