import { getDictionary } from "@/lib/dictionary";
import { AboutUs } from "@/components/about/about-us";

export default async function AboutPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = params;
  const dictionary = await getDictionary(lang as "en" | "ar");

  return <AboutUs dictionary={dictionary} lang={lang} />;
}
