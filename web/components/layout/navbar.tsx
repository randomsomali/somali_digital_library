// components/layout/navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { ThemeToggler } from "../ThemeToggler";
import { LanguageSwitcher } from "../LanguageSwitcher";
import VisuallyHidden from "../ui/visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AppDictionary } from "@/types/dictionary"; // Updated import

interface NavbarProps {
  dictionary: AppDictionary; // Updated type
  lang: string;
}

export function Navbar({ dictionary, lang }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const resources = [
    {
      label: dictionary.navigation.categories.educational,
      href: `/${lang}/resources?category_id=1`, // Example category ID
    },
    {
      label: dictionary.navigation.categories.scientific,
      href: `/${lang}/resources?category_id=2`, // Example category ID
    },
    {
      label: dictionary.navigation.categories.literature,
      href: `/${lang}/resources?category_id=3`, // Example category ID
    },
  ];

  const libraryTypes = [
    {
      label: dictionary.navigation.library.books,
      href: `/${lang}/resources?type=book`, // Example type
    },
    {
      label: dictionary.navigation.library.research,
      href: `/${lang}/resources?type=research`, // Example type
    },
    {
      label: dictionary.navigation.library.articles,
      href: `/${lang}/resources?type=article`, // Example type
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full ${
        isScrolled
          ? "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : ""
      }`}
    >
      <nav
        className={`container mx-auto px-4 ${lang === "ar" ? "rtl" : "ltr"}`}
      >
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center space-x-2">
            <span className="text-xl font-bold">{dictionary.common.logo}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href={`/${lang}`}
              className="text-sm font-medium hover:text-primary"
            >
              {dictionary.navigation.home}
            </Link>

            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary">
                {dictionary.navigation.resources}
                <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {resources.map((item) => (
                  <DropdownMenuItem key={item.href}>
                    <Link href={item.href} className="w-full">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Library Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary">
                {dictionary.navigation.library.title}
                <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {libraryTypes.map((item) => (
                  <DropdownMenuItem key={item.href}>
                    <Link href={item.href} className="w-full">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href={`/${lang}#stat`}
              className="text-sm font-medium hover:text-primary"
            >
              {dictionary.navigation.about}
            </Link>

            <Link
              href={`/${lang}#footer`}
              className="text-sm font-medium hover:text-primary"
            >
              {dictionary.navigation.contact}
            </Link>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggler />
              <LanguageSwitcher />

              {/* Auth Buttons */}
              <Button variant="outline" asChild>
                <Link href={`/${lang}/login`}>{dictionary.auth.login}</Link>
              </Button>
              <Button asChild>
                <Link href={`/${lang}/register`}>{dictionary.auth.signup}</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={lang === "ar" ? "right" : "left"}>
                <DialogTitle>
                  <VisuallyHidden>
                    <h2>{dictionary.navigation.menuTitle}</h2>{" "}
                    {/* Add a title for the dialog */}
                  </VisuallyHidden>
                </DialogTitle>

                <div className="flex flex-col gap-4">
                  <Link
                    href={`/${lang}`}
                    className="text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {dictionary.navigation.home}
                  </Link>

                  {/* Mobile Resources */}
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium">
                      {dictionary.navigation.resources}
                    </h2>
                    {resources.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-2 py-1 text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Library */}
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium">
                      {dictionary.navigation.library.title}
                    </h2>
                    {libraryTypes.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-2 py-1 text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <Link
                    href={`/${lang}#stat`}
                    className="text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {dictionary.navigation.about}
                  </Link>

                  <Link
                    href={`/${lang}#footer`}
                    className="text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {dictionary.navigation.contact}
                  </Link>

                  <div className="flex flex-col gap-2 pt-4">
                    <Button variant="outline" asChild>
                      <Link
                        href={`/${lang}/login`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {dictionary.auth.login}
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link
                        href={`/${lang}/register`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {dictionary.auth.signup}
                      </Link>
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <ThemeToggler />
                    <LanguageSwitcher />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
