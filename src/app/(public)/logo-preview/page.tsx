"use client";

import { useState } from "react";

// ============================================================
// LOGOMARK VARIANTS (Icon Only)
// ============================================================

// Variant A: Medical Cross + Digital Pulse inside Circle
function LogomarkA({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="markA-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
        <linearGradient id="markA-cross" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>
      </defs>
      {/* Circle */}
      <circle cx="60" cy="60" r="56" fill="url(#markA-bg)" />
      {/* Inner ring */}
      <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      {/* Medical Cross */}
      <rect x="48" y="28" width="24" height="64" rx="6" fill="url(#markA-cross)" />
      <rect x="28" y="48" width="64" height="24" rx="6" fill="url(#markA-cross)" />
      {/* Pulse line across cross */}
      <path
        d="M28 60 L42 60 L47 48 L53 72 L59 44 L65 76 L71 52 L77 60 L92 60"
        fill="none"
        stroke="#2563EB"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Variant B: Stylized "C" with Heartbeat
function LogomarkB({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="markB-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      {/* Rounded square background */}
      <rect x="4" y="4" width="112" height="112" rx="28" fill="url(#markB-bg)" />
      {/* Stylized C */}
      <path
        d="M78 35C71 28 62 24 52 24C32 24 20 40 20 60C20 80 32 96 52 96C62 96 71 92 78 85"
        fill="none"
        stroke="white"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Heartbeat pulse extending from C */}
      <path
        d="M68 60 L78 60 L83 45 L90 75 L97 50 L102 60 L112 60"
        fill="none"
        stroke="#67E8F9"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Small dot accent */}
      <circle cx="68" cy="60" r="3" fill="#67E8F9" />
    </svg>
  );
}

// Variant C: Shield + Cross (Trust & Medical)
function LogomarkC({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="markC-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#0E7490" />
        </linearGradient>
        <linearGradient id="markC-inner" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
      </defs>
      {/* Shield shape */}
      <path
        d="M60 6L108 26V62C108 90 88 114 60 124C32 114 12 90 12 62V26L60 6Z"
        fill="url(#markC-bg)"
      />
      {/* Inner shield */}
      <path
        d="M60 16L98 32V62C98 84 82 104 60 112C38 104 22 84 22 62V32L60 16Z"
        fill="url(#markC-inner)"
      />
      {/* Medical cross */}
      <rect x="50" y="36" width="20" height="52" rx="4" fill="white" />
      <rect x="34" y="52" width="52" height="20" rx="4" fill="white" />
      {/* Heart */}
      <path
        d="M60 78C60 78 48 68 48 61C48 56 51 54 54 54C56 54 58 56 60 58C62 56 64 54 66 54C69 54 72 56 72 61C72 68 60 78 60 78Z"
        fill="#EF4444"
      />
    </svg>
  );
}

// Variant D: Hexagon + "C" + Nodes (Tech/Digital)
function LogomarkD({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="markD-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      {/* Hexagon */}
      <path
        d="M60 4L108 28V76L60 100L12 76V28L60 4Z"
        fill="url(#markD-bg)"
      />
      <path
        d="M60 12L100 32V72L60 92L20 72V32L60 12Z"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1.5"
      />
      {/* Letter C */}
      <path
        d="M74 36C68 30 62 27 54 27C38 27 28 40 28 52C28 64 38 77 54 77C62 77 68 74 74 68"
        fill="none"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Digital nodes */}
      <circle cx="78" cy="36" r="5" fill="#67E8F9" />
      <circle cx="78" cy="68" r="5" fill="#67E8F9" />
      <circle cx="90" cy="52" r="4" fill="#67E8F9" opacity="0.6" />
      {/* Connection lines */}
      <line x1="78" y1="41" x2="78" y2="63" stroke="#67E8F9" strokeWidth="1.5" opacity="0.4" />
      <line x1="83" y1="36" x2="87" y2="50" stroke="#67E8F9" strokeWidth="1.5" opacity="0.4" />
      <line x1="83" y1="68" x2="87" y2="54" stroke="#67E8F9" strokeWidth="1.5" opacity="0.4" />
      {/* Cross accent inside C */}
      <rect x="44" y="46" width="18" height="12" rx="2" fill="none" stroke="white" strokeWidth="2" opacity="0.4" />
      <line x1="53" y1="46" x2="53" y2="58" stroke="white" strokeWidth="2" opacity="0.4" />
      <line x1="44" y1="52" x2="62" y2="52" stroke="white" strokeWidth="2" opacity="0.4" />
    </svg>
  );
}

