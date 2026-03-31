import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CategoryPageClient from "@/components/CategoryPageClient";

interface CategoryPageProps {
  params: Promise<{ locale: string; category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = await params;

  return (
    <>
      <Navigation locale={locale} />
      <main>
        <CategoryPageClient locale={locale} category={category} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
