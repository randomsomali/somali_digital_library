// components/resources/ResourceFilters.tsx
"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { AppDictionary } from "@/types/dictionary";

interface ResourceFiltersProps {
  dictionary: AppDictionary;
  onFilterChange: (filters: any) => void;
  categories: { category_id: number; category_name: string }[];
  years: number[];
}

export function ResourceFilters({
  dictionary,
  onFilterChange,
  categories,
  years,
}: ResourceFiltersProps) {
  const [filters, setFilters] = React.useState({
    category_id: "",
    type: "",
    year_of_publication: "",
    search: "",
  });

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category_id: "",
      type: "",
      year_of_publication: "",
      search: "",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Filter className="h-4 w-4" />
          {dictionary.resources.filters.title}
        </h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          {dictionary.resources.filters.clear}
        </Button>
      </div>

      <Input
        placeholder={dictionary.resources.filters.searchPlaceholder}
        value={filters.search}
        onChange={(e) => handleChange("search", e.target.value)}
        className="w-full"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          value={filters.category_id}
          onValueChange={(value) => handleChange("category_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={dictionary.resources.filters.category} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem
                key={category.category_id}
                value={category.category_id.toString()}
              >
                {category.category_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.type}
          onValueChange={(value) => handleChange("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={dictionary.resources.filters.type} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(dictionary.resources.types).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.year_of_publication}
          onValueChange={(value) => handleChange("year_of_publication", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={dictionary.resources.filters.year} />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
