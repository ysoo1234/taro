import Image from "next/image";

type ReceiptCardProps = {
  qrDataUrl: string;
  summary: string;
  compact?: boolean;
};

export function ReceiptCard({ qrDataUrl, summary, compact }: ReceiptCardProps) {
  const className = compact
    ? "byeoldam-receipt byeoldam-receipt-compact"
    : "byeoldam-receipt";

  return (
    <section className={className} aria-label="QR 영수증">
      <div className="receipt-corners" />
      <div className="receipt-moons">
        <span>☾</span>
        <span>✦</span>
        <span>☽</span>
      </div>
      <h2>별담카페</h2>
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
      <p className="receipt-summary">{summary}</p>
      <p className="receipt-instagram">@the.byeoldam</p>
    </section>
  );
}
