import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PortfolioPage({ params }: PageProps) {
  const { locale } = await params;
  // Portfolio section is on the homepage — redirect there
  redirect(`/${locale}`);
}
