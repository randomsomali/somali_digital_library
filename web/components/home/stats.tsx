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
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-500/10 to-blue-600/10",
    },
    {
      icon: GraduationCap,
      value: "1200+",
      label: dictionary.home.stats.journals,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-500/10 to-green-600/10",
    },
    {
      icon: Files,
      value: "25000+",
      label: dictionary.home.stats.articles,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-500/10 to-purple-600/10",
    },
    {
      icon: Users,
      value: "5000+",
      label: dictionary.home.stats.users,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-500/10 to-orange-600/10",
    },
  ];

  return (
    <section
      id="stat"
      className={`py-12 md:py-16 bg-gradient-to-br from-muted/40 via-muted/20 to-background ${
        lang === "ar" ? "rtl" : "ltr"
      }`}
    >
      <div className="container px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gradient">
            {dictionary.home.stats.title}
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            {dictionary.home.stats.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              className="group relative"
            >
              <div className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-4 hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-1">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative text-center">
                  <div
                    className={`inline-flex p-2 mb-3 rounded-md bg-gradient-to-br ${stat.color} shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-110`}
                  >
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-1 text-foreground group-hover:text-primary transition-colors duration-300">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
