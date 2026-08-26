import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ArrowRight, ArrowLeft, ArrowUpRight, Check, X, Upload, Clock,
  ChevronDown, ChevronRight, Search, Lock,
  Download, Sparkles, Circle, CircleDot, Plus, Minus
} from "lucide-react";

/* ============================================================
   TOKENS — light + dark palettes behind a theme context
   ============================================================ */
const LIGHT = {
  ink: "#121212",
  paper: "#FAF9F5",
  paperDim: "#F2F0EA",
  mid: "#7A776F",
  faint: "#A8A59B",
  line: "#DEDBD1",
  lineStrong: "#C7C3B6",
  accent: "#3547F0",
  accentDim: "#EBEDFD",
  white: "#FFFFFF",
  navBg: "rgba(250,249,245,0.86)",
};

const DARK = {
  ink: "#F2F0EA",
  paper: "#131210",
  paperDim: "#1C1A16",
  mid: "#A7A395",
  faint: "#726E60",
  line: "#2C2A24",
  lineStrong: "#413D33",
  accent: "#5B6BFF",
  accentDim: "#1E2350",
  white: "#FFFFFF",
  navBg: "rgba(19,18,16,0.86)",
};

const ThemeContext = React.createContext({ theme: "dark", C: DARK, toggle: () => {} });
function useC() { return React.useContext(ThemeContext).C; }
function useThemeToggle() { return React.useContext(ThemeContext); }

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const C = theme === "dark" ? DARK : LIGHT;
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return <ThemeContext.Provider value={{ theme, C, toggle }}>{children}</ThemeContext.Provider>;
}

const getFonts = (C) => `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
  .f-display{font-family:'Space Grotesk',sans-serif;}
  .f-mono{font-family:'IBM Plex Mono',monospace;}
  .f-body{font-family:'Inter',sans-serif;}
  .no-scrollbar::-webkit-scrollbar{display:none;}
  @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  .marquee-track{animation:marquee 26s linear infinite;}
  @keyframes riseIn { from{opacity:0; transform:translateY(14px)} to{opacity:1; transform:translateY(0)} }
  .rise{animation:riseIn .6s cubic-bezier(.16,1,.3,1) both;}
  @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:.25} }
  .pulse-dot{animation:pulseDot 1.6s ease-in-out infinite;}
  @keyframes digitIn { from{opacity:0; transform:translateY(-10px)} to{opacity:1; transform:translateY(0)} }
  .digit-in{animation:digitIn .32s cubic-bezier(.16,1,.3,1) both;}
  @keyframes floatSlow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  .float-slow{animation:floatSlow 4s ease-in-out infinite;}
  @keyframes underlineIn { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  .btn-press{transition:transform .15s cubic-bezier(.34,1.56,.64,1);}
  .btn-press:active{transform:scale(.96);}
  .hover-lift{transition:transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s ease;}
  .hover-lift:hover{transform:translateY(-4px);}
  @keyframes radarSweep { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .radar-sweep{animation:radarSweep 5s linear infinite;}
  @keyframes ringSpin { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  .ring-spin{animation:ringSpin 9s linear infinite;}
  @keyframes ringSpinRev { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .ring-spin-rev{animation:ringSpinRev 14s linear infinite;}
  @keyframes sonarPing { 0%{transform:scale(1); opacity:.9} 100%{transform:scale(4.5); opacity:0} }
  .sonar-ping{animation:sonarPing 3s cubic-bezier(.2,.6,.4,1) infinite; transform-box:fill-box; transform-origin:center;}
  @keyframes pickPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
  .pick-pulse{animation:pickPulse 2s ease-in-out infinite; transform-box:fill-box; transform-origin:center;}
  @keyframes crosshairBreathe { 0%,100%{opacity:.3} 50%{opacity:.85} }
  .crosshair-breathe{animation:crosshairBreathe 2s ease-in-out infinite;}
  @keyframes dotFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
  @keyframes dotTwinkle { 0%,100%{opacity:.35} 50%{opacity:1} }
  .dot-anim{animation:dotFloat 3s ease-in-out infinite, dotTwinkle 2.4s ease-in-out infinite; transform-box:fill-box; transform-origin:center;}
  @keyframes waveFill {
    0%,100%{clip-path:polygon(0% 42%,8% 38%,16% 46%,24% 40%,32% 48%,40% 38%,48% 46%,56% 40%,64% 48%,72% 38%,80% 46%,88% 40%,96% 48%,100% 42%,100% 100%,0% 100%);}
    50%{clip-path:polygon(0% 48%,8% 44%,16% 38%,24% 46%,32% 40%,40% 48%,48% 38%,56% 46%,64% 40%,72% 48%,80% 38%,88% 46%,96% 40%,100% 46%,100% 100%,0% 100%);}
  }
  .wave-fill-layer{animation:waveFill 3.2s ease-in-out infinite;}
  body{background-color:${C.paper};}
  input:focus, textarea:focus { border-color:${C.accent} !important; box-shadow:0 0 0 3px ${C.accentDim}; }
  @media (prefers-reduced-motion: reduce){ .marquee-track,.rise,.pulse-dot,.digit-in,.float-slow,.btn-press,.hover-lift,.radar-sweep,.ring-spin,.ring-spin-rev,.sonar-ping,.pick-pulse,.crosshair-breathe,.dot-anim,.wave-fill-layer{animation:none !important; transition:none !important;} }
`;

/* ============================================================
   MOCK DATA
   ============================================================ */
const CATEGORIES = ["Food & Hospitality", "Fashion", "Fitness", "Retail", "Beauty", "Music", "Real Estate", "Nonprofit"];

const STATUS_ORDER = ["Submitted", "Reviewing", "Shortlisted", "Picked", "Designing", "Delivered"];

const POOL = [
  { id: "0241", business: "Lagos Street Food Co.", category: "Food & Hospitality", brief: "We need an Instagram post set for our weekend food festival — three posts and a story that feel loud, hot, and a little chaotic, like the market itself.", status: "Submitted", submitted: "Aug 11" },
  { id: "0242", business: "Marlowe & Finch", category: "Fashion", brief: "A social media post announcing our resort capsule collection. Quiet luxury, lots of negative space, one strong typographic moment.", status: "Submitted", submitted: "Aug 11" },
  { id: "0243", business: "Iron & Ember Gym", category: "Fitness", brief: "Social post for our 6am strength class. Should feel heavy, industrial, a little intimidating.", status: "Submitted", submitted: "Aug 12" },
  { id: "0244", business: "Petalworks", category: "Retail", brief: "Instagram teaser post for our new Yaba location opening.", status: "Submitted", submitted: "Aug 12" },
  { id: "0245", business: "Nova Skin Studio", category: "Beauty", brief: "Social post listing our facial treatments — clean, clinical, but warm.", status: "Submitted", submitted: "Aug 13" },
  { id: "0246", business: "Basement Sessions", category: "Music", brief: "Social post for an underground jazz night. Should feel smoky, analog, like it was printed on a risograph.", status: "Submitted", submitted: "Aug 13" },
  { id: "0247", business: "Third Place Coffee", category: "Food & Hospitality", brief: "Social post for our loyalty card launch — playful, stamp-and-punch card energy.", status: "Submitted", submitted: "Aug 14" },
  { id: "0248", business: "Ade & Sons Realty", category: "Real Estate", brief: "New listing announcement post for a waterfront property in Lekki.", status: "Submitted", submitted: "Aug 15" },
  { id: "0249", business: "Tim Luxury Place", category: "Real Estate", brief: "Instagram post announcing new luxury short-let units across the Lekki axis — Chevron, Ajah, and Ikate. Should feel upscale but reassuring: less like a listing, more like a map — show how close each property actually sits to the landmarks that matter (banks, hospitals, the toll plaza).", status: "Delivered", commissioned: true, submitted: "Aug 15" },
  { id: "0250", business: "The Reading Room", category: "Nonprofit", brief: "Social post for our childhood literacy fundraiser — hopeful but not sappy.", status: "Submitted", submitted: "Aug 16" },
  { id: "0251", business: "Halcyon Studio", category: "Fitness", brief: "Instagram carousel announcing our new Pilates timetable.", status: "Submitted", submitted: "Aug 16" },
  { id: "0252", business: "Root & Bloom Market", category: "Food & Hospitality", brief: "Social post for our farmers market pop-up this Saturday.", status: "Submitted", submitted: "Aug 17" },
  { id: "0253", business: "Currency House", category: "Fashion", brief: "Social post for our new streetwear drop — bold, oversized type, editorial.", status: "Submitted", submitted: "Aug 17" },
  { id: "0254", business: "Palm & Vine Nursery", category: "Retail", brief: "Simple social post for our plant-of-the-month subscription.", status: "Submitted", submitted: "Aug 17" },
  { id: "0255", business: "Onyeka Films", category: "Music", brief: "Social post for our short film premiere night — moody, cinematic.", status: "Submitted", submitted: "Aug 18" },
  { id: "0256", business: "Bright Path Clinic", category: "Nonprofit", brief: "Social post announcing free health screenings this month.", status: "Submitted", submitted: "Aug 18" },
  { id: "0257", business: "Salt Flat Ceramics", category: "Retail", brief: "Social post for our studio's workshop offerings.", status: "Submitted", submitted: "Aug 18" },
  { id: "0258", business: "Kindred Kitchen", category: "Food & Hospitality", brief: "Social post for a supper club — intimate, warm, candlelit feel.", status: "Submitted", submitted: "Aug 18" },
];

