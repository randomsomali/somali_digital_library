// components/layout/footer.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { AppDictionary } from "@/types/dictionary"; // Updated import

interface FooterProps {
  dictionary: AppDictionary;
  lang: string;
}

export function Footer({ dictionary, lang }: FooterProps) {
  return (
    <footer
      id="footer"
      className={`border-t bg-background/95 ${lang === "ar" ? "rtl" : "ltr"}`}
    >
      <div className="container px-4 py-12  mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {dictionary.footer.about.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {dictionary.footer.about.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {dictionary.footer.quickLinks.title}
            </h3>
            <ul className="space-y-2">
              {dictionary.footer.quickLinks.links.map((link: any) => (
                <li key={link.href}>
                  <Link
                    href={`/${lang}${link.href}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {dictionary.footer.resources.title}
            </h3>
            <ul className="space-y-2">
              {dictionary.footer.resources.links.map((link: any) => (
                <li key={link.href}>
                  <Link
                    href={`/${lang}${link.href}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {dictionary.footer.newsletter.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {dictionary.footer.newsletter.description}
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder={dictionary.footer.newsletter.placeholder}
              />
              <Button className="w-full">
                {dictionary.footer.newsletter.button}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {dictionary.common.logo}.{" "}
            {dictionary.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
