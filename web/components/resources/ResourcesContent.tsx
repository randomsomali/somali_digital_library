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
    <div className="space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gradient">
          {dictionary.resources.title}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {dictionary.resources.description}
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-gradient-to-br from-card/60 via-card/40 to-background backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-lg">
        <ResourceFilters
          dictionary={dictionary}
          onFilter={handleFilter}
          onClear={clearFilters}
          {...filterOptions}
          initialFilters={initialFilters}
        />
      </div>

      {/* Content Section */}
      <div className="min-h-[400px] space-y-8">
        {loading ? (
          <ResourceList.Skeleton />
        ) : resources.length > 0 ? (
          <>
            {/* Results Count */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-accent/50 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-muted-foreground">
                  {dictionary.resources.resultsCount.replace(
                    "{count}",
                    resources.length.toString()
                  )}
                </span>
              </div>
            </div>

            <ResourceList
              resources={resources}
              dictionary={dictionary}
              lang={lang}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center pt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-muted/20 via-muted/10 to-background rounded-2xl border border-border/50">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">📚</span>
              </div>
              <div className="text-xl text-muted-foreground mb-6">
                {dictionary.resources.noResults}
              </div>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-border/50 hover:border-border hover:bg-accent/20 transition-all duration-300"
              >
                {dictionary.resources.filters.clear}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
