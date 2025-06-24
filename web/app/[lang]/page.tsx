// app/[lang]/page.tsx
import { getDictionary } from "@/lib/dictionary";
import { Hero } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { AboutUs } from "@/components/about/about-us";

export default async function Home({ params }: { params: { lang: string } }) {
  const { lang } = await params;

  const dictionary = await getDictionary(lang as "en" | "ar");

  return (
    <>
      <Hero dictionary={dictionary} lang={lang} />
      <Stats dictionary={dictionary} lang={lang} />
      <AboutUs dictionary={dictionary} lang={lang} />

      {/* <SearchSection dictionary={dictionary} lang={lang} /> */}
    </>
  );
}
