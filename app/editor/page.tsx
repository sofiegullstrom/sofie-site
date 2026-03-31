"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Photo {
  src: string;
  tx: number;   // vw offset from center
  ty: number;   // vh offset from center
  rot: number;  // degrees
  from: number; // scroll trigger (0-1)
  w: number;    // px width
  h: number;    // px height
}

type DragState = {
  photoIdx: number;
  startMouseX: number;
  startMouseY: number;
  startTx: number;
  startTy: number;
} | null;

type ResizeState = {
  photoIdx: number;
  startMouseX: number;
  startMouseY: number;
  startW: number;
  startH: number;
} | null;

export default function EditorPage() {
  const [photos, setPhotos]   = useState<Photo[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [loaded, setLoaded]   = useState(false);
  const canvasRef  = useRef<HTMLDivElement>(null);
  const dragRef    = useRef<DragState>(null);
  const resizeRef  = useRef<ResizeState>(null);

  // ── Load config ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/photo-config")
      .then((r) => r.json())
      .then((data) => { setPhotos(data); setLoaded(true); });
  }, []);

  // ── Canvas size helper ──────────────────────────────────────────────────
  const canvasSize = useCallback(() => {
    const c = canvasRef.current;
    return c ? { w: c.clientWidth, h: c.clientHeight } : { w: 900, h: 600 };
  }, []);

  // ── Global mouse handlers ───────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const { w, h } = canvasSize();

      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startMouseX;
        const dy = e.clientY - dragRef.current.startMouseY;
        const dTx = (dx / w) * 100;
        const dTy = (dy / h) * 100;
        const idx = dragRef.current.photoIdx;
        setPhotos((prev) =>
          prev.map((p, i) =>
            i === idx
              ? { ...p, tx: dragRef.current!.startTx + dTx, ty: dragRef.current!.startTy + dTy }
              : p
          )
        );
      }

      if (resizeRef.current) {
        const dx = e.clientX - resizeRef.current.startMouseX;
        const dy = e.clientY - resizeRef.current.startMouseY;
        const idx = resizeRef.current.photoIdx;
        setPhotos((prev) =>
          prev.map((p, i) =>
            i === idx
              ? {
                  ...p,
                  w: Math.max(60, resizeRef.current!.startW + dx),
                  h: Math.max(60, resizeRef.current!.startH + dy),
                }
              : p
          )
        );
      }
    };

    const onUp = () => {
      dragRef.current   = null;
      resizeRef.current = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [canvasSize]);

  // ── Save ────────────────────────────────────────────────────────────────
  const save = async () => {
    setSaving(true);
    await fetch("/api/photo-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(photos),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // ── Z-order helpers ─────────────────────────────────────────────────────
  const moveForward = (idx: number) => {
    if (idx >= photos.length - 1) return;
    setPhotos((prev) => {
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
    setSelected(idx + 1);
  };

  const moveBack = (idx: number) => {
    if (idx <= 0) return;
    setPhotos((prev) => {
      const next = [...prev];
      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
      return next;
    });
    setSelected(idx - 1);
  };

  const sendToFront = (idx: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.push(item);
      return next;
    });
    setSelected(photos.length - 1);
  };

  const sendToBack = (idx: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.unshift(item);
      return next;
    });
    setSelected(0);
  };

  // ── Update single property ───────────────────────────────────────────────
  const setProp = (idx: number, key: keyof Photo, value: number) => {
    setPhotos((prev) => prev.map((p, i) => (i === idx ? { ...p, [key]: value } : p)));
  };

  // ── Render ──────────────────────────────────────────────────────────────
  if (!loaded) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#111", color: "#fff", fontFamily: "sans-serif" }}>
        Laddar foton…
      </div>
    );
  }

  const sel = selected !== null ? photos[selected] : null;
  const { w: cw, h: ch } = canvasSize();

  return (
    <div style={{ display: "flex", height: "100vh", background: "#111", color: "#fff", fontFamily: "'Inter', sans-serif", overflow: "hidden", userSelect: "none" }}>

      {/* ── Canvas ────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <div style={{ height: 52, background: "#1a1a1a", borderBottom: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#aaa", letterSpacing: 2, textTransform: "uppercase" }}>Kollage-editor</span>
            <span style={{ fontSize: 11, color: "#555" }}>— {photos.length} foton</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "#555" }}>Klicka för att välja · Dra för att flytta · Handtag för storlek</span>
            <button
              onClick={save}
              style={{
                padding: "8px 24px",
                background: saved ? "#2d6a4f" : "#722F37",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontSize: 13,
                cursor: "pointer",
                letterSpacing: 1,
                fontWeight: 600,
                transition: "background 0.3s",
              }}
            >
              {saving ? "Sparar…" : saved ? "✓  Sparat!" : "Spara"}
            </button>
          </div>
        </div>

        {/* Canvas area */}
        <div
          ref={canvasRef}
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
          style={{
            flex: 1,
            position: "relative",
            background: "#000",
            overflow: "hidden",
            backgroundImage: "radial-gradient(circle, #2a2a2a 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {/* Center crosshair */}
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

          {photos.map((photo, i) => {
            const left = cw / 2 + (photo.tx / 100) * cw - photo.w / 2;
            const top  = ch / 2 + (photo.ty / 100) * ch - photo.h / 2;
            const isSelected = selected === i;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left,
                  top,
                  width:     photo.w,
                  height:    photo.h,
                  transform: `rotate(${photo.rot}deg)`,
                  zIndex:    i + 1,
                  cursor:    "grab",
                  boxShadow: isSelected
                    ? "0 0 0 2px #60a5fa, 0 8px 32px rgba(0,0,0,0.8)"
                    : "0 4px 20px rgba(0,0,0,0.6)",
                  outline: "none",
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setSelected(i);
                  dragRef.current = {
                    photoIdx:     i,
                    startMouseX:  e.clientX,
                    startMouseY:  e.clientY,
                    startTx:      photo.tx,
                    startTy:      photo.ty,
                  };
                }}
              >
                {/* Photo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
                />

                {/* Z-index badge */}
                <div style={{
                  position: "absolute",
                  top: 4,
                  left: 4,
                  background: isSelected ? "#60a5fa" : "rgba(0,0,0,0.7)",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 5px",
                  borderRadius: 3,
                  letterSpacing: 0.5,
                }}>
                  {i + 1}
                </div>

                {/* Resize handle (bottom-right) */}
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -1,
                      right: -1,
                      width: 16,
                      height: 16,
                      background: "#60a5fa",
                      cursor: "se-resize",
                      borderRadius: "0 0 2px 0",
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      resizeRef.current = {
                        photoIdx:     i,
                        startMouseX:  e.clientX,
                        startMouseY:  e.clientY,
                        startW:       photo.w,
                        startH:       photo.h,
                      };
                    }}
                  />
                )}

                {/* Rotation label on hover */}
                {isSelected && (
                  <div style={{
                    position: "absolute",
                    bottom: 4,
                    left: 4,
                    background: "rgba(0,0,0,0.7)",
                    color: "#aaa",
                    fontSize: 9,
                    padding: "2px 4px",
                    borderRadius: 2,
                    pointerEvents: "none",
                  }}>
                    {Math.round(photo.rot)}° · {Math.round(photo.w)}×{Math.round(photo.h)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right sidebar ─────────────────────────────────────────────── */}
      <div style={{ width: 280, background: "#1a1a1a", borderLeft: "1px solid #2a2a2a", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Selected photo properties */}
        {sel !== null && selected !== null ? (
          <div style={{ padding: 16, borderBottom: "1px solid #2a2a2a", flexShrink: 0 }}>
            {/* Thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sel.src}
              alt=""
              style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 4, marginBottom: 12, display: "block" }}
            />
            <div style={{ fontSize: 11, color: "#777", marginBottom: 12, textAlign: "center" }}>
              {sel.src.split("/").pop()} — position {selected + 1} av {photos.length}
            </div>

            {/* Z-order buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4, marginBottom: 14 }}>
              {[
                { label: "⬆ Längst fram", fn: () => sendToFront(selected) },
                { label: "↑ Ett steg fram", fn: () => moveForward(selected) },
                { label: "↓ Ett steg bak", fn: () => moveBack(selected) },
                { label: "⬇ Längst bak",  fn: () => sendToBack(selected) },
              ].map(({ label, fn }) => (
                <button
                  key={label}
                  onClick={fn}
                  style={{
                    background: "#2a2a2a",
                    border: "1px solid #3a3a3a",
                    color: "#ccc",
                    fontSize: 9,
                    padding: "6px 4px",
                    borderRadius: 4,
                    cursor: "pointer",
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Sliders */}
            {(
              [
                ["tx",  "Position horisontellt (vw)", -52, 52, 0.5],
                ["ty",  "Position vertikalt (vh)",    -40, 40, 0.5],
                ["rot", "Rotation (grader)",           -25, 25, 0.5],
                ["w",   "Bredd (px)",                   60, 380, 2],
                ["h",   "Höjd (px)",                    60, 430, 2],
              ] as [keyof Photo, string, number, number, number][]
            ).map(([key, label, min, max, step]) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 3 }}>
                  <span>{label}</span>
                  <span style={{ color: "#ccc", fontVariantNumeric: "tabular-nums" }}>
                    {Math.round((sel[key] as number) * 10) / 10}
                  </span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={sel[key] as number}
                  onChange={(e) => setProp(selected, key, parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "#722F37" }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: 20, color: "#555", fontSize: 12, textAlign: "center", borderBottom: "1px solid #2a2a2a" }}>
            Klicka på ett foto i canvasen för att redigera det
          </div>
        )}

        {/* Photo list (z-order overview) */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          <div style={{ fontSize: 10, color: "#555", padding: "4px 16px 8px", letterSpacing: 1, textTransform: "uppercase" }}>
            Z-ordning (1 = bakre, {photos.length} = framre)
          </div>
          {[...photos].map((p, i) => (
            <div
              key={i}
              onClick={() => setSelected(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 12px",
                cursor: "pointer",
                background: selected === i ? "#2d2d2d" : "transparent",
                borderLeft: selected === i ? "2px solid #722F37" : "2px solid transparent",
              }}
            >
              <span style={{ fontSize: 10, color: "#555", minWidth: 16, textAlign: "right" }}>{i + 1}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 3, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: "#aaa", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.src.split("/").pop()}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); moveForward(i); }}
                  style={{ background: "#333", border: "none", color: "#888", fontSize: 9, padding: "2px 4px", borderRadius: 2, cursor: "pointer", lineHeight: 1 }}
                  title="Flytta framåt"
                >▲</button>
                <button
                  onClick={(e) => { e.stopPropagation(); moveBack(i); }}
                  style={{ background: "#333", border: "none", color: "#888", fontSize: 9, padding: "2px 4px", borderRadius: 2, cursor: "pointer", lineHeight: 1 }}
                  title="Flytta bakåt"
                >▼</button>
              </div>
            </div>
          ))}
        </div>

        {/* Save reminder */}
        <div style={{ padding: 12, borderTop: "1px solid #2a2a2a", background: "#111" }}>
          <button
            onClick={save}
            style={{
              width: "100%",
              padding: "10px",
              background: saved ? "#2d6a4f" : "#722F37",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 600,
              letterSpacing: 1,
              transition: "background 0.3s",
            }}
          >
            {saving ? "Sparar…" : saved ? "✓  Sparat!" : "💾  Spara kollaget"}
          </button>
          {saved && (
            <div style={{ textAlign: "center", fontSize: 10, color: "#4ade80", marginTop: 6 }}>
              Ladda om localhost:3000 för att se ändringarna
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
