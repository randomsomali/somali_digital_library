// app/[lang]/page.tsx
import { getDictionary } from "@/lib/dictionary";
import { Hero } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { SearchSection } from "@/components/home/search-section";

export default async function Home({ params }: { params: { lang: string } }) {
  // Await the params object if necessary (in this case, it's not needed)
  const { lang } = await params; // Directly destructuring lang from params

  const dictionary = await getDictionary(lang as "en" | "ar");

  return (
    <>
      {/* <Navbar dictionary={dictionary} lang={lang} /> */}
      <Hero dictionary={dictionary} lang={lang} />
      <Stats dictionary={dictionary} lang={lang} />

      <FeaturedCategories dictionary={dictionary} lang={lang} />
      <SearchSection dictionary={dictionary} lang={lang} />
      {/* <Footer dictionary={dictionary} lang={lang} /> */}

      {/* Add more components here */}
    </>
  );
}
