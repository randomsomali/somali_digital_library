// components/resources/resource-detail.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Download, Share2, Quote } from "lucide-react";
import { AppDictionary, ResourceType } from "@/types/dictionary";

interface ResourceDetailProps {
  resource: ResourceType;
  dictionary: AppDictionary;
  lang: string;
}

export default function ResourceDetail({
  resource,
  dictionary,
  lang,
}: ResourceDetailProps) {
  const handleDownload = (fileUrl: string) => {
    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = fileUrl;
    // Set the download attribute with the filename
    link.setAttribute("download", ""); // The browser will use the original filename
    // Hide the anchor
    link.style.display = "none";
    // Add to document
    document.body.appendChild(link);
    // Trigger click
    link.click();
    // Cleanup
    document.body.removeChild(link);
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-bold mb-4">{resource.title}</h1>
          <p className="text-xl text-muted-foreground">{resource.authors}</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => handleDownload(resource.file_url)}>
            <Download className="h-4 w-4 mr-2" />
            {dictionary.resources.details.download}
          </Button>
          <Button variant="outline">
            <Quote className="h-4 w-4 mr-2" />
            {dictionary.resources.details.cite}
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            {dictionary.resources.details.share}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {dictionary.resources.details.abstract}
            </h2>
            <p className="text-muted-foreground">{resource.abstract}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 bg-card rounded-lg border">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-muted-foreground">
                  {dictionary.resources.details.published}
                </dt>
                <dd className="text-sm font-medium">
                  {resource.year_of_publication}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  {dictionary.resources.details.publisher}
                </dt>
                <dd className="text-sm font-medium">{resource.publisher}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  {dictionary.resources.details.type}
                </dt>
                <dd className="text-sm font-medium">
                  {
                    dictionary.resources.types[
                      resource.type as keyof typeof dictionary.resources.types
                    ]
                  }
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  {dictionary.resources.details.category}
                </dt>
                <dd className="text-sm font-medium">
                  {resource.category_name}
                </dd>
              </div>
              {resource.doi && (
                <div>
                  <dt className="text-sm text-muted-foreground">
                    {dictionary.resources.details.doi}
                  </dt>
                  <dd className="text-sm font-medium">{resource.doi}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-muted-foreground">
                  {dictionary.resources.details.downloads}
                </dt>
                <dd className="text-sm font-medium">{resource.downloads}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  {dictionary.resources.details.citations}
                </dt>
                <dd className="text-sm font-medium">{resource.citations}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
