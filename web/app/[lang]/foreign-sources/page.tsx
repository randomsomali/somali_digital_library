// app/[lang]/foreign-sources/page.tsx
import { getDictionary } from "@/lib/dictionary";
import { ForeignSourcesContent } from "@/components/knowledge-sources/foreign-sources-content";

export default async function ForeignSourcesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as "en" | "ar");

  return <ForeignSourcesContent dictionary={dictionary} lang={lang} />;
}
