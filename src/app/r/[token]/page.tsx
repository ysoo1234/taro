import { notFound } from "next/navigation";

import { ReadingResult } from "@/components/result/ReadingResult";
import { getReadingByToken } from "@/lib/readings";

type PublicReadingPageProps = {
  params: Promise<{ token: string }>;
};

export const dynamic = "force-dynamic";

export default async function PublicReadingPage({
  params,
}: PublicReadingPageProps) {
  const { token } = await params;
  const reading = await getReadingByToken(token);

  if (!reading) {
    notFound();
  }

  return (
    <main className="byeoldam-page px-3 py-4 sm:px-4 sm:py-6">
      <div className="byeoldam-shell">
        <section className="byeoldam-panel rounded-[36px] p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="byeoldam-pill">별담 AI 리딩 결과</span>
            <span className="text-sm font-semibold text-[var(--navy-soft)]">
              QR로 다시 열어본 개인 결과 페이지
            </span>
          </div>
          <ReadingResult reading={reading} compact />
        </section>
      </div>
    </main>
  );
}
