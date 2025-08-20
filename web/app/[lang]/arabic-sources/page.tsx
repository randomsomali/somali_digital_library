// app/[lang]/arabic-sources/page.tsx
import { getDictionary } from "@/lib/dictionary";
import { ArabicSourcesContent } from "@/components/knowledge-sources/arabic-sources-content";

export default async function ArabicSourcesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as "en" | "ar");

  return <ArabicSourcesContent dictionary={dictionary} lang={lang} />;
}
