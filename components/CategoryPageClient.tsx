"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FollowSection from "@/components/FollowSection";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ImageEntry {
  src: string;
  brand: string;
}

interface VideoEntry {
  src: string;          // path to actual .mp4
  label?: string;       // e.g. "1080 × 1920"
}

// Defined here so CatData can reference it
type GalleryItem =
  | { kind: "image";            src: string; brand: string; ratio: string }
  | { kind: "video";            src: string; label: string }          // real .mp4
  | { kind: "videoPlaceholder"; ratio: string; label: string };       // fallback

interface CatData {
  sv: string;
  en: string;
  tagline_sv: string;
  tagline_en: string;
  cover: string;
  images: ImageEntry[];
  videos?: VideoEntry[]; // real video files when available
  galleryItems?: GalleryItem[]; // explicit carousel order override
}

// ─── Category data ────────────────────────────────────────────────────────────
const CATS: Record<string, CatData> = {
  beauty: {
    sv: "Beauty & Skincare",
    en: "Beauty & Skincare",
    tagline_sv: "Skönhet som konst – produkter som berättar historier och skapar igenkänning.",
    tagline_en: "Beauty as art – products that tell stories and create recognition.",
    cover: "/images/beauty/IMG_9017.jpg",
    images: [
      { src: "/images/beauty/IMG_2775.jpg", brand: "Beauty" },
      { src: "/images/beauty/IMG_0143.jpg", brand: "Beauty" },
      { src: "/images/beauty/IMG_1124.jpg", brand: "Beauty" },
      { src: "/images/beauty/IMG_2513.jpg", brand: "Beauty" },
      { src: "/images/beauty/IMG_2658.jpg", brand: "Beauty" },
      { src: "/images/beauty/IMG_2747.jpg", brand: "Beauty" },
      { src: "/images/beauty/IMG_2767.jpg", brand: "Beauty" },
      { src: "/images/beauty/IMG_2774.jpg", brand: "Beauty" },
      { src: "/images/beauty/IMG_2779.jpg", brand: "Beauty" },
      { src: "/images/beauty/IMG_8082.jpg", brand: "Beauty" },
    ],
    videos: [
      { src: "/images/beauty/bv1.mp4", label: "1080 × 1920" },
      { src: "/images/beauty/bv2.mp4", label: "1080 × 1920" },
      { src: "/images/beauty/bv3.mp4", label: "1080 × 1920" },
      { src: "/images/beauty/bv4.mp4", label: "1080 × 1920" },
      { src: "/images/beauty/bv5.mp4", label: "1080 × 1920" },
      { src: "/images/beauty/bv6.mp4", label: "1080 × 1920" },
      { src: "/images/beauty/bv7.mp4", label: "1080 × 1920" },
      { src: "/images/beauty/bv8.mp4", label: "1080 × 1920" },
      { src: "/images/beauty/bv9.mp4", label: "1080 × 1920" },
    ],
    // Explicit carousel order:
    // [0] bv1 = copy_6EED08FB → CENTER
    // [1] IMG_2775 → RIGHT
    // [18] bv9 = copy_0E527FE5 → LEFT
    galleryItems: [
      { kind: "video", src: "/images/beauty/bv1.mp4",    label: "1080 × 1920" }, // 0 CENTER
      { kind: "image", src: "/images/beauty/IMG_2775.jpg", brand: "Beauty", ratio: "4/5" }, // 1 RIGHT
      { kind: "image", src: "/images/beauty/IMG_0143.jpg", brand: "Beauty", ratio: "1/1" },
      { kind: "video", src: "/images/beauty/bv2.mp4",    label: "1080 × 1920" },
      { kind: "image", src: "/images/beauty/IMG_1124.jpg", brand: "Beauty", ratio: "4/5" },
      { kind: "image", src: "/images/beauty/IMG_2513.jpg", brand: "Beauty", ratio: "3/4" },
      { kind: "video", src: "/images/beauty/bv3.mp4",    label: "1080 × 1920" },
      { kind: "image", src: "/images/beauty/IMG_2658.jpg", brand: "Beauty", ratio: "4/5" },
      { kind: "image", src: "/images/beauty/IMG_2747.jpg", brand: "Beauty", ratio: "1/1" },
      { kind: "video", src: "/images/beauty/bv4.mp4",    label: "1080 × 1920" },
      { kind: "image", src: "/images/beauty/IMG_2767.jpg", brand: "Beauty", ratio: "4/5" },
      { kind: "image", src: "/images/beauty/IMG_2774.jpg", brand: "Beauty", ratio: "3/4" },
      { kind: "video", src: "/images/beauty/bv5.mp4",    label: "1080 × 1920" },
      { kind: "image", src: "/images/beauty/IMG_2779.jpg", brand: "Beauty", ratio: "4/5" },
      { kind: "image", src: "/images/beauty/IMG_8082.jpg", brand: "Beauty", ratio: "1/1" },
      { kind: "video", src: "/images/beauty/bv6.mp4",    label: "1080 × 1920" },
      { kind: "video", src: "/images/beauty/bv7.mp4",    label: "1080 × 1920" },
      { kind: "video", src: "/images/beauty/bv8.mp4",    label: "1080 × 1920" },
      { kind: "video", src: "/images/beauty/bv9.mp4",    label: "1080 × 1920" }, // 18 LEFT
    ],
  },
  mat: {
    sv: "Mat & Dryck",
    en: "Food & Drink",
    tagline_sv: "Smaker som inspirerar och recept som engagerar – mat är mer än näring, det är gemenskap.",
    tagline_en: "Flavors that inspire and recipes that engage – food is more than nutrition, it's community.",
    cover: "/images/portfolio/p16.jpg",
    images: [
      { src: "/images/portfolio/p3.jpg",  brand: "Arla"       },
      { src: "/images/portfolio/p15.jpg", brand: "HelloFresh" },
      { src: "/images/portfolio/p16.jpg", brand: "HelloFresh" },
      { src: "/images/portfolio/p25.jpg", brand: "Hickap"     },
    ],
  },
  mode: {
    sv: "Mode & Stil",
    en: "Fashion & Style",
    tagline_sv: "Stil med substans – mode som berör, inspirerar och sätter avtryck.",
    tagline_en: "Style with substance – fashion that moves, inspires and leaves a mark.",
    cover: "/images/mode/IMG_2660.jpg",
    images: [
      { src: "/images/mode/IMG_2660.jpg",                            brand: "Mode" },
      { src: "/images/mode/IMG_2748.jpg",                            brand: "Mode" },
      { src: "/images/mode/IMG_2750.jpg",                            brand: "Mode" },
      { src: "/images/mode/IMG_2751.jpg",                            brand: "Mode" },
      { src: "/images/mode/IMG_2753.jpg",                            brand: "Mode" },
      { src: "/images/mode/IMG_2780.jpg",                            brand: "Mode" },
      { src: "/images/mode/F27F1C2F-1E0A-4CC2-BF62-75CD7A00A6C4.JPG", brand: "Mode" },
      { src: "/images/mode/IMG_2025_01_02-13_50_12_9810_BDD76381.JPG", brand: "Mode" },
      { src: "/images/mode/IMG_2026_02_27-15_39_09_4910_CA9C3AB8.JPEG", brand: "Mode" },
    ],
    videos: [
      { src: "/images/mode/fv1.mp4", label: "1080 × 1920" },
      { src: "/images/mode/fv2.mp4", label: "1080 × 1920" },
      { src: "/images/mode/fv3.mp4", label: "1080 × 1920" },
      { src: "/images/mode/fv4.mp4", label: "1080 × 1920" },
      { src: "/images/mode/fv5.mp4", label: "1080 × 1920" },
      { src: "/images/mode/fv6.mp4", label: "1080 × 1920" },
      { src: "/images/mode/fv7.mp4", label: "1080 × 1920" },
      { src: "/images/mode/fv8.mp4", label: "1080 × 1920" },
      { src: "/images/mode/fv9.mp4", label: "1080 × 1920" },
    ],
  },
  hem: {
    sv: "Hem & Inredning",
    en: "Home & Décor",
    tagline_sv: "Hemmet som inspirationskälla – inredning med känsla och berättelse.",
    tagline_en: "Home as inspiration – décor with feeling and story.",
    cover: "/images/hem/IMG_0852.jpg",
    images: [
      { src: "/images/hem/IMG_0852.jpg",                               brand: "Hem" },
      { src: "/images/hem/IMG_4523.JPG",                               brand: "Hem" },
      { src: "/images/hem/IMG_4530.JPG",                               brand: "Hem" },
      { src: "/images/hem/IMG_5448.JPG",                               brand: "Hem" },
      { src: "/images/hem/IMG_5449.JPG",                               brand: "Hem" },
      { src: "/images/hem/IMG_7782.JPG",                               brand: "Hem" },
      { src: "/images/hem/IMG_8284.JPG",                               brand: "Hem" },
      { src: "/images/hem/E5E3C918-3E55-4920-86DE-995156A355CC.JPG",   brand: "Hem" },
    ],
    videos: [
      { src: "/images/hem/hv1.mp4", label: "1080 × 1920" },
      { src: "/images/hem/hv2.mp4", label: "1080 × 1920" },
      { src: "/images/hem/hv3.mp4", label: "1080 × 1920" },
      { src: "/images/hem/hv4.mp4", label: "1080 × 1920" },
    ],
  },
  familj: {
    sv: "Familj & Föräldraskap",
    en: "Family & Parenting",
    tagline_sv: "Äkta ögonblick och autentiskt familjeliv – för varumärken som vill nå hjärtat.",
    tagline_en: "Authentic moments and real family life – for brands that want to reach the heart.",
    cover: "/images/familj/IMG_6150.JPG",
    images: [
      { src: "/images/familj/IMG_2657.jpg",                             brand: "Familj" },
      { src: "/images/familj/IMG_6076.jpg",                             brand: "Familj" },
      { src: "/images/familj/IMG_6120.JPG",                             brand: "Familj" },
      { src: "/images/familj/IMG_6150.JPG",                             brand: "Familj" },
      { src: "/images/familj/IMG_6091_jpg.JPG",                         brand: "Familj" },
      { src: "/images/familj/IMG_2091.JPG",                             brand: "Familj" },
      { src: "/images/familj/IMG_0409.jpg",                             brand: "Familj" },
      { src: "/images/familj/IMG_0851.jpg",                             brand: "Familj" },
      { src: "/images/familj/IMG_1736.jpg",                             brand: "Familj" },
      { src: "/images/familj/IMG_1737.jpg",                             brand: "Familj" },
      { src: "/images/familj/IMG_1738.jpg",                             brand: "Familj" },
      { src: "/images/familj/IMG_2501.jpg",                             brand: "Familj" },
      { src: "/images/familj/IMG_2812.JPG",                             brand: "Familj" },
      { src: "/images/familj/IMG_2814.JPG",                             brand: "Familj" },
      { src: "/images/familj/IMG_2816.JPG",                             brand: "Familj" },
      { src: "/images/familj/B7E06C88-7A7B-4E65-BF5B-82825F967952.JPG", brand: "Familj" },
      { src: "/images/familj/D7DFF9F9-5965-412B-9301-321CA0446E9B.JPG", brand: "Familj" },
      { src: "/images/familj/4D8F992B-FB98-4891-8A31-E6E8DEDF96BA.JPG", brand: "Familj" },
    ],
    videos: [
      { src: "/images/familj/famv1.mp4",  label: "1080 × 1920" },
      { src: "/images/familj/famv2.mp4",  label: "1080 × 1920" },
      { src: "/images/familj/famv3.mp4",  label: "1080 × 1920" },
      { src: "/images/familj/famv4.mp4",  label: "1080 × 1920" },
      { src: "/images/familj/famv5.mp4",  label: "1080 × 1920" },
      { src: "/images/familj/famv6.mp4",  label: "1080 × 1920" },
      { src: "/images/familj/famv7.mp4",  label: "1080 × 1920" },
      { src: "/images/familj/famv8.mp4",  label: "1080 × 1920" },
      { src: "/images/familj/famv9.mp4",  label: "1080 × 1920" },
      { src: "/images/familj/famv10.mp4", label: "1080 × 1920" },
      { src: "/images/familj/famv11.mp4", label: "1080 × 1920" },
      { src: "/images/familj/famv12.mp4", label: "1080 × 1920" },
      { src: "/images/familj/famv13.mp4", label: "1080 × 1920" },
      { src: "/images/familj/famv14.mp4", label: "1080 × 1920" },
      { src: "/images/familj/famv15.mp4", label: "1080 × 1920" },
    ],
  },
  elektronik: {
    sv: "Elektronik & Tech",
    en: "Tech & Electronics",
    tagline_sv: "Teknik som berättar – gadgets och innovationer med karaktär och personlighet.",
    tagline_en: "Tech that tells stories – gadgets and innovations with character and personality.",
    cover: "/images/elektronik/0B645D3D-2462-4861-983B-E7349F588CA4.JPG",
    images: [
      { src: "/images/elektronik/IMG_2815.jpg",                          brand: "Elektronik" },
      { src: "/images/elektronik/IMG_0853.jpg",                          brand: "Elektronik" },
      { src: "/images/elektronik/IMG_1603.jpg",                          brand: "Elektronik" },
      { src: "/images/elektronik/IMG_2393.jpg",                          brand: "Elektronik" },
      { src: "/images/elektronik/IMG_2811.JPG",                          brand: "Elektronik" },
      { src: "/images/elektronik/0B645D3D-2462-4861-983B-E7349F588CA4.JPG", brand: "Elektronik" },
      { src: "/images/elektronik/D8C4195E-9F18-4B77-80CC-A2F5553BA69A.JPG", brand: "Elektronik" },
    ],
    videos: [
      { src: "/images/elektronik/ev1.mp4", label: "1080 × 1920" },
      { src: "/images/elektronik/ev2.mp4", label: "1080 × 1920" },
      { src: "/images/elektronik/ev3.mp4", label: "1080 × 1920" },
      { src: "/images/elektronik/ev4.mp4", label: "1080 × 1920" },
      { src: "/images/elektronik/ev5.mp4", label: "1080 × 1920" },
      { src: "/images/elektronik/ev6.mp4", label: "1080 × 1920" },
      { src: "/images/elektronik/ev7.mp4", label: "1080 × 1920" },
      { src: "/images/elektronik/ev8.mp4", label: "1080 × 1920" },
      { src: "/images/elektronik/ev9.mp4", label: "1080 × 1920" },
    ],
  },
  halsa: {
    sv: "Hälsa & Träning",
    en: "Health & Wellness",
    tagline_sv: "Välmående som livsstil – hälsoprodukter och träning presenterade med äkthet.",
    tagline_en: "Wellness as lifestyle – health products and fitness presented with authenticity.",
    cover: "/images/halsa/CE1FED39-8F36-48F9-AFFF-B2AEF2B0DBA7.JPG",
    images: [
      { src: "/images/halsa/CE1FED39-8F36-48F9-AFFF-B2AEF2B0DBA7.JPG",          brand: "Träning" },
      { src: "/images/halsa/IMG_0842.jpg",                                        brand: "Träning" },
      { src: "/images/halsa/IMG_0844.jpg",                                        brand: "Träning" },
      { src: "/images/halsa/IMG_0845.jpg",                                        brand: "Träning" },
      { src: "/images/halsa/IMG_0846.jpg",                                        brand: "Träning" },
      { src: "/images/halsa/IMG_7908.jpg",                                        brand: "Hälsa"   },
      { src: "/images/halsa/IMG_3485.jpg",                                        brand: "Hälsa"   },
      { src: "/images/halsa/Facetune_21-03-2026-10-44-15.jpg",                   brand: "Hälsa"   },
      { src: "/images/halsa/35F00161-8B2C-4A1F-9A7F-8DCA6E207CDE.JPG",           brand: "Hälsa"   },
      { src: "/images/halsa/8DD24053-D489-47D3-97A5-816E4B7EDC01.JPG",           brand: "Hälsa"   },
      { src: "/images/halsa/8E8D94BA-A74E-463C-B214-E43E249F6207.JPG",           brand: "Hälsa"   },
    ],
    videos: [
      { src: "/images/halsa/tv1.mp4", label: "1080 × 1920" },
      { src: "/images/halsa/tv2.mp4", label: "1080 × 1920" },
      { src: "/images/halsa/tv3.mp4", label: "1080 × 1920" },
      { src: "/images/halsa/tv4.mp4", label: "1080 × 1920" },
      { src: "/images/halsa/tv5.mp4", label: "1080 × 1920" },
      { src: "/images/halsa/tv6.mp4", label: "1080 × 1920" },
      { src: "/images/halsa/tv7.mp4", label: "1080 × 1920" },
      { src: "/images/halsa/tv8.mp4", label: "1080 × 1920" },
      { src: "/images/halsa/tv9.mp4", label: "1080 × 1920" },
    ],
  },
  media: {
    sv: "TV & Media",
    en: "TV & Media",
    tagline_sv: "Från skärm till hjärta – TV-uppträdanden och medieproduktion som engagerar.",
    tagline_en: "From screen to heart – TV appearances and media production that captivates.",
    cover: "/images/portfolio/p20.jpg",
    images: [
      { src: "/images/portfolio/p19.jpg", brand: "TV-produktion"  },
      { src: "/images/portfolio/p20.jpg", brand: "Malou efter 10" },
      { src: "/images/portfolio/p22.jpg", brand: "Media"          },
    ],
  },
};

