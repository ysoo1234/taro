import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
      <div className="byeoldam-shell grid gap-4">
        <div className="no-print result-actions">
          <PrintButton />
          <Link
            href="/studio"
            className="byeoldam-button byeoldam-button-secondary"
          >
            새 타로 보기
          </Link>
        </div>

        <section className="byeoldam-panel screen-result rounded-[30px] p-5 sm:p-6">
          <ReadingResult reading={reading} />
        </section>

        <section className="print-only">
          <section className="byeoldam-receipt" aria-label="QR 운세 영수증">
            <div className="receipt-corners" />
            <div className="receipt-moons">
              <span>☾</span>
              <span>✦</span>
              <span>☽</span>
            </div>
            <h2>별담카페</h2>
            <p className="receipt-ribbon">
              지금의 선택이 좋은 방향으로 이어지고 있습니다.
            </p>
            <div className="receipt-qr">
              <Image
                src={qrDataUrl}
                alt="손님 결과 확인 QR 코드"
                width={320}
                height={320}
                unoptimized
              />
            </div>
            <div className="receipt-summary-label">한 줄 요약</div>
            <p className="receipt-summary">{reading.result.shareSummary}</p>
            <p className="receipt-instagram">@the.beyeoldam</p>
          </section>
        </section>
      </div>
    </main>
  );
}
