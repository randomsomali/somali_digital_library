// components/home/stats.tsx
"use client";

import { useInView } from "react-intersection-observer";
import { Book, GraduationCap, Files, Users } from "lucide-react";
import { motion } from "framer-motion";
import { AppDictionary } from "@/types/dictionary";

interface StatsProps {
  dictionary: AppDictionary;
  lang: string;
}

export function Stats({ dictionary, lang }: StatsProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const stats = [
    {
      icon: Book,
      value: "7000+",
      label: dictionary.home.stats.books,
    },
    {
      icon: GraduationCap,
      value: "1200+",
      label: dictionary.home.stats.journals,
    },
    {
      icon: Files,
      value: "25000+",
      label: dictionary.home.stats.articles,
    },
    {
      icon: Users,
      value: "50000+",
      label: dictionary.home.stats.users,
    },
  ];

  return (
    <section
      id="stat"
      className={`py-16 bg-muted/50 ${lang === "ar" ? "rtl" : "ltr"}`}
    >
      <div className="container px-4" ref={ref}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex p-4 mb-4 rounded-full bg-primary/10">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
