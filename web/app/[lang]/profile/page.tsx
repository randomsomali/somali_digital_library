import { getDictionary } from "@/lib/dictionary";

export default async function AboutPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = await getDictionary(lang as "en" | "ar");

  return (
    <div>
      <h1>{dictionary.about.title}</h1>
    </div>
  );
}
