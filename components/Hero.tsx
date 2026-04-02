"use client";

import { useEffect, useRef, useState } from "react";

interface HeroProps {
  locale: string;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function Hero({ locale: _locale }: HeroProps) {
  const [mounted,      setMounted]      = useState(false);
  const [progress,     setProgress]     = useState(0);
  const [plusRevealed, setPlusRevealed] = useState(false);

  const sectionRef       = useRef<HTMLElement>(null);
  const videoRef         = useRef<HTMLVideoElement>(null);
  const rafRef           = useRef<number | null>(null);
  const plusRevealedRef  = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;
        const rect       = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const raw        = Math.min(Math.max(-rect.top / scrollable, 0), 1);
        setProgress(raw);

        // Drive video by scroll position
        const vid = videoRef.current;
        if (vid && vid.readyState >= 2 && vid.duration) {
          vid.currentTime = Math.min(raw / 0.75, 1) * vid.duration;
        }

        // Compute eased progress for "+" trigger
        const p           = easeInOut(raw);
        const textProgress = Math.min(Math.max((p - 0.42) / 0.28, 0), 1);

        // Trigger "+" drop-in once text is 88% revealed
        if (textProgress >= 0.88 && !plusRevealedRef.current) {
          plusRevealedRef.current = true;
          setPlusRevealed(true);
        }
        // Reset if scrolled back near top
        if (textProgress < 0.05 && plusRevealedRef.current) {
          plusRevealedRef.current = false;
          setPlusRevealed(false);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const p = easeInOut(progress);

  // ── Video: shrinks and fades out ─────────────────────────────────
  const videoProgress = Math.min(p / 0.72, 1);
  const videoScale    = Math.max(0, 1 - videoProgress);
  const videoRot      = videoProgress * -3;
  const videoOpacity  = Math.max(0, 1 - Math.min(p / 0.62, 1));

  // ── Reveal text: fades + slides up as video disappears ───────────
  // Starts earlier: when video is ~35% scale (p ≈ 0.42)
  const textProgress  = Math.min(Math.max((p - 0.42) / 0.28, 0), 1);
  const textOpacity   = easeInOut(textProgress);
  const textY         = (1 - easeInOut(textProgress)) * 40;

  // ── Background: dark → cream ─────────────────────────────────────
  const creamOpacity  = Math.min(Math.max((p - 0.4) / 0.4, 0), 0.96);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "250vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-dark flex flex-col">

        {/* Cream bg fades in as video shrinks */}
        <div
          className="absolute inset-0 z-0 bg-cream"
          style={{ opacity: creamOpacity }}
        />

        {/* Video – scroll-driven, shrinks + fades to reveal text */}
        <div
          className="absolute inset-0 z-30"
          style={{
            opacity:       videoOpacity,
            willChange:    "opacity",
            pointerEvents: "none",
          }}
        >
          {/* Centered video container */}
          <div
            style={{
              position:        "absolute",
              top:             "50%",
              left:            "50%",
              width:           "50%",
              aspectRatio:     "9/16",
              transform:       `translate(-50%, -50%) scale(${videoScale}) rotate(${videoRot}deg)`,
              transformOrigin: "center center",
              willChange:      "transform",
              overflow:        "hidden",
              borderRadius:    "8px",
            }}
          >
            <video
              ref={videoRef}
              src="/images/herovideo.mp4"
              className="w-full h-full object-cover"
              preload="auto"
              autoPlay
              muted
              playsInline
              disablePictureInPicture
              onLoadedData={(e) => {
                const v = e.currentTarget;
                v.pause();
                v.currentTime = 0;
              }}
            />
          </div>
        </div>

        {/* Reveal text */}
        <div
          className="absolute inset-0 z-20 flex items-center justify-center px-6"
          style={{
            opacity:       mounted ? textOpacity : 0,
            transform:     `translateY(${textY}px)`,
            willChange:    "opacity, transform",
            pointerEvents: "none",
          }}
        >
          <p
            className="font-serif font-light text-center text-dark leading-tight tracking-tight"
            style={{ fontSize: "clamp(2.2rem, 6vw, 7rem)", maxWidth: "14ch" }}
          >
            What{" "}
            {/* "10" — normal, fades in with the rest of the text */}
            <span className="inline-block">10</span>
            {/* "+" — clips and drops in from above once text is ~88% revealed */}
            <span
              style={{
                display:        "inline-block",
                overflow:       "hidden",
                verticalAlign:  "top",
                lineHeight:     "inherit",
              }}
            >
              <span
                style={{
                  display:    "inline-block",
                  color:      "var(--color-merlot)",
                  transform:  plusRevealed ? "translateY(0)" : "translateY(-1.1em)",
                  transition: plusRevealed
                    ? "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    : "none",
                }}
              >
                +
              </span>
            </span>
            {" "}years of content looks like.
          </p>
        </div>

        {/* Name — fades out at start of scroll, sits lower */}
        <div
          className="absolute z-40 pointer-events-none"
          style={{
            bottom:  "clamp(5rem, 12vh, 10rem)",
            left:    "clamp(1.5rem, 2.5vw, 2.5rem)",
            opacity: mounted ? Math.max(0, 1 - p * 8) : 0,
          }}
        >
          <p
            className="font-serif text-cream leading-none"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 5.5rem)", fontWeight: 300, letterSpacing: "0.1em" }}
          >
            SOFIE
          </p>
          <p
            className="font-serif text-cream leading-none"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 5.5rem)", fontWeight: 500, letterSpacing: "0.1em", marginTop: "-0.05em" }}
          >
            GULLSTRÖM
          </p>
        </div>

      </div>
    </section>
  );
}
