import { getDictionary } from "@/lib/dictionary";
import { AboutUs } from "@/components/about/about-us";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as "en" | "ar");

  return <AboutUs dictionary={dictionary} lang={lang} />;
}
