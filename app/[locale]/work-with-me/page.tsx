import WorkWithMeClient from "@/components/WorkWithMeClient";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "sv") {
    return {
      title: "Jobba med mig",
      description:
        "Samarbeta med Sofie Gullström – UGC-skapare, fotograf och videoproducent för sociala medier. Kontakta mig för influencer-samarbeten, produktfoto och digitala kampanjer.",
      openGraph: {
        title: "Jobba med mig | Sofie Gullström",
        description:
          "UGC-skapare och digital konsult. Ta kontakt för influencer-samarbeten och kampanjer.",
        url: "https://sofiegullstrom.com/sv/work-with-me",
        images: [{ url: "/images/hero.jpg", width: 1200, height: 630, alt: "Sofie Gullström – Jobba med mig" }],
      },
      alternates: { canonical: "https://sofiegullstrom.com/sv/work-with-me" },
    };
  }
  return {
    title: "Work With Me",
    description:
      "Collaborate with Sofie Gullström – UGC creator, photographer and video producer for social media. Get in touch for influencer partnerships, product photography and digital campaigns.",
    openGraph: {
      title: "Work With Me | Sofie Gullström",
      description:
        "UGC creator and digital consultant. Get in touch for influencer collaborations and campaigns.",
      url: "https://sofiegullstrom.com/en/work-with-me",
      images: [{ url: "/images/hero.jpg", width: 1200, height: 630, alt: "Sofie Gullström – Work With Me" }],
    },
    alternates: { canonical: "https://sofiegullstrom.com/en/work-with-me" },
  };
}

export default async function WorkWithMePage({ params }: PageProps) {
  const { locale } = await params;
  return <WorkWithMeClient locale={locale} />;
}
