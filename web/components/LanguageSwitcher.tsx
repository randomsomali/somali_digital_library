// components/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Globe, ChevronDown } from "lucide-react";
import Image from "next/image";

// Helper to set cookie
const setCookie = (name: string, value: string, days: number) => {
  if (typeof window !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }
};

// Language options with flags
const languages = [
  {
    code: "en",
    name: "English",
    flag: "/images/flags/en.png", // In production, use an actual flag image path
  },
  {
    code: "ar",
    name: "العربية",
    flag: "/images/flags/ar.png", // In production, use an actual flag image path
  },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set current language on client side to avoid hydration mismatch
  useEffect(() => {
    const pathLang = pathname.split("/")[1];
    setCurrentLang(pathLang === "en" || pathLang === "ar" ? pathLang : "ar");
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const switchLanguage = (locale: string) => {
    // Remember user preference
    setCookie("NEXT_LOCALE", locale, 365); // 1 year

    // Navigate to the new locale path
    const segments = pathname.split("/");
    segments[1] = locale;
    const newPath = segments.join("/");
    router.push(newPath);

    // Close the dropdown
    setIsOpen(false);
  };

  // Find current language details
  const currentLanguage =
    languages.find((lang) => lang.code === currentLang) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background hover:bg-muted transition-colors duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* <Globe size={18} className="text-muted-foreground" /> */}
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-4 overflow-hidden rounded-sm shadow">
            <Image
              src={currentLanguage.flag}
              alt={currentLanguage.code}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-medium">{currentLanguage.name}</span>
        </div>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg border border-border overflow-hidden z-50">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => switchLanguage(language.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors ${
                  currentLang === language.code ? "bg-muted/50" : ""
                }`}
                aria-current={
                  currentLang === language.code ? "true" : undefined
                }
              >
                <div className="relative w-6 h-4 overflow-hidden rounded-sm shadow flex-shrink-0">
                  <Image
                    src={language.flag}
                    alt={language.code}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="flex-grow font-medium">{language.name}</span>
                {currentLang === language.code && (
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
