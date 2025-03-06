import { getDictionary } from "@/lib/dictionary";
import { getResourceById } from "@/lib/api";
import { ResourceDetails } from "@/components/resources/ResourceDetails";
import { ResourceNotFound } from "@/components/resources/ResourceNotFound";

interface ResourcePageProps {
  params: {
    lang: string;
    id: string;
  };
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  // Await params to resolve before using its properties
  const { lang, id } = await params;

  const dictionary = await getDictionary(lang as "en" | "ar");

  try {
    const resource = await getResourceById(id);
    return (
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-4xl mx-auto">
          <ResourceDetails
            resource={resource}
            dictionary={dictionary}
            lang={lang}
          />
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ResourceNotFound dictionary={dictionary} lang={lang} />
        </div>
      </main>
    );
  }
}
