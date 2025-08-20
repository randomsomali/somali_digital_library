"use client";

import { ResourceList } from "./ResourceList";
import { ResourceFilters } from "./ResourceFilters";
import { Resource, ResourceFilters as Filters } from "@/types/resource";
import { AppDictionary } from "@/types/dictionary";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useResourceFiltering } from "@/hooks/useResourceFiltering";
import { useState } from "react";
import { Filter, X } from "lucide-react";

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
  hasSearchTerm?: boolean;
}

export function ResourcesContent({
  initialResources,
  dictionary,
  lang,
  initialFilters = {},
  hasSearchTerm = false,
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

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gradient">
          {dictionary.resources.title}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {dictionary.resources.description}
        </p>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full gap-2 border-border/50 hover:border-border hover:bg-accent/20"
        >
          <Filter className="h-4 w-4" />
          {dictionary.resources.filters.title}
          {showMobileFilters ? (
            <X className="h-4 w-4 ml-auto" />
          ) : (
            <Filter className="h-4 w-4 ml-auto" />
          )}
        </Button>
      </div>

      {/* Mobile Filters (Collapsible) */}
      {showMobileFilters && (
        <div className="lg:hidden">
          <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
            <ResourceFilters
              dictionary={dictionary}
              onFilter={handleFilter}
              onClear={clearFilters}
              {...filterOptions}
              initialFilters={initialFilters}
            />
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
          <div className="sticky top-36">
            <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
              <ResourceFilters
                dictionary={dictionary}
                onFilter={handleFilter}
                onClear={clearFilters}
                {...filterOptions}
                initialFilters={initialFilters}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {hasSearchTerm 
                    ? dictionary.resources.resultsCount.replace(
                        "{count}",
                        resources.length.toString()
                      )
                    : "Use search to find resources"
                  }
                </span>
              </div>

              {/* Clear Filters Button (Desktop) */}
              {hasSearchTerm && (
                <div className="hidden lg:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-primary hover:bg-accent/50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {dictionary.resources.filters.clear}
                  </Button>
                </div>
              )}
            </div>

            {/* Resources List */}
            <div className="min-h-[400px]">
              {loading ? (
                <ResourceList.Skeleton />
              ) : !hasSearchTerm && resources.length === 0 ? (
                // Show search prompt when no filters are active
                <div className="text-center py-16 bg-gradient-to-br from-muted/20 via-muted/10 to-background rounded-2xl border border-border/50">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <div className="text-xl text-muted-foreground mb-2">
                      Start Your Search
                    </div>
                    <div className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                      Use the search bar or filters above to discover resources in our digital library
                    </div>
                  </div>
                </div>
              ) : resources.length > 0 ? (
                <>
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
        </div>
      </div>
    </div>
  );
}
