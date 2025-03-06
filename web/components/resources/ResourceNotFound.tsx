import { AppDictionary } from "@/types/dictionary";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";

interface ResourceNotFoundProps {
  dictionary: AppDictionary;
  lang: string;
}

export function ResourceNotFound({ dictionary, lang }: ResourceNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          {dictionary.resources.notFound.title}
        </h1>
        <p className="text-muted-foreground">
          {dictionary.resources.notFound.description}
        </p>
      </div>
      <Link href={`/${lang}/resources`}>
        <Button variant="default">
          <BookOpen className="h-4 w-4 mr-2" />
          {dictionary.resources.backToList}
        </Button>
      </Link>
    </div>
  );
}
