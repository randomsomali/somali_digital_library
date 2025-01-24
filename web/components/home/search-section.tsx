// components/home/search-section.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { AppDictionary } from "@/types/dictionary";
import Link from "next/link";

interface SearchSectionProps {
  dictionary: AppDictionary;
  lang: string;
}

export function SearchSection({ dictionary, lang }: SearchSectionProps) {
  const [category, setCategory] = useState("all");

  return (
    <section className={`py-16 bg-muted/50 ${lang === "ar" ? "rtl" : "ltr"}`}>
      <div className="container px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              {dictionary.search.title}
            </h2>
            <p className="text-muted-foreground">
              {dictionary.search.description}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={dictionary.search.placeholder}
                className="w-full"
              />
            </div>
            <Select defaultValue="all" onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue
                  placeholder={dictionary.search.categoryPlaceholder}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {dictionary.search.categories.all}
                </SelectItem>
                <SelectItem value="books">
                  {dictionary.search.categories.books}
                </SelectItem>
                <SelectItem value="articles">
                  {dictionary.search.categories.articles}
                </SelectItem>
                <SelectItem value="journals">
                  {dictionary.search.categories.journals}
                </SelectItem>
              </SelectContent>
            </Select>
            <Link href={`${lang}/resources`}>
              <Button className="md:w-[120px]">
                <Search className="w-4 h-4 mr-2" />
                {dictionary.search.button}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
