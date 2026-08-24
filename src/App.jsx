import React from "react";

/* ============================================================
   TOKENS — mirrors App_2_.jsx exactly so this drops in cleanly.
   If you're pasting this into the same file as App_2_.jsx, delete
   this block and the ThemeContext bits below — just import useC()
   and getFonts() from there instead.
   ============================================================ */
const LIGHT = {
  ink: "#121212", paper: "#FAF9F5", paperDim: "#F2F0EA",
  mid: "#7A776F", faint: "#A8A59B", line: "#DEDBD1", lineStrong: "#C7C3B6",
  accent: "#3547F0", accentDim: "#EBEDFD", white: "#FFFFFF",
};
const DARK = {
  ink: "#F2F0EA", paper: "#131210", paperDim: "#1C1A16",
  mid: "#A7A395", faint: "#726E60", line: "#2C2A24", lineStrong: "#413D33",
  accent: "#5B6BFF", accentDim: "#1E2350", white: "#FFFFFF",
};

const getFonts = (C) => `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
  .f-display{font-family:'Space Grotesk',sans-serif;}
  .f-mono{font-family:'IBM Plex Mono',monospace;}
  .f-body{font-family:'Inter',sans-serif;}
  @keyframes riseIn { from{opacity:0; transform:translateY(14px)} to{opacity:1; transform:translateY(0)} }
  .rise{animation:riseIn .6s cubic-bezier(.16,1,.3,1) both;}
  @keyframes sonarPing { 0%{transform:scale(1); opacity:.9} 100%{transform:scale(4.2); opacity:0} }
  .sonar-ping{animation:sonarPing 3.4s cubic-bezier(.2,.6,.4,1) infinite; transform-box:fill-box; transform-origin:center;}
  @keyframes crosshairBreathe { 0%,100%{opacity:.3} 50%{opacity:.85} }
  .crosshair-breathe{animation:crosshairBreathe 2.2s ease-in-out infinite;}
  @keyframes dotFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
  @keyframes dotTwinkle { 0%,100%{opacity:.35} 50%{opacity:1} }
  .dot-anim{animation:dotFloat 3s ease-in-out infinite, dotTwinkle 2.4s ease-in-out infinite; transform-box:fill-box; transform-origin:center;}
  @keyframes ringSpin { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  .ring-spin-slow{animation:ringSpin 22s linear infinite; transform-box:fill-box; transform-origin:center;}
  .btn-press{transition:transform .15s cubic-bezier(.34,1.56,.64,1);}
  .btn-press:active{transform:scale(.96);}
  body{background-color:${C.paper};}
  input:focus { border-color:${C.accent} !important; box-shadow:0 0 0 3px ${C.accentDim}; }
  @media (prefers-reduced-motion: reduce){ .rise,.sonar-ping,.crosshair-breathe,.dot-anim,.ring-spin-slow,.btn-press{animation:none !important; transition:none !important;} }
`;

/* ============================================================
   SIGNATURE MARK — a crosshair mid-scan, the same targeting
   vocabulary the "pick" ritual uses elsewhere in the product.
   Instead of picking a brief, it's paused mid-search.
   ============================================================ */
function ScanMark({ C }) {
  return (
    <svg width="132" height="132" viewBox="0 0 132 132" fill="none" style={{ overflow: "visible" }}>
      <circle cx="66" cy="66" r="1" fill={C.accent} className="sonar-ping" stroke={C.accent} strokeWidth="1.2" fillOpacity="0" />
      <circle cx="66" cy="66" r="46" stroke={C.line} strokeWidth="1" fill="none" />
      <g className="ring-spin-slow" style={{ transformOrigin: "66px 66px" }}>
        <circle cx="66" cy="66" r="46" stroke={C.lineStrong} strokeWidth="1.4" strokeDasharray="2 10" fill="none" />
      </g>
      <g className="crosshair-breathe">
        <line x1="66" y1="10" x2="66" y2="26" stroke={C.ink} strokeWidth="1.4" />
        <line x1="66" y1="106" x2="66" y2="122" stroke={C.ink} strokeWidth="1.4" />
        <line x1="10" y1="66" x2="26" y2="66" stroke={C.ink} strokeWidth="1.4" />
        <line x1="106" y1="66" x2="122" y2="66" stroke={C.ink} strokeWidth="1.4" />
      </g>
      <circle cx="66" cy="66" r="3.5" fill={C.accent} className="dot-anim" />
    </svg>
  );
}

export default function PausedScreen({ theme = "dark" }) {
  const C = theme === "dark" ? DARK : LIGHT;

  return (
    <div
      className="f-body min-h-screen w-full flex flex-col"
      style={{ backgroundColor: C.paper, color: C.ink, transition: "background-color .3s ease, color .3s ease" }}
    >
      <style>{getFonts(C)}</style>

      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="rise w-full max-w-lg flex flex-col items-center text-center">
          <ScanMark C={C} />

          <span
            className="f-mono uppercase text-[10px] tracking-widest mt-8"
            style={{ color: C.faint }}
          >
            Picked — between rounds
          </span>

          <h1
            className="f-display mt-4"
            style={{ fontSize: "clamp(30px,5vw,44px)", lineHeight: 1.15, fontWeight: 600, letterSpacing: "-0.01em", color: C.ink }}
          >
            We'll be back shortly.
          </h1>

          <p className="f-body mt-4 max-w-sm" style={{ fontSize: 15, lineHeight: 1.7, color: C.mid }}>
            This week's brief is already picked and in progress. New submissions open again once it ships.
          </p>
        </div>
      </div>

      <div className="w-full px-6 py-6 flex items-center justify-center" style={{ borderTop: `1px solid ${C.line}` }}>
        <a
          href="mailto:oshiderooreoluwa@gmail.com"
          className="f-mono uppercase text-[10px] tracking-widest"
          style={{ color: C.faint }}
        >
          Need something sooner? oshiderooreoluwa@gmail.com
        </a>
      </div>
    </div>
  );
}
