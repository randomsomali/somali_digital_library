// app/[lang]/resources/[id]/page.tsx
import { getResourceById } from "@/lib/api";
import { getDictionary } from "@/lib/dictionary";
import ResourceDetail from "@/components/resources/ResourceDetail";

export default async function ResourcePage({
  params,
}: {
  params: { lang: string; id: string };
}) {
  const dictionary = await getDictionary(params.lang as "en" | "ar");
  const resource = await getResourceById(params.id);

  if (!resource) {
    return <div>{dictionary.resources.error}</div>;
  }

  return (
    <ResourceDetail
      resource={resource}
      dictionary={dictionary}
      lang={params.lang}
    />
  );
}
