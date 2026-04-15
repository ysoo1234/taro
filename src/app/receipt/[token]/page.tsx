import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyLinkButton } from "@/components/result/CopyLinkButton";
import { PrintButton } from "@/components/result/PrintButton";
import { ReadingResult } from "@/components/result/ReadingResult";
import { getAbsoluteUrl } from "@/lib/absolute-url";
import { createQrDataUrl } from "@/lib/qr";
import { getReadingByToken } from "@/lib/readings";

type ReceiptPageProps = {
  params: Promise<{ token: string }>;
};

export const dynamic = "force-dynamic";

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const { token } = await params;
  const reading = await getReadingByToken(token);

  if (!reading) {
    notFound();
  }

  const publicPath = `/r/${reading.publicToken}`;
  const publicUrl = await getAbsoluteUrl(publicPath);
  const qrDataUrl = await createQrDataUrl(publicUrl);

  return (
    <main className="byeoldam-page px-3 py-4 sm:px-4 sm:py-6">
      <div className="byeoldam-shell grid gap-5">
        <section className="byeoldam-panel no-print rounded-[36px] p-5 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="byeoldam-pill">QR 영수증 / 운영자 확인용</div>
              <h1 className="mt-4 text-[2rem] font-black tracking-[-0.04em] text-[var(--navy)]">
                손님에게 바로 건네줄 결과가 준비됐어요.
              </h1>
              <p className="mt-3 max-w-[760px] text-[1rem] leading-7 text-[var(--navy-soft)]">
                이 화면에서 QR을 인쇄하면 손님은 언제든 같은 결과를 다시 볼 수
                있습니다. 공개 링크는 아래 버튼으로 복사할 수 있어요.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <PrintButton />
              <CopyLinkButton value={publicUrl} />
              <Link
                href="/studio"
                className="byeoldam-button byeoldam-button-secondary"
              >
                새 리딩 만들기
              </Link>
            </div>
          </div>
        </section>

        <section className="byeoldam-print-sheet grid gap-5 lg:grid-cols-[0.66fr_1.34fr]">
          <aside className="byeoldam-panel rounded-[34px] p-5 sm:p-6">
            <div className="byeoldam-card-slot p-5 text-center">
              <div className="relative z-10">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold-strong)]">
                  Guest QR
                </p>
                <div className="mx-auto mt-4 w-fit rounded-[28px] bg-[#fff9f0] p-4 shadow-[0_12px_28px_rgba(29,36,51,0.08)]">
                  <Image
                    src={qrDataUrl}
                    alt="별담 결과 확인 QR 코드"
                    width={320}
                    height={320}
                    unoptimized
                  />
                </div>
                <p className="mt-4 text-sm font-semibold leading-6 text-[var(--navy-soft)]">
                  손님이 이 QR을 스캔하면 저장된 운세 결과 페이지로 바로 이동합니다.
                </p>
              </div>
            </div>

            <div className="byeoldam-reading-section mt-4">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold-strong)]">
                한 줄 요약
              </p>
              <p className="mt-3 text-[1rem] leading-7 text-[var(--navy)]">
                {reading.result.shareSummary}
              </p>
            </div>
          </aside>

          <section className="byeoldam-panel rounded-[34px] p-5 sm:p-6">
            <ReadingResult reading={reading} />
          </section>
        </section>
      </div>
    </main>
  );
}
