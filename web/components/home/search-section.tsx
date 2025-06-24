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
import { motion } from "framer-motion";

interface SearchSectionProps {
  dictionary: AppDictionary;
  lang: string;
}

export function SearchSection({ dictionary, lang }: SearchSectionProps) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <section
      className={`py-20 md:py-32 bg-gradient-to-br from-muted/30 via-muted/10 to-background ${
        lang === "ar" ? "rtl" : "ltr"
      }`}
    >
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              {dictionary.search.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {dictionary.search.description}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl blur-xl" />
            <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder={dictionary.search.placeholder}
                    className="w-full h-14 pl-12 pr-4 text-base border-border/50 focus:border-primary transition-colors duration-200 rounded-xl bg-background/50"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select defaultValue="all" onValueChange={setCategory}>
                  <SelectTrigger className="w-full md:w-[200px] h-14 text-base border-border/50 focus:border-primary transition-colors duration-200 rounded-xl bg-background/50">
                    <SelectValue
                      placeholder={dictionary.search.categoryPlaceholder}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {dictionary.search.categories.all}
                    </SelectItem>
                    <SelectItem value="Book">
                      {dictionary.search.categories.books}
                    </SelectItem>
                    <SelectItem value="Article">
                      {dictionary.search.categories.articles}
                    </SelectItem>
                    <SelectItem value="Journal">
                      {dictionary.search.categories.journals}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Link
                  href={`/${lang}/resources?search=${search}&type=${category}`}
                >
                  <Button className="md:w-[140px] h-14 text-base bg-gradient-primary hover:bg-gradient-primary-hover shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-xl">
                    <Search className="w-5 h-5 mr-2" />
                    {dictionary.search.button}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
