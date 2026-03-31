import SeeAllClient from "@/components/SeeAllClient";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function SeeAllPage({ params }: PageProps) {
  const { locale } = await params;
  return <SeeAllClient locale={locale} />;
}
