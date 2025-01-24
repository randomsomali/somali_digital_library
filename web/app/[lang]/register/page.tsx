import Register from "@/components/Auth/Register";
import { getDictionary } from "@/lib/dictionary";

export default async function RegisterPage({
  params,
}: {
  params: { lang: string };
}) {
  const dictionary = await getDictionary(params.lang as "en" | "ar");

  return (
    <div>
      <Register dictionary={dictionary} />
    </div>
  );
}
