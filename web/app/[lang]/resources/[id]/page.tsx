import { getDictionary } from "@/lib/dictionary";
import { getResourceById } from "@/lib/api";
import { ResourceDetails } from "@/components/resources/ResourceDetails";
import { ResourceNotFound } from "@/components/resources/ResourceNotFound";

interface ResourcePageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  // Await params to resolve before using its properties
  const { lang, id } = await params;

  const dictionary = await getDictionary(lang as "en" | "ar");

  try {
    const resource = await getResourceById(id);
    return (
      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <ResourceDetails
              resource={resource}
              dictionary={dictionary}
              lang={lang}
            />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    //use a more specific error type if available
    console.error("Failed to fetch resource:", error);
    // If the resource is not found, render the ResourceNotFound component
    return (
      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <ResourceNotFound dictionary={dictionary} lang={lang} />
          </div>
        </div>
      </main>
    );
  }
}
