// components/knowledge-sources/arabic-sources-content.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { AppDictionary } from "@/types/dictionary";
import { getActivePartners } from "@/lib/partnerInstitutions";
import { BookOpen, Globe, ArrowLeft, ExternalLink } from "lucide-react";

interface ArabicSourcesContentProps {
  dictionary: AppDictionary;
  lang: string;
}

export function ArabicSourcesContent({ dictionary, lang }: ArabicSourcesContentProps) {
  const partners = getActivePartners('arabic');

  return (
    <div className={`min-h-screen bg-background ${lang === "ar" ? "rtl" : "ltr"}`}>
      {/* Header */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              {dictionary.knowledgeSources.arabicSources.title}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
              {dictionary.knowledgeSources.arabicSources.title}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {dictionary.knowledgeSources.arabicSources.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container px-4">
          {partners.length === 0 ? (
            // Coming Soon Section
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="mb-8">
                <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {dictionary.knowledgeSources.arabicSources.comingSoon}
                </h2>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {dictionary.knowledgeSources.arabicSources.comingSoonDescription}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/${lang}`}>
                  <Button variant="outline" size="lg" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    {dictionary.knowledgeSources.backToHome}
                  </Button>
                </Link>
                
                <Link href={`/${lang}/resources`}>
                  <Button size="lg" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    {dictionary.knowledgeSources.exploreResources}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            // Partners Section
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {dictionary.knowledgeSources.arabicSources.partners}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Access knowledge resources from our partner institutions
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {partners.map((partner, index) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="group h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-4">
                          {partner.logo && (
                            <img 
                              src={partner.logo} 
                              alt={lang === "ar" ? partner.nameAr : partner.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <CardTitle className="text-xl">
                              {lang === "ar" ? partner.nameAr : partner.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {partner.category}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          {lang === "ar" ? partner.descriptionAr : partner.description}
                        </p>
                        
                        <Button asChild className="w-full gap-2">
                          <a href={partner.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                            Visit
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
