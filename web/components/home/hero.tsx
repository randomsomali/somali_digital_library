// components/home/hero.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import hero from "../../public/images/hero.png"; // Relative to your file
import { AppDictionary } from "@/types/dictionary"; // Updated import

interface HeroProps {
  dictionary: AppDictionary;
  lang: string;
}

export function Hero({ dictionary, lang }: HeroProps) {
  return (
    <section
      className={`relative overflow-hidden ${lang === "ar" ? "rtl" : "ltr"}`}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)]
        dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900),theme(colors.gray.900))]"
      />

      <div className="container px-4 py-24 mx-auto">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              {dictionary.home.hero.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {dictionary.home.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="flex gap-2">
                {dictionary.home.hero.explore}
              </Button>
              <Button size="lg" variant="outline">
                {dictionary.home.hero.learnMore}
              </Button>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div className="relative aspect-video lg:aspect-square">
              <Image
                className="object-cover rounded-xl shadow-2xl"
                src={hero}
                alt="Library Hero"
                fill
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
