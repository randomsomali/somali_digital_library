import { AppDictionary } from "@/types/dictionary";
import { Button } from "@/components/ui/button";
import { BookOpen, Search } from "lucide-react";
import Link from "next/link";

interface ResourceNotFoundProps {
  dictionary: AppDictionary;
  lang: string;
}

export function ResourceNotFound({ dictionary, lang }: ResourceNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center">
      <div className="space-y-4">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gradient">
          {dictionary.resources.notFound.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          {dictionary.resources.notFound.description}
        </p>
      </div>
      <Link href={`/${lang}/resources`}>
        <Button
          variant="default"
          size="lg"
          className="bg-gradient-primary hover:bg-gradient-primary-hover shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3"
        >
          <BookOpen className="h-5 w-5 mr-2" />
          {dictionary.resources.backToList}
        </Button>
      </Link>
    </div>
  );
}
