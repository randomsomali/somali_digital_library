//registerpage.tsx
"use client";

import { getDictionary } from "@/lib/dictionary";
import { useEffect, useState } from "react";
import Register from "@/components/Auth/Register";
import { AppDictionary } from "@/types/dictionary";
import { use } from "react";
import PublicRoute from "@/components/PublicRoute";

export default function RegisterPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const [dictionary, setDictionary] = useState<AppDictionary | null>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      const dict = await getDictionary(lang as "en" | "ar");
      setDictionary(dict);
    };
    loadDictionary();
  }, [lang]);

  if (!dictionary) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20">
        <div className="container px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PublicRoute lang={lang}>
      <Register dictionary={dictionary} lang={lang} />
    </PublicRoute>
  );
}
