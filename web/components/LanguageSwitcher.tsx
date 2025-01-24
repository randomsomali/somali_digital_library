"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    const newPath = segments.join("/");
    router.push(newPath);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => switchLanguage("en")}>
        English
      </Button>
      <Button variant="outline" onClick={() => switchLanguage("ar")}>
        العربية
      </Button>
    </div>
  );
}