// ─── Video format data ────────────────────────────────────────────────────────
const VIDEO_FORMATS = [
  {
    label: "1080 × 1920",
    name_sv: "Vertikal · Reels & Stories",
    name_en: "Vertical · Reels & Stories",
    platform_sv: "Instagram · TikTok · YouTube Shorts",
    platform_en: "Instagram · TikTok · YouTube Shorts",
    ratio: "9:16",
    w: 180,
    h: 320,
  },
  {
    label: "1920 × 1080",
    name_sv: "Liggande · YouTube & TV",
    name_en: "Landscape · YouTube & TV",
    platform_sv: "YouTube · LinkedIn · Desktop",
    platform_en: "YouTube · LinkedIn · Desktop",
    ratio: "16:9",
    w: 380,
    h: 214,
  },
  {
    label: "1080 × 1080",
    name_sv: "Kvadrat · Feedinlägg",
    name_en: "Square · Feed Post",
    platform_sv: "Instagram · Facebook Feed",
    platform_en: "Instagram · Facebook Feed",
    ratio: "1:1",
    w: 280,
    h: 280,
  },
  {
    label: "1080 × 1350",
    name_sv: "Stående · Feedinlägg",
    name_en: "Portrait · Feed Post",
    platform_sv: "Instagram · Pinterest",
    platform_en: "Instagram · Pinterest",
    ratio: "4:5",
    w: 240,
    h: 300,
  },
];

