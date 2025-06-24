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
import { AppDictionary } from "@/types/dictionary";

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
      href: `/${lang}/resources?type=Article`,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/10",
    },
    {
      title: dictionary.categories.research.title,
      description: dictionary.categories.research.description,
      icon: "🔬",
      href: `/${lang}/resources?type=Article`,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-500/10 to-green-600/10",
    },
    {
      title: dictionary.categories.literature.title,
      description: dictionary.categories.literature.description,
      icon: "📚",
      href: `/${lang}/resources?type=Article`,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-500/10 to-purple-600/10",
    },
  ];

  return (
    <section
      className={`py-20 md:py-32 bg-background ${
        lang === "ar" ? "rtl" : "ltr"
      }`}
    >
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            {dictionary.home.categories.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {dictionary.home.categories.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Link href={category.href}>
                <Card className="group h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                  <CardHeader className="relative">
                    <div
                      className={`text-6xl mb-6 bg-gradient-to-br ${category.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
                    >
                      {category.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="text-base leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                      {category.description}
                    </CardDescription>
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
