// app/[lang]/layout.tsx
import { Noto_Sans_Arabic, Noto_Sans } from "next/font/google";
import { getDictionary } from "@/lib/dictionary";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// Load fonts outside component to avoid reloads
const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-sans-arabic",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const { lang } = await params;
  const validLang = ["en", "ar"].includes(lang) ? lang : "en";
  const dictionary = await getDictionary(validLang as "en" | "ar");
  const isRTL = validLang === "ar";

  return (
    <div
      className={`${isRTL ? notoSansArabic.variable : notoSans.variable} ${
        isRTL ? "rtl" : "ltr"
      } flex min-h-screen flex-col bg-background`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navbar dictionary={dictionary} lang={validLang} />
      <main className="flex-1 w-full">{children}</main>
      <Footer dictionary={dictionary} lang={validLang} />
    </div>
  );
}

// export async function generateMetadata({
//   params,
// }: {
//   params: { lang: string };
// }) {
//   const dictionary = await getDictionary(params.lang);

//   return {
//     title: dictionary.common.title,
//     description: dictionary.common.description,
//     alternates: {
//       languages: {
//         en: "/en",
//         ar: "/ar",
//       },
//     },
//   };
// }
