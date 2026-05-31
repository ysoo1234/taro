"use client";

import { useMemo, useRef } from "react";

type PrintButtonProps = {
  qrDataUrl: string;
  summary: string;
};

function escapeSvgText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wrapSummary(summary: string, maxLineLength = 10, maxLines = 3) {
  const words = summary.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (next.length > maxLineLength && current) {
      lines.push(current);
      current = word;
      continue;
    }

    current = next;
  }

  if (current) {
    lines.push(current);
  }

  return lines.slice(0, maxLines);
}

function createReceiptSvg(qrDataUrl: string, summaryLines: string[]) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="570" height="900" viewBox="0 0 570 900">
      <rect width="570" height="900" fill="white"/>
      <rect x="12" y="12" width="546" height="876" fill="none" stroke="#111" stroke-width="3"/>
      <path d="M28 65V28h38M504 28h38v37" fill="none" stroke="#111" stroke-width="4"/>
      <text x="180" y="76" font-family="serif" font-size="46">☾</text>
      <text x="285" y="76" text-anchor="middle" font-family="serif" font-size="42">✦</text>
      <text x="390" y="76" font-family="serif" font-size="46">☽</text>
      <line x1="55" y1="115" x2="515" y2="115" stroke="#111" stroke-width="4"/>
      <text x="285" y="188" text-anchor="middle" font-family="Arial, sans-serif" font-size="58" font-weight="900">별담카페</text>
      <rect x="115" y="240" width="340" height="340" fill="white" stroke="#111" stroke-width="4"/>
      <image href="${qrDataUrl}" x="133" y="258" width="304" height="304"/>
      <text x="285" y="635" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="800">한 줄 요약</text>
      ${summaryLines
        .map(
          (line, index) =>
            `<text x="285" y="${685 + index * 36}" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="900">${escapeSvgText(line)}</text>`,
        )
        .join("")}
      <line x1="55" y1="820" x2="515" y2="820" stroke="#111" stroke-width="4"/>
      <text x="285" y="865" text-anchor="middle" font-family="Arial, sans-serif" font-size="31" font-weight="900">@the.byeoldam</text>
    </svg>
  `;
}

function createA4Svg(qrDataUrl: string, summaryLines: string[]) {
  const receipt = createReceiptSvg(qrDataUrl, summaryLines)
    .replace("<svg ", '<g transform="translate(340 250) scale(3.15)" ')
    .replace("</svg>", "</g>");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="2480" height="3508" viewBox="0 0 2480 3508">
      <rect width="2480" height="3508" fill="white"/>
      ${receipt}
    </svg>
  `;
}

export function PrintButton({ qrDataUrl, summary }: PrintButtonProps) {
  const printLockRef = useRef(false);
  const receiptImageHref = useMemo(() => {
    const summaryLines = wrapSummary(summary);
    const svg = createReceiptSvg(qrDataUrl, summaryLines);

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }, [qrDataUrl, summary]);
  const a4ImageHref = useMemo(() => {
    const summaryLines = wrapSummary(summary, 10, 3);
    const svg = createA4Svg(qrDataUrl, summaryLines);

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }, [qrDataUrl, summary]);

  function printReceipt() {
    if (printLockRef.current) {
      return;
    }

    printLockRef.current = true;
    window.setTimeout(() => {
      printLockRef.current = false;
    }, 900);

    window.focus();
    window.setTimeout(() => {
      window.print();
    }, 0);
  }

  return (
    <div className="print-action-group">
      <a
        href="#print"
        role="button"
        onClick={printReceipt}
        onPointerUp={(event) => {
          if (event.pointerType === "touch") {
            event.preventDefault();
            printReceipt();
          }
        }}
        onTouchEnd={(event) => {
          event.preventDefault();
          printReceipt();
        }}
        className="byeoldam-button byeoldam-button-primary"
      >
        QR 코드 인쇄
      </a>
      <a
        href={receiptImageHref}
        download="byeoldam-qr-receipt-57x90.svg"
        className="byeoldam-button byeoldam-button-secondary"
      >
        페이퍼랑 이미지
      </a>
      <a
        href={a4ImageHref}
        download="byeoldam-qr-receipt-a4.svg"
        className="byeoldam-button byeoldam-button-secondary"
      >
        A4 이미지
      </a>
    </div>
  );
}
