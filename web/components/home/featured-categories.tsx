// components/home/featured-categories.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { AppDictionary } from "@/types/dictionary"; // Updated import

interface FeaturedCategoriesProps {
  dictionary: AppDictionary;
  lang: string;
}

export function FeaturedCategories({
  dictionary,
  lang,
}: FeaturedCategoriesProps) {
  const categories = [
    {
      title: dictionary.categories.academic.title,
      description: dictionary.categories.academic.description,
      icon: "🎓",
      href: `/${lang}/resources`,
    },
    {
      title: dictionary.categories.research.title,
      description: dictionary.categories.research.description,
      icon: "🔬",
      href: `/${lang}/resources`,
    },
    {
      title: dictionary.categories.literature.title,
      description: dictionary.categories.literature.description,
      icon: "📚",
      href: `/${lang}/resources`,
    },
  ];

  return (
    <section className={`py-16 ${lang === "ar" ? "rtl" : "ltr"}`}>
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {dictionary.home.categories.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {dictionary.home.categories.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={category.href}>
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <CardTitle>{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{category.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
