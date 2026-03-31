import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ClientLogos from "@/components/ClientLogos";
import PortfolioSection from "@/components/PortfolioSection";
import AboutSection from "@/components/AboutSection";
import type { Metadata } from "next";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "sv") {
    return {
      title: "Sofie Gullström – UGC Creator & Digital Konsult",
      description: "Sofie Gullström är en UGC-skapare och digital konsult med 10+ års erfarenhet. Foto, video, influencer-samarbeten och marknadsstrategi för svenska och internationella varumärken.",
      alternates: { canonical: "https://sofiegullstrom.com/sv" },
    };
  }
  return {
    title: "Sofie Gullström – UGC Creator & Digital Consultant",
    description: "Sofie Gullström is a UGC creator and digital consultant with 10+ years of experience. Photography, video, influencer collaborations and marketing strategy for Swedish and international brands.",
    alternates: { canonical: "https://sofiegullstrom.com/en" },
  };
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

        {/* 3. About – intro text + device mockups */}
        <AboutSection locale={locale} />

        {/* 4. Portfolio – categorized grid */}
        <PortfolioSection locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
