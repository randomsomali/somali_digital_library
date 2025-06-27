"use client";

import { Resource } from "@/types/resource";
import { AppDictionary } from "@/types/dictionary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, FileText, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ResourceListProps {
  resources: Resource[];
  dictionary: AppDictionary;
  lang: string;
}

export function ResourceList({
  resources,
  dictionary,
  lang,
}: ResourceListProps) {
  return (
    <div className="grid gap-4">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="group relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-border"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main Content */}
            <div className="flex-1 space-y-3">
              {/* Title and Badge */}
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/${lang}/resources/${resource.id}`}
                  className="text-lg md:text-xl font-semibold hover:text-primary transition-colors duration-300 leading-tight line-clamp-2"
                >
                  {resource.title}
                </Link>
                <Badge
                  variant={
                    resource.paid === "premium" ? "default" : "secondary"
                  }
                  className="uppercase text-xs tracking-wider px-2 py-1 flex-shrink-0"
                >
                  {resource.paid === "premium"
                    ? dictionary.resources.premium
                    : dictionary.resources.free}
                </Badge>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {resource.authors.length > 0 && (
                  <span className="flex items-center gap-1 bg-accent/50 px-2 py-1 rounded-md">
                    <Users className="h-3 w-3 text-primary" />
                    <span className="font-medium">
                      {resource.authors.join(", ")}
                    </span>
                  </span>
                )}
                <span className="flex items-center gap-1 bg-accent/50 px-2 py-1 rounded-md">
                  <Calendar className="h-3 w-3 text-primary" />
                  <span className="font-medium">
                    {new Date(resource.publication_date).toLocaleDateString(
                      lang === "ar" ? "ar-EG" : "en-US"
                    )}
                  </span>
                </span>
              </div>

              {/* Abstract */}
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {resource.abstract}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 border-border/50 text-xs"
                >
                  <FileText className="h-3 w-3" />
                  {resource.type}
                </Badge>
                <Badge variant="outline" className="border-border/50 text-xs">
                  {resource.language}
                </Badge>
                {resource.category_name && (
                  <Badge variant="outline" className="border-border/50 text-xs">
                    {resource.category_name}
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-start lg:items-center">
              <Link href={`/${lang}/resources/${resource.id}`}>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-gradient-primary hover:bg-gradient-primary-hover shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {dictionary.resources.details.view}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton loader for the list
ResourceList.Skeleton = function ResourceListSkeleton() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-5 animate-pulse"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-5 bg-muted rounded w-16" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 bg-muted rounded w-32" />
              <div className="h-6 bg-muted rounded w-24" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 bg-muted rounded w-20" />
              <div className="h-6 bg-muted rounded w-20" />
              <div className="h-6 bg-muted rounded w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
