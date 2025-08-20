import { getDictionary } from "@/lib/dictionary";
import { getResources } from "@/lib/api";
import { ResourcesContent } from "@/components/resources/ResourcesContent";
import { ReadonlyURLSearchParams } from "next/navigation";

// Helper function to safely parse search params
function parseSearchParams(
  searchParams: ReadonlyURLSearchParams | { [key: string]: string | undefined }
) {
  const params: { [key: string]: string } = {};

  if (searchParams instanceof ReadonlyURLSearchParams) {
    // Handle ReadonlyURLSearchParams
    for (const [key, value] of searchParams.entries()) {
      if (value) params[key] = value;
    }
  } else {
    // Handle plain object
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params[key] = value;
    }
  }

  return {
    page: parseInt(params.page || "1"),
    filters: {
      search: params.search,
      type: params.type,
      category_id: params.category_id,
      language: params.language,
      year: params.year,
    },
  };
}

export default async function ResourcesPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as "en" | "ar");

  const awaitedSearchParams = await searchParams;
  const { page, filters } = parseSearchParams(awaitedSearchParams);

  // Check if there's an active search term
  const hasSearchTerm = Boolean(filters.search && filters.search.trim() !== "");

  let initialResources;
  if (hasSearchTerm) {
    // Only fetch resources if there's a search term
    initialResources = await getResources({
      ...filters,
      page,
      limit: 15,
    });
  } else {
    // Return empty results if no search term
    initialResources = {
      success: true,
      data: [],
      total: 0,
      totalPages: 0,
      page: 1,
      limit: 15,
    };
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="container px-4">
        <ResourcesContent
          initialResources={initialResources}
          dictionary={dictionary}
          lang={lang}
          initialFilters={filters}
          hasSearchTerm={hasSearchTerm}
        />
      </div>
    </main>
  );
}