// ─── Gallery items ─────────────────────────────────────────────────────────────
function buildGalleryItems(images: ImageEntry[], videos?: VideoEntry[]): GalleryItem[] {
  const ratios = ["4/5", "1/1", "4/5", "3/4", "4/5", "1/1", "4/5", "3/4"];

  // If real videos exist, interleave them with images
  if (videos && videos.length > 0) {
    const result: GalleryItem[] = [];
    const maxItems = images.length + videos.length;
    let imgIdx = 0;
    let vidIdx = 0;
    let slot = 0;
    while (result.length < maxItems && (imgIdx < images.length || vidIdx < videos.length)) {
      // pattern: 2 images, 1 video, repeat
      if (slot % 3 === 2 && vidIdx < videos.length) {
        result.push({ kind: "video", src: videos[vidIdx].src, label: videos[vidIdx].label ?? "1080 × 1920" });
        vidIdx++;
      } else if (imgIdx < images.length) {
        result.push({ kind: "image", src: images[imgIdx].src, brand: images[imgIdx].brand, ratio: ratios[imgIdx % ratios.length] });
        imgIdx++;
      } else if (vidIdx < videos.length) {
        result.push({ kind: "video", src: videos[vidIdx].src, label: videos[vidIdx].label ?? "1080 × 1920" });
        vidIdx++;
      }
      slot++;
    }
    return result;
  }

  // Fallback: placeholder videos
  const items: GalleryItem[] = images.map((img, i) => ({
    kind: "image",
    src: img.src,
    brand: img.brand,
    ratio: ratios[i % ratios.length],
  }));

  const videoInsertAt = [1, 4];
  const videoFormats = [
    { ratio: "9/16", label: "1080 × 1920" },
    { ratio: "16/9", label: "1920 × 1080" },
  ];
  videoInsertAt.forEach((pos, vi) => {
    if (pos <= items.length) {
      items.splice(pos, 0, { kind: "videoPlaceholder", ratio: videoFormats[vi].ratio, label: videoFormats[vi].label });
    }
  });

  return items;
}

