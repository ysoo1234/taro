import "server-only";

import QRCode from "qrcode";

export async function createQrDataUrl(value: string) {
  return QRCode.toDataURL(value, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 320,
    color: {
      dark: "#161616",
      light: "#ffffff",
    },
  });
}
