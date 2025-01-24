// app/[lang] / resources / page.tsx;
import { getResources } from "@/lib/api";
import { getDictionary } from "@/lib/dictionary";
import { ResourceGrid } from "@/components/resources/ResourceGrid";
import { ResourceFilters } from "@/components/resources/ResourceFilters";
import { Suspense } from "react";

export default async function ResourcesPage({
  params,
}: {
  params: { lang: string };
}) {
  const dictionary = await getDictionary(params.lang as "en" | "ar");
  const resources = await getResources();

  // Get unique years from resources
  const years = [...new Set(resources.map((r) => r.year_of_publication))].sort(
    (a, b) => b - a
  );

  // Get unique categories from resources
  const categories = [
    ...new Set(
      resources.map((r) => ({
        category_id: r.category_id,
        category_name: r.category_name,
      }))
    ),
  ];

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-4xl font-bold">{dictionary.resources.title}</h1>

      <Suspense fallback={<div>{dictionary.resources.loading}</div>}>
        <ResourceFilters
          dictionary={dictionary}
          onFilterChange={async (filters) => {
            "use server";
            return await getResources(filters);
          }}
          categories={categories}
          years={years}
        />

        <ResourceGrid
          resources={resources}
          dictionary={dictionary}
          lang={params.lang}
        />
      </Suspense>
    </div>
  );
}
