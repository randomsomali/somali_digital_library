// components/layout/navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Users, User } from "lucide-react";
import { ThemeToggler } from "../ThemeToggler";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import { AppDictionary } from "@/types/dictionary";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  dictionary: AppDictionary;
  lang: string;
}

export function Navbar({ dictionary, lang }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get dashboard route based on user type
  const getDashboardRoute = () => {
    if (user?.role === "institution") {
      return `/${lang}/institution-dashboard`;
    }

    return `/${lang}/dashboard`;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/20"
          : "bg-transparent"
      }`}
    >
      <nav
        className={`container mx-auto px-6 py-4 ${
          lang === "ar" ? "rtl" : "ltr"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2 group">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-violet-500 transition-colors duration-300">
              {dictionary.common.logo}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Direct Resources Link */}
            <Link
              href={`/${lang}/resources`}
              className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105 transform"
            >
              {dictionary.navigation.resources}
            </Link>

            <Link
              href={`/${lang}/about`}
              className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105 transform"
            >
              {dictionary.navigation.about}
            </Link>

            <Link
              href={`/${lang}#footer`}
              className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105 transform"
            >
              {dictionary.navigation.contact}
            </Link>

            <Link
              href={`/${lang}`}
              className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105 transform"
            >
              {dictionary.navigation.blog}
            </Link>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggler />
              <LanguageSwitcher />

              {/* Conditional Button - Dashboard if logged in, Join Community if not */}
              {isAuthenticated ? (
                <Button
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg hover:shadow-violet-500/25 transition-all duration-200 text-white font-medium px-4 py-2 rounded-lg"
                  asChild
                >
                  <Link href={getDashboardRoute()}>
                    <User className="w-4 h-4" />
                    {dictionary.auth.profile}
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-border/40 hover:border-border hover:bg-accent/20 transition-all duration-200 font-medium px-4 py-2 rounded-lg"
                  asChild
                >
                  <Link href={`/${lang}/login`}>
                    <Users className="w-4 h-4" />
                    {dictionary.navigation.joinCommunity}
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden hover:bg-accent/50"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={lang === "ar" ? "right" : "left"}
                className="w-80 bg-card/95 backdrop-blur-xl border-border/20"
              >
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, x: lang === "ar" ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6 pt-8"
                  >
                    {/* User Avatar Placeholders */}
                    <div className="flex items-center gap-2 pb-4 border-b border-border/20">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-background flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            A
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-background flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            B
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-background flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            C
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        {dictionary.common.joinCommunity}
                      </span>
                    </div>

                    {/* Mobile Menu Items */}
                    <Link
                      href={`/${lang}`}
                      className="text-base font-medium hover:text-violet-500 transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {dictionary.navigation.home}
                    </Link>

                    <Link
                      href={`/${lang}/resources`}
                      className="text-base font-medium hover:text-violet-500 transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {dictionary.navigation.resources}
                    </Link>

                    <Link
                      href={`/${lang}/about`}
                      className="text-base font-medium hover:text-violet-500 transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {dictionary.navigation.about}
                    </Link>

                    <Link
                      href={`/${lang}#footer`}
                      className="text-base font-medium hover:text-violet-500 transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {dictionary.navigation.contact}
                    </Link>

                    {/* Conditional Mobile Buttons */}
                    {isAuthenticated ? (
                      <div className="flex flex-col gap-3 pt-6 border-t border-border/20">
                        <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                          <Link
                            href={getDashboardRoute()}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {dictionary.auth.profile}
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 pt-6 border-t border-border/20">
                        <Button
                          variant="outline"
                          className="border-border/40 hover:bg-accent/20"
                        >
                          <Link
                            href={`/${lang}/login`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {dictionary.auth.login}
                          </Link>
                        </Button>
                        <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                          <Link
                            href={`/${lang}/register`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {dictionary.auth.signup}
                          </Link>
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-6 border-t border-border/20">
                      <ThemeToggler />
                      <LanguageSwitcher />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
