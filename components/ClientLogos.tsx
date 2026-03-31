"use client";

interface ClientLogosProps {
  locale: string;
}

// ── Display modes ─────────────────────────────────────────────────────
// "text"        → styled text only, no logo image
// "logo"        → logo image only (bigger), no text name
// "both"        → logo image + text name side by side
// "sfbio"       → custom inline SVG recreation of SF BIO logo
// "hemmakväll"  → multicolour letter-by-letter recreation
type Mode = "text" | "logo" | "both" | "sfbio" | "hemmakväll";

interface Brand {
  name: string;
  domain: string | null;
  mode: Mode;
}

const BRANDS: Brand[] = [
  { name: "LANCÔME",           domain: "lancome.com",          mode: "text" },
  { name: "L'ORÉAL",           domain: "loreal.com",           mode: "text" },
  { name: "HelloFresh",        domain: "hellofresh.com",       mode: "both" },
  { name: "HEMTEX",            domain: "hemtex.se",            mode: "both" },
  { name: "Polarn O. Pyret",   domain: "polarnopyret.se",      mode: "logo" },
  { name: "NAKD",              domain: "na-kd.com",            mode: "text" },
  { name: "Arla",              domain: "arla.com",             mode: "logo" },
  { name: "CDON",              domain: "cdon.com",             mode: "logo" },
  { name: "Akademibokhandeln", domain: "akademibokhandeln.se", mode: "both" },
  { name: "Epson",             domain: "epson.com",            mode: "both" },
  { name: "Ford",              domain: "ford.com",             mode: "logo" },
  { name: "SF BIO",            domain: "sf.se",                mode: "sfbio" },
  { name: "Nestlé",            domain: "nestle.com",           mode: "text" },
  { name: "SodaStream",        domain: "sodastream.com",       mode: "text" },
  { name: "SEPHORA",           domain: "sephora.com",          mode: "both" },
  { name: "Pandora",           domain: "pandora.net",          mode: "both" },
  { name: "Vaseline",          domain: "vaseline.com",         mode: "logo" },
  { name: "VILA",              domain: "vila.com",             mode: "both" },
  { name: "Vero Moda",         domain: "veromoda.com",         mode: "both" },
  { name: "SCANDIC",           domain: "scandichotels.com",    mode: "text" },
  { name: "Wolt",              domain: "wolt.com",             mode: "both" },
  { name: "Anyfin",            domain: "anyfin.com",           mode: "both" },
  { name: "Jollyroom",         domain: "jollyroom.se",         mode: "both" },
  { name: "Herobility",        domain: "herobility.se",        mode: "both" },
  { name: "Däckia",            domain: "dackia.se",            mode: "both" },
  { name: "HEMMAKVÄLL",        domain: null,                   mode: "hemmakväll" },
  { name: "Lensway",           domain: "lensway.se",           mode: "both" },
  { name: "ACO",               domain: "aco.se",               mode: "logo" },
  { name: "Jotex",             domain: "jotex.se",             mode: "logo" },
  { name: "NORMAL",            domain: null,                   mode: "text" },
  { name: "Protein.se",        domain: "protein.se",           mode: "both" },
  { name: "Nextstory",         domain: null,                   mode: "text" },
];

// ── Text name style (used for text-only and the name part of "both") ──
const nameStyle: React.CSSProperties = {
  fontFamily:    "sans-serif",
  fontSize:      "15px",
  fontWeight:    500,
  color:         "rgba(44,26,14,0.65)",
  letterSpacing: "0.07em",
  whiteSpace:    "nowrap",
};

// ── Logo image helper ─────────────────────────────────────────────────
function LogoImg({ name, domain, size = 34 }: { name: string; domain: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://img.logo.dev/${domain}?format=png&size=128`}
      alt={name}
      title={name}
      style={{
        height:     `${size}px`,
        width:      "auto",
        maxWidth:   `${size * 2.2}px`,
        objectFit:  "contain",
        opacity:    0.65,
        flexShrink: 0,
      }}
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        if (!img.dataset.fallback) {
          img.dataset.fallback = "1";
          img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
          img.style.height = `${Math.round(size * 0.75)}px`;
          img.style.width  = `${Math.round(size * 0.75)}px`;
        } else {
          img.style.display = "none";
        }
      }}
    />
  );
}

