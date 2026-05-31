"use client";

import { useRef } from "react";

export function PrintButton() {
  const printLockRef = useRef(false);

  function printReceipt() {
    if (printLockRef.current) {
      return;
    }

    printLockRef.current = true;
    window.setTimeout(() => {
      printLockRef.current = false;
    }, 900);

    window.focus();
    window.print();
  }

  return (
    <button
      type="button"
      onClick={printReceipt}
      onTouchEnd={(event) => {
        event.preventDefault();
        printReceipt();
      }}
      className="byeoldam-button byeoldam-button-primary"
    >
      QR 코드 인쇄
    </button>
  );
}
