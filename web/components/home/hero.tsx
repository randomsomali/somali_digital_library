"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Users, ArrowRight } from "lucide-react";
import { AppDictionary } from "@/types/dictionary";
import Link from "next/link";
import { useState } from "react";

interface HeroProps {
  dictionary: AppDictionary;
  lang: string;
}

export function Hero({ dictionary, lang }: HeroProps) {
  const [search, setSearch] = useState("");

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32 bg-background">
      <div className="container">
        {/* Announcement Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <Badge
            variant="secondary"
            className="gap-2 px-4 py-2 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-violet-700 dark:text-violet-300 hover:from-violet-500/20 hover:to-purple-500/20 transition-all duration-300"
          >
            {/* <Sparkles className="w-4 h-4" /> */}
            <span className="text-sm font-medium">
              {dictionary.home.hero.announcement}
            </span>
            <div className="flex -space-x-1 ml-1">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border border-background flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-green-600 border border-background flex items-center justify-center">
                <span className="text-white text-xs font-bold">B</span>
              </div>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border border-background flex items-center justify-center">
                <span className="text-white text-xs font-bold">C</span>
              </div>
            </div>
          </Badge>
        </motion.div>

        {/* Main Content */}
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-foreground">
              {dictionary.home.hero.title}
            </span>
            <br />
            <span className="text-gradient">
              {dictionary.home.hero.subtitle}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            {dictionary.home.hero.description}
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl blur-xl" />
              <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={dictionary.home.hero.searchPlaceholder}
                      className="w-full h-14 pl-12 pr-4 text-base border-border/50 focus:border-primary transition-colors duration-200 rounded-xl bg-background/50"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Link href={`/${lang}/resources?search=${search}`}>
                    <Button
                      size="lg"
                      className="h-14 px-8 bg-gradient-primary hover:bg-gradient-primary-hover shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-xl"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      {dictionary.common.search}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid md:grid-cols-3 gap-6 w-full mb-12"
          >
            {/* Academic Category */}
            <div className="relative group h-64 w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-6 hover:border-blue-500/40 transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl mb-4 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">🎓</span>
                </div>
                <h3 className="font-semibold text-2xl mb-3 text-foreground">
                  {dictionary.categories.academic.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 flex-grow leading-relaxed">
                  {dictionary.categories.academic.description}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 p-0 h-auto hover:bg-transparent hover:text-blue-500 self-start group-hover:translate-x-1 transition-all duration-300"
                  asChild
                >
                  <Link href={`/${lang}/resources?type=Article`}>
                    <span className="text-xs font-medium">
                      {dictionary.home.hero.explore}
                    </span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Research Category */}
            <div className="relative group h-64 w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl mb-4 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">🔬</span>
                </div>
                <h3 className="font-semibold text-2xl mb-3 text-foreground">
                  {dictionary.categories.research.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 flex-grow leading-relaxed">
                  {dictionary.categories.research.description}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 p-0 h-auto hover:bg-transparent hover:text-green-500 self-start group-hover:translate-x-1 transition-all duration-300"
                  asChild
                >
                  <Link href={`/${lang}/resources?type=Article`}>
                    <span className="text-xs font-medium">
                      {dictionary.home.hero.explore}
                    </span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Literature Category */}
            <div className="relative group h-64 w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl mb-4 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">📚</span>
                </div>
                <h3 className="font-semibold text-2xl mb-3 text-foreground">
                  {dictionary.categories.literature.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 flex-grow leading-relaxed">
                  {dictionary.categories.literature.description}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 p-0 h-auto hover:bg-transparent hover:text-purple-500 self-start group-hover:translate-x-1 transition-all duration-300"
                  asChild
                >
                  <Link href={`/${lang}/resources?type=Article`}>
                    <span className="text-xs font-medium">
                      {dictionary.home.hero.explore}
                    </span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg hover:shadow-violet-500/25 transition-all duration-300 px-8 py-3"
              asChild
            >
              <Link href={`/${lang}/resources`}>
                <span className="font-medium">
                  {dictionary.home.hero.explore}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-border/40 hover:border-border hover:bg-accent/20 transition-all duration-300 px-8 py-3"
              asChild
            >
              <Link href={`/${lang}/register`}>
                <Users className="w-4 h-4" />
                <span className="font-medium">
                  {dictionary.home.hero.joinCommunity}
                </span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-violet-500/3 to-purple-500/3 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>
    </section>
  );
}