// ─── prefers-reduced-motion hook ──────────────────────────────────────────────
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function RevealBlock({ children, delay = 0, className = "", style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal(0.1);
  const reduced = useReducedMotion();
  // When reduced-motion: skip translate, only fade in
  const translate = reduced ? "translateY(0)" : visible ? "translateY(0)" : "translateY(40px)";
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: translate, transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms${reduced ? "" : `, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`}`, ...style }}>
      {children}
    </div>
  );
}

// ─── Cover-flow carousel ───────────────────────────────────────────────────────
const CARD_W = 270;
const CARD_H = 400;
const SIDE_OFFSET = 240; // px from center — side cards peek ~30% into frame
const SIDE_SCALE = 0.80;
const SIDE_OPACITY = 0.50;

function CarouselCard({ item }: { item: GalleryItem }) {
  if (item.kind === "image") {
    return (
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={item.src}
          alt={item.brand}
          fill
          className="object-cover"
          sizes="340px"
        />
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-dark/70 to-transparent">
          <p className="font-serif text-[10px] text-cream/80 tracking-widest uppercase">{item.brand}</p>
        </div>
      </div>
    );
  }

  if (item.kind === "video") {
    return (
      <div className="relative w-full h-full overflow-hidden">
        <video
          src={item.src}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Format badge */}
        <div className="absolute top-2 left-2 bg-dark/60 backdrop-blur-sm px-2 py-0.5">
          <p className="font-mono text-[8px] text-cream/60 tracking-widest">{item.label}</p>
        </div>
        {/* Subtle play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-dark/20">
          <div className="w-10 h-10 rounded-full border border-cream/50 flex items-center justify-center">
            <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[9px] border-l-cream/80 ml-0.5" />
          </div>
        </div>
      </div>
    );
  }

  // videoPlaceholder fallback
  return (
    <div
      className="relative w-full h-full overflow-hidden flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, rgba(114,47,55,0.4) 0%, rgba(44,26,14,0.97) 60%, #100806 100%)" }}
    >
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(250,247,242,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(250,247,242,0.04) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      {[["top-2 left-2","border-t border-l"],["top-2 right-2","border-t border-r"],["bottom-2 left-2","border-b border-l"],["bottom-2 right-2","border-b border-r"]].map(([pos,borders],i)=>(
        <div key={i} className={`absolute ${pos} w-3 h-3 border-cream/20 ${borders}`}/>
      ))}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-cream/30 flex items-center justify-center hover:border-cream/60 transition-colors">
          <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[9px] border-l-cream/60 ml-0.5" />
        </div>
        <p className="font-mono text-[9px] text-cream/35 tracking-widest">{item.label}</p>
      </div>
    </div>
  );
}

function ImageCarousel({ items }: { items: GalleryItem[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const total = items.length;
  const stageRef = useRef<HTMLDivElement>(null);

  const prev = () => setActiveIdx((i) => (i - 1 + total) % total);
  const next = () => setActiveIdx((i) => (i + 1) % total);

  // ── Keyboard navigation (← →, Home, End) ─────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    if (e.key === "Home")       { e.preventDefault(); setActiveIdx(0); }
    if (e.key === "End")        { e.preventDefault(); setActiveIdx(total - 1); }
  };

  const getItemStyle = (pos: number): React.CSSProperties => {
    if (pos === 0) return { transform: "translateX(0px) scale(1)", opacity: 1, zIndex: 3, pointerEvents: "auto" };
    if (pos === 1) return { transform: `translateX(${SIDE_OFFSET}px) scale(${SIDE_SCALE})`, opacity: SIDE_OPACITY, zIndex: 2, pointerEvents: "auto", cursor: "pointer" };
    if (pos === total - 1) return { transform: `translateX(-${SIDE_OFFSET}px) scale(${SIDE_SCALE})`, opacity: SIDE_OPACITY, zIndex: 2, pointerEvents: "auto", cursor: "pointer" };
    const goRight = pos < total / 2;
    return { transform: `translateX(${goRight ? SIDE_OFFSET * 2.2 : -SIDE_OFFSET * 2.2}px) scale(${SIDE_SCALE * 0.7})`, opacity: 0, zIndex: 0, pointerEvents: "none" };
  };

  const activeItem = items[activeIdx];
  const activeLabel = activeItem.kind === "image" ? activeItem.brand : activeItem.label;

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      <p className="eyebrow text-cream/40 self-start ml-1" aria-hidden="true">
        Example work
      </p>

      {/* Carousel region — keyboard-navigable */}
      <div
        ref={stageRef}
        role="region"
        aria-label={`Example work gallery, ${activeIdx + 1} of ${total}`}
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
        style={{ height: CARD_H + 20 }}
      >
        {items.map((item, i) => {
          const pos = (i - activeIdx + total) % total;
          const isCenter = pos === 0;
          const itemLabel = item.kind === "image" ? item.brand : item.label;
          return (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${itemLabel}, ${i + 1} of ${total}`}
              aria-hidden={!isCenter}
              onClick={() => {
                if (pos === 1) next();
                if (pos === total - 1) prev();
              }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: CARD_W,
                height: CARD_H,
                marginLeft: -CARD_W / 2,
                marginTop: -CARD_H / 2,
                transition: "transform 0.52s cubic-bezier(0.4,0,0.2,1), opacity 0.52s ease",
                ...getItemStyle(pos),
              }}
            >
              <CarouselCard item={item} />
            </div>
          );
        })}
      </div>

      {/* Navigation row */}
      <div className="flex items-center gap-4">
        {/* Prev — min 44×44px touch target */}
        <button
          onClick={prev}
          aria-label={`Previous slide (${activeIdx === 0 ? total : activeIdx} of ${total})`}
          className="group flex items-center justify-center w-11 h-11 rounded-full border border-cream/20 hover:border-cream/50 hover:bg-cream/10 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-sand focus-visible:outline-offset-2"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="text-cream/50 group-hover:text-cream transition-colors">
            <path d="M9 2.5L4.5 7L9 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Dot indicators — each has a 44px tap zone via padding */}
        <div role="tablist" aria-label="Slides" className="flex items-center gap-1">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={`Slide ${i + 1} of ${total}`}
              onClick={() => setActiveIdx(i)}
              className="flex items-center justify-center w-[22px] h-[44px] focus-visible:outline-2 focus-visible:outline-sand focus-visible:outline-offset-1 rounded-sm"
            >
              <span
                aria-hidden="true"
                style={{
                  display: "block",
                  width: i === activeIdx ? 18 : 5,
                  height: 5,
                  borderRadius: 3,
                  background: i === activeIdx ? "rgba(250,247,242,0.85)" : "rgba(250,247,242,0.22)",
                  transition: "width 0.35s ease, background 0.3s ease",
                }}
              />
            </button>
          ))}
        </div>

        {/* Next — min 44×44px */}
        <button
          onClick={next}
          aria-label={`Next slide (${(activeIdx + 2) > total ? 1 : activeIdx + 2} of ${total})`}
          className="group flex items-center justify-center w-11 h-11 rounded-full border border-cream/20 hover:border-cream/50 hover:bg-cream/10 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-sand focus-visible:outline-offset-2"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="text-cream/50 group-hover:text-cream transition-colors">
            <path d="M5 2.5L9.5 7L5 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Live counter — announced to screen readers on change */}
      <p
        aria-live="polite"
        aria-atomic="true"
        className="font-mono text-[9px] text-cream/30 tracking-[0.3em]"
      >
        <span className="sr-only">Showing slide </span>
        {activeIdx + 1} / {total}
        <span className="sr-only">: {activeLabel}</span>
      </p>
    </div>
  );
}

