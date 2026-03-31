"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import DeviceMockups from "@/components/DeviceMockups";

interface AboutSectionProps {
  locale: string;
}

interface AboutContent {
  eyebrow_sv: string;
  eyebrow_en: string;
  heading_sv: string;
  heading_en: string;
  paragraphs_sv: string[];
  paragraphs_en: string[];
}

interface SiteContent {
  about: AboutContent;
}

const FALLBACK: AboutContent = {
  eyebrow_sv: "Om mig",
  eyebrow_en: "About me",
  heading_sv: "Sofie\nGullström",
  heading_en: "Sofie\nGullström",
  paragraphs_sv: [
    "Hej, jag är Sofie!",
    "När jag satte ihop den här portfolion insåg jag att det inte är lätt att sammanfatta 10 års arbete och erfarenhet på ett enda bildspel. Så jag bestämde mig för att bygga en plats där jag kan dela fler av de projekt, idéer och arbeten jag har varit en del av.",
  ],
  paragraphs_en: [
    "Hi, I'm Sofie!",
    "When putting this portfolio together, I realized that it's not easy to summarize 10 years of work and experience in a single slide. So I decided to build a place where I can share more of the projects, ideas and work I've been part of.",
  ],
};

// Highlight a specific phrase inside a string with merlot color
function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  const parts = text.split(highlight);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span style={{ color: "var(--color-merlot)", fontWeight: 500 }}>{highlight}</span>
          )}
        </span>
      ))}
    </>
  );
}

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// Curved hand-drawn arrow SVG — starts upper-right, curves down-left toward the person
function CurvedArrow() {
  return (
    <svg
      width="60"
      height="72"
      viewBox="0 0 60 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Curve from top-right down to lower-left */}
      <path
        d="M 52 5 C 46 18, 24 34, 8 62"
        stroke="var(--color-merlot)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arrowhead pointing down-left */}
      <path
        d="M 8 62 L 4 52 M 8 62 L 19 57"
        stroke="var(--color-merlot)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AboutSection({ locale }: AboutSectionProps) {
  const isSv = locale === "sv";
  const [content, setContent] = useState<AboutContent>(FALLBACK);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data: SiteContent) => { if (data?.about) setContent(data.about); })
      .catch(() => {});
  }, []);

  // Para[0] = greeting ("Hi, I'm Sofie!") — shown as overlay on video, NOT in text column
  // Para[1] = old piano/creative text — skip always
  // Para[2+] = the actual body paragraphs we want in the text column
  const allParagraphs = isSv ? content.paragraphs_sv : content.paragraphs_en;
  const paragraphs = allParagraphs.length >= 3
    ? allParagraphs.slice(2)
    : allParagraphs.slice(1);

  const highlightPhrase = isSv ? "sammanfatta 10" : "summarize 10";

  const { ref: textRef, visible: textVisible } = useReveal(0.1);

  // Video: plays once when scrolled into view, freezes on last frame
  const videoRef    = useRef<HTMLVideoElement>(null);
  const imgRef      = useRef<HTMLDivElement>(null);
  const [imgVisible, setImgVisible] = useState(false);
  const [played,    setPlayed]    = useState(false);

  const handleEnded = useCallback(() => {
    setPlayed(true);
    videoRef.current?.pause();
  }, []);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setImgVisible(true);
          if (!played) videoRef.current?.play().catch(() => {});
          obs.disconnect();
        }
      },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      id="om-mig"
      aria-labelledby="about-heading"
      className="border-t border-sand/20 pt-20 md:pt-28 pb-24 md:pb-32"
      style={{ background: "#FAF8F4" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Two-column: image left, text + devices right */}
        <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-10 md:gap-16 items-start">

          {/* Left – sticker image with "Hi, I'm Sofie!" overlay */}
          <div
            ref={imgRef}
            className="relative"
            style={{
              opacity: imgVisible ? 1 : 0,
              transform: imgVisible ? "translateY(0) scale(1)" : "translateY(36px) scale(0.98)",
              transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/5" }}>
              <video
                ref={videoRef}
                src="/images/about-video.mp4"
                muted
                playsInline
                preload="metadata"
                onEnded={handleEnded}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* "Hi, I'm Sofie!" greeting + curved arrow — appears after image reveals */}
            <div
              className="absolute top-6 right-0 flex flex-col items-end gap-1"
              style={{
                opacity: imgVisible ? 1 : 0,
                transform: imgVisible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s",
              }}
            >
              <p
                className="font-serif italic font-light"
                style={{
                  fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                  color: "var(--color-dark)",
                  letterSpacing: "0.02em",
                }}
              >
                {isSv ? "Hej, jag är Sofie!" : "Hi, I'm Sofie!"}
              </p>
              <div style={{ marginRight: "12px" }}>
                <CurvedArrow />
              </div>
            </div>
          </div>

          {/* Right – text at top, devices below */}
          <div className="flex flex-col">

            {/* Text (skip greeting, shown as overlay) */}
            <div
              ref={textRef}
              className="flex flex-col gap-5 md:pt-2"
              style={{
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? "translateY(0)" : "translateY(28px)",
                transition: "opacity 0.85s cubic-bezier(0.16,1,0.3,1) 0.18s, transform 0.85s cubic-bezier(0.16,1,0.3,1) 0.18s",
              }}
            >
              <h2 id="about-heading" className="sr-only">
                {isSv ? "Om mig" : "About me"}
              </h2>

              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={`font-sans leading-relaxed tracking-wide ${
                    i === 0
                      ? "text-lg md:text-xl text-dark font-light"
                      : "text-base text-mocha/75"
                  }`}
                >
                  <HighlightedText text={para} highlight={highlightPhrase} />
                </p>
              ))}
            </div>

            {/* Devices — below text, within the right column */}
            <DeviceMockups locale={locale} />

          </div>

        </div>

      </div>
    </section>
  );
}
