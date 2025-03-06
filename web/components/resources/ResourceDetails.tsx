import { Resource } from "@/types/resource";
import { AppDictionary } from "@/types/dictionary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Users,
  FileText,
  Download,
  Quote,
  Share2,
  BookOpen,
  Tag,
  Building,
  Hash,
  Book,
} from "lucide-react";
import Link from "next/link";

interface ResourceDetailsProps {
  resource: Resource;
  dictionary: AppDictionary;
  lang: string;
}

export function ResourceDetails({
  resource,
  dictionary,
  lang,
}: ResourceDetailsProps) {
  return (
    <article className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-gradient">{resource.title}</h1>
          <Badge
            variant={resource.paid === "premium" ? "default" : "secondary"}
            className="uppercase text-sm tracking-wider"
          >
            {resource.paid === "premium"
              ? dictionary.resources.premium
              : dictionary.resources.free}
          </Badge>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          {resource.authors.length > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{resource.authors.join(", ")}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(resource.publication_date).toLocaleDateString(
                lang === "ar" ? "ar-EG" : "en-US"
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>{resource.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <span>{resource.language}</span>
          </div>
          {resource.category_name && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>{resource.category_name}</span>
            </div>
          )}
          {resource.doi && (
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <span>{resource.doi}</span>
            </div>
          )}
          {resource.downloads && (
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>{resource.downloads}</span>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        {resource.file_url && (
          <Button className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-2" />
            {dictionary.resources.details.download}
          </Button>
        )}

        <Button variant="outline" className="flex-1 sm:flex-none">
          <Share2 className="h-4 w-4 mr-2" />
          {dictionary.resources.details.share}
        </Button>
      </div>

      {/* Abstract Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {dictionary.resources.details.abstract}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {resource.abstract}
        </p>
      </div>

      {/* Back Button */}
      <div className="pt-4">
        <Link href={`/${lang}/resources`}>
          <Button variant="ghost">
            <BookOpen className="h-4 w-4 mr-2" />
            {dictionary.resources.backToList}
          </Button>
        </Link>
      </div>
    </article>
  );
}
