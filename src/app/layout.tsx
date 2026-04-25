import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "별담 AI 타로",
  description:
    "현장에서 촬영한 타로 카드 사진과 고민을 바탕으로 결과를 생성하고 QR 영수증으로 전달하는 별담 운영 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className="h-full antialiased"
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
