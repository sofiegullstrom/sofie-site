"use client";

interface DeviceMockupsProps {
  locale: string;
}

// Desktop grid images — 6 slots matching the 3×3 editorial grid
const DESKTOP_IMAGES = [
  "/images/beauty/IMG_1124.jpg",
  "/images/beauty/IMG_2747.jpg",
  "/images/hem/IMG_5449.JPG",
  "/images/halsa/8DD24053-D489-47D3-97A5-816E4B7EDC01.JPG",
  "/images/halsa/Facetune_21-03-2026-10-44-15.jpg",
  "/images/device-desktop-img0994.jpg",
];

export default function DeviceMockups({ locale }: DeviceMockupsProps) {
  const sv = locale === "sv";

  return (
    // Rendered inside AboutSection — no section/padding/background needed
    <div className="pt-16 md:pt-24 overflow-hidden">
      <div>

        {/* Eyebrow — kept as section label, no heading or paragraph */}
        <p className="eyebrow mb-14 md:mb-20">
          {sv ? "Innehåll för alla format" : "Content for every format"}
        </p>

        {/*
          Device grid: Phone (smallest) | TV (largest, center) | Desktop (medium)
          Ordered visually by prominence: TV dominates as the center hero device.
          Real-world scale: TV > Desktop > Phone
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-end">

          {/* ── LEFT: iPhone — smallest ── */}
          <div className="flex flex-col items-center gap-5">
            <div className="relative mx-auto" style={{ width: "120px" }}>
              <div className="relative bg-dark rounded-[2rem] p-[7px] shadow-xl shadow-dark/20">
                <div className="bg-dark rounded-[1.6rem] overflow-hidden" style={{ aspectRatio: "9/19" }}>
                  {/* Notch */}
                  <div className="h-5 bg-dark rounded-t-[1.6rem] flex items-center justify-center flex-shrink-0 relative z-10">
                    <div className="w-12 h-2.5 bg-dark/80 rounded-full" />
                  </div>
                  {/* Video */}
                  <div className="overflow-hidden -mt-5 h-full">
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video
                      src="/images/device-mobile.mp4"
                      autoPlay loop muted playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Home bar */}
                  <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                    <div className="w-10 h-0.5 bg-white/25 rounded-full" />
                  </div>
                </div>
                <div className="absolute right-0 top-16 w-0.5 h-6 bg-dark/50 rounded-r-full -mr-px" />
                <div className="absolute left-0 top-12 w-0.5 h-5 bg-dark/50 rounded-l-full -ml-px" />
                <div className="absolute left-0 top-20 w-0.5 h-8 bg-dark/50 rounded-l-full -ml-px" />
                <div className="absolute left-0 top-30 w-0.5 h-8 bg-dark/50 rounded-l-full -ml-px" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs tracking-ultra-wide uppercase text-mocha font-sans mb-1">
                Instagram &amp; TikTok
              </p>
              <p className="font-serif text-lg text-dark">
                {sv ? "Vertikal video & UGC" : "Vertical video & UGC"}
              </p>
            </div>
          </div>

          {/* ── CENTER: TV — largest, most prominent ── */}
          <div className="flex flex-col items-center gap-5 md:-mt-16 order-first md:order-none">
            <div className="relative w-full mx-auto" style={{ maxWidth: "420px" }}>
              <div className="bg-dark rounded-2xl p-2.5 shadow-2xl shadow-dark/30">
                <div className="bg-dark rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video
                    src="/images/device-tv.mp4"
                    autoPlay loop muted playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* TV stand */}
              <div className="flex justify-center mt-1">
                <div
                  className="bg-dark/70 rounded-b-lg"
                  style={{ width: "52px", height: "18px", clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)" }}
                />
              </div>
              <div className="flex justify-center">
                <div className="w-24 h-1 bg-dark/40 rounded-full" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs tracking-ultra-wide uppercase text-mocha font-sans mb-1">
                {sv ? "TV & reklamfilm" : "TV & commercials"}
              </p>
              <p className="font-serif text-2xl text-dark">
                {sv ? "Reklamfilm & produktion" : "TV commercials & production"}
              </p>
            </div>
          </div>

          {/* ── RIGHT: Desktop — medium ── */}
          <div className="flex flex-col items-center gap-5">
            <div className="relative w-full mx-auto" style={{ maxWidth: "270px" }}>
              <div className="bg-dark rounded-t-xl p-1.5 shadow-xl shadow-dark/20">
                <div className="bg-dark rounded-t-lg overflow-hidden" style={{ aspectRatio: "16/10" }}>
                  {/* Browser bar */}
                  <div className="h-5 bg-dark/80 flex items-center gap-1.5 px-3 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-dark/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-dark/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-dark/50" />
                    <div className="flex-1 mx-2 h-2.5 bg-dark/25 rounded-full" />
                  </div>
                  {/* Editorial photo grid */}
                  <div className="p-1 grid grid-cols-3 gap-0.5 h-full pb-3">
                    {DESKTOP_IMAGES.map((src, i) => (
                      <div
                        key={i}
                        className={`overflow-hidden ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt=""
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Stand */}
              <div className="flex justify-center">
                <div className="w-12 h-2.5 bg-dark rounded-b-sm" />
              </div>
              <div className="flex justify-center">
                <div className="w-20 h-0.5 bg-dark/50 rounded-full" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs tracking-ultra-wide uppercase text-mocha font-sans mb-1">
                {sv ? "Webb & annonsering" : "Web & advertising"}
              </p>
              <p className="font-serif text-xl text-dark">
                {sv ? "Foto & kampanjmaterial" : "Photography & campaigns"}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
