// components/resources/ResourceCard.tsx
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import Link from "next/link";
// import { ResourceType } from "@lib/dictionary";
import { AppDictionary, ResourceType } from "@/types/dictionary";
import api from "@/lib/api";

interface ResourceCardProps {
  resource: ResourceType;
  dictionary: AppDictionary;
  lang: string;
}

export function ResourceCard({
  resource,
  dictionary,
  lang,
}: ResourceCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US");
  };

  const handleDownload = async () => {
    try {
      // Register download
      // Direct download from Cloudinary
      window.open(resource.file_url, "_blank");
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <Link
            href={`/${lang}/resources/${resource.id}`}
            className="text-lg font-semibold hover:text-primary transition-colors"
          >
            {resource.title}
          </Link>
          <span className="text-sm text-muted-foreground">
            {resource.year_of_publication}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{resource.authors}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm line-clamp-3">{resource.abstract}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
            {
              dictionary.resources.types[
                resource.type as keyof typeof dictionary.resources.types
              ]
            }
          </span>
          <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
            {resource.category_name}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>
            {resource.downloads} {dictionary.resources.details.downloads}
          </span>
          <span>
            {resource.citations} {dictionary.resources.details.citations}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
