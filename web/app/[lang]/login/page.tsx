import Login from "@/components/Auth/Login";
import { getDictionary } from "@/lib/dictionary";

export default async function LoginPage({
  params,
}: {
  params: { lang: string };
}) {
  const dictionary = await getDictionary(params.lang as "en" | "ar");

  return (
    <div>
      <Login dictionary={dictionary} />
    </div>
  );
}