// Variant E: Abstract "CX" Monogram
function LogomarkE({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="markE-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
        <linearGradient id="markE-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#A5F3FC" />
        </linearGradient>
      </defs>
      {/* Circle background */}
      <circle cx="60" cy="60" r="56" fill="url(#markE-bg)" />
      {/* C shape */}
      <path
        d="M72 30C64 24 55 22 46 24C30 28 22 42 24 58C26 74 38 86 54 86C62 84 68 80 72 74"
        fill="none"
        stroke="white"
        strokeWidth="9"
        strokeLinecap="round"
      />
      {/* X shape integrated */}
      <path d="M64 38L88 74" stroke="url(#markE-accent)" strokeWidth="7" strokeLinecap="round" />
      <path d="M88 38L64 74" stroke="url(#markE-accent)" strokeWidth="7" strokeLinecap="round" />
      {/* Small medical cross */}
      <rect x="72" y="52" width="12" height="4" rx="2" fill="white" opacity="0.5" />
      <rect x="76" y="48" width="4" height="12" rx="2" fill="white" opacity="0.5" />
    </svg>
  );
}

// Variant F: Minimal Stethoscope forming "C"
function LogomarkF({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="markF-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
      </defs>
      {/* Rounded square */}
      <rect x="4" y="4" width="112" height="112" rx="24" fill="url(#markF-bg)" />
      {/* Stethoscope tube forming C shape */}
      <path
        d="M80 30C70 22 58 20 46 24C30 30 22 46 24 62C26 78 40 92 58 92C68 90 76 84 82 76"
        fill="none"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Stethoscope earpieces at top */}
      <circle cx="80" cy="30" r="6" fill="none" stroke="white" strokeWidth="3" />
      <circle cx="80" cy="30" r="2" fill="#67E8F9" />
      {/* Stethoscope chest piece at bottom */}
      <circle cx="82" cy="76" r="10" fill="none" stroke="white" strokeWidth="3" />
      <circle cx="82" cy="76" r="5" fill="#67E8F9" />
      {/* Pulse inside */}
      <path
        d="M36 58L44 58L48 48L54 68L58 52L62 58L70 58"
        fill="none"
        stroke="#67E8F9"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ============================================================
// LOGOTYPE VARIANTS (Text Only)
// ============================================================

// Logotype 1: Clean Modern
function Logotype1({ size = 36 }: { size?: number }) {
  return (
    <svg height={size} viewBox="0 0 280 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="type1-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
      </defs>
      <text x="0" y="44" fontFamily="Inter, system-ui, sans-serif" fontSize="42" fontWeight="700" fill="url(#type1-grad)" letterSpacing="-1">
        Clinexa
      </text>
      <text x="0" y="58" fontFamily="Inter, system-ui, sans-serif" fontSize="10" fontWeight="500" fill="#64748B" letterSpacing="3">
        SMART CLINIC MANAGEMENT
      </text>
    </svg>
  );
}

// Logotype 2: Bold with accent on "xa"
function Logotype2({ size = 36 }: { size?: number }) {
  return (
    <svg height={size} viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="44" fontFamily="Inter, system-ui, sans-serif" fontSize="42" fontWeight="800" letterSpacing="-1">
        <tspan fill="#1E293B">Clin</tspan>
        <tspan fill="#2563EB">exa</tspan>
      </text>
      <text x="0" y="58" fontFamily="Inter, system-ui, sans-serif" fontSize="10" fontWeight="500" fill="#94A3B8" letterSpacing="3">
        SMART CLINIC MANAGEMENT
      </text>
    </svg>
  );
}

// Logotype 3: Uppercase Tech
function Logotype3({ size = 36 }: { size?: number }) {
  return (
    <svg height={size} viewBox="0 0 340 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="type3-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <text x="0" y="40" fontFamily="Inter, system-ui, sans-serif" fontSize="38" fontWeight="900" fill="url(#type3-grad)" letterSpacing="8">
        CLINEXA
      </text>
      <line x1="0" y1="48" x2="330" y2="48" stroke="url(#type3-grad)" strokeWidth="2" />
      <text x="0" y="58" fontFamily="Inter, system-ui, sans-serif" fontSize="9" fontWeight="500" fill="#64748B" letterSpacing="5">
        SMART CLINIC MANAGEMENT
      </text>
    </svg>
  );
}

// Logotype 4: Elegant with dot separator
function Logotype4({ size = 36 }: { size?: number }) {
  return (
    <svg height={size} viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="38" fontFamily="Inter, system-ui, sans-serif" fontSize="40" fontWeight="300" fill="#1E293B" letterSpacing="2">
        clin
      </text>
      <text x="108" y="38" fontFamily="Inter, system-ui, sans-serif" fontSize="40" fontWeight="700" fill="#2563EB" letterSpacing="2">
        exa
      </text>
      <circle cx="100" cy="42" r="3" fill="#06B6D4" />
      <text x="0" y="56" fontFamily="Inter, system-ui, sans-serif" fontSize="10" fontWeight="400" fill="#94A3B8" letterSpacing="4">
        SMART CLINIC MANAGEMENT
      </text>
    </svg>
  );
}

// ============================================================
// COMBINATION VARIANTS (Icon + Text)
// ============================================================

// Combo 1: LogomarkB + Logotype2 (Rounded Square + Bold Split)
function Combo1({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <LogomarkB size={size} />
      <div className="flex flex-col">
        <span className="text-2xl font-extrabold tracking-tight leading-tight">
          <span className="text-slate-800 dark:text-white">Clin</span>
          <span className="text-blue-600">exa</span>
        </span>
        <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em] uppercase">
          Smart Clinic Management
        </span>
      </div>
    </div>
  );
}

