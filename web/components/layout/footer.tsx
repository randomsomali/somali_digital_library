// components/layout/footer.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { AppDictionary } from "@/types/dictionary";

interface FooterProps {
  dictionary: AppDictionary;
  lang: string;
}

export function Footer({ dictionary, lang }: FooterProps) {
  return (
    <footer
      id="footer"
      className={`border-t border-border/50 bg-background ${
        lang === "ar" ? "rtl" : "ltr"
      }`}
    >
      <div className="container px-4 py-16 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gradient">
              {dictionary.footer.about.title}
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {dictionary.footer.about.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">
              {dictionary.footer.quickLinks.title}
            </h3>
            <ul className="space-y-3">
              {dictionary.footer.quickLinks.links.map((link: any) => (
                <li key={link.href}>
                  <Link
                    href={`/${lang}${link.href}`}
                    className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">
              {dictionary.footer.resources.title}
            </h3>
            <ul className="space-y-3">
              {dictionary.footer.resources.links.map((link: any) => (
                <li key={link.href}>
                  <Link
                    href={`/${lang}${link.href}`}
                    className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">
              {dictionary.footer.newsletter.title}
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {dictionary.footer.newsletter.description}
            </p>
            <form className="space-y-4">
              <Input
                type="email"
                placeholder={dictionary.footer.newsletter.placeholder}
                className="h-12 text-base border-border/50 focus:border-primary transition-colors duration-200 bg-background/50 rounded-xl"
              />
              <Button className="w-full h-12 text-base bg-gradient-primary hover:bg-gradient-primary-hover shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-xl">
                {dictionary.footer.newsletter.button}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border/50 mt-16 pt-8 text-center">
          <p className="text-base text-muted-foreground">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            {dictionary.common.logo}. {dictionary.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
