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
        <section className="byeoldam-panel rounded-[32px] p-5 sm:p-7">
          <ReadingResult reading={reading} compact />
        </section>
      </div>
    </main>
  );
}
