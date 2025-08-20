"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import { ResourceFilters as Filters } from "@/types/resource";
import { AppDictionary } from "@/types/dictionary";
import { Category } from "@/types/resource";

interface ResourceFiltersProps {
  dictionary: AppDictionary;
  onFilter: (filters: Filters) => void;
  onClear: () => void;
  types: string[];
  years: number[];
  languages: string[];
  categories: Category[];
  initialFilters?: Filters;
}

export function ResourceFilters({
  dictionary,
  onFilter,
  onClear,
  types,
  years,
  languages,
  categories,
  initialFilters = {},
}: ResourceFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    search: initialFilters.search || "",
    type: initialFilters.type || "all",
    year: initialFilters.year || "all",
    language: initialFilters.language || "all",
    category_id: initialFilters.category_id || "all",
  });

  const handleChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    // Only send non-"all" values to the API
    const apiFilters = Object.fromEntries(
      Object.entries(newFilters).filter(
        ([, value]) => value !== "all" && value !== ""
      )
    );
    onFilter(apiFilters);
  };

  const handleClear = () => {
    setFilters({
      search: "",
      type: "all",
      year: "all",
      language: "all",
      category_id: "all",
    });
    onClear();
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "all" && value !== ""
  );

  return (
    <div className="space-y-6">
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
            <Filter className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {dictionary.resources.filters.title}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {dictionary.resources.filters.subtitle}
            </p>
          </div>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-muted-foreground hover:text-primary hover:bg-accent/50 transition-all duration-300 h-8 px-2"
          >
            <X className="h-3 w-3 mr-1" />
            {dictionary.resources.filters.clear}
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={dictionary.resources.filters.searchPlaceholder}
          className="pl-10 h-10 text-sm bg-background/50 border-border/50 focus:border-primary transition-colors duration-200 rounded-lg"
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
        />
      </div>

      {/* Filter Options - Vertical Layout */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {dictionary.resources.filters.type}
          </label>
          <Select
            value={filters.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary transition-colors duration-200 h-10 rounded-lg text-sm">
              <SelectValue placeholder={dictionary.resources.filters.type} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {dictionary.resources.filters.allTypes}
              </SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {dictionary.resources.filters.category}
          </label>
          <Select
            value={filters.category_id}
            onValueChange={(value) => handleChange("category_id", value)}
          >
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary transition-colors duration-200 h-10 rounded-lg text-sm">
              <SelectValue
                placeholder={dictionary.resources.filters.category}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {dictionary.resources.filters.allCategories}
              </SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {dictionary.resources.filters.language}
          </label>
          <Select
            value={filters.language}
            onValueChange={(value) => handleChange("language", value)}
          >
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary transition-colors duration-200 h-10 rounded-lg text-sm">
              <SelectValue
                placeholder={dictionary.resources.filters.language}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {dictionary.resources.filters.allLanguages}
              </SelectItem>
              {languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {dictionary.resources.filters.year}
          </label>
          <Select
            value={filters.year}
            onValueChange={(value) => handleChange("year", value)}
          >
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary transition-colors duration-200 h-10 rounded-lg text-sm">
              <SelectValue placeholder={dictionary.resources.filters.year} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {dictionary.resources.filters.allYears}
              </SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-border/50">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Active Filters:
            </p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(filters).map(([key, value]) => {
                if (value && value !== "all") {
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-md"
                    >
                      {key}: {value}
                    </span>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
