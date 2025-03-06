"use client";

import { ResourceList } from "./ResourceList";
import { ResourceFilters } from "./ResourceFilters";
import { Resource, ResourceFilters as Filters } from "@/types/resource";
import { AppDictionary } from "@/types/dictionary";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useResourceFiltering } from "@/hooks/useResourceFiltering";

interface ResourcesContentProps {
  initialResources: {
    data: Resource[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  dictionary: AppDictionary;
  lang: string;
  initialFilters?: Filters;
}

export function ResourcesContent({
  initialResources,
  dictionary,
  lang,
  initialFilters = {},
}: ResourcesContentProps) {
  const {
    resources,
    loading,
    currentPage,
    totalPages,
    filterOptions,
    handleFilter,
    handlePageChange,
    clearFilters,
  } = useResourceFiltering(initialResources, initialFilters);

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8 mt-12">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-gradient">{dictionary.resources.title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {dictionary.resources.description}
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-gradient-to-b from-background to-muted/20 rounded-xl p-6 shadow-sm">
        <ResourceFilters
          dictionary={dictionary}
          onFilter={handleFilter}
          onClear={clearFilters}
          {...filterOptions}
          initialFilters={initialFilters}
        />
      </div>

      {/* Content Section */}
      <div className="min-h-[400px]">
        {loading ? (
          <ResourceList.Skeleton />
        ) : resources.length > 0 ? (
          <>
            {/* Results Count */}
            <div className="mb-6 text-center">
              <p className="text-sm text-muted-foreground">
                {dictionary.resources.resultsCount.replace(
                  "{count}",
                  resources.length.toString()
                )}
              </p>
            </div>

            <ResourceList
              resources={resources}
              dictionary={dictionary}
              lang={lang}
            />

            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-muted/20 rounded-xl">
            <div className="text-xl text-muted-foreground mb-4">
              {dictionary.resources.noResults}
            </div>
            <Button variant="outline" onClick={clearFilters}>
              {dictionary.resources.filters.clear}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
