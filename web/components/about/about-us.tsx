"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { AppDictionary } from "@/types/dictionary";
import {
  BookOpen,
  Users,
  Globe,
  Award,
  Target,
  Heart,
  Lightbulb,
  Shield,
  ArrowRight,
  Sparkles,
  Library,
  GraduationCap,
  Globe2,
  Users2,
} from "lucide-react";
import Link from "next/link";

interface AboutUsProps {
  dictionary: AppDictionary;
  lang: string;
}

export function AboutUs({ dictionary, lang }: AboutUsProps) {
  //   const stats = [
  //     {
  //       icon: BookOpen,
  //       value: "50,000+",
  //       label: dictionary.about.stats.books,
  //       description: dictionary.about.stats.booksDesc,
  //     },
  //     {
  //       icon: Users,
  //       value: "10,000+",
  //       label: dictionary.about.stats.users,
  //       description: dictionary.about.stats.usersDesc,
  //     },
  //     {
  //       icon: Globe,
  //       value: "100+",
  //       label: dictionary.about.stats.institutions,
  //       description: dictionary.about.stats.institutionsDesc,
  //     },
  //     {
  //       icon: Award,
  //       value: "15+",
  //       label: dictionary.about.stats.years,
  //       description: dictionary.about.stats.yearsDesc,
  //     },
  //   ];

  const values = [
    {
      icon: Heart,
      title: dictionary.about.values.preservation.title,
      description: dictionary.about.values.preservation.description,
    },
    {
      icon: Users2,
      title: dictionary.about.values.community.title,
      description: dictionary.about.values.community.description,
    },
    {
      icon: Lightbulb,
      title: dictionary.about.values.innovation.title,
      description: dictionary.about.values.innovation.description,
    },
    {
      icon: Shield,
      title: dictionary.about.values.accessibility.title,
      description: dictionary.about.values.accessibility.description,
    },
  ];

  const features = [
    {
      icon: Library,
      title: dictionary.about.features.digitalLibrary.title,
      description: dictionary.about.features.digitalLibrary.description,
    },
    {
      icon: GraduationCap,
      title: dictionary.about.features.educational.title,
      description: dictionary.about.features.educational.description,
    },
    {
      icon: Globe2,
      title: dictionary.about.features.global.title,
      description: dictionary.about.features.global.description,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {/*
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <Badge
              variant="secondary"
              className="gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                {dictionary.about.hero.badge}
              </span>
            </Badge>
          </motion.div>

          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="text-foreground">
                {dictionary.about.hero.title}
              </span>
              <br />
              <span className="text-gradient">
                {dictionary.about.hero.subtitle}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            >
              {dictionary.about.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 px-8 py-3"
                asChild
              >
                <Link href={`/${lang}/resources`}>
                  <span className="font-medium">
                    {dictionary.about.hero.exploreLibrary}
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
                    {dictionary.about.hero.joinUs}
                  </span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/3 to-cyan-500/3 rounded-full blur-3xl" />
        </div>
      </section>  */}

      {/* Statistics Section */}
      {/*<section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {dictionary.about.stats.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {dictionary.about.stats.description}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-2xl mb-4 mx-auto flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2 text-gradient">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold mb-2">{stat.label}</div>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 text-green-700 dark:text-green-300">
                {dictionary.about.mission.badge}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {dictionary.about.mission.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {dictionary.about.mission.description}
              </p>
              <div className="space-y-4">
                {dictionary.about.mission.goals.map((goal, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">{goal}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl blur-2xl" />
              <Card className="relative bg-card/60 backdrop-blur-sm border border-border/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    {dictionary.about.vision.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    {dictionary.about.vision.description}
                  </p>
                  <div className="space-y-4">
                    {dictionary.about.vision.pillars.map((pillar, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="font-medium">{pillar}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      {/*<section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {dictionary.about.values.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {dictionary.about.values.description}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <Card className="relative bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-6 hover:border-blue-500/40 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl mb-4 flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {dictionary.about.features.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {dictionary.about.features.description}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <Card className="relative bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-8 hover:border-violet-500/40 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-purple-600 rounded-2xl mb-6 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-2xl mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {dictionary.about.cta.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {dictionary.about.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 px-8 py-3"
                asChild
              >
                <Link href={`/${lang}/register`}>
                  <span className="font-medium">
                    {dictionary.about.cta.joinNow}
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
                <Link href={`/${lang}/resources`}>
                  <BookOpen className="w-4 h-4" />
                  <span className="font-medium">
                    {dictionary.about.cta.exploreLibrary}
                  </span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
