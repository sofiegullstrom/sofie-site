"use client";

interface AchievementsSectionProps {
  locale: string;
}

export default function AchievementsSection({ locale }: AchievementsSectionProps) {
  const sv = locale === "sv";

  const highlights = sv
    ? [
        {
          tag: "TV-reklamfilm",
          title: "myFUJIFILM",
          desc: "Skapade och spelade in en reklamfilm som sändes i Sverige och Frankrike. Mina bilder åt varumärket visades även på deras officiella webbplats.",
          detail: "Sverige & Frankrike",
        },
        {
          tag: "Nordisk ambassadör · 1 år",
          title: "Epson",
          desc: "Utsedd till nordisk varumärkesambassadör för Epsons Instagram-kanaler i hela ett år. Skapade och levererade konsekvent innehåll anpassat för nordisk publik.",
          detail: "Sverige · Danmark · Norge · Finland",
        },
        {
          tag: "Ansikte utåt · 6 månader",
          title: "HelloFresh",
          desc: "Valdes ut som ansiktet för HelloFresh i Sverige under en sexmånaderskampanj. Kampanjbilder och videos spreds i stor skala på deras sociala kanaler.",
          detail: "Kampanjer & sociala medier",
        },
        {
          tag: "Influencer Award",
          title: "Prisbelönt kreatör",
          desc: "Vinnare av Influencer Award – ett erkännande för kreativitet och genomslag i branschen.",
          detail: "Influencer Award Sverige",
        },
        {
          tag: "TV-framträdanden",
          title: "Unga Föräldrar & Malou efter 10",
          desc: "Medverkat i TV-programmen Unga Föräldrar och Malou efter 10 i TV4.",
          detail: "SVT & TV4",
        },
      ]
    : [
        {
          tag: "TV commercial",
          title: "myFUJIFILM",
          desc: "Created and starred in a commercial aired on TV in both Sweden and France. Photos I shot for the brand were also featured on their official website.",
          detail: "Sweden & France",
        },
        {
          tag: "Nordic ambassador · 1 year",
          title: "Epson",
          desc: "Appointed as brand ambassador for Epson's Instagram channels across all Nordic countries for a full year. Delivered consistent, on-brand content for a Nordic audience.",
          detail: "Sweden · Denmark · Norway · Finland",
        },
        {
          tag: "Brand face · 6 months",
          title: "HelloFresh",
          desc: "Selected as the face of HelloFresh in Sweden for a six-month campaign. Campaign photos and videos were distributed across their social media channels at scale.",
          detail: "Campaigns & social media",
        },
        {
          tag: "Influencer Award",
          title: "Award-winning creator",
          desc: "Winner of the Influencer Award – a recognition for creativity and industry impact.",
          detail: "Influencer Award Sweden",
        },
        {
          tag: "TV appearances",
          title: "Unga Föräldrar & Malou efter 10",
          desc: "Featured on TV programmes Unga Föräldrar and Malou efter 10 on TV4.",
          detail: "SVT & TV4",
        },
      ];

  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-beige">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <p className="eyebrow mb-4">
            {sv ? "Höjdpunkter" : "Highlights"}
          </p>
          <h2 className="section-heading">
            {sv ? "Utvalda samarbeten." : "Selected work."}
          </h2>
        </div>

        {/* Highlights list */}
        <div className="divide-y divide-sand/30">
          {highlights.map((item, i) => (
            <div
              key={i}
              className="group py-8 md:py-10 grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-4 md:gap-10 items-start transition-all duration-300 hover:bg-sand/10 -mx-6 md:-mx-0 px-6 md:px-0"
            >
              {/* Number + tag */}
              <div className="flex items-start gap-4 md:gap-6">
                <span className="font-serif text-2xl text-sand leading-none mt-0.5 select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <span className="text-xs tracking-ultra-wide uppercase text-merlot font-sans">
                    {item.tag}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-dark mt-1 group-hover:text-espresso transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-mocha text-sm leading-relaxed">
                {item.desc}
              </p>

              {/* Detail */}
              <p className="text-xs tracking-wider uppercase text-mocha/60 font-sans md:text-right">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <a
            href={`/${locale}/work-with-me`}
            className="btn-primary"
          >
            {sv ? "Starta ett samarbete" : "Start a collaboration"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