// ── SF BIO inline SVG logo ────────────────────────────────────────────
function SFBioLogo() {
  return (
    <svg
      width="42" height="42"
      viewBox="0 0 90 90"
      aria-label="SF BIO"
      style={{ flexShrink: 0, opacity: 0.9 }}
    >
      <circle cx="45" cy="45" r="44" fill="#C41E3A" />
      <circle cx="45" cy="45" r="37" fill="none" stroke="white" strokeWidth="1.5" />
      {/* Decorative outer ring dots */}
      <text
        x="45" y="52"
        textAnchor="middle"
        fill="white"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="28"
        fontWeight="bold"
        fontStyle="italic"
      >
        SF
      </text>
      <text
        x="45" y="70"
        textAnchor="middle"
        fill="white"
        fontFamily="Arial, sans-serif"
        fontSize="11"
        fontWeight="bold"
        letterSpacing="3"
      >
        BIO
      </text>
    </svg>
  );
}

// ── HEMMAKVÄLL multicolour text ───────────────────────────────────────
const HK_CHARS = [
  { ch: "H", color: "#F97316" }, // orange
  { ch: "E", color: "#FAFAFA" }, // white
  { ch: "M", color: "#EAB308" }, // yellow
  { ch: "M", color: "#DC2626" }, // red
  { ch: "A", color: "#EC4899" }, // pink
  { ch: "K", color: "#06B6D4" }, // cyan
  { ch: "V", color: "#F59E0B" }, // amber
  { ch: "Ä", color: "#22C55E" }, // green
  { ch: "L", color: "#60A5FA" }, // blue
  { ch: "L", color: "#14B8A6" }, // teal
];

function HemmakväLLText() {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", lineHeight: 1 }}>
      {HK_CHARS.map(({ ch, color }, i) => (
        <span
          key={i}
          style={{
            fontFamily:  "Arial Black, sans-serif",
            fontSize:    "16px",
            fontWeight:  900,
            color,
            letterSpacing: "0.01em",
          }}
        >
          {ch}
        </span>
      ))}
      <span style={{ fontFamily: "Arial, sans-serif", fontSize: "9px", color: "rgba(44,26,14,0.5)", marginLeft: "1px", verticalAlign: "super" }}>®</span>
    </span>
  );
}

// ── Single brand item ─────────────────────────────────────────────────
function BrandItem({ brand }: { brand: Brand }) {
  const { name, domain, mode } = brand;

  if (mode === "sfbio") {
    return <SFBioLogo />;
  }

  if (mode === "hemmakväll") {
    return <HemmakväLLText />;
  }

  if (mode === "text") {
    return <span style={nameStyle}>{name}</span>;
  }

  if (mode === "logo") {
    // Logo only — bigger (44px) since no text to accompany it
    return domain ? <LogoImg name={name} domain={domain} size={44} /> : <span style={nameStyle}>{name}</span>;
  }

  // "both" — logo + text name
  return (
    <span className="inline-flex items-center gap-2.5">
      {domain && <LogoImg name={name} domain={domain} size={34} />}
      <span style={nameStyle}>{name}</span>
    </span>
  );
}

// ── Section ───────────────────────────────────────────────────────────
export default function ClientLogos({ locale }: ClientLogosProps) {
  const tripled = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <section className="py-10 border-y border-sand/30 overflow-hidden bg-cream">
      <p className="eyebrow text-center mb-8 px-6">
        {locale === "sv"
          ? "200+ varumärken i min kundlista"
          : "200+ brands in my client list"}
      </p>

      <div className="relative overflow-hidden">
        <div className="logos-track-ltr flex items-center gap-0 whitespace-nowrap w-max">
          {tripled.map((brand, i) => (
            <span key={i} className="inline-flex items-center flex-shrink-0">
              <span className="mx-8">
                <BrandItem brand={brand} />
              </span>
              {/* Dot separator */}
              <span
                style={{
                  color:      "rgba(44,26,14,0.22)",
                  fontSize:   "20px",
                  lineHeight: 1,
                  userSelect: "none",
                }}
                aria-hidden="true"
              >
                ·
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
