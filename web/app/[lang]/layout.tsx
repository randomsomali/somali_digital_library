import { Cairo } from "next/font/google";
import { getDictionary } from "@/lib/dictionary";
import { Navbar } from "@/components/layout/navbar"; // Import Navbar
import { Footer } from "@/components/layout/footer"; // Import Footer

const cairo = Cairo({ subsets: ["arabic"] });

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as "en" | "ar");

  return (
    <div
      className={`${lang === "ar" ? "rtl" : "ltr"} ${
        lang === "ar" ? cairo.className : ""
      }`}
    >
      <Navbar dictionary={dictionary} lang={lang} /> {/* Render Navbar */}
      <main className="container mx-auto px-4">{children}</main>{" "}
      {/* Main content area */}
      <Footer dictionary={dictionary} lang={lang} /> {/* Render Footer */}{" "}
    </div>
  );
}