const ARCHIVE = [
  {
    week: 4, business: "Tim Luxury Place", category: "Real Estate", title: "Location Campaign",
    grad: ["#0B1233", "#1B2E6B"], accent: "#D9A441", commissioned: true,
    images: [
      "https://res.cloudinary.com/dmqyultl0/image/upload/v1787487265/New_Units_jyzupr.jpg",
      "https://res.cloudinary.com/dmqyultl0/image/upload/v1787487268/New_Units_1_iu896f.jpg",
      "https://res.cloudinary.com/dmqyultl0/image/upload/v1787487266/New_Units_2_f9zp0f.jpg",
      "https://res.cloudinary.com/dmqyultl0/image/upload/v1787487270/New_Units_3_f62oin.jpg",
    ],
    brief: "Instagram post announcing new luxury short-let units across the Lekki axis — Chevron, Ajah, and Ikate. The reference they sent was built around a full illustrated map with nearby landmarks — banks, hospitals, the toll plaza — carrying that same 'we're right where you need us' reassurance.",
    challenge: "The reference map was doing a lot at once — routes, transit lines, seven separate landmark icons — clear as a reference board but noisy for a fast Instagram scroll, and it read closer to a listing flyer than a brand moment.",
    thinking: "I kept the reassurance and dropped the map. Three real interiors, pinned like photos on a corkboard and tagged simply by neighbourhood — Chevron, Ajah, Ikate — say 'we're already there' faster than any landmark icon could. The headline shortened to two lines, the logo and a quiet swipe cue anchor the corners, and the navy-and-gold palette keeps the same upscale feel the reference had, just with room to breathe.",
  },
  {
    week: 3, business: "Third Place Coffee", category: "Food & Hospitality", title: "New Location Flyer",
    grad: ["#2B2B2B", "#4A3A2C"], accent: "#E8A33D",
    images: [
      "https://res.cloudinary.com/dmqyultl0/image/upload/v1787216769/Instagram_post_-_6_2_ukwh78.png",
      "https://res.cloudinary.com/dmqyultl0/image/upload/v1787217033/Instagram_post_-_7_1_rw7itt.png",
    ],
    brief: "We're opening a second location and want a flyer we can print and hand out around the neighbourhood — warm, a little rough around the edges, not corporate.",
    challenge: "The client wanted something printable at low cost — single colour on kraft paper — while still feeling considered, and it needed to announce a location without one, since the new space wasn't open yet.",
    thinking: "I framed it as an in-store lifestyle shot bleeding up into a bold two-line headline — More Coffee. Same Spirit. — with a hand-lettered 'Coming soon!' banner doing the announcement instead of a hard date. A torn kraft-paper strip at the bottom, styled like the shop's own packaging, carries the practical bits: same heart, new neighbourhood, stay tuned. It reads like a note from the shop, not a real-estate ad.",
  },
  {
    week: 2, business: "Kairos", category: "Fitness", title: "Launch Campaign",
    images: [
      "https://res.cloudinary.com/dmqyultl0/image/upload/v1787204693/Instagram_post_-_18_3_y28wrb.png",
      "https://res.cloudinary.com/dmqyultl0/image/upload/v1787205271/Instagram_post_-_21_rhdkat.png",
      "https://res.cloudinary.com/dmqyultl0/image/upload/v1787204315/Instagram_post_-_17_ezq0px.png",
    ],
    grad: ["#161616", "#FF6A1A"], accent: "#FF6A1A",
    brief: "We just launched Kairos, a health-tracking wearable, and need a set of Instagram posts introducing it — sleep tracking, everyday wear, the whole idea that it's one device for every moment that matters. Clean, confident, not overly techy.",
    challenge: "The product photography was already strong — soft, lifestyle-driven, well shot. What was missing was a system: no consistent headline treatment, no recurring mark, nothing tying one post to the next as a campaign instead of a batch of separate images.",
    thinking: "I designed the whole thing around one repeatable move: a stacked three-line headline where the middle line always breaks into the brand's orange, and a small double-arrow mark in the corner as a signature you'd start to recognize post after post. The photography stayed the hero — I just gave it a frame that made the posts feel like a campaign instead of a product dump.",
  },
  {
    week: 1, business: "Studio Orea", category: "Beauty", title: "Studio Flyer",
    images: [
      "https://res.cloudinary.com/dmqyultl0/image/upload/v1787168512/Instagram_post_-_27_ws2qbz.png",
      "https://res.cloudinary.com/dmqyultl0/image/upload/v1787636919/Instagram_post_-_29_bajpe2.png",
    ],
    grad: ["#3B0F1E", "#C96A2E"], accent: "#F6D9C4",
    brief: "A single flyer for our nail and lash studio in Lugbe, Abuja. Needs to carry the full service list and location without losing the glam — and make people want to book on the spot.",
    challenge: "A flyer that has to do a lot of jobs at once — services, pricing context, location, contact, a CTA — for a brand whose only existing asset was a playful, hand-lettered logo. The risk was cramming it full and losing the personality that logo already had.",
    thinking: "I designed everything around that hand-lettered mark instead of fighting it — a deep wine-to-amber gradient behind it for warmth, and let the actual nail work do the selling: three real photos anchored along the bottom instead of illustrations. Services and location live in one clean card on the right so the eye has somewhere to land, and the 'Book now' pill echoes the same loose, hand-drawn energy as the logo — so the CTA feels like part of the brand, not a sticker on top of it.",
  },
];

const CYCLE = {
  week: 5,
  opened: "Aug 23",
  deadline: "Aug 28",
  pickDate: "Aug 28, 5:00 PM WAT",
  nextOpen: "Aug 26", // when the pool reopens for the following week, once this one is picked
  status: "open", // open | closed | designing | delivered
};

const submissionsOpen = CYCLE.status === "open";
const currentBrief = POOL.find((b) => b.status === "Designing");

/* ============================================================
   SMALL PRIMITIVES
   ============================================================ */

/* Scroll-reveal wrapper — fades/rises elements into view once */
function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(18px)",
        transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

/* Count-up number, triggers once in view */
function AnimatedNumber({ value, pad = 0 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const target = Number(value) || 0;
      const dur = 900;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref}>{String(display).padStart(pad, "0")}</span>;
}

/* Magnetic hover — subtle cursor-follow pull, used on primary CTAs */
function useMagnetic(strength = 14) {
  const ref = useRef(null);
  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
    const y = ((e.clientY - r.top) / r.height - 0.5) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onMouseLeave = () => { if (ref.current) ref.current.style.transform = "translate(0,0)"; };
  return { ref, onMouseMove, onMouseLeave };
}

function Eyebrow({ children, dot = true, center = false }) {
  const C = useC();
  return (
    <div className={`f-mono flex items-center gap-2 uppercase tracking-widest text-xs ${center ? "justify-center" : ""}`} style={{ color: C.mid }}>
      {dot && <span className="inline-block w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: C.accent }} />}
      {children}
    </div>
  );
}

function Rule({ tight }) {
  const C = useC();
  return <div style={{ borderTop: `1px solid ${C.line}`, width: "100%" }} className={tight ? "my-4" : "my-10"} />;
}

function Button({ children, variant = "primary", onClick, icon: Icon = ArrowRight, className = "", type = "button", magnetic = true }) {
  const C = useC();
  const m = useMagnetic(10);
  const base = "f-mono inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-widest transition-all duration-200 btn-press group/btn";
  const mag = magnetic ? { ref: m.ref, onMouseMove: m.onMouseMove, onMouseLeave: m.onMouseLeave } : {};
  const mstyle = magnetic ? { transition: "transform .25s cubic-bezier(.16,1,.3,1), background-color .2s ease, border-color .2s ease" } : {};

  if (variant === "primary") {
    return (
      <button type={type} onClick={onClick} {...mag}
        className={base + " " + className}
        style={{ backgroundColor: C.ink, color: C.paper, borderRadius: 3, ...mstyle }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.accent)}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.ink; magnetic && m.onMouseLeave(); }}
      >
        {children} <Icon size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
      </button>
    );
  }
  if (variant === "ghost") {
    return (
      <button type={type} onClick={onClick} {...mag}
        className={base + " " + className}
        style={{ backgroundColor: "transparent", color: C.ink, border: `1px solid ${C.lineStrong}`, borderRadius: 3, ...mstyle }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.ink; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.lineStrong; magnetic && m.onMouseLeave(); }}
      >
        {children} {Icon && <Icon size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />}
      </button>
    );
  }
  return (
    <button type={type} onClick={onClick} className={base + " " + className + " hover:opacity-60"} style={{ color: C.mid }}>
      {children} {Icon && <Icon size={13} className="transition-transform duration-300 group-hover/btn:translate-x-1" />}
    </button>
  );
}

/* Every "Submit a brief" entry point in the app routes through here, so the
   open/closed rule only has to live in one place. When submissions are closed,
   it swaps to a plain, non-interactive line telling people when the pool
   reopens instead of a dead-looking disabled button. */
function SubmitCTA({ go, variant = "primary", label = "Drop a brief", icon, className = "", asLink = false, pill = true }) {
  const C = useC();
  if (!submissionsOpen) {
    return (
      <span className={`f-mono uppercase text-xs tracking-widest inline-flex items-center gap-2 ${className}`} style={{ color: C.faint }}>
        <Lock size={12} /> Opens {CYCLE.nextOpen}
      </span>
    );
  }
  if (asLink) {
    return (
      <button onClick={() => go("submit")} className={className} style={{ color: C.ink }}>
        {label}
      </button>
    );
  }
  return (
    <span className={`relative inline-block ${className}`}>
      <Button variant={variant} onClick={() => go("submit")} icon={icon}>
        {label}
      </Button>
      {pill && (
        <span
          className="f-mono uppercase text-[9px] tracking-widest px-2.5 py-1 rounded-full absolute -top-3 -right-3 z-10 select-none pointer-events-none"
          style={{ backgroundColor: C.accent, color: "#fff", transform: "rotate(8deg)", boxShadow: "0 4px 12px rgba(53,71,240,0.35)" }}
        >
          Free
        </span>
      )}
    </span>
  );
}

function StatBlock({ value, label, animated = true }) {
  const C = useC();
  const numeric = /^\d+$/.test(String(value));
  return (
    <div>
      <div className="f-display leading-none" style={{ fontSize: 40, fontWeight: 600, color: C.ink }}>
        {animated && numeric ? <AnimatedNumber value={value} pad={String(value).length} /> : value}
      </div>
      <div className="f-mono uppercase tracking-widest text-[10px] mt-1.5" style={{ color: C.mid }}>{label}</div>
    </div>
  );
}

/* Countdown */
function useCountdown(target) {
  const [t, setT] = useState(target - Date.now());
  useEffect(() => {
    const i = setInterval(() => setT(target - Date.now()), 1000);
    return () => clearInterval(i);
  }, [target]);
  const clamp = Math.max(t, 0);
  const d = Math.floor(clamp / 86400000);
  const h = Math.floor((clamp % 86400000) / 3600000);
  const m = Math.floor((clamp % 3600000) / 60000);
  const s = Math.floor((clamp % 60000) / 1000);
  return { d, h, m, s };
}

