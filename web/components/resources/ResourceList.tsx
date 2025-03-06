"use client";

import { Resource } from "@/types/resource";
import { AppDictionary } from "@/types/dictionary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, FileText, BookOpen, Download } from "lucide-react";
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
    <div className="space-y-6">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="group bg-card hover:bg-accent/50 border rounded-xl p-6 transition-all duration-200 hover:shadow-md"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1 space-y-4">
              {/* Title and Badge */}
              <div className="flex items-start justify-between gap-4">
                <Link
                  href={`/${lang}/resources/${resource.id}`}
                  className="text-xl font-semibold hover:text-primary transition-colors"
                >
                  {resource.title}
                </Link>
                <Badge
                  variant={
                    resource.paid === "premium" ? "default" : "secondary"
                  }
                  className="uppercase text-xs tracking-wider"
                >
                  {resource.paid === "premium"
                    ? dictionary.resources.premium
                    : dictionary.resources.free}
                </Badge>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {resource.authors.length > 0 && (
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {resource.authors.join(", ")}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(resource.publication_date).toLocaleDateString(
                    lang === "ar" ? "ar-EG" : "en-US"
                  )}
                </span>
              </div>

              {/* Abstract */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {resource.abstract}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap pt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {resource.type}
                </Badge>
                <Badge variant="outline">{resource.language}</Badge>
                <Badge variant="outline">{resource.category_name}</Badge>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-start">
              <Link href={`/${lang}/resources/${resource.id}`}>
                <Button variant="default" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {dictionary.resources.details.view}
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
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card border rounded-lg p-4 animate-pulse">
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-3/4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
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
