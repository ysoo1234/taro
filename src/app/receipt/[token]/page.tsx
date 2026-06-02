import Link from "next/link";
import { notFound } from "next/navigation";

import { PrintButton } from "@/components/result/PrintButton";
import { ReceiptCard } from "@/components/result/ReceiptCard";
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
          <PrintButton printPageHref={`/receipt/${reading.publicToken}/card`} />
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
          <ReceiptCard
            qrDataUrl={qrDataUrl}
            summary={reading.result.shareSummary}
          />
        </section>
      </div>
    </main>
  );
}