function Countdown({ target, size = "lg" }) {
  const C = useC();
  const { d, h, m, s } = useCountdown(target);
  const cell = (v, label) => (
    <div className="flex flex-col items-center">
      <div className="f-display tabular-nums leading-none overflow-hidden" style={{ fontSize: size === "lg" ? 56 : 34, fontWeight: 600, color: C.ink, height: size === "lg" ? 64 : 40 }}>
        <span key={v} className="digit-in inline-block">{String(v).padStart(2, "0")}</span>
      </div>
      <div className="f-mono uppercase tracking-widest text-[10px] mt-2" style={{ color: C.mid }}>{label}</div>
    </div>
  );
  return (
    <div className="flex items-start gap-5 sm:gap-7">
      {cell(d, "Days")}
      <div className="f-display" style={{ fontSize: size === "lg" ? 44 : 28, color: C.faint, marginTop: -4 }}>:</div>
      {cell(h, "Hrs")}
      <div className="f-display" style={{ fontSize: size === "lg" ? 44 : 28, color: C.faint, marginTop: -4 }}>:</div>
      {cell(m, "Min")}
      <div className="f-display" style={{ fontSize: size === "lg" ? 44 : 28, color: C.faint, marginTop: -4 }}>:</div>
      {cell(s, "Sec")}
    </div>
  );
}

