"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="byeoldam-button byeoldam-button-primary"
    >
      QR 인쇄하기
    </button>
  );
}