// ─── Collaboration form ───────────────────────────────────────────────────────
function CollaborationForm({ locale }: { locale: string }) {
  const [fields, setFields] = useState({ name: "", email: "", brand: "", type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const set = (k: string, v: string) => setFields((f) => ({ ...f, [k]: v }));

  // Focus success message on submit for screen readers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => successRef.current?.focus(), 50);
  };

  const inputBase =
    "w-full bg-transparent border-b py-2.5 text-cream text-sm font-sans tracking-wide " +
    "placeholder:text-cream/30 transition-colors duration-300 " +
    "focus:outline-none focus-visible:border-sand";

  const inputClass = (name: string) =>
    `${inputBase} ${focused === name ? "border-sand" : "border-cream/20"}`;

  if (submitted) {
    return (
      // role="status" + aria-live so screen readers announce the success
      <div
        ref={successRef}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        className="flex flex-col items-center justify-center gap-5 py-10 text-center focus:outline-none"
      >
        <div className="w-11 h-11 rounded-full border border-sand/40 flex items-center justify-center" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8L6 12L14 4" stroke="#DBC9A8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="font-serif text-xl text-cream font-light mb-1.5">
            {locale === "sv" ? "Tack!" : "Thank you!"}
          </p>
          <p className="text-sand/70 text-sm font-sans tracking-wide leading-relaxed">
            {locale === "sv"
              ? "Jag återkommer till dig så snart som möjligt."
              : "I'll get back to you as soon as possible."}
          </p>
        </div>
        <button
          onClick={() => { setSubmitted(false); setFields({ name: "", email: "", brand: "", type: "", message: "" }); }}
          className="eyebrow text-sand/60 hover:text-sand transition-colors mt-1 focus-visible:outline-2 focus-visible:outline-sand focus-visible:outline-offset-2 rounded-sm px-1"
        >
          {locale === "sv" ? "Nytt meddelande" : "New message"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
      noValidate
      aria-label={locale === "sv" ? "Kontaktformulär" : "Collaboration inquiry form"}
    >
      {/* Required field note */}
      <p className="text-cream/35 text-[10px] font-sans tracking-wide">
        {locale === "sv" ? "* Obligatoriska fält" : "* Required fields"}
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="collab-name" className="font-mono text-[10px] text-sand/60 tracking-[0.22em] uppercase">
            {locale === "sv" ? "Namn" : "Name"} <span aria-hidden="true">*</span>
          </label>
          <input
            id="collab-name"
            required
            autoComplete="name"
            aria-required="true"
            className={inputClass("name")}
            placeholder={locale === "sv" ? "Anna Lindström" : "Anna Lindström"}
            value={fields.name}
            onChange={(e) => set("name", e.target.value)}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused(null)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="collab-email" className="font-mono text-[10px] text-sand/60 tracking-[0.22em] uppercase">
            {locale === "sv" ? "E-post" : "Email"} <span aria-hidden="true">*</span>
          </label>
          <input
            id="collab-email"
            required
            type="email"
            autoComplete="email"
            aria-required="true"
            className={inputClass("email")}
            placeholder="anna@brand.se"
            value={fields.email}
            onChange={(e) => set("email", e.target.value)}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="collab-brand" className="font-mono text-[10px] text-sand/60 tracking-[0.22em] uppercase">
          {locale === "sv" ? "Varumärke / Företag" : "Brand / Company"}
        </label>
        <input
          id="collab-brand"
          autoComplete="organization"
          className={inputClass("brand")}
          placeholder={locale === "sv" ? "Ditt varumärke" : "Your brand"}
          value={fields.brand}
          onChange={(e) => set("brand", e.target.value)}
          onFocus={() => setFocused("brand")}
          onBlur={() => setFocused(null)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="collab-type" className="font-mono text-[10px] text-sand/60 tracking-[0.22em] uppercase">
          {locale === "sv" ? "Typ av samarbete" : "Type of collaboration"}
        </label>
        <select
          id="collab-type"
          className={`${inputClass("type")} cursor-pointer`}
          style={{ background: "transparent", colorScheme: "dark" }}
          value={fields.type}
          onChange={(e) => set("type", e.target.value)}
          onFocus={() => setFocused("type")}
          onBlur={() => setFocused(null)}
        >
          <option value="" style={{ background: "#2C1A0E" }}>{locale === "sv" ? "Välj…" : "Choose…"}</option>
          <option value="collab" style={{ background: "#2C1A0E" }}>{locale === "sv" ? "Collab på mina socials" : "Collab on my socials"}</option>
          <option value="ugc" style={{ background: "#2C1A0E" }}>UGC</option>
          <option value="photo_video" style={{ background: "#2C1A0E" }}>{locale === "sv" ? "Foto / Video" : "Photography / Video"}</option>
          <option value="other" style={{ background: "#2C1A0E" }}>{locale === "sv" ? "Annat" : "Other"}</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="collab-message" className="font-mono text-[10px] text-sand/60 tracking-[0.22em] uppercase">
          {locale === "sv" ? "Berätta mer" : "Tell me more"}
        </label>
        <textarea
          id="collab-message"
          rows={3}
          className={`${inputClass("message")} resize-none`}
          placeholder={locale === "sv" ? "Om projektet, tidsram, budget…" : "About the project, timeline, budget…"}
          value={fields.message}
          onChange={(e) => set("message", e.target.value)}
          onFocus={() => setFocused("message")}
          onBlur={() => setFocused(null)}
        />
      </div>

      <button
        type="submit"
        className="mt-1 self-start group inline-flex items-center gap-2 min-h-[44px] bg-cream text-dark px-6 py-3 text-xs tracking-widest uppercase font-sans transition-all duration-300 hover:bg-sand focus-visible:outline-2 focus-visible:outline-sand focus-visible:outline-offset-2"
      >
        {locale === "sv" ? "Skicka" : "Submit"}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </form>
  );
}

// ─── RevealImage (for mosaic) ─────────────────────────────────────────────────
function RevealImage({
  src,
  brand,
  className = "",
  delay = 0,
  priority = false,
  style,
}: {
  src: string;
  brand: string;
  className?: string;
  delay?: number;
  priority?: boolean;
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden group cursor-pointer ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.98)",
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
        ...style,
      }}
    >
      <Image
        src={src}
        alt={brand}
        fill
        priority={priority}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/45 transition-all duration-500" />
      <div className="absolute inset-0 border border-transparent group-hover:border-sand/30 transition-all duration-500" style={{ margin: "12px" }} />
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
        <p className="font-serif text-cream text-sm tracking-[0.2em] uppercase font-light">{brand}</p>
        <div className="h-px w-8 bg-sand/50 mt-2" />
      </div>
    </div>
  );
}

// ─── Editorial mosaic ─────────────────────────────────────────────────────────
function ImageMosaic({ images }: { images: ImageEntry[] }) {
  const count = Math.min(images.length, 5);
  if (count >= 5) return (
    <div className="hidden md:grid gap-2" style={{ gridTemplateColumns: "3fr 2fr", gridTemplateRows: "320px 280px 260px", gridTemplateAreas: '"a b" "a c" "d e"' }}>
      <RevealImage src={images[0].src} brand={images[0].brand} delay={0}   priority className="[grid-area:a]" />
      <RevealImage src={images[1].src} brand={images[1].brand} delay={80}  className="[grid-area:b]" />
      <RevealImage src={images[2].src} brand={images[2].brand} delay={160} className="[grid-area:c]" />
      <RevealImage src={images[3].src} brand={images[3].brand} delay={120} className="[grid-area:d]" />
      <RevealImage src={images[4].src} brand={images[4].brand} delay={200} className="[grid-area:e]" />
    </div>
  );
  if (count === 4) return (
    <div className="hidden md:grid gap-2" style={{ gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "360px 320px", gridTemplateAreas: '"a a b" "c d d"' }}>
      <RevealImage src={images[0].src} brand={images[0].brand} delay={0}   priority className="[grid-area:a]" />
      <RevealImage src={images[1].src} brand={images[1].brand} delay={100} className="[grid-area:b]" />
      <RevealImage src={images[2].src} brand={images[2].brand} delay={160} className="[grid-area:c]" />
      <RevealImage src={images[3].src} brand={images[3].brand} delay={80}  className="[grid-area:d]" />
    </div>
  );
  if (count === 3) return (
    <div className="hidden md:grid gap-2" style={{ gridTemplateColumns: "3fr 2fr", gridTemplateRows: "340px 300px", gridTemplateAreas: '"a b" "a c"' }}>
      <RevealImage src={images[0].src} brand={images[0].brand} delay={0}   priority className="[grid-area:a]" />
      <RevealImage src={images[1].src} brand={images[1].brand} delay={100} className="[grid-area:b]" />
      <RevealImage src={images[2].src} brand={images[2].brand} delay={180} className="[grid-area:c]" />
    </div>
  );
  return (
    <div className="hidden md:flex gap-2 items-start">
      <div className="flex-[3]"><RevealImage src={images[0].src} brand={images[0].brand} delay={0} priority className="w-full" style={{ height: "480px" }} /></div>
      {images[1] && <div className="flex-[2]" style={{ marginTop: "80px" }}><RevealImage src={images[1].src} brand={images[1].brand} delay={120} className="w-full" style={{ height: "380px" }} /></div>}
    </div>
  );
}

function MobileMosaic({ images }: { images: ImageEntry[] }) {
  return (
    <div className="md:hidden columns-2 gap-2">
      {images.map((img, i) => (
        <div key={img.src} className="break-inside-avoid mb-2">
          <RevealImage src={img.src} brand={img.brand} delay={i * 80} priority={i === 0} className="w-full" style={{ aspectRatio: i % 3 === 0 ? "3/4" : "4/5" }} />
        </div>
      ))}
    </div>
  );
}

// ─── Services / Device showcase ───────────────────────────────────────────────
function VideoShowcase({ locale }: { locale: string }) {
  const { ref, visible } = useReveal(0.1);

  const services = locale === "sv"
    ? [
        {
          id: "collab",
          label: "Collab på mina socials",
          who: "Passar dig som vill synas för min engagerade följarskara. Jag lyfter ditt varumärke naturligt och trovärdigt utan att det känns som en annons.",
        },
        {
          id: "ugc",
          label: "UGC",
          who: "Passar dig som vill ha autentiskt content skapat av en riktig användare. Perfekt för att bygga förtroende, driva konvertering och nå en bredare publik.",
        },
        {
          id: "photo",
          label: "Foto / Video",
          who: "Passar dig som behöver professionella bilder eller videos till hemsidan, sociala medier eller kampanjer. Jag hanterar allt från idé till färdigt material.",
        },
      ]
    : [
        {
          id: "collab",
          label: "Collab on my socials",
          who: "Perfect if you want to reach my engaged audience. I feature your brand in a natural, authentic way that never feels like an ad.",
        },
        {
          id: "ugc",
          label: "UGC",
          who: "Perfect if you want authentic content created by a real user. Great for building trust, driving conversions and reaching a wider audience.",
        },
        {
          id: "photo",
          label: "Photography / Video",
          who: "Perfect if you need professional photos or videos for your website, social media or campaigns. I handle everything from concept to final delivery.",
        },
      ];

  return (
    <section className="border-t border-sand/30" style={{ background: "#F5F0E8" }}>
      <div
        ref={ref}
        className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1px_1fr] gap-0"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(18px)", transition: "opacity 0.9s ease, transform 0.9s ease" }}
      >

        {/* ── LEFT: devices ─────────────────────────────────────── */}
        <div className="flex flex-col justify-center px-8 md:px-14 py-14 md:py-20">
          <p className="eyebrow text-merlot mb-10">
            {locale === "sv" ? "Vad jag erbjuder" : "What I offer"}
          </p>

          <div className="flex flex-row items-end gap-5 md:gap-7">

            {/* Laptop */}
            <div className="flex flex-col items-center gap-2">
              <div style={{ width: 180, background: "#1c1108", borderRadius: "8px 8px 0 0", border: "2px solid rgba(250,247,242,0.13)", padding: "8px 8px 5px" }}>
                <div className="flex items-center gap-1 mb-2 px-0.5">
                  {["rgba(255,80,70,0.5)","rgba(255,185,0,0.5)","rgba(35,190,70,0.5)"].map((c,i) => (
                    <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: c }} />
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center gap-2" style={{ height: 96, background: "linear-gradient(135deg, rgba(114,47,55,0.20) 0%, rgba(44,26,14,0.92) 100%)", border: "1px solid rgba(250,247,242,0.06)", borderRadius: 3 }}>
                  <div style={{ width: "78%", height: 4, borderRadius: 2, background: "rgba(250,247,242,0.07)" }} />
                  <p className="font-serif text-cream/75 text-[10px] tracking-wide text-center px-3 leading-snug">
                    {locale === "sv" ? "Content för\nwebbplats" : "Content for\nwebsite"}
                  </p>
                  <div style={{ width: 20, height: 1, background: "rgba(114,47,55,0.55)" }} />
                </div>
              </div>
              <div style={{ width: 196, height: 5, background: "linear-gradient(180deg, rgba(80,50,20,0.18) 0%, rgba(80,50,20,0.05) 100%)", borderRadius: "0 0 3px 3px" }} />
              <div style={{ width: 70, height: 3, background: "rgba(80,50,20,0.12)", borderRadius: 2 }} />
              <p className="font-mono text-[10px] text-mocha/80 tracking-[0.22em] uppercase mt-0.5">Website</p>
            </div>

            {/* iPhone */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center" style={{ width: 78, height: 158, background: "#1c1108", borderRadius: 16, border: "2px solid rgba(250,247,242,0.15)", padding: "10px 6px" }}>
                <div style={{ width: 26, height: 5, background: "rgba(250,247,242,0.09)", borderRadius: 2, marginBottom: 8 }} />
                <div className="flex-1 w-full flex flex-col items-center justify-center gap-1.5" style={{ background: "linear-gradient(160deg, rgba(114,47,55,0.24) 0%, rgba(44,26,14,0.93) 100%)", borderRadius: 9, border: "1px solid rgba(250,247,242,0.06)" }}>
                  <div className="flex gap-1">
                    {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(250,247,242,0.11)" }} />)}
                  </div>
                  <p className="font-serif text-cream/75 text-[8px] tracking-wide text-center px-1.5 leading-snug">
                    Social media &<br/>collab
                  </p>
                  <div style={{ width: 14, height: 1, background: "rgba(114,47,55,0.55)" }} />
                </div>
                <div style={{ width: 22, height: 2, background: "rgba(250,247,242,0.12)", borderRadius: 1, marginTop: 7 }} />
              </div>
              <p className="font-mono text-[10px] text-mocha/80 tracking-[0.22em] uppercase">Socials</p>
            </div>

            {/* iPad */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center" style={{ width: 130, height: 168, background: "#1c1108", borderRadius: 10, border: "2px solid rgba(250,247,242,0.13)", padding: "8px 8px" }}>
                <div className="flex justify-center mb-1.5">
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(250,247,242,0.09)" }} />
                </div>
                <div className="flex-1 w-full flex flex-col items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, rgba(114,47,55,0.20) 0%, rgba(44,26,14,0.92) 100%)", borderRadius: 6, border: "1px solid rgba(250,247,242,0.06)" }}>
                  <div className="flex flex-col gap-1 w-3/4">
                    {[1,0.65,0.4].map((o,i) => (
                      <div key={i} style={{ height: 3, borderRadius: 2, background: `rgba(250,247,242,${o*0.09})`, width: i===1 ? "72%" : "100%" }} />
                    ))}
                  </div>
                  <p className="font-serif text-cream/75 text-[11px] tracking-widest text-center">UGC</p>
                  <div style={{ width: 16, height: 1, background: "rgba(114,47,55,0.55)" }} />
                </div>
                <div style={{ width: 16, height: 16, borderRadius: "50%", border: "1.5px solid rgba(250,247,242,0.09)", marginTop: 6 }} />
              </div>
              <p className="font-mono text-[10px] text-mocha/80 tracking-[0.22em] uppercase">UGC</p>
            </div>

          </div>

          {/* Meeting text */}
          <p className="font-serif text-dark text-lg md:text-xl font-normal italic tracking-wide mt-10 max-w-sm leading-relaxed">
            {locale === "sv"
              ? "Jag bokar gärna ett möte för att höra vad just ni vill göra!"
              : "I'd love to book a meeting to hear what you have in mind!"}
          </p>
        </div>

        {/* ── Divider ─────────────────────────────────────────── */}
        <div className="hidden md:block" style={{ background: "rgba(180,155,120,0.25)" }} />

        {/* ── RIGHT: service descriptions ─────────────────────── */}
        <div className="flex flex-col justify-center px-8 md:px-14 py-14 md:py-20 gap-0">
          {services.map((s, i) => (
            <div key={s.id}>
              {i > 0 && <div style={{ height: 1, background: "rgba(180,155,120,0.22)", margin: "22px 0" }} />}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[8px] text-merlot/60 tracking-[0.28em]">0{i+1}</span>
                  <p className="font-serif text-dark text-base md:text-lg font-light tracking-wide">{s.label}</p>
                </div>
                <p className="text-mocha/65 text-xs font-sans leading-relaxed tracking-wide pl-7">{s.who}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── How I work ───────────────────────────────────────────────────────────────
function HowIWork({ locale }: { locale: string }) {
  const steps = locale === "sv"
    ? [
        {
          num: "01",
          title: "Förståelse kommer först",
          desc: "Bra content börjar med förståelse. Innan jag skapar något tar jag mig tid att sätta mig in i varumärket: marknaden det verkar på, målgruppen det talar till och vad som faktiskt spelar roll för kunden. Utan den grunden går budskapet ofta förlorat.",
        },
        {
          num: "02",
          title: "De bästa idéerna kommer från testande",
          desc: "Marknadsföring förändras hela tiden. De varumärken som sticker ut är de som vågar testa nya format, nya idéer och nya sätt att kommunicera. En del idéer fungerar direkt, andra mognar med tiden – men experimenterandet är alltid där de mest intressanta resultaten föds.",
        },
        {
          num: "03",
          title: "Samarbete ska kännas enkelt",
          desc: "Jag har lärt mig att det bästa arbetet sker när samarbetet är enkelt. Jag jobbar snabbt, kommunicerar tydligt och strävar alltid efter att bygga långsiktiga relationer med de varumärken jag arbetar med. Målet är inte bara en lyckad kampanj – det är ett partnerskap som fungerar, gång på gång.",
        },
      ]
    : [
        {
          num: "01",
          title: "Understanding comes first",
          desc: "Great content starts with understanding. Before I create anything, I take time to understand the brand: the market it lives in, the audience it speaks to, and what actually matters to the customer. Without that foundation, the message often gets lost.",
        },
        {
          num: "02",
          title: "The best ideas come from testing",
          desc: "Marketing is constantly changing. The brands that stand out are the ones willing to test new formats, new ideas and new ways of communicating. Some ideas work instantly, others evolve over time, but experimentation is always where the most interesting results come from.",
        },
        {
          num: "03",
          title: "Collaboration should feel easy",
          desc: "Over the years I've learned that great work happens when collaboration feels simple. I work quickly, communicate clearly, and always aim to build long-term relationships with the brands I work with. The goal isn't just a successful campaign, it's a partnership that works again and again.",
        },
      ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-cream border-t border-sand/30">
      {/* Subtle warm tint */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 55% 45% at 80% 60%, rgba(114,47,55,0.06) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">

        {/* Heading block */}
        <RevealBlock className="mb-16 md:mb-20">
          <p className="eyebrow mb-4 text-merlot">
            {locale === "sv" ? "Hur jag jobbar" : "How I work"}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-dark tracking-wide leading-snug max-w-2xl">
            {locale === "sv"
              ? "Vad 10 år inom marknadsföring har lärt mig"
              : "What 10 years in marketing has taught me"}
          </h2>
          <div className="h-px w-16 bg-merlot mt-6" />
        </RevealBlock>

        {/* Three steps — each falls in with stagger */}
        <div className="grid md:grid-cols-3 gap-px" style={{ background: "rgba(180,155,120,0.18)" }}>
          {steps.map((step, i) => (
            <RevealBlock
              key={step.num}
              delay={i * 180}
              className="p-8 md:p-10 relative bg-cream"
              style={{
                // Extra Y travel for "fall down" feel
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Top merlot accent bar — full width, fading intensity */}
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `rgba(114,47,55,${i === 0 ? 0.85 : i === 1 ? 0.5 : 0.25})` }} />
              <p className="font-mono text-xs text-merlot/60 tracking-[0.3em] mb-6">{step.num}</p>
              <p className="font-serif text-xl md:text-2xl text-dark font-light mb-5 tracking-wide leading-snug">{step.title}</p>
              <p className="text-mocha/70 text-sm font-sans leading-relaxed tracking-wide">{step.desc}</p>
            </RevealBlock>
          ))}
        </div>

      </div>
    </section>
  );
}

// FollowSection is now a shared component — see components/FollowSection.tsx

// ─── Main component ───────────────────────────────────────────────────────────
export default function CategoryPageClient({
  locale,
  category,
}: {
  locale: string;
  category: string;
}) {
  const data = CATS[category];

  // Scroll-away title
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-cream">
        <p className="font-serif text-4xl text-dark font-light">404</p>
        <Link href={`/${locale}`} className="eyebrow text-merlot hover:opacity-60 transition-opacity">
          ← {locale === "sv" ? "Tillbaka" : "Back"}
        </Link>
      </div>
    );
  }

  const title = locale === "sv" ? data.sv : data.en;

  return (
    <>
      {/* ── Scroll-away category title (fixed top-left) ──────── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 18,
          left: "50%",
          transform: scrolled ? "translateX(-50%) translateY(-10px)" : "translateX(-50%) translateY(0)",
          zIndex: 40,
          opacity: scrolled ? 0 : 1,
          transition: "opacity 0.45s ease, transform 0.45s ease",
          pointerEvents: "none",
        }}
      >
        <p className="font-serif text-cream/80 text-lg md:text-xl font-light tracking-wide">
          {title}
        </p>
        <div style={{ height: 1, width: "100%", background: "rgba(114,47,55,0.55)", marginTop: 5 }} />
      </div>

      {/* ── Split: glassmorphism form (left) + carousel (right) ── */}
      <section
        aria-label={locale === "sv" ? "Kontakt och exempelarbeten" : "Contact and example work"}
        className="relative py-12 md:py-20 overflow-hidden"
      >

        {/* Rich dark background with merlot depth — no photo */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #1a0a0d 0%, #2C1A0E 45%, #1f0e0a 100%)",
          }}
        />
        {/* Subtle merlot glow top-left */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 55% at 20% 30%, rgba(114,47,55,0.28) 0%, transparent 70%)",
          }}
        />
        {/* Faint grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(250,247,242,1) 1px, transparent 1px), linear-gradient(90deg, rgba(250,247,242,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">

            {/* Left: merlot-toned glassmorphism card */}
            <div
              style={{
                background: "rgba(114,47,55,0.22)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                border: "1px solid rgba(114,47,55,0.45)",
                boxShadow:
                  "0 0 0 1px rgba(250,247,242,0.04) inset, 0 12px 48px rgba(0,0,0,0.4), 0 1px 0 rgba(250,247,242,0.06) inset",
              }}
              className="p-8 md:p-10"
            >
              {/* Card header */}
              <div className="mb-7">
                <p className="font-mono text-[9px] text-sand/50 tracking-[0.3em] uppercase mb-3">
                  {locale === "sv" ? "Jobba ihop" : "Work together"}
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-light text-cream tracking-wide leading-snug">
                  {locale === "sv" ? "Låt oss skapa något bra" : "Let's create something great"}
                </h2>
                <div className="h-px w-10 bg-merlot mt-4" />
              </div>
              <CollaborationForm locale={locale} />
            </div>

            {/* Right: cover-flow carousel */}
            <div className="hidden md:block">
              <ImageCarousel items={data.galleryItems ?? buildGalleryItems(data.images, data.videos)} />
            </div>

          </div>
        </div>
      </section>

      {/* ── Video showcase ────────────────────────────────────── */}
      <VideoShowcase locale={locale} />

      {/* ── How I work ───────────────────────────────────────── */}
      <HowIWork locale={locale} />

      {/* ── Follow / parallax ────────────────────────────────── */}
      <FollowSection locale={locale} />

      {/* ── Navigation row ───────────────────────────────────── */}
      <nav aria-label={locale === "sv" ? "Portfolionavigation" : "Portfolio navigation"} className="bg-beige py-14 px-6 border-t border-sand/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <Link
            href={`/${locale}#portfolio`}
            className="group flex items-center gap-3 text-mocha hover:text-merlot transition-colors duration-300 min-h-[44px] focus-visible:outline-2 focus-visible:outline-merlot focus-visible:outline-offset-2 rounded-sm px-1"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
              <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="eyebrow">{locale === "sv" ? "Tillbaka till portfolio" : "Back to portfolio"}</span>
          </Link>
          <div className="flex gap-6" role="list" aria-label={locale === "sv" ? "Andra kategorier" : "Other categories"}>
            {Object.entries(CATS).filter(([k]) => k !== category).slice(0, 2).map(([k, c]) => (
              <div key={k} role="listitem">
                <Link
                  href={`/${locale}/portfolio/${k}`}
                  className="group flex items-center gap-2 min-h-[44px] hover:opacity-60 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-merlot focus-visible:outline-offset-2 rounded-sm px-1"
                >
                  <span className="eyebrow text-mocha">{locale === "sv" ? c.sv : c.en}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="text-mocha transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M2 7H12M12 7L7 2M12 7L7 12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