// Combo 2: LogomarkA + Gradient Text
function Combo2({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <LogomarkA size={size} />
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight leading-tight bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
          Clinexa
        </span>
        <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em] uppercase">
          Smart Clinic Management
        </span>
      </div>
    </div>
  );
}

// Combo 3: LogomarkD + Uppercase Tech
function Combo3({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <LogomarkD size={size} />
      <div className="flex flex-col">
        <span className="text-xl font-black tracking-[0.15em] leading-tight bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-500 bg-clip-text text-transparent uppercase">
          Clinexa
        </span>
        <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em] uppercase">
          Smart Clinic Management
        </span>
      </div>
    </div>
  );
}

// Combo 4: LogomarkF + Elegant
function Combo4({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <LogomarkF size={size} />
      <div className="flex flex-col">
        <span className="text-2xl tracking-wide leading-tight">
          <span className="font-light text-slate-700 dark:text-slate-200">clin</span>
          <span className="font-bold text-blue-600">exa</span>
        </span>
        <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em] uppercase">
          Smart Clinic Management
        </span>
      </div>
    </div>
  );
}

// Combo 5: LogomarkE + Clean Bold
function Combo5({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <LogomarkE size={size} />
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight leading-tight text-slate-800 dark:text-white">
          Clinexa
        </span>
        <span className="text-[10px] font-medium text-cyan-500 tracking-[0.2em] uppercase">
          Smart Clinic Management
        </span>
      </div>
    </div>
  );
}

// Combo 6: LogomarkC + Shield Trust
function Combo6({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <LogomarkC size={size} />
      <div className="flex flex-col">
        <span className="text-2xl font-extrabold tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-blue-800 to-cyan-700 bg-clip-text text-transparent">Clinexa</span>
        </span>
        <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em] uppercase">
          Smart Clinic Management
        </span>
      </div>
    </div>
  );
}

