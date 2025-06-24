//loginpage.tsx
"use client";

import { getDictionary } from "@/lib/dictionary";
import { useEffect, useState } from "react";
import Login from "@/components/Auth/Login";
import { AppDictionary } from "@/types/dictionary";
import { use } from "react";
import PublicRoute from "@/components/PublicRoute";

export default function LoginPage({
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
      <div className="pt-32 pb-20 md:pt-40 md:pb-32 min-h-screen bg-background">
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
      <Login dictionary={dictionary} lang={lang} />
    </PublicRoute>
  );
}
