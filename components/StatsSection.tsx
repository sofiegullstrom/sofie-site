"use client";

import { useEffect, useRef, useState } from "react";

interface StatsSectionProps {
  locale: string;
}

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
}

function StatCard({
  value,
  label,
  sublabel,
  prefix = "",
  suffix = "",
  animate,
}: {
  value: number;
  label: string;
  sublabel?: string;
  prefix?: string;
  suffix?: string;
  animate: boolean;
}) {
  const count = useCountUp(value, 1600, animate);

  return (
    <div className="flex flex-col items-center md:items-start">
      <p className="font-serif text-5xl md:text-6xl lg:text-7xl text-dark leading-none mb-2">
        {prefix}
        {count.toLocaleString("sv-SE")}
        {suffix}
      </p>
      <p className="text-sm tracking-widest uppercase text-mocha font-sans mb-1">{label}</p>
      {sublabel && (
        <p className="text-xs text-mocha/60 font-sans">{sublabel}</p>
      )}
    </div>
  );
}

export default function StatsSection({ locale }: StatsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const sv = locale === "sv";

  return (
    <section ref={sectionRef} className="bg-beige py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <p className="eyebrow mb-4">
            {sv ? "Räckvidd & engagemang" : "Reach & engagement"}
          </p>
          <h2 className="section-heading max-w-lg">
            {sv ? "Siffror som talar." : "Numbers that speak."}
          </h2>
        </div>

        {/* Big stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 mb-20">
          <StatCard
            value={1700000}
            label={sv ? "TikTok-visningar" : "TikTok views"}
            sublabel={sv ? "Senaste månaden" : "Last month"}
            suffix="+"
            animate={animate}
          />
          <StatCard
            value={10200}
            label={sv ? "TikTok-följare" : "TikTok followers"}
            animate={animate}
          />
          <StatCard
            value={280000}
            label={sv ? "Instagram-visningar" : "Instagram views"}
            sublabel={sv ? "Senaste månaden" : "Last month"}
            suffix="+"
            animate={animate}
          />
          <StatCard
            value={11300}
            label={sv ? "Instagram-följare" : "Instagram followers"}
            animate={animate}
          />
        </div>

        {/* Audience breakdown */}
        <div className="border-t border-sand/40 pt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Platform breakdown */}
          <div>
            <p className="eyebrow mb-6">
              {sv ? "Målgrupp" : "Audience"}
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs uppercase tracking-widest text-mocha font-sans">
                    {sv ? "Kvinnor" : "Women"}
                  </span>
                  <span className="text-xs text-dark font-sans font-medium">88–89%</span>
                </div>
                <div className="h-px bg-sand/40 w-full">
                  <div
                    className="h-px bg-espresso transition-all duration-2000"
                    style={{ width: animate ? "89%" : "0%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs uppercase tracking-widest text-mocha font-sans">
                    {sv ? "Ålder 25–44" : "Age 25–44"}
                  </span>
                  <span className="text-xs text-dark font-sans font-medium">62%</span>
                </div>
                <div className="h-px bg-sand/40 w-full">
                  <div
                    className="h-px bg-espresso transition-all duration-2000"
                    style={{ width: animate ? "62%" : "0%", transitionDelay: "200ms" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs uppercase tracking-widest text-mocha font-sans">
                    {sv ? "Sverige" : "Sweden"}
                  </span>
                  <span className="text-xs text-dark font-sans font-medium">97%</span>
                </div>
                <div className="h-px bg-sand/40 w-full">
                  <div
                    className="h-px bg-espresso transition-all duration-2000"
                    style={{ width: animate ? "97%" : "0%", transitionDelay: "400ms" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Engagement highlights */}
          <div>
            <p className="eyebrow mb-6">
              {sv ? "Engagemang / månad" : "Engagement / month"}
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: sv ? "Gilla-markeringar" : "Likes", value: "36 000+" },
                { label: sv ? "Kommentarer" : "Comments", value: "1 900+" },
                { label: sv ? "Delningar" : "Shares", value: "2 500+" },
                { label: sv ? "Profilbesök" : "Profile visits", value: "49 000+" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-baseline border-b border-sand/20 pb-2">
                  <span className="text-xs uppercase tracking-widest text-mocha font-sans">
                    {item.label}
                  </span>
                  <span className="font-serif text-xl text-dark">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Collaboration highlight */}
          <div>
            <p className="eyebrow mb-6">
              {sv ? "Samarbeten" : "Collaborations"}
            </p>
            <div className="flex flex-col gap-3">
              {[
                {
                  label: sv ? "Varumärken" : "Brands",
                  value: "200+",
                },
                {
                  label: sv ? "Instagram" : "Instagram",
                  value: "@sofiegullstrom",
                },
                {
                  label: sv ? "TikTok" : "TikTok",
                  value: "@sofiegullstrom",
                },
                {
                  label: sv ? "Aktiv sedan" : "Active since",
                  value: "2018",
                },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-baseline border-b border-sand/20 pb-2">
                  <span className="text-xs uppercase tracking-widest text-mocha font-sans">
                    {item.label}
                  </span>
                  <span className="font-serif text-lg text-dark">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
