// components/resources/ResourceGrid.tsx
"use client";

import React from "react";
import { ResourceCard } from "./ResourceCard";
import { AppDictionary, ResourceType } from "@/types/dictionary";

interface ResourceGridProps {
  resources: ResourceType[];
  dictionary: AppDictionary;
  lang: string;
}

export function ResourceGrid({
  resources,
  dictionary,
  lang,
}: ResourceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          dictionary={dictionary}
          lang={lang}
        />
      ))}
    </div>
  );
}
