import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "별담 AI 타로",
  description: "현장에서 뽑은 타로 3장과 고민을 바탕으로 결과를 생성하고 QR로 전달하는 별담 운영 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