/* Ticket-punch progress track — signature element */
function ProgressTrack({ status, compact }) {
  const C = useC();
  const idx = STATUS_ORDER.indexOf(status);
  return (
    <div className="flex items-center w-full">
      {STATUS_ORDER.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center" style={{ minWidth: compact ? 0 : 64 }}>
              <div
                className="rounded-full flex items-center justify-center relative"
                style={{
                  width: active ? 14 : 10, height: active ? 14 : 10,
                  backgroundColor: done || active ? C.accent : C.paperDim,
                  border: `1px solid ${done || active ? C.accent : C.lineStrong}`,
                  transition: "all .4s cubic-bezier(.16,1,.3,1)",
                }}
              >
                {active && <span className="absolute inline-block rounded-full pulse-dot" style={{ width: 26, height: 26, border: `1px solid ${C.accent}` }} />}
              </div>
              {!compact && (
                <div className="f-mono uppercase text-[9px] tracking-wider mt-2 text-center transition-colors duration-300" style={{ color: done || active ? C.ink : C.faint }}>
                  {s}
                </div>
              )}
            </div>
            {i < STATUS_ORDER.length - 1 && (
              <div className="flex-1 h-px mx-1 relative overflow-hidden">
                <div className="absolute inset-0" style={{ backgroundColor: C.line }} />
                <div className="absolute inset-y-0 left-0 transition-all duration-700 ease-out" style={{ width: i < idx ? "100%" : "0%", backgroundColor: C.accent }} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StatusPill({ status }) {
  const C = useC();
  const map = {
    Submitted: C.mid, Reviewing: C.mid, Shortlisted: C.ink, Picked: C.ink, Designing: C.accent, Delivered: "#2E9C5B", Completed: "#2E9C5B", Rejected: C.faint,
  };
  return (
    <span className="f-mono uppercase tracking-widest text-[10px] px-2.5 py-1 rounded-full" style={{ color: C.white, backgroundColor: map[status] || C.mid }}>
      {status}
    </span>
  );
}

/* Marks a brief that was hired directly rather than picked from the pool —
   an outline instead of a solid fill, so it reads as a different kind of
   status, not a louder version of the same one. */
function CommissionedTag() {
  const C = useC();
  return (
    <span className="f-mono uppercase tracking-widest text-[10px] px-2.5 py-1 rounded-full" style={{ color: C.accent, border: `1px solid ${C.accent}` }}>
      Commissioned
    </span>
  );
}

/* A liquid text-fill effect: the word renders once normally (hidden, purely
   for layout sizing), then twice more stacked on top of it — a solid ink
   layer and an accent layer clipped to a wave shape that animates — so a
   band of colour washes across the letters like a tide. */
function WaveFillText({ children }) {
  const C = useC();
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ visibility: "hidden" }}>{children}</span>
      <span aria-hidden="true" style={{ position: "absolute", inset: 0, color: C.ink }}>{children}</span>
      <span aria-hidden="true" className="wave-fill-layer" style={{ position: "absolute", inset: 0, color: C.accent }}>{children}</span>
    </span>
  );
}

/* ============================================================
   NAV
   ============================================================ */
function Nav({ go, view }) {
  const C = useC();
  const { theme, toggle } = useThemeToggle();
  const links = [
    ["home", "Home"], ["week", "This Week"], ["archive", "Archive"],
  ];
  return (
    <div className="sticky top-0 z-40 backdrop-blur" style={{ backgroundColor: C.navBg, borderBottom: `1px solid ${C.line}` }}>
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 h-16 flex items-center justify-between">
        <button onClick={() => go("home")} className="flex items-center gap-2.5 group" aria-label="Picked — home">
          <img
            src="/picked-logo.png"
            alt="Picked"
            className="transition-transform duration-300 ease-out group-hover:-rotate-3 group-hover:scale-105"
            style={{ height: 32, width: "auto", display: "block" }}
          />
          <span className="f-mono text-[8px] hidden sm:inline transition-colors duration-300" style={{ color: C.faint, letterSpacing: "-0.01em" }}>by Isaac Oreoluwa</span>
        </button>
        <div className="hidden md:flex items-center gap-8">
          {links.map(([id, label]) => (
            <button key={id} onClick={() => go(id)} className="relative f-mono uppercase text-[11px] tracking-widest group py-1"
              style={{ color: view === id ? C.ink : C.mid, transition: "color .25s ease" }}>
              {label}
              <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left transition-transform duration-300"
                style={{ backgroundColor: C.ink, transform: view === id ? "scaleX(1)" : "scaleX(0)" }} />
              <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"
                style={{ backgroundColor: C.faint, opacity: view === id ? 0 : 1 }} />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="relative flex items-center rounded-full btn-press shrink-0"
            style={{ width: 44, height: 24, backgroundColor: theme === "dark" ? C.accent : C.paperDim, border: `1px solid ${C.lineStrong}`, transition: "background-color .25s ease" }}
          >
            <span
              className="absolute rounded-full flex items-center justify-center transition-transform duration-300"
              style={{ width: 18, height: 18, top: 2, left: 2, backgroundColor: C.paper, transform: theme === "dark" ? "translateX(20px)" : "translateX(0)" }}
            >
              {theme === "dark" ? <Circle size={9} color={C.accent} fill={C.accent} /> : <CircleDot size={9} color={C.mid} />}
            </span>
          </button>
          <SubmitCTA go={go} variant="ghost" className="!py-2.5 !px-4" pill={false} />
        </div>
      </div>
    </div>
  );
}

function Footer({ go }) {
  const C = useC();
  const [logoHover, setLogoHover] = useState(false);
  const [gifPos, setGifPos] = useState({ x: 0, y: 0 });
  return (
    <div style={{ borderTop: `1px solid ${C.line}` }} className="mt-24">
      {/* One combined band: the hire-me pitch leads, the credit rides along as a
          quieter secondary element — instead of two equally loud sections. */}
      <div style={{ borderBottom: `1px solid ${C.line}`, backgroundColor: C.paperDim }}>
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16 sm:py-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 lg:gap-16">
          <div className="max-w-xl">
            <div className="f-display" style={{ fontSize: "clamp(22px,2.8vw,30px)", lineHeight: 1.35, fontWeight: 500, color: C.ink }}>
              If you'd rather just hire me
            </div>
            <p className="f-body mt-2 text-sm leading-relaxed" style={{ color: C.mid }}>
              for a proper campaign, gig, or one-off — that's on the table too.
            </p>
            <a href="mailto:oshiderooreoluwa@gmail.com"
              className="group inline-flex items-center gap-2 f-mono uppercase text-xs tracking-widest px-6 py-3.5 rounded-full mt-7 btn-press"
              style={{ border: `1px solid ${C.ink}`, color: C.ink, transition: "background-color .25s ease, color .25s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.ink; e.currentTarget.style.color = C.paper; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = C.ink; }}
            >
              oshiderooreoluwa@gmail.com <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          <div className="shrink-0 lg:text-right">
            <span className="f-mono uppercase text-[10px] tracking-widest" style={{ color: C.faint }}>Designed by</span>
            <div className="f-display mt-2" style={{ fontSize: "clamp(22px,2.6vw,28px)", fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>
              Isaac Oreoluwa
            </div>
            <a href="https://isaacoreoluwa.xyz" target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 f-mono uppercase text-[11px] tracking-widest mt-2.5"
              style={{ color: C.mid, transition: "color .2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.ink; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.mid; }}
            >
              isaacoreoluwa.xyz <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Closing statement — the loud, dramatic sign-off. The logo, full width. */}
      <button
        onClick={() => go("home")}
        onMouseEnter={() => setLogoHover(true)}
        onMouseMove={(e) => setGifPos({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setLogoHover(false)}
        className="block w-full text-left group"
        style={{ padding: "0" }}
      >
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-14 sm:pt-20 pb-6 sm:pb-10 overflow-hidden">
          <img
            src="/picked-logo.png"
            alt="Picked"
            className="inline-block transition-transform duration-500 group-hover:-translate-y-1"
            style={{ width: "clamp(280px, 58vw, 880px)", height: "auto", display: "block" }}
          />
        </div>
      </button>

      {/* Cursor-following preview — a small tooltip-like reveal, not a static hover state */}
      <img
        src="https://res.cloudinary.com/dmqyultl0/image/upload/v1787511199/Untitled_design_wlkc2y.gif"
        alt=""
        aria-hidden="true"
        className="hidden sm:block"
        style={{
          position: "fixed", left: gifPos.x, top: gifPos.y, zIndex: 60,
          width: 176, height: 176, objectFit: "cover", borderRadius: 10,
          border: `1px solid ${C.lineStrong}`, boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
          pointerEvents: "none",
          transform: `translate(26px, -55%) rotate(-3deg) scale(${logoHover ? 1 : 0.85})`,
          opacity: logoHover ? 1 : 0,
          transition: "opacity .25s ease, transform .3s cubic-bezier(.16,1,.3,1)",
        }}
      />

      {/* Slim closing bar — essentials only, no filler links */}
      <div style={{ borderTop: `1px solid ${C.line}` }}>
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span className="f-mono text-[10px] uppercase tracking-widest" style={{ color: C.faint }}>
            © {new Date().getFullYear()} Picked — one designer, one campaign a week.
          </span>
          <div className="flex items-center gap-7">
            <button onClick={() => go("archive")} className="f-mono text-[10px] uppercase tracking-widest hover:opacity-60 transition-opacity" style={{ color: C.mid }}>Archive</button>
            <SubmitCTA go={go} asLink className="f-mono text-[10px] uppercase tracking-widest hover:opacity-60 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   POOL ILLUSTRATION — a scatter of nodes with one picked, plus
   corner registration marks. Deterministic, not random, so it
   doesn't reshuffle on every re-render.
   ============================================================ */
function PoolRipples() {
  const C = useC();
  const points = [40, 150, 260, 370];
  return (
    <svg viewBox="0 0 400 50" preserveAspectRatio="none" className="w-full h-12 overflow-visible">
      <line x1="0" y1="25" x2="400" y2="25" stroke={C.line} strokeWidth="1" />
      {points.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="25" r="2" fill={C.accent} />
          <circle cx={x} cy="25" r="2" fill="none" stroke={C.accent} strokeWidth="1" className="sonar-ping" style={{ animationDelay: `${i * 0.8}s` }} />
        </g>
      ))}
    </svg>
  );
}

function PoolIllustration({ count }) {
  const C = useC();
  const hash = (n) => {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const W = 200, H = 250, PAD = 20;
  const dots = Array.from({ length: Math.max(count, 1) }, (_, i) => ({
    x: PAD + hash(i * 3.7 + 1) * (W - PAD * 2),
    y: PAD + hash(i * 9.1 + 4) * (H - PAD * 2 - 40), // keep clear of the label band at the bottom
  }));
  const pick = dots[Math.min(3, dots.length - 1)];
  const originStyle = pick ? { transformBox: "view-box", transformOrigin: `${pick.x}px ${pick.y}px` } : {};

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
      {/* corner registration marks */}
      <path d={`M10,26 L10,10 L26,10`} stroke={C.lineStrong} strokeWidth="1" fill="none" />
      <path d={`M${W - 26},10 L${W - 10},10 L${W - 10},26`} stroke={C.lineStrong} strokeWidth="1" fill="none" />
      <path d={`M10,${H - 26} L10,${H - 10} L26,${H - 10}`} stroke={C.lineStrong} strokeWidth="1" fill="none" />
      <path d={`M${W - 26},${H - 10} L${W - 10},${H - 10} L${W - 10},${H - 26}`} stroke={C.lineStrong} strokeWidth="1" fill="none" />

      {/* faint diagonal, purely compositional */}
      <line x1={PAD} y1={H - PAD - 30} x2={W - PAD} y2={PAD} stroke={C.line} strokeWidth="0.75" opacity="0.5" />

      {pick && (
        <>
          {/* radar sweep — a rotating gradient blade centered on the pick */}
          <defs>
            <linearGradient id="sweepFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.accent} stopOpacity="0.5" />
              <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          <g className="radar-sweep" style={originStyle}>
            <line x1={pick.x} y1={pick.y} x2={pick.x} y2={pick.y - 95} stroke="url(#sweepFade)" strokeWidth="14" />
          </g>

          {/* sonar pings — expanding rings pulsing outward on a loop */}
          <circle cx={pick.x} cy={pick.y} r="4" fill="none" stroke={C.accent} strokeWidth="1" className="sonar-ping" style={{ animationDelay: "0s" }} />
          <circle cx={pick.x} cy={pick.y} r="4" fill="none" stroke={C.accent} strokeWidth="1" className="sonar-ping" style={{ animationDelay: "1s" }} />
          <circle cx={pick.x} cy={pick.y} r="4" fill="none" stroke={C.accent} strokeWidth="1" className="sonar-ping" style={{ animationDelay: "2s" }} />
        </>
      )}

      {/* the pool — one hollow ring per brief, gently drifting and twinkling */}
      {dots.map((d, i) => (
        d === pick ? null : (
          <circle
            key={i} cx={d.x} cy={d.y} r="2.5" fill="none" stroke={C.lineStrong} strokeWidth="1"
            className="dot-anim"
            style={{ animationDelay: `${(hash(i * 5.3) * 3).toFixed(2)}s, ${(hash(i * 6.1) * 2.4).toFixed(2)}s` }}
          />
        )
      ))}

      {/* the pick — breathing crosshair, spinning dashed rings, pulsing core */}
      {pick && (
        <g>
          <g className="crosshair-breathe">
            <line x1={pick.x - 22} y1={pick.y} x2={pick.x + 22} y2={pick.y} stroke={C.accent} strokeWidth="0.75" />
            <line x1={pick.x} y1={pick.y - 22} x2={pick.x} y2={pick.y + 22} stroke={C.accent} strokeWidth="0.75" />
          </g>
          <circle cx={pick.x} cy={pick.y} r="18" fill="none" stroke={C.lineStrong} strokeWidth="0.75" strokeDasharray="1 4" className="ring-spin-rev" style={originStyle} />
          <circle cx={pick.x} cy={pick.y} r="13" fill="none" stroke={C.accent} strokeWidth="1" strokeDasharray="2 3" className="ring-spin" style={originStyle} />
          <circle cx={pick.x} cy={pick.y} r="4" fill={C.accent} className="pick-pulse" />
        </g>
      )}
    </svg>
  );
}

/* ============================================================
   THE DESK — replaces the pool/progress visual on Home. No
   photography, minimal copy: a statement, one line of context,
   the CTA, and a small hand-marked signature graphic — built to
   be read and acted on in a few seconds, not studied.
   ============================================================ */
function DeskMark({ count }) {
  const C = useC();
  const W = 132, H = 132;
  const cx = W / 2, cy = H / 2;
  return (
    <div style={{ width: W, transform: "rotate(-1.5deg)" }}>
      <div className="relative" style={{ width: W, height: H, border: `1px solid ${C.line}`, borderRadius: 3, backgroundColor: C.paperDim }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full overflow-visible">
          {/* corner registration marks — same motif as the rest of the site */}
          <path d={`M9,23 L9,9 L23,9`} stroke={C.lineStrong} strokeWidth="1" fill="none" />
          <path d={`M${W - 23},9 L${W - 9},9 L${W - 9},23`} stroke={C.lineStrong} strokeWidth="1" fill="none" />
          <path d={`M9,${H - 23} L9,${H - 9} L23,${H - 9}`} stroke={C.lineStrong} strokeWidth="1" fill="none" />

          {/* the mark — a hand-circled pick, the site's one recurring gesture */}
          <g className="crosshair-breathe">
            <line x1={cx - 16} y1={cy} x2={cx + 16} y2={cy} stroke={C.accent} strokeWidth="0.75" />
            <line x1={cx} y1={cy - 16} x2={cx} y2={cy + 16} stroke={C.accent} strokeWidth="0.75" />
          </g>
          <ellipse cx={cx} cy={cy} rx="26" ry="21" fill="none" stroke={C.accent} strokeWidth="2" transform={`rotate(-8 ${cx} ${cy})`} />
          <circle cx={cx} cy={cy} r="3" fill={C.accent} className="pick-pulse" />
        </svg>
        <div className="absolute f-mono text-[8px] uppercase tracking-widest" style={{ bottom: 9, right: 11, color: C.faint }}>
          W{String(CYCLE.week).padStart(2, "0")}
        </div>
      </div>
      <div className="f-mono text-[9px] uppercase tracking-widest mt-2 text-center" style={{ color: C.faint }}>
        {count} in the running
      </div>
    </div>
  );
}

function DeskSection({ go }) {
  const C = useC();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-10 sm:gap-16">
      <div className="flex-1 max-w-md">
        <h3 className="f-display uppercase" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.01em", color: C.ink }}>
          The desk<br />is open.
        </h3>
        <p className="f-body mt-3 text-sm leading-relaxed" style={{ color: C.mid }}>
          One business, one Friday, one campaign — free, no pitch required.
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-6">
          <SubmitCTA go={go} />
          <span className="f-mono text-[10px] uppercase tracking-widest" style={{ color: C.faint }}>
            Closes {CYCLE.deadline} · picked {CYCLE.pickDate}
          </span>
        </div>
      </div>
      <div className="shrink-0 sm:ml-auto">
        <DeskMark count={POOL.length} />
      </div>
    </div>
  );
}

/* ============================================================
   HOME
   ============================================================ */
function Home({ go, openBrief }) {
  const C = useC();
  const target = useMemo(() => Date.now() + (4 * 3600 + 22 * 60 + 10) * 1000, []);

  /* Shared "log entry" row: a slim mono margin column + a wide content column.
     Every entry on the page — the intro note, this week's brief, past weeks —
     uses this same two-column shape, so the page reads as one running log
     rather than a stack of different marketing sections. */
  const Entry = ({ index, meta, children, first = false, pattern = false }) => (
    <div
      className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 grid grid-cols-[56px_1fr] sm:grid-cols-[96px_1fr] gap-6 sm:gap-10 py-12 sm:py-16 relative overflow-hidden"
      style={{ borderTop: first ? "none" : `1px solid ${C.line}` }}
    >
      {pattern && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `radial-gradient(${C.lineStrong} 1px, transparent 1.5px)`,
            backgroundSize: "26px 26px",
            opacity: 0.5,
            maskImage: "linear-gradient(to left, black 0%, black 38%, transparent 82%)",
            WebkitMaskImage: "linear-gradient(to left, black 0%, black 38%, transparent 82%)",
          }}
        />
      )}
      <div className="pt-1 relative z-10">
        <div className="f-mono text-xs sm:text-sm" style={{ color: C.faint }}>{index}</div>
        {meta && <div className="f-mono uppercase text-[9px] sm:text-[10px] tracking-widest mt-2 leading-relaxed" style={{ color: C.mid }}>{meta}</div>}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );

  return (
    <div>
      {/* 00 — the intro note, standing in for a hero. Leads with the business
          owner's problem, not the designer's story. */}
      <Entry index="00" meta={<>Vol. 1<br />Ongoing</>} first pattern>
        <div className="rise max-w-2xl">
          <p className="f-display" style={{ fontSize: "clamp(52px,9vw,96px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em", color: C.ink }}>
            Got a design problem?
          </p>
          <p className="f-body mt-4 max-w-lg" style={{ fontSize: 16, lineHeight: 1.7, color: C.mid }}>
            Drop the brief. I pick one every week and turn it into a finished creative.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-7">
            <SubmitCTA go={go} />
            {submissionsOpen ? (
              <Button variant="ghost" icon={null} onClick={() => go("archive")}>See what I've picked</Button>
            ) : (
              <Button variant="ghost" icon={null} onClick={() => window.location.href = "mailto:oshiderooreoluwa@gmail.com"}>Hire me</Button>
            )}
          </div>
        </div>

        {/* Why am I doing this? — a quiet text-button that slides down to the Why note */}
        <div className="rise mt-14" style={{ animationDelay: "80ms" }}>
          <button
            onClick={() => document.getElementById("why-section")?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="f-mono uppercase text-[11px] sm:text-xs tracking-widest transition-colors duration-200 inline-flex items-center gap-1.5 group"
            style={{ color: C.mid, background: "none", border: "none", padding: 0, cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.mid)}
          >
            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            Why am I doing this?
          </button>
        </div>
      </Entry>

      {/* This week — open for submissions, or already in progress */}
      {submissionsOpen ? (
        <Entry
          index={`W${String(CYCLE.week).padStart(2, "0")}`}
          meta={<>{CYCLE.opened}<br /><span className="inline-flex items-center gap-1.5" style={{ color: C.accent }}><span className="inline-block w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: C.accent }} />Open</span></>}
        >
          <Reveal>
            <DeskSection go={go} />
          </Reveal>
        </Entry>
      ) : (
        <Entry
          index={`W${String(CYCLE.week).padStart(2, "0")}`}
          meta={<>{CYCLE.opened}<br /><span className="inline-flex items-center gap-1.5" style={{ color: C.faint }}><Lock size={9} />Closed</span></>}
        >
          <Reveal>
            {currentBrief ? (
              <div className="flex flex-col md:flex-row md:items-start gap-8">
                <div className="flex-1">
                  <Eyebrow>This week's pick</Eyebrow>
                  <div className="f-display mt-3" style={{ fontSize: 26, fontWeight: 600, color: C.ink }}>{currentBrief.business}</div>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <span className="f-mono uppercase text-[10px] tracking-widest" style={{ color: C.mid }}>{currentBrief.category}</span>
                    {currentBrief.commissioned && <CommissionedTag />}
                  </div>
                  <p className="f-body mt-4 text-sm leading-relaxed max-w-md" style={{ color: C.mid }}>{currentBrief.brief}</p>
                  <button onClick={() => go("week")} className="f-mono text-xs uppercase tracking-widest flex items-center gap-1 group mt-6" style={{ color: C.ink }}>
                    Follow along <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
                <div className="w-full md:w-56 shrink-0">
                  <div className="w-full aspect-[4/5] rounded relative overflow-hidden float-slow" style={{ border: `1px dashed ${C.lineStrong}` }}>
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(135deg, ${C.line} 0px, ${C.line} 1px, transparent 1px, transparent 12px)`,
                    }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                      <Lock size={18} color={C.faint} />
                      <span className="f-mono uppercase text-[9px] tracking-widest" style={{ color: C.faint }}>Picked. We're designing it.</span>
                    </div>
                  </div>
                  <p className="f-mono text-[10px] mt-2" style={{ color: C.faint }}>Hidden until it's done — next pool opens {CYCLE.nextOpen}.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 max-w-2xl">
                <div>
                  <div className="f-display" style={{ fontSize: 24, fontWeight: 600, color: C.ink }}>Submissions are closed for now.</div>
                  <p className="f-body mt-3 text-sm leading-relaxed max-w-md" style={{ color: C.mid }}>
                    Last week's pick just shipped. The pool reopens {CYCLE.nextOpen} — check back then to submit a brief.
                  </p>
                </div>
                <SubmitCTA go={go} className="shrink-0" />
              </div>
            )}
          </Reveal>
        </Entry>
      )}

      {/* Past weeks — the actual work, same log format. Wrapped with an id so
          the floating sample can hide itself while this stretch scrolls by. */}
      <div id="archive-weeks">
        {ARCHIVE.map((a, i) => (
          <Entry key={a.week} index={`W${String(a.week).padStart(2, "0")}`} meta={a.category}>
            <Reveal delay={i * 80}>
              <button onClick={() => openBrief(a)} className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8 text-left group w-full">
                <div className="w-full md:w-64 shrink-0 aspect-[4/5] rounded relative overflow-hidden" style={{ background: a.images ? C.paperDim : `linear-gradient(150deg, ${a.grad[0]}, ${a.grad[1]})` }}>
                  {a.images ? (
                    <ArchiveCardMedia a={a} />
                  ) : (
                    <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110" />
                  )}
                </div>
                <div className="pt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="f-display transition-colors duration-300 group-hover:opacity-60" style={{ fontSize: 22, fontWeight: 600, color: C.ink }}>{a.business}</div>
                    {a.commissioned && <CommissionedTag />}
                  </div>
                  <div className="f-body text-sm mt-2 leading-relaxed max-w-md" style={{ color: C.mid }}>{a.brief}</div>
                  <span className="f-mono text-[11px] uppercase tracking-widest flex items-center gap-1 group mt-4" style={{ color: C.ink }}>
                    See the design <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
            </Reveal>
          </Entry>
        ))}
      </div>

      {/* Fine print — mechanics, kept quiet and appendix-like. Also the cue
          for the floating sample to reappear once the archive has passed. */}
      <div id="fine-print">
        <Entry index="—" meta="The fine print">
          <Reveal>
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-14 max-w-2xl">
              {[
                ["Drop a brief", "Tell me what you need, who it's for, and what it should say."],
                ["One gets picked, every week", "Reviewed, shortlisted, then one is picked — from everyone who submitted."],
                ["It lands in your inbox", "Fully art-directed, free, ready to publish."],
              ].map(([t, d]) => (
                <div key={t} className="flex-1">
                  <div className="f-body text-sm font-medium" style={{ color: C.ink }}>{t}</div>
                  <p className="f-body text-xs mt-1.5 leading-relaxed" style={{ color: C.mid }}>{d}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-10 max-w-xl" style={{ borderTop: `1px solid ${C.line}` }}>
              <div className="f-body text-sm font-medium" style={{ color: C.ink }}>You already have the brief.</div>
              <p className="f-body text-sm mt-2 leading-relaxed" style={{ color: C.mid }}>
                No pitch. No quote. No awkward sales call. Just tell me what you're trying to achieve — if I pick it, I'll figure out the creative.
              </p>
            </div>

            <div id="why-section" className="mt-10 pt-10 max-w-xl" style={{ borderTop: `1px solid ${C.line}` }}>
              <span className="f-mono uppercase text-[10px] tracking-widest" style={{ color: C.faint }}>Why</span>
              <p className="f-body text-sm mt-3 leading-relaxed" style={{ color: C.mid, opacity: 0.75 }}>
                I miss making proper campaign work for real businesses — the idea, the direction, the type, the tiny details nobody asked for. So I started making it again.
              </p>
            </div>
          </Reveal>
        </Entry>
      </div>
    </div>
  );
}

/* ============================================================
   WEEK PAGE (current cycle detail)
   ============================================================ */
function WeekPage({ go }) {
  const C = useC();
  return (
    <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-14 pb-24">
      <Reveal>
        <div className="text-center">
          <Eyebrow center>Week {CYCLE.week}</Eyebrow>
          <h1 className="f-display mt-4" style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 600, color: C.ink }}>The current <WaveFillText>cycle.</WaveFillText></h1>
          <p className="f-body mt-4 max-w-lg mx-auto" style={{ color: C.mid, fontSize: 16 }}>
            {submissionsOpen
              ? `${POOL.length} briefs submitted so far. One gets picked ${CYCLE.deadline}.`
              : currentBrief
                ? `${POOL.length} briefs came in this week. One got picked — here's where it stands.`
                : `Submissions are closed right now. The pool reopens ${CYCLE.nextOpen}.`}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-3 mt-6">
            {[`${POOL.length} briefs`, "shortlisted", "1 picked", "finished design"].map((step, i, arr) => (
              <React.Fragment key={step}>
                <span className="f-mono uppercase text-[10px] tracking-widest px-3 py-1.5 rounded-full" style={{
                  border: `1px solid ${i === arr.length - 1 ? C.accent : C.lineStrong}`,
                  color: i === arr.length - 1 ? C.accent : C.mid,
                }}>
                  {step}
                </span>
                {i < arr.length - 1 && <ArrowRight size={11} color={C.faint} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Reveal>

      {submissionsOpen ? (
        <Reveal delay={120}>
          <div className="mt-14 rounded p-8 sm:p-10 hover-lift text-center flex flex-col items-center" style={{ border: `1px solid ${C.line}` }}>
            <Eyebrow center>The pool is open</Eyebrow>
            <div className="f-display mt-4" style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>Nothing's been picked yet.</div>
            <p className="f-body mt-3 max-w-md" style={{ color: C.mid, fontSize: 15, lineHeight: 1.65 }}>
              Drop a brief before {CYCLE.deadline} and it's in the running for this week's pick.
            </p>
            <SubmitCTA go={go} className="mt-7" />
          </div>
        </Reveal>
      ) : currentBrief ? (
        <Reveal delay={120}>
          <div className="mt-14">
            <div className="rounded p-8 sm:p-10 hover-lift" style={{ border: `1px solid ${C.line}` }}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Eyebrow>This week's pick</Eyebrow>
                <div className="flex items-center gap-2">
                  {currentBrief.commissioned && <CommissionedTag />}
                  <StatusPill status="Designing" />
                </div>
              </div>
              <div className="f-display mt-4" style={{ fontSize: 32, fontWeight: 600, color: C.ink }}>{currentBrief.business}</div>
              <div className="f-mono uppercase text-[11px] tracking-widest mt-1" style={{ color: C.mid }}>{currentBrief.category}</div>
              <p className="f-body mt-5 max-w-2xl" style={{ color: C.ink, fontSize: 16, lineHeight: 1.6 }}>"{currentBrief.brief}"</p>
              <div className="mt-8">
                <ProgressTrack status="Designing" />
              </div>
              <div className="mt-10 rounded flex flex-col items-center justify-center text-center py-14 float-slow" style={{ backgroundColor: C.paperDim }}>
                <div className="f-display" style={{ fontSize: 24, fontWeight: 600, color: C.ink }}>Picked.</div>
                <p className="f-body text-sm mt-2" style={{ color: C.mid }}>"We're designing it. Come back Friday."</p>
              </div>
            </div>
          </div>
        </Reveal>
      ) : (
        <Reveal delay={120}>
          <div className="mt-14 rounded p-8 sm:p-10 hover-lift text-center flex flex-col items-center" style={{ border: `1px solid ${C.line}` }}>
            <Eyebrow center dot={false}><Lock size={11} />Closed</Eyebrow>
            <div className="f-display mt-4" style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>Nothing's open right now.</div>
            <p className="f-body mt-3 max-w-md" style={{ color: C.mid, fontSize: 15, lineHeight: 1.65 }}>
              Last week's pick just shipped. The pool reopens {CYCLE.nextOpen} for the next round.
            </p>
          </div>
        </Reveal>
      )}
    </div>
  );
}

/* ============================================================
   PROJECT / REVEAL PAGE
   ============================================================ */
function ProjectPage({ project, go, openBrief }) {
  const C = useC();
  const p = project || ARCHIVE[0];
  const more = ARCHIVE.filter((a) => a.week !== p.week).slice(0, 3);

  // Cloudinary honors fl_attachment as a Content-Disposition hint, forcing a real
  // download instead of navigating to the image — plain <a download> doesn't
  // reliably work cross-origin.
  const toDownloadUrl = (url) => {
    if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
    return url.replace("/upload/", "/upload/fl_attachment/");
  };

  const downloadOne = (url, filename) => {
    const a = document.createElement("a");
    a.href = toDownloadUrl(url);
    a.download = filename || "";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-10">
        <button onClick={() => go("archive")} aria-label="Back to archive" className="inline-flex items-center justify-center rounded-full group" style={{ width: 36, height: 36, border: `1px solid ${C.line}`, color: C.mid, transition: "border-color .2s ease, color .2s ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.lineStrong; e.currentTarget.style.color = C.ink; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.mid; }}
        >
          <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
        </button>
      </div>
      <Reveal>
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-8 pb-8 text-center">
          <Eyebrow center>Week 0{p.week}</Eyebrow>
          <h1 className="f-display mt-5" style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 600, color: C.ink }}>
            {p.business}
          </h1>
          <div className="f-mono uppercase text-xs tracking-widest mt-2" style={{ color: C.mid }}>{p.category}</div>
          {p.commissioned && (
            <div className="mt-3">
              <CommissionedTag />
            </div>
          )}
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
          <Eyebrow>The design</Eyebrow>
          <div className="mt-5">
          {p.images ? (
            <div className={`grid gap-4 ${p.images.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
              {p.images.map((src, idx) => (
                <div key={idx} className="w-full aspect-[4/5] rounded overflow-hidden relative group flex items-center justify-center" style={{ backgroundColor: C.paperDim }}>
                  <img src={src} alt={`${p.business} — ${idx === 0 ? p.title : "logo"}`} className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]" />
                  <button
                    onClick={() => downloadOne(src, `${p.business} — ${p.title} ${idx + 1}`)}
                    className="absolute bottom-3 right-3 f-mono uppercase text-[10px] tracking-widest px-3 py-2 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ backgroundColor: C.ink, color: C.paper }}
                  >
                    <Download size={11} /> Save
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full aspect-[16/10] rounded overflow-hidden relative group" style={{ background: `linear-gradient(150deg, ${p.grad[0]}, ${p.grad[1]})` }}>
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105">
                <div className="f-display text-center" style={{ color: p.accent, fontSize: "clamp(28px,6vw,72px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
                  {p.title}
                </div>
              </div>
              <div className="absolute bottom-5 left-6 f-mono text-[10px] uppercase tracking-widest" style={{ color: "#fff", opacity: 0.7 }}>
                Made for {p.business}
              </div>
            </div>
          )}
          </div>
        </div>
      </Reveal>

      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16 flex flex-col gap-12 max-w-3xl">
        <Reveal>
          <div>
            <Eyebrow>The problem</Eyebrow>
            <p className="f-body mt-4 leading-relaxed" style={{ color: C.ink, fontSize: 16 }}>{p.brief}</p>
          </div>
        </Reveal>
        {p.challenge && (
          <Reveal delay={80}>
            <div>
              <Eyebrow>The challenge</Eyebrow>
              <p className="f-body mt-4 leading-relaxed" style={{ color: C.ink, fontSize: 16 }}>{p.challenge}</p>
            </div>
          </Reveal>
        )}
        <Reveal delay={160}>
          <div>
            <Eyebrow>The approach</Eyebrow>
            <p className="f-body mt-4 leading-relaxed" style={{ color: C.ink, fontSize: 16 }}>{p.thinking}</p>
          </div>
        </Reveal>
        <Reveal delay={240}>
          <div className="pt-8" style={{ borderTop: `1px solid ${C.line}` }}>
            <Eyebrow>The result</Eyebrow>
            <p className="f-body mt-4 leading-relaxed" style={{ color: C.mid, fontSize: 16 }}>
              {p.commissioned
                ? `Commissioned directly and delivered — a finished, ready-to-publish design for ${p.business}.`
                : `Picked from that week's pool, delivered free — a finished, ready-to-publish design for ${p.business}.`}
            </p>
          </div>
        </Reveal>
      </div>

      {more.length > 0 && (
        <Reveal>
          <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pb-16" style={{ borderTop: `1px solid ${C.line}`, paddingTop: 56 }}>
            <div className="flex items-center justify-between mb-8">
              <Eyebrow>More work</Eyebrow>
              <button onClick={() => go("archive")} className="f-mono text-[11px] uppercase tracking-widest flex items-center gap-1.5 group shrink-0" style={{ color: C.mid }}>
                See the full archive <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {more.map((o) => (
                <button key={o.week} onClick={() => openBrief(o)} className="text-left group">
                  <div className="w-full aspect-[4/5] rounded relative overflow-hidden" style={{ background: o.images ? C.paperDim : `linear-gradient(150deg, ${o.grad[0]}, ${o.grad[1]})` }}>
                    {o.images ? (
                      <ArchiveCardMedia a={o} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-90 transition-transform duration-500 group-hover:scale-110">
                        <span className="f-display" style={{ color: o.accent, fontSize: 20, fontWeight: 700 }}>{o.title}</span>
                      </div>
                    )}
                  </div>
                  <div className="f-body text-sm mt-3 transition-opacity duration-300 group-hover:opacity-60" style={{ color: C.ink, fontWeight: 500 }}>{o.business}</div>
                  <div className="f-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: C.faint }}>{o.category}</div>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      <Reveal>
        <div className="flex flex-col items-center gap-5 pb-24 text-center">
          <div className="f-display" style={{ fontSize: 22, fontWeight: 600, color: C.ink }}>Got something that needs designing?</div>
          <p className="f-body text-sm" style={{ color: C.mid }}>Maybe I'll design yours.</p>
          <SubmitCTA go={go} variant="ghost" icon={null} />
        </div>
      </Reveal>
    </div>
  );
}

/* ============================================================
   ARCHIVE
   ============================================================ */
function ArchiveCardMedia({ a }) {
  const [idx, setIdx] = useState(0);
  const multi = a.images && a.images.length > 1;

  useEffect(() => {
    if (!multi) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % a.images.length), 2200);
    return () => clearInterval(t);
  }, [multi, a.images]);

  if (!a.images) {
    return (
      <>
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110" style={{ background: `linear-gradient(150deg, ${a.grad[0]}, ${a.grad[1]})` }} />
        <div className="absolute inset-0 flex items-center justify-center opacity-90">
          <span className="f-display transition-transform duration-500 group-hover:-translate-y-1 inline-block" style={{ color: a.accent, fontSize: 26, fontWeight: 700 }}>{a.title}</span>
        </div>
      </>
    );
  }

  return (
    <>
      {a.images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${a.business} — ${a.title}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          style={{ opacity: i === idx ? 1 : 0, transition: "opacity 0.7s ease, transform 0.5s ease-out" }}
        />
      ))}
      {multi && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {a.images.map((_, i) => (
            <span
              key={i}
              className="rounded-full"
              style={{
                width: i === idx ? 14 : 5, height: 5,
                backgroundColor: i === idx ? "#fff" : "rgba(255,255,255,0.45)",
                transition: "width 0.3s ease, background-color 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

const ARCHIVE_FILTERS = [
  { id: "all", label: "All" },
  { id: "picked", label: "Picked from the pool" },
  { id: "commissioned", label: "Commissioned" },
];

function ArchivePage({ go, openBrief }) {
  const C = useC();
  const [filter, setFilter] = useState("all");
  const filtered = ARCHIVE.filter((a) => {
    if (filter === "commissioned") return !!a.commissioned;
    if (filter === "picked") return !a.commissioned;
    return true;
  });

  return (
    <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-16 pb-24">
      <Reveal>
        <Eyebrow>Every brief that's been picked</Eyebrow>
        <h1 className="f-display mt-4" style={{ fontSize: "clamp(32px,5vw,58px)", fontWeight: 600, color: C.ink }}>The picks.</h1>
        <p className="f-body mt-4 max-w-lg" style={{ color: C.mid, fontSize: 16 }}>Real problems, picked one at a time, and turned into finished creative — free, one a week.</p>
      </Reveal>

      <Reveal delay={80}>
        <div className="flex flex-wrap items-center gap-6 mt-10" style={{ borderBottom: `1px solid ${C.line}`, paddingBottom: 14 }}>
          {ARCHIVE_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="relative f-mono uppercase text-[11px] tracking-widest py-1"
              style={{ color: filter === f.id ? C.ink : C.mid, transition: "color .25s ease" }}
            >
              {f.label}
              <span
                className="absolute left-0 -bottom-0.5 h-px w-full origin-left transition-transform duration-300"
                style={{ backgroundColor: C.ink, transform: filter === f.id ? "scaleX(1)" : "scaleX(0)" }}
              />
            </button>
          ))}
        </div>
      </Reveal>

      {filtered.length === 0 ? (
        <p className="f-body text-sm mt-14" style={{ color: C.mid }}>Nothing here yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {filtered.map((a, i) => (
            <Reveal delay={i * 100} key={a.week}>
              <button onClick={() => openBrief(a)} className="text-left group w-full">
                <div className="w-full aspect-[4/5] rounded relative overflow-hidden" style={{ backgroundColor: a.images ? C.paperDim : "transparent" }}>
                  <ArchiveCardMedia a={a} />
                </div>
                <div className="f-display mt-3 transition-colors duration-300 group-hover:opacity-60" style={{ fontSize: 18, fontWeight: 600, color: C.ink }}>{a.business}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="f-mono uppercase text-[10px] tracking-widest" style={{ color: C.mid }}>{a.category}</span>
                  {a.commissioned && <CommissionedTag />}
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      )}

      <div className="mt-20 flex justify-center">
        <SubmitCTA go={go} />
      </div>
    </div>
  );
}

/* ============================================================
   SUBMISSION FLOW
   ============================================================ */
const DRAFT_KEY = "picked_brief_draft";

function SubmitFlow({ go }) {
  const C = useC();
  const inputStyle = { border: `1px solid ${C.line}`, backgroundColor: C.paper, padding: "13px 16px", borderRadius: 3, width: "100%", fontSize: 15, fontFamily: "'Inter',sans-serif", outline: "none", color: C.ink, transition: "border-color .2s ease, box-shadow .2s ease" };
  const [step, setStep] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      return saved?.step ?? 0;
    } catch { return 0; }
  });
  const [data, setData] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      return saved?.data ?? {
        goal: "", format: "",
        businessName: "", category: "",
        instagram: "", facebook: "", tiktok: "", twitter: "", website: "",
        brief: "", email: "", phone: "",
      };
    } catch {
      return {
        goal: "", format: "",
        businessName: "", category: "",
        instagram: "", facebook: "", tiktok: "", twitter: "", website: "",
        brief: "", email: "", phone: "",
      };
    }
  });
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const steps = ["Tell me about it", "The brief", "References", "Delivery", "Review"];
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  // Autosave the draft on every change so a reload or accidental navigation doesn't lose it.
  useEffect(() => {
    if (done) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, data }));
    } catch { /* storage unavailable — fail silently, nothing to save to anyway */ }
  }, [step, data, done]);

  // Which step a given form field lives on, so we can jump the user back to a field an error points at.
  const stepForField = (field) => {
    if (["businessName", "category"].includes(field)) return 0;
    if (field === "brief") return 1;
    if (["email", "phone"].includes(field)) return 3;
    return step;
  };

  const submitBrief = async () => {
    setSending(true);
    setError("");
    setFieldErrors({});
    try {
      const res = await fetch("https://formspree.io/f/xqpzgoap", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        try { localStorage.removeItem(DRAFT_KEY); } catch { /* nothing to clean up */ }
        setDone(true);
        return;
      }

      // Try to read Formspree's actual error payload instead of showing a generic message.
      let payload = null;
      try { payload = await res.json(); } catch { /* non-JSON error body */ }

      if (payload?.errors?.length) {
        const messages = payload.errors.map((e) => e.message || `${e.field || "Field"} is invalid`);
        setError(messages.join(" "));
        const fe = {};
        let jumpTo = null;
        payload.errors.forEach((e) => {
          if (e.field) {
            fe[e.field] = e.message || "This field is invalid.";
            if (jumpTo === null) jumpTo = stepForField(e.field);
          }
        });
        setFieldErrors(fe);
        if (jumpTo !== null && jumpTo !== step) setStep(jumpTo);
      } else if (payload?.error) {
        setError(payload.error);
      } else {
        setError(`Something went wrong sending your brief (error ${res.status}). Please try again.`);
      }
    } catch {
      setError("Couldn't reach the server — check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  // Website is optional, but if something's typed in, it has to actually look like a link.
  const isValidWebsite = (v) => {
    const val = v.trim();
    if (!val) return true;
    const withProto = /^https?:\/\//i.test(val) ? val : `https://${val}`;
    try {
      const u = new URL(withProto);
      return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(u.hostname);
    } catch {
      return false;
    }
  };

  const canNext = () => {
    if (step === 0) return data.businessName.trim().length > 1 && data.category && isValidWebsite(data.website);
    if (step === 1) return data.brief.trim().length > 12;
    if (step === 3) return /\S+@\S+\.\S+/.test(data.email);
    return true;
  };

  if (!submissionsOpen && !done) {
    return (
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-24 pb-24 text-center rise">
        <Lock size={20} color={C.faint} className="mx-auto" />
        <h1 className="f-display mt-5" style={{ fontSize: 34, fontWeight: 600, color: C.ink }}>The pool's closed right now.</h1>
        <p className="f-body text-sm mt-4 max-w-sm mx-auto" style={{ color: C.mid, lineHeight: 1.65 }}>
          Submissions are closed for now. They reopen {CYCLE.nextOpen} — come back then.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button variant="ghost" icon={null} onClick={() => go("week")}>See this week's brief</Button>
          <Button variant="text" icon={null} onClick={() => go("home")}>Back home</Button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-24 pb-24 text-center rise">
        <Eyebrow>Submission received</Eyebrow>
        <h1 className="f-display mt-5" style={{ fontSize: 44, fontWeight: 600, color: C.ink }}>You're in.</h1>
        <div className="f-mono text-sm mt-3" style={{ color: C.mid }}>BRIEF #0259</div>

        <div className="mt-10 rounded p-8" style={{ border: `1px solid ${C.line}` }}>
          <div className="flex items-center gap-2">
            <span className="f-mono uppercase text-[10px] tracking-widest" style={{ color: C.faint }}>Status</span>
            <StatusPill status="Submitted" />
          </div>
          <p className="f-body text-sm mt-4" style={{ color: C.mid }}>Every week, one brief gets picked. Yours is officially in the pool for Week {CYCLE.week}.</p>
          <div className="mt-8 overflow-x-auto">
            <ProgressTrack status="Submitted" />
          </div>
        </div>

        <p className="f-body text-sm mt-8" style={{ color: C.mid }}>
          We'll email <span style={{ color: C.ink }}>{data.email || "you"}</span> the moment anything changes.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button onClick={() => go("status")}>What happens next</Button>
          <Button variant="ghost" icon={null} onClick={() => go("home")}>Back home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-14 pb-24">
      <div className="flex items-center justify-between mb-3">
        <Eyebrow>Drop your brief</Eyebrow>
        <span className="f-mono text-[10px] uppercase tracking-widest" style={{ color: C.faint }}>{step + 1} / {steps.length}</span>
      </div>
      <div className="w-full h-px mb-10" style={{ backgroundColor: C.line }}>
        <div className="h-px transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%`, backgroundColor: C.accent }} />
      </div>

      <h2 className="f-display" style={{ fontSize: 32, fontWeight: 600, color: C.ink }}>{steps[step]}</h2>

      <div className="mt-9 rise" key={step}>
        {step === 0 && (
          <div className="flex flex-col gap-6">
            <Field label="What are you trying to make happen?" optional>
              <div className="flex flex-wrap gap-2">
                {["Promote a weekend offer", "Launch a new product", "Get people to attend an event", "Announce something important", "Make our new service impossible to ignore", "Something else"].map((g) => (
                  <Chip key={g} active={data.goal === g} onClick={() => set("goal", g)}>{g}</Chip>
                ))}
              </div>
            </Field>
            <Field label="Business name">
              <input value={data.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder="Lagos Street Food Co." style={inputStyle} />
            </Field>
            <Field label="Business category">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Chip key={c} active={data.category === c} onClick={() => set("category", c)}>{c}</Chip>
                ))}
              </div>
            </Field>
            <Field label="Social media platforms" optional>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="f-mono text-[10px] uppercase tracking-widest mb-1.5" style={{ color: C.faint }}>Instagram</div>
                  <input value={data.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@yourbusiness" style={inputStyle} />
                </div>
                <div>
                  <div className="f-mono text-[10px] uppercase tracking-widest mb-1.5" style={{ color: C.faint }}>Facebook</div>
                  <input value={data.facebook} onChange={(e) => set("facebook", e.target.value)} placeholder="facebook.com/yourbusiness" style={inputStyle} />
                </div>
                <div>
                  <div className="f-mono text-[10px] uppercase tracking-widest mb-1.5" style={{ color: C.faint }}>TikTok</div>
                  <input value={data.tiktok} onChange={(e) => set("tiktok", e.target.value)} placeholder="@yourbusiness" style={inputStyle} />
                </div>
                <div>
                  <div className="f-mono text-[10px] uppercase tracking-widest mb-1.5" style={{ color: C.faint }}>X / Twitter</div>
                  <input value={data.twitter} onChange={(e) => set("twitter", e.target.value)} placeholder="@yourbusiness" style={inputStyle} />
                </div>
                <div className="sm:col-span-2">
                  <div className="f-mono text-[10px] uppercase tracking-widest mb-1.5" style={{ color: C.faint }}>Website</div>
                  <input value={data.website} onChange={(e) => set("website", e.target.value)} placeholder="yourbusiness.com" style={{ ...inputStyle, borderColor: data.website && !isValidWebsite(data.website) ? "#C0392B" : C.line }} />
                  {data.website && !isValidWebsite(data.website) && (
                    <p className="f-body text-xs mt-2" style={{ color: "#C0392B" }}>That doesn't look like a valid link — try something like yourbusiness.com</p>
                  )}
                </div>
              </div>
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-8">
            <div>
              <textarea
                value={data.brief} onChange={(e) => set("brief", e.target.value)}
                placeholder="What do you need people to see, understand, or do?"
                rows={8}
                className="f-body w-full p-5 rounded outline-none resize-none"
                style={{ border: `1px solid ${C.line}`, backgroundColor: C.paper, fontSize: 15, lineHeight: 1.6 }}
              />
              <p className="f-body text-xs mt-3" style={{ color: C.mid }}>
                Give me the context. Tell me what you're promoting, who it's for, what you want it to communicate, and anything I should know.
              </p>
            </div>
            <Field label="What needs to be designed?" optional>
              <div className="flex flex-wrap gap-2">
                {["Social campaign", "Promotional graphic", "Event campaign", "Product launch", "Advertisement", "Poster", "Flyer", "Menu", "Editorial graphic", "Other"].map((f) => (
                  <Chip key={f} active={data.format === f} onClick={() => set("format", f)}>{f}</Chip>
                ))}
              </div>
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="rounded p-8 sm:p-10" style={{ border: `1px solid ${C.line}` }}>
            <Clock size={20} color={C.mid} />
            <div className="f-display mt-4" style={{ fontSize: 22, fontWeight: 600, color: C.ink }}>
              Nothing to upload right now.
            </div>
            <p className="f-body mt-3 max-w-md" style={{ fontSize: 15, lineHeight: 1.65, color: C.mid }}>
              If your brief gets picked, I'll follow up by email and ask for whatever the campaign actually needs — your logo, brand colors, product photos, stock images, that kind of thing.
            </p>
            <p className="f-body mt-3 max-w-md" style={{ fontSize: 15, lineHeight: 1.65, color: C.mid }}>
              No sense collecting files for a brief that might not get made.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <Field label="Email address">
              <input value={data.email} onChange={(e) => { set("email", e.target.value); setFieldErrors((fe) => ({ ...fe, email: undefined })); }} placeholder="you@business.com" style={{ ...inputStyle, borderColor: fieldErrors.email ? "#C0392B" : C.line }} />
              {fieldErrors.email && <p className="f-body text-xs mt-2" style={{ color: "#C0392B" }}>{fieldErrors.email}</p>}
            </Field>
            <Field label="Phone number" optional>
              <input value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234 ..." style={inputStyle} />
            </Field>
          </div>
        )}

        {step === 4 && (
          <div className="rounded p-7" style={{ border: `1px solid ${C.line}` }}>
            {[
              ["Trying to", data.goal || "—"],
              ["Business", data.businessName || "—"],
              ["Category", data.category || "—"],
              ["Format", data.format || "—"],
              ["Brief", data.brief ? data.brief.slice(0, 120) + (data.brief.length > 120 ? "…" : "") : "—"],
              ["Delivery email", data.email || "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-3" style={{ borderBottom: `1px solid ${C.line}` }}>
                <span className="f-mono uppercase text-[10px] tracking-widest shrink-0" style={{ color: C.faint }}>{k}</span>
                <span className="f-body text-sm text-right" style={{ color: C.ink }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-10">
        <button onClick={() => (step === 0 ? go("home") : setStep(step - 1))} className="f-mono uppercase text-xs tracking-widest flex items-center gap-2" style={{ color: C.mid }}>
          <ArrowLeft size={13} /> {step === 0 ? "Cancel" : "Back"}
        </button>
        {step < steps.length - 1 ? (
          <Button onClick={() => canNext() && setStep(step + 1)} className={!canNext() ? "opacity-40 pointer-events-none" : ""}>Continue</Button>
        ) : (
          <Button onClick={submitBrief} className={sending ? "opacity-60 pointer-events-none" : ""}>{sending ? "Sending…" : "Drop my brief"}</Button>
        )}
      </div>
      {error && (
        <p className="f-body text-sm mt-4 text-center" style={{ color: "#C0392B" }}>{error}</p>
      )}
    </div>
  );
}

function Field({ label, children, optional }) {
  const C = useC();
  return (
    <div>
      <div className="f-mono uppercase text-[10px] tracking-widest mb-2.5 flex items-center gap-2" style={{ color: C.mid }}>
        {label} {optional && <span style={{ color: C.faint }}>(optional)</span>}
      </div>
      {children}
    </div>
  );
}

function Chip({ children, active, onClick }) {
  const C = useC();
  return (
    <button onClick={onClick} className="f-mono text-[11px] uppercase tracking-wide px-3.5 py-2 rounded-full btn-press"
      style={{ border: `1px solid ${active ? C.ink : C.line}`, backgroundColor: active ? C.ink : "transparent", color: active ? C.paper : C.mid, transition: "all .25s cubic-bezier(.16,1,.3,1)" }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = C.ink; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = C.line; }}
    >
      {children}
    </button>
  );
}

/* ============================================================
   STATUS LOOKUP
   ============================================================ */
function StatusPage() {
  const C = useC();
  return (
    <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-16 pb-24">
      <Eyebrow>You already have the brief</Eyebrow>
      <h1 className="f-display mt-4" style={{ fontSize: 38, fontWeight: 600, color: C.ink }}>No pitch. No quote. No awkward sales call.</h1>
      <p className="f-body text-sm mt-4 max-w-lg" style={{ color: C.mid }}>
        Just tell me what you're trying to achieve. If I pick it, I'll figure out the creative — here's exactly what
        happens between now and then.
      </p>

      <div className="mt-10 rounded p-8" style={{ border: `1px solid ${C.line}` }}>
        <div className="flex flex-col gap-8">
          <div className="flex gap-4">
            <span className="f-mono text-xs mt-1" style={{ color: C.faint }}>01</span>
            <div>
              <div className="f-body text-sm font-medium" style={{ color: C.ink }}>Your brief joins the pool</div>
              <p className="f-body text-sm mt-1" style={{ color: C.mid }}>It sits alongside everything else submitted this week — no queue position, no ranking.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="f-mono text-xs mt-1" style={{ color: C.faint }}>02</span>
            <div>
              <div className="f-body text-sm font-medium" style={{ color: C.ink }}>Reviewed, then shortlisted</div>
              <p className="f-body text-sm mt-1" style={{ color: C.mid }}>Every brief gets read. A few make the shortlist each week.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="f-mono text-xs mt-1" style={{ color: C.faint }}>03</span>
            <div>
              <div className="f-body text-sm font-medium" style={{ color: C.ink }}>One gets picked</div>
              <p className="f-body text-sm mt-1" style={{ color: C.mid }}>From that shortlist, one problem becomes this week's design — free, start to finish.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="f-mono text-xs mt-1" style={{ color: C.faint }}>04</span>
            <div>
              <div className="f-body text-sm font-medium" style={{ color: C.ink }}>You'll hear by email either way</div>
              <p className="f-body text-sm mt-1" style={{ color: C.mid }}>Picked or not, an email goes out to the address you submitted with — check your inbox (and spam folder, just in case).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FLOATING SAMPLE STICKER — draggable, click-to-expand
   ============================================================ */
const SAMPLE_IMAGES = [
  "https://res.cloudinary.com/dmqyultl0/image/upload/v1787210430/Instagram_post_-_5_u1nxqq.png",
  "https://res.cloudinary.com/dmqyultl0/image/upload/v1787227199/Instagram_post_-_8_ww1a49.png",
];

function FloatingSample() {
  const C = useC();
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: null, y: null });
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [idx, setIdx] = useState(0);
  const drag = useRef({ dragging: false, moved: false, offX: 0, offY: 0 });

  useEffect(() => {
    if (SAMPLE_IMAGES.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % SAMPLE_IMAGES.length), 2400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const SIZE = 168;
    function onMove(e) {
      if (!drag.current.dragging) return;
      drag.current.moved = true;
      const nx = Math.min(Math.max(0, e.clientX - drag.current.offX), window.innerWidth - SIZE);
      const ny = Math.min(Math.max(0, e.clientY - drag.current.offY), window.innerHeight - SIZE);
      setPos({ x: nx, y: ny });
    }
    function onUp() { drag.current.dragging = false; }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const onPointerDown = (e) => {
    const rect = ref.current.getBoundingClientRect();
    drag.current.dragging = true;
    drag.current.moved = false;
    drag.current.offX = e.clientX - rect.left;
    drag.current.offY = e.clientY - rect.top;
    if (pos.x === null) setPos({ x: rect.left, y: rect.top });
  };

  const onClick = () => {
    if (drag.current.moved) { drag.current.moved = false; return; }
    setOpen(true);
  };

  const style = pos.x === null
    ? { position: "fixed", right: 22, bottom: 22 }
    : { position: "fixed", left: pos.x, top: pos.y };

  return (
    <>
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="select-none float-slow"
        style={{
          ...style, zIndex: 55, cursor: "grab", touchAction: "none",
          transform: `rotate(${hover ? 0 : -6}deg) scale(${hover ? 1.04 : 1})`,
          transition: "transform .3s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div className="relative">
          <div
            className="f-mono uppercase text-[9px] tracking-widest px-2.5 py-1 rounded-full absolute -top-3 -left-3 z-10"
            style={{ backgroundColor: C.accent, color: "#fff", transform: "rotate(-8deg)", boxShadow: "0 4px 12px rgba(53,71,240,0.35)" }}
          >
            Sample
          </div>
          <div
            style={{
              width: 148, aspectRatio: "4 / 5", overflow: "hidden", borderRadius: 10,
              border: `2px solid ${C.ink}`, backgroundColor: C.paper, position: "relative",
              boxShadow: hover ? "0 18px 34px rgba(18,18,18,0.22)" : "0 10px 24px rgba(18,18,18,0.16)",
              transition: "box-shadow .3s ease",
            }}
          >
            {SAMPLE_IMAGES.map((src, i) => (
              <img key={src} src={src} alt="Sample social campaign design" draggable={false}
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain",
                  pointerEvents: "none", opacity: i === idx ? 1 : 0, transition: "opacity 0.7s ease",
                }} />
            ))}
            {SAMPLE_IMAGES.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {SAMPLE_IMAGES.map((_, i) => (
                  <span key={i} className="rounded-full" style={{
                    width: i === idx ? 12 : 4, height: 4,
                    backgroundColor: i === idx ? C.ink : "rgba(18,18,18,0.3)",
                    transition: "width 0.3s ease, background-color 0.3s ease",
                  }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center p-6"
          style={{ zIndex: 100, backgroundColor: "rgba(18,18,18,0.86)", animation: "riseIn .25s ease both" }}
          onClick={() => setOpen(false)}
        >
          <div className="max-w-md w-full rise" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-end mb-4">
              <button onClick={() => setOpen(false)} className="f-mono uppercase text-[10px] tracking-widest flex items-center gap-1.5 transition-transform duration-200 hover:rotate-90" style={{ color: "#fff" }}>
                <X size={14} />
              </button>
            </div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
              <img src={SAMPLE_IMAGES[idx]} alt="Sample social campaign design — full size" style={{ width: "100%", display: "block" }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   ROOT
   ============================================================ */
function AppShell() {
  const C = useC();
  const [view, setView] = useState("home");
  const [project, setProject] = useState(null);
  const go = (v) => { setView(v); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openBrief = (p) => { setProject(p); go("project"); };

  return (
    <div className="f-body min-h-screen w-full" style={{ backgroundColor: C.paper, color: C.ink, transition: "background-color .3s ease, color .3s ease" }}>
      <style>{getFonts(C)}</style>
      <Nav go={go} view={view} />
      <div key={view} className="rise">
        {view === "home" && <Home go={go} openBrief={openBrief} />}
        {view === "week" && <WeekPage go={go} />}
        {view === "archive" && <ArchivePage go={go} openBrief={openBrief} />}
        {view === "project" && <ProjectPage project={project} go={go} openBrief={openBrief} />}
        {view === "submit" && <SubmitFlow go={go} />}
        {view === "status" && <StatusPage />}
      </div>
      <Footer go={go} />
      {view === "home" && <FloatingSample />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
