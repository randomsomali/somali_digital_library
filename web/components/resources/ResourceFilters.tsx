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
}: // initialFilters = {}, // removed unused variable warning by keeping as prop but not using it
ResourceFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    type: "all",
    year: "all",
    language: "all",
    category_id: "all",
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
    <div className="space-y-8">
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between pb-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {dictionary.resources.filters.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {dictionary.resources.filters.subtitle}
            </p>
          </div>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-muted-foreground hover:text-primary hover:bg-accent/50 transition-all duration-300"
          >
            <X className="h-4 w-4 mr-2" />
            {dictionary.resources.filters.clear}
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder={dictionary.resources.filters.searchPlaceholder}
          className="pl-12 h-12 text-base bg-background/50 border-border/50 focus:border-primary transition-colors duration-200 rounded-xl"
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
        />
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            {dictionary.resources.filters.type}
          </label>
          <Select
            value={filters.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary transition-colors duration-200 h-12 rounded-xl">
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

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            {dictionary.resources.filters.year}
          </label>
          <Select
            value={filters.year}
            onValueChange={(value) => handleChange("year", value)}
          >
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary transition-colors duration-200 h-12 rounded-xl">
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

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            {dictionary.resources.filters.language}
          </label>
          <Select
            value={filters.language}
            onValueChange={(value) => handleChange("language", value)}
          >
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary transition-colors duration-200 h-12 rounded-xl">
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

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            {dictionary.resources.filters.category}
          </label>
          <Select
            value={filters.category_id}
            onValueChange={(value) => handleChange("category_id", value)}
          >
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary transition-colors duration-200 h-12 rounded-xl">
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
      </div>
    </div>
  );
}
