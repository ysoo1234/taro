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
    window.setTimeout(() => {
      window.print();
    }, 0);
  }

  return (
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
  );
}
