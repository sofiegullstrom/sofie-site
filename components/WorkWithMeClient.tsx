"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useRef, useState, useEffect, FormEvent } from "react";

interface WorkWithMeClientProps {
  locale: string;
}

// ── Light cream background ────────────────────────────────────────────
const PAGE_BG_STYLE: React.CSSProperties = {
  background: "#FAF8F4",
};

// ── Testimonials data ─────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "Working with Sofie is seamless. She consistently delivers on time and produces high-quality content that meets our expectations every time.",
    brand: "JFR",
  },
  {
    quote: "Sofie is highly professional and incredibly easy to work with. We especially value her creativity — it adds a unique edge to every piece of content she creates.",
    brand: "Twistshake",
  },
  {
    quote: "Sofie is a joy to collaborate with. It's clear she puts real thought and effort into her work, consistently delivering relevant, high-quality content.",
    brand: "Lekmer",
  },
  {
    quote: "Working with Sofie feels like a long-term partnership rather than a one-off collaboration.",
    brand: "NAKD",
  },
];

// ── Content ───────────────────────────────────────────────────────────
const CONTENT = {
  sv: {
    eyebrow: "Samarbete",
    heading: "Jobba med mig",
    testimonials_label: "Vad varumärken säger",
    form: {
      name: "Namn",
      company: "Företag / Varumärke",
      email: "E-post",
      type: "Typ av samarbete",
      typeOptions: ["Välj...", "Produktfoto & Video", "Influencer-samarbete", "Kreativ kampanj", "Övrigt"],
      message: "Meddelande",
      send: "SEND",
      sending: "Skickar…",
      error: "Något gick fel. Försök igen.",
    },
    success: {
      heading: "Tack!",
      sub: "Jag hör av mig snart.",
      social: "Följ mig på sociala medier",
    },
    footer: {
      rights: "© 2025 Sofie Gullström. Alla rättigheter förbehållna.",
      nav: ["Start", "Portfolio", "Om mig"],
    },
  },
  en: {
    eyebrow: "Collaboration",
    heading: "Let's work together",
    testimonials_label: "What brands say",
    form: {
      name: "Name",
      company: "Company / Brand",
      email: "Email",
      type: "Type of collaboration",
      typeOptions: ["Select…", "Product Photo & Video", "Influencer Collaboration", "Creative Campaign", "Something else"],
      message: "Message",
      send: "SEND",
      sending: "Sending…",
      error: "Something went wrong. Please try again.",
    },
    success: {
      heading: "Thank you!",
      sub: "I'll be in touch soon.",
      social: "Follow me on social media",
    },
    footer: {
      rights: "© 2025 Sofie Gullström. All rights reserved.",
      nav: ["Home", "Portfolio", "About"],
    },
  },
};

// ── Form field ────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="font-mono text-[10px] tracking-widest uppercase font-medium"
        style={{ color: "var(--color-merlot)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-transparent border-b py-2.5 font-sans text-sm text-dark placeholder-mocha/20 focus:outline-none transition-colors duration-200";

// ── Social icons ──────────────────────────────────────────────────────
function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/>
    </svg>
  );
}

// ── Rotating testimonials (one at a time, slides up) ─────────────────
function TestimonialRotator({ label }: { label: string }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
        setAnimating(false);
      }, 500); // half of transition
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const t = TESTIMONIALS[current];

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Label */}
      <p
        className="font-mono text-[10px] tracking-widest uppercase mb-10"
        style={{ color: "var(--color-merlot)" }}
      >
        {label}
      </p>

      {/* Quote block */}
      <div
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(-20px)" : "translateY(0)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {/* Large decorative quote */}
        <span
          className="font-serif block leading-none mb-6"
          style={{
            fontSize: "clamp(60px, 8vw, 100px)",
            color: "rgba(44,26,14,0.07)",
            lineHeight: 0.8,
          }}
        >
          "
        </span>

        <p
          className="font-serif font-light leading-relaxed mb-10"
          style={{
            fontSize: "clamp(18px, 2vw, 26px)",
            color: "rgba(44,26,14,0.85)",
          }}
        >
          {t.quote}
        </p>

        <div className="flex items-center gap-4">
          <div
            className="h-px w-8"
            style={{ background: "var(--color-merlot)" }}
          />
          <span
            className="font-mono text-[11px] tracking-[0.25em] uppercase"
            style={{ color: "rgba(44,26,14,0.45)" }}
          >
            {t.brand}
          </span>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex items-center gap-2 mt-12">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setAnimating(true); setTimeout(() => { setCurrent(i); setAnimating(false); }, 500); }}
            className="transition-all duration-300"
            style={{
              width: i === current ? "24px" : "6px",
              height: "2px",
              background: i === current ? "var(--color-merlot)" : "rgba(44,26,14,0.15)",
            }}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}