// ============================================================
// WHITE VARIANTS (for dark backgrounds)
// ============================================================

function ComboWhite1({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <LogomarkB size={size} />
      <div className="flex flex-col">
        <span className="text-2xl font-extrabold tracking-tight leading-tight text-white">
          Clinexa
        </span>
        <span className="text-[10px] font-medium text-white/60 tracking-[0.2em] uppercase">
          Smart Clinic Management
        </span>
      </div>
    </div>
  );
}

function ComboWhite2({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <LogomarkF size={size} />
      <div className="flex flex-col">
        <span className="text-2xl leading-tight text-white">
          <span className="font-light">clin</span>
          <span className="font-bold">exa</span>
        </span>
        <span className="text-[10px] font-medium text-cyan-300/70 tracking-[0.2em] uppercase">
          Smart Clinic Management
        </span>
      </div>
    </div>
  );
}

// ============================================================
// PREVIEW PAGE
// ============================================================

export default function LogoPreviewPage() {
  const [bgMode, setBgMode] = useState<"light" | "dark">("light");

  return (
    <div className={`min-h-screen ${bgMode === "dark" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl border-b border-slate-200/20 bg-white/80 dark:bg-slate-900/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Logo Preview — Clinexa</h1>
            <p className="text-sm text-slate-500">Pilih logo yang paling sesuai</p>
          </div>
          <button
            onClick={() => setBgMode(bgMode === "light" ? "dark" : "light")}
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-300 transition-colors"
          >
            {bgMode === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">

        {/* ============================== */}
        {/* SECTION 1: LOGOMARK */}
        {/* ============================== */}
        <section>
          <h2 className={`text-xl font-bold mb-2 ${bgMode === "dark" ? "text-white" : "text-slate-900"}`}>
            1. Logomark (Ikon Saja)
          </h2>
          <p className={`text-sm mb-8 ${bgMode === "dark" ? "text-slate-400" : "text-slate-500"}`}>
            Digunakan untuk favicon, app icon, watermark. Pilih yang paling memorable.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { label: "A — Cross + Pulse", Component: LogomarkA },
              { label: "B — C + Heartbeat", Component: LogomarkB },
              { label: "C — Shield + Cross", Component: LogomarkC },
              { label: "D — Hexagon + Tech", Component: LogomarkD },
              { label: "E — CX Monogram", Component: LogomarkE },
              { label: "F — Stethoscope C", Component: LogomarkF },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all hover:scale-105 hover:shadow-lg cursor-pointer ${
                  bgMode === "dark"
                    ? "bg-slate-900 border-slate-800 hover:border-blue-500"
                    : "bg-white border-slate-200 hover:border-blue-400"
                }`}
              >
                <item.Component size={72} />
                <span className={`text-xs font-medium text-center ${bgMode === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ============================== */}
        {/* SECTION 2: LOGOTYPE */}
        {/* ============================== */}
        <section>
          <h2 className={`text-xl font-bold mb-2 ${bgMode === "dark" ? "text-white" : "text-slate-900"}`}>
            2. Logotype (Teks Saja)
          </h2>
          <p className={`text-sm mb-8 ${bgMode === "dark" ? "text-slate-400" : "text-slate-500"}`}>
            Styling teks &quot;Clinexa&quot;. Perhatikan font weight, spacing, dan warna.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: "1 — Gradient Modern", Component: Logotype1 },
              { label: "2 — Bold Split Color", Component: Logotype2 },
              { label: "3 — Uppercase Tech", Component: Logotype3 },
              { label: "4 — Elegant Dot", Component: Logotype4 },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex flex-col gap-4 p-8 rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer ${
                  bgMode === "dark"
                    ? "bg-slate-900 border-slate-800 hover:border-blue-500"
                    : "bg-white border-slate-200 hover:border-blue-400"
                }`}
              >
                <item.Component size={40} />
                <span className={`text-xs font-medium ${bgMode === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ============================== */}
        {/* SECTION 3: COMBINATION */}
        {/* ============================== */}
        <section>
          <h2 className={`text-xl font-bold mb-2 ${bgMode === "dark" ? "text-white" : "text-slate-900"}`}>
            3. Combination (Ikon + Teks)
          </h2>
          <p className={`text-sm mb-8 ${bgMode === "dark" ? "text-slate-400" : "text-slate-500"}`}>
            Versi lengkap untuk navbar, landing page, dokumen resmi. Ini yang paling sering dipakai.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: "Combo 1 — C+Heartbeat + Bold Split", Component: Combo1 },
              { label: "Combo 2 — Cross+Pulse + Gradient", Component: Combo2 },
              { label: "Combo 3 — Hexagon + Uppercase", Component: Combo3 },
              { label: "Combo 4 — Stethoscope + Elegant", Component: Combo4 },
              { label: "Combo 5 — CX Monogram + Clean", Component: Combo5 },
              { label: "Combo 6 — Shield + Trust", Component: Combo6 },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex flex-col gap-4 p-8 rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer ${
                  bgMode === "dark"
                    ? "bg-slate-900 border-slate-800 hover:border-blue-500"
                    : "bg-white border-slate-200 hover:border-blue-400"
                }`}
              >
                <item.Component size={52} />
                <span className={`text-xs font-medium ${bgMode === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ============================== */}
        {/* SECTION 4: ON DARK BACKGROUND */}
        {/* ============================== */}
        <section>
          <h2 className={`text-xl font-bold mb-2 ${bgMode === "dark" ? "text-white" : "text-slate-900"}`}>
            4. Versi Dark Background
          </h2>
          <p className={`text-sm mb-8 ${bgMode === "dark" ? "text-slate-400" : "text-slate-500"}`}>
            Preview di atas background gelap (untuk hero section, footer, dll).
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4 p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-slate-700">
              <ComboWhite1 size={52} />
              <span className="text-xs font-medium text-slate-500">White Version 1</span>
            </div>
            <div className="flex flex-col gap-4 p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-slate-700">
              <ComboWhite2 size={52} />
              <span className="text-xs font-medium text-slate-500">White Version 2</span>
            </div>
          </div>
        </section>

        {/* ============================== */}
        {/* SECTION 5: SIZE PREVIEW */}
        {/* ============================== */}
        <section>
          <h2 className={`text-xl font-bold mb-2 ${bgMode === "dark" ? "text-white" : "text-slate-900"}`}>
            5. Ukuran Preview
          </h2>
          <p className={`text-sm mb-8 ${bgMode === "dark" ? "text-slate-400" : "text-slate-500"}`}>
            Pastikan logo tetap terbaca di berbagai ukuran.
          </p>

          <div className={`p-8 rounded-2xl border ${bgMode === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="flex items-end gap-6 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <LogomarkB size={16} />
                <span className={`text-[10px] ${bgMode === "dark" ? "text-slate-500" : "text-slate-400"}`}>16px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogomarkB size={24} />
                <span className={`text-[10px] ${bgMode === "dark" ? "text-slate-500" : "text-slate-400"}`}>24px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogomarkB size={32} />
                <span className={`text-[10px] ${bgMode === "dark" ? "text-slate-500" : "text-slate-400"}`}>32px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogomarkB size={48} />
                <span className={`text-[10px] ${bgMode === "dark" ? "text-slate-500" : "text-slate-400"}`}>48px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogomarkB size={64} />
                <span className={`text-[10px] ${bgMode === "dark" ? "text-slate-500" : "text-slate-400"}`}>64px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogomarkB size={96} />
                <span className={`text-[10px] ${bgMode === "dark" ? "text-slate-500" : "text-slate-400"}`}>96px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogomarkB size={128} />
                <span className={`text-[10px] ${bgMode === "dark" ? "text-slate-500" : "text-slate-400"}`}>128px</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <div className={`border-t py-6 text-center text-sm ${bgMode === "dark" ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>
        Clinexa Logo Concepts — Pilih favorit Anda, lalu beritahu saya nomor variannya
      </div>
    </div>
  );
}
