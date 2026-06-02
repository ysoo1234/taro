"use client";

import type { MouseEvent } from "react";

type PrintButtonProps = {
  printPageHref: string;
};

export function PrintButton({ printPageHref }: PrintButtonProps) {
  function openReceiptPage(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    const opened = window.open(
      printPageHref,
      "_blank",
      "popup,width=215,height=367",
    );

    if (opened) {
      opened.opener = null;
      opened.focus();
      return;
    }

    window.location.href = printPageHref;
  }

  return (
    <div className="print-action-group">
      <a
        href={printPageHref}
        target="_blank"
        rel="noreferrer"
        onClick={openReceiptPage}
        className="byeoldam-button byeoldam-button-primary"
      >
        5.7x9.7 페이지 열기
      </a>
    </div>
  );
}