// ── Main component ────────────────────────────────────────────────────
export default function WorkWithMeClient({ locale }: WorkWithMeClientProps) {
  const isSv = locale === "sv";
  const c = isSv ? CONTENT.sv : CONTENT.en;

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", company: "", email: "", type: "", message: "" });
  const formRef = useRef<HTMLDivElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setForm({ name: "", company: "", email: "", type: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={PAGE_BG_STYLE}>
      {/* ── Navbar ── */}
      <Navigation locale={locale} />

      <main className="flex-1 pt-24 pb-0">
        {/* ── Hero text ── */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-16 md:pb-20">
          <p
            className="font-mono text-[10px] tracking-widest uppercase mb-5"
            style={{ color: "var(--color-merlot)" }}
          >
            {c.eyebrow}
          </p>
          <h1
            className="font-serif font-light tracking-wide"
            style={{
              fontSize: "clamp(44px, 7vw, 96px)",
              color: "var(--color-dark)",
              lineHeight: 1.05,
            }}
          >
            {c.heading}
          </h1>
        </div>

        {/* ── Two-column: testimonials left + form right ── */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch min-h-[520px]">

            {/* LEFT — testimonials */}
            <div className="lg:pr-16 py-12 flex flex-col">
              <TestimonialRotator label={c.testimonials_label} />
            </div>

            {/* RIGHT — form panel: slightly lifted with shadow to separate from left column */}
            <div
              ref={formRef}
              className="p-10 md:p-12 flex flex-col border border-sand/20"
              style={{ background: "#FFFFFF" }}
            >
              {status === "success" ? (
                /* Success card */
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 py-8">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "var(--color-merlot)" }}
                  >
                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                      <path d="M1 7L7 13L17 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-serif text-3xl font-light text-dark mb-2">{c.success.heading}</h2>
                    <p className="font-sans text-base text-mocha/60">{c.success.sub}</p>
                  </div>
                  <div className="border-t border-sand/30 w-full pt-8 flex flex-col items-center gap-5">
                    <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--color-merlot)" }}>
                      {c.success.social}
                    </p>
                    <div className="flex items-center gap-6">
                      <a href="https://www.instagram.com/sofiigullstrom" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans text-sm transition-opacity duration-200 hover:opacity-70" style={{ color: "var(--color-merlot)" }}>
                        <InstagramIcon /><span>Instagram</span>
                      </a>
                      <a href="https://www.tiktok.com/@sofiigullstrom" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans text-sm transition-opacity duration-200 hover:opacity-70" style={{ color: "var(--color-merlot)" }}>
                        <TikTokIcon /><span>TikTok</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field label={c.form.name}>
                      <input name="name" value={form.name} onChange={handleChange} required className={inputCls} style={{ borderBottomColor: "rgba(120,40,60,0.25)" }} />
                    </Field>
                    <Field label={c.form.company}>
                      <input name="company" value={form.company} onChange={handleChange} className={inputCls} style={{ borderBottomColor: "rgba(120,40,60,0.25)" }} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field label={c.form.email}>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputCls} style={{ borderBottomColor: "rgba(120,40,60,0.25)" }} />
                    </Field>
                    <Field label={c.form.type}>
                      <select name="type" value={form.type} onChange={handleChange} required className={inputCls + " cursor-pointer"} style={{ borderBottomColor: "rgba(120,40,60,0.25)" }}>
                        {c.form.typeOptions.map((opt) => (
                          <option key={opt} value={opt === c.form.typeOptions[0] ? "" : opt}>{opt}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label={c.form.message}>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className={inputCls + " resize-none"} style={{ borderBottomColor: "rgba(120,40,60,0.25)" }} />
                  </Field>

                  {status === "error" && (
                    <p className="font-sans text-sm text-red-500">{c.form.error}</p>
                  )}

                  <div className="mt-auto pt-4">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-cream px-10 py-4 transition-all duration-300"
                      style={{ background: status === "sending" ? "rgba(120,40,60,0.5)" : "var(--color-merlot)" }}
                    >
                      {status === "sending" ? c.form.sending : c.form.send}
                      {status !== "sending" && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <Footer locale={locale} />
    </div>
  );
}
