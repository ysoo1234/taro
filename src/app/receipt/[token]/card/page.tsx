import { notFound } from "next/navigation";

import { ReceiptCard } from "@/components/result/ReceiptCard";
import { getAbsoluteUrl } from "@/lib/absolute-url";
import { createQrDataUrl } from "@/lib/qr";
import { getReadingByToken } from "@/lib/readings";

type ReceiptCardPageProps = {
  params: Promise<{ token: string }>;
};

export const dynamic = "force-dynamic";

export default async function ReceiptCardPage({ params }: ReceiptCardPageProps) {
  const { token } = await params;
  const reading = await getReadingByToken(token);

  if (!reading) {
    notFound();
  }

  const publicUrl = await getAbsoluteUrl(`/r/${reading.publicToken}`);
  const qrDataUrl = await createQrDataUrl(publicUrl);

  return (
    <main className="receipt-card-page" aria-label="5.7x9.7 QR 페이지">
      <ReceiptCard
        qrDataUrl={qrDataUrl}
        summary={reading.result.shareSummary}
        compact
      />
    </main>
  );
}
