import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ClientLogos from "@/components/ClientLogos";
import AchievementsSection from "@/components/AchievementsSection";
import PortfolioSection from "@/components/PortfolioSection";
import AboutSection from "@/components/AboutSection";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <Navigation locale={locale} />
      <main>
        {/* 1. Hero – full screen video + collage */}
        <Hero locale={locale} />

        {/* 2. Client logos – scrolling marquee */}
        <ClientLogos locale={locale} />

        {/* 3. About – intro text above portfolio */}
        <AboutSection locale={locale} />

        {/* 5. Portfolio – categorized filter + masonry grid */}
        <PortfolioSection locale={locale} />

        {/* 7. Achievements – notable work highlights */}
        <AchievementsSection locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
