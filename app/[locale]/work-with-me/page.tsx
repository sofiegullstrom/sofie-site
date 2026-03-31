import WorkWithMeClient from "@/components/WorkWithMeClient";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function WorkWithMePage({ params }: PageProps) {
  const { locale } = await params;
  return <WorkWithMeClient locale={locale} />;
}
