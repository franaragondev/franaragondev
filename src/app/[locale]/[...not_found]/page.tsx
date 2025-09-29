import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <main className="flex flex-col items-center justify-center min-h-[98vh] text-center -mt-14">
      <h1 className="text-6xl font-bold text-[#eac582] mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2 text-[#bb9b63]">
        {t("title")}
      </h2>
      <p className="mb-6 text-[#bb9b63]">{t("subtitle")}</p>
      <Link href="/" className="text-[#cdcdcd] hover:underline">
        {t("goHome")}
      </Link>
    </main>
  );
}
