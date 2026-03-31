"use client";

import { useEffect, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SiteContent {
  about: {
    eyebrow_sv: string;
    eyebrow_en: string;
    heading_sv: string;
    heading_en: string;
    paragraphs_sv: string[];
    paragraphs_en: string[];
  };
  hero: {
    cta_sv: string;
    cta_en: string;
    tagline_sv: string;
    tagline_en: string;
  };
}

const EMPTY_CONTENT: SiteContent = {
  about: {
    eyebrow_sv: "",
    eyebrow_en: "",
    heading_sv: "",
    heading_en: "",
    paragraphs_sv: ["", "", ""],
    paragraphs_en: ["", "", ""],
  },
  hero: {
    cta_sv: "",
    cta_en: "",
    tagline_sv: "",
    tagline_en: "",
  },
};

type SectionKey = "about" | "hero";
type LangKey = "sv" | "en";

// ─── Small components ─────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, color: "#888", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6, fontFamily: "sans-serif" }}>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        background: "#242424",
        border: "1px solid #333",
        borderRadius: 6,
        color: "#f0ece6",
        fontSize: 14,
        padding: "10px 12px",
        fontFamily: "sans-serif",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#722F37")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
    />
  );
}

function TextArea({ value, onChange, rows = 4, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      style={{
        width: "100%",
        background: "#242424",
        border: "1px solid #333",
        borderRadius: 6,
        color: "#f0ece6",
        fontSize: 14,
        padding: "10px 12px",
        fontFamily: "sans-serif",
        outline: "none",
        resize: "vertical",
        lineHeight: 1.6,
        boxSizing: "border-box",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#722F37")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
    />
  );
}

// ─── Main editor ──────────────────────────────────────────────────────────────

export default function ContentEditorPage() {
  const [content, setContent] = useState<SiteContent>(EMPTY_CONTENT);
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>("about");
  const [activeLang, setActiveLang] = useState<LangKey>("sv");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Load
  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data: SiteContent) => {
        setContent(data);
        setLoaded(true);
      })
      .catch(() => {
        setContent(EMPTY_CONTENT);
        setLoaded(true);
      });
  }, []);

  // Generic updater
  const update = useCallback(<S extends SectionKey>(
    section: S,
    key: keyof SiteContent[S],
    value: SiteContent[S][keyof SiteContent[S]]
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
    setDirty(true);
  }, []);

  // Paragraph updater
  const updatePara = useCallback((lang: LangKey, index: number, value: string) => {
    setContent((prev) => {
      const key = lang === "sv" ? "paragraphs_sv" : "paragraphs_en";
      const paras = [...prev.about[key]];
      paras[index] = value;
      return { ...prev, about: { ...prev.about, [key]: paras } };
    });
    setDirty(true);
  }, []);

  // Add / remove paragraph
  const addPara = useCallback((lang: LangKey) => {
    setContent((prev) => {
      const key = lang === "sv" ? "paragraphs_sv" : "paragraphs_en";
      return { ...prev, about: { ...prev.about, [key]: [...prev.about[key], ""] } };
    });
    setDirty(true);
  }, []);

  const removePara = useCallback((lang: LangKey, index: number) => {
    setContent((prev) => {
      const key = lang === "sv" ? "paragraphs_sv" : "paragraphs_en";
      const paras = prev.about[key].filter((_, i) => i !== index);
      return { ...prev, about: { ...prev.about, [key]: paras } };
    });
    setDirty(true);
  }, []);

  // Save
  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Kunde inte spara. Kontrollera att servern körs.");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#111", color: "#fff", fontFamily: "sans-serif", fontSize: 14 }}>
        Laddar innehåll…
      </div>
    );
  }

  const SECTIONS: { key: SectionKey; label: string; icon: string }[] = [
    { key: "about", label: "Om mig", icon: "👤" },
    { key: "hero",  label: "Hero",   icon: "🎬" },
  ];

  const LANGS: { key: LangKey; label: string; flag: string }[] = [
    { key: "sv", label: "Svenska", flag: "🇸🇪" },
    { key: "en", label: "English", flag: "🇬🇧" },
  ];

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#111",
      color: "#f0ece6",
      fontFamily: "'Inter', system-ui, sans-serif",
      overflow: "hidden",
    }}>

      {/* ── Left sidebar ──────────────────────────────────────────────────── */}
      <div style={{
        width: 220,
        background: "#161616",
        borderRight: "1px solid #2a2a2a",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>

        {/* Logo/title */}
        <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid #2a2a2a" }}>
          <div style={{ fontSize: 11, color: "#722F37", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>
            SG Studio
          </div>
          <div style={{ fontSize: 13, color: "#888", fontWeight: 400 }}>
            Texteditor
          </div>
        </div>

        {/* Section list */}
        <div style={{ padding: "10px 8px", flex: 1 }}>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: 1.5, textTransform: "uppercase", padding: "6px 10px 10px", fontWeight: 600 }}>
            Sektioner
          </div>
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 12px",
                background: activeSection === s.key ? "#1e1e1e" : "transparent",
                border: "none",
                borderLeft: activeSection === s.key ? "2px solid #722F37" : "2px solid transparent",
                borderRadius: "0 6px 6px 0",
                color: activeSection === s.key ? "#f0ece6" : "#888",
                fontSize: 13,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 15 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Bottom: link to photo editor */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid #2a2a2a" }}>
          <a
            href="/editor"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              color: "#666",
              textDecoration: "none",
              fontSize: 12,
              borderRadius: 6,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
          >
            <span>🖼</span> Kollage-editor
          </a>
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              color: "#666",
              textDecoration: "none",
              fontSize: 12,
              borderRadius: 6,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
          >
            <span>↗</span> Se webbplatsen
          </a>
        </div>
      </div>

      {/* ── Main area ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{
          height: 56,
          background: "#161616",
          borderBottom: "1px solid #2a2a2a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#f0ece6" }}>
              {SECTIONS.find((s) => s.key === activeSection)?.label}
            </span>
            {dirty && (
              <span style={{ fontSize: 11, color: "#666", background: "#222", padding: "3px 8px", borderRadius: 20 }}>
                Osparade ändringar
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Language tabs */}
            <div style={{ display: "flex", background: "#1e1e1e", borderRadius: 8, padding: 3, gap: 2 }}>
              {LANGS.map((l) => (
                <button
                  key={l.key}
                  onClick={() => setActiveLang(l.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    background: activeLang === l.key ? "#2a2a2a" : "transparent",
                    border: "none",
                    borderRadius: 6,
                    color: activeLang === l.key ? "#f0ece6" : "#666",
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: activeLang === l.key ? 500 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>

            {/* Save button */}
            <button
              onClick={save}
              disabled={saving || !dirty}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 20px",
                background: saved ? "#2d6a4f" : dirty ? "#722F37" : "#2a2a2a",
                color: dirty || saved ? "#fff" : "#555",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: dirty ? "pointer" : "default",
                transition: "all 0.2s",
                letterSpacing: 0.5,
              }}
            >
              {saving ? "Sparar…" : saved ? "✓ Sparat!" : "Spara"}
            </button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>

          {/* ── About section ─────────────────────────────────────────── */}
          {activeSection === "about" && (
            <div style={{ maxWidth: 720 }}>
              <p style={{ fontSize: 12, color: "#555", marginBottom: 28, lineHeight: 1.6 }}>
                Redigera texten som visas i &quot;Om mig&quot;-sektionen på startsidan.
                Välj språk med knapparna uppe till höger.
              </p>

              {/* Eyebrow label */}
              <div style={{ marginBottom: 24 }}>
                <Label>Etikett (liten text ovanför rubriken)</Label>
                <TextInput
                  value={activeLang === "sv" ? content.about.eyebrow_sv : content.about.eyebrow_en}
                  onChange={(v) => update("about", activeLang === "sv" ? "eyebrow_sv" : "eyebrow_en", v)}
                  placeholder={activeLang === "sv" ? "Om mig" : "About me"}
                />
              </div>

              {/* Heading */}
              <div style={{ marginBottom: 24 }}>
                <Label>Rubrik (använd \\n för radbrytning)</Label>
                <TextInput
                  value={activeLang === "sv" ? content.about.heading_sv : content.about.heading_en}
                  onChange={(v) => update("about", activeLang === "sv" ? "heading_sv" : "heading_en", v)}
                  placeholder="Sofie\nGullström"
                />
                <div style={{ fontSize: 11, color: "#555", marginTop: 6, fontFamily: "sans-serif" }}>
                  Tips: skriv <code style={{ background: "#222", padding: "1px 5px", borderRadius: 3 }}>Sofie\nGullström</code> för att få radbrytning
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid #2a2a2a", margin: "28px 0" }} />

              {/* Paragraphs */}
              <div style={{ marginBottom: 8 }}>
                <Label>Brödtext — stycken</Label>
              </div>

              {(activeLang === "sv" ? content.about.paragraphs_sv : content.about.paragraphs_en).map((para, i) => (
                <div key={i} style={{ marginBottom: 20, position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ fontSize: 10, color: "#555", letterSpacing: 1, textTransform: "uppercase", fontFamily: "sans-serif" }}>
                      Stycke {i + 1}{i === 0 ? " — visas större (ingress)" : ""}
                    </div>
                    {(activeLang === "sv" ? content.about.paragraphs_sv : content.about.paragraphs_en).length > 1 && (
                      <button
                        onClick={() => removePara(activeLang, i)}
                        style={{
                          background: "none",
                          border: "1px solid #333",
                          color: "#555",
                          fontSize: 11,
                          padding: "3px 8px",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                        title="Ta bort stycke"
                      >
                        ✕ Ta bort
                      </button>
                    )}
                  </div>
                  <TextArea
                    value={para}
                    onChange={(v) => updatePara(activeLang, i, v)}
                    rows={i === 0 ? 3 : 4}
                    placeholder={`Skriv stycke ${i + 1}…`}
                  />
                </div>
              ))}

              {/* Add paragraph */}
              <button
                onClick={() => addPara(activeLang)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "none",
                  border: "1px dashed #333",
                  color: "#666",
                  fontSize: 13,
                  padding: "10px 16px",
                  borderRadius: 6,
                  cursor: "pointer",
                  width: "100%",
                  justifyContent: "center",
                  marginTop: 4,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#722F37"; e.currentTarget.style.color = "#aaa"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#666"; }}
              >
                + Lägg till stycke
              </button>
            </div>
          )}

          {/* ── Hero section ──────────────────────────────────────────── */}
          {activeSection === "hero" && (
            <div style={{ maxWidth: 720 }}>
              <p style={{ fontSize: 12, color: "#555", marginBottom: 28, lineHeight: 1.6 }}>
                Redigera knapptexter och taggar som visas i hero-sektionen.
              </p>

              <div style={{ marginBottom: 24 }}>
                <Label>CTA-knapp text</Label>
                <TextInput
                  value={activeLang === "sv" ? content.hero.cta_sv : content.hero.cta_en}
                  onChange={(v) => update("hero", activeLang === "sv" ? "cta_sv" : "cta_en", v)}
                  placeholder={activeLang === "sv" ? "Jobba med mig" : "Let's work together"}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <Label>Tagline (liten text längst ner i hero)</Label>
                <TextInput
                  value={activeLang === "sv" ? content.hero.tagline_sv : content.hero.tagline_en}
                  onChange={(v) => update("hero", activeLang === "sv" ? "tagline_sv" : "tagline_en", v)}
                  placeholder={activeLang === "sv" ? "Urval ur portfolio" : "Portfolio highlights"}
                />
              </div>
            </div>
          )}

        </div>

        {/* Bottom save bar (appears when dirty) */}
        {dirty && (
          <div style={{
            background: "#1a1a1a",
            borderTop: "1px solid #2a2a2a",
            padding: "12px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 12, color: "#666" }}>
              Du har osparade ändringar
            </span>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { window.location.reload(); }}
                style={{
                  background: "none",
                  border: "1px solid #333",
                  color: "#666",
                  fontSize: 12,
                  padding: "8px 16px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Ångra allt
              </button>
              <button
                onClick={save}
                disabled={saving}
                style={{
                  background: "#722F37",
                  border: "none",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "8px 24px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                {saving ? "Sparar…" : "💾 Spara ändringar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
