import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ArrowRight, ArrowLeft, ArrowUpRight, Check, X, Upload, Clock,
  ChevronDown, ChevronRight, Search, Instagram, Globe, Lock,
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
  body{background-color:${C.paper};}
  input:focus, textarea:focus { border-color:${C.accent} !important; box-shadow:0 0 0 3px ${C.accentDim}; }
  @media (prefers-reduced-motion: reduce){ .marquee-track,.rise,.pulse-dot,.digit-in,.float-slow,.btn-press,.hover-lift{animation:none !important; transition:none !important;} }
`;

/* ============================================================
   MOCK DATA
   ============================================================ */
const CATEGORIES = ["Food & Hospitality", "Fashion", "Fitness", "Retail", "Beauty", "Music", "Real Estate", "Nonprofit"];

const STATUS_ORDER = ["Submitted", "Picked", "Designing", "Delivered"];

const POOL = [
  { id: "0241", business: "Lagos Street Food Co.", category: "Food & Hospitality", brief: "We need an Instagram post set for our weekend food festival — three posts and a story that feel loud, hot, and a little chaotic, like the market itself.", status: "Submitted", submitted: "Aug 11" },
  { id: "0242", business: "Marlowe & Finch", category: "Fashion", brief: "A social media post announcing our resort capsule collection. Quiet luxury, lots of negative space, one strong typographic moment.", status: "Submitted", submitted: "Aug 11" },
  { id: "0243", business: "Iron & Ember Gym", category: "Fitness", brief: "Social post for our 6am strength class. Should feel heavy, industrial, a little intimidating.", status: "Submitted", submitted: "Aug 12" },
  { id: "0244", business: "Petalworks", category: "Retail", brief: "Instagram teaser post for our new Yaba location opening.", status: "Submitted", submitted: "Aug 12" },
  { id: "0245", business: "Nova Skin Studio", category: "Beauty", brief: "Social post listing our facial treatments — clean, clinical, but warm.", status: "Submitted", submitted: "Aug 13" },
  { id: "0246", business: "Basement Sessions", category: "Music", brief: "Social post for an underground jazz night. Should feel smoky, analog, like it was printed on a risograph.", status: "Submitted", submitted: "Aug 13" },
  { id: "0247", business: "Third Place Coffee", category: "Food & Hospitality", brief: "Social post for our loyalty card launch — playful, stamp-and-punch card energy.", status: "Submitted", submitted: "Aug 14" },
  { id: "0248", business: "Ade & Sons Realty", category: "Real Estate", brief: "New listing announcement post for a waterfront property in Lekki.", status: "Submitted", submitted: "Aug 15" },
  { id: "0249", business: "Foundry Skate Co.", category: "Retail", brief: "Social post for our new deck series, three colourways.", status: "Submitted", submitted: "Aug 15" },
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
    week: 3, business: "Kairos", category: "Fitness", title: "Launch Campaign",
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
    week: 2, business: "Third Place Coffee", category: "Food & Hospitality", title: "Promo Flyer",
    grad: ["#2B2B2B", "#4A3A2C"], accent: "#E8A33D",
    brief: "We're opening a second location and want a flyer we can print and hand out around the neighbourhood — warm, a little rough around the edges, not corporate.",
    challenge: "The client wanted something printable at low cost — single colour on kraft paper — while still feeling considered.",
    thinking: "I leaned into the constraint. One ink colour, a hand-set feeling headline, and copy that reads like it was written by an actual person behind the counter, not a marketing team.",
  },
  {
    week: 1, business: "Studio Orea", category: "Beauty", title: "Studio Flyer",
    images: [
      "https://res.cloudinary.com/dmqyultl0/image/upload/v1787168515/Instagram_post_-_25_1_wrk0bu.png",
      "https://res.cloudinary.com/dmqyultl0/image/upload/v1787168512/Instagram_post_-_27_ws2qbz.png",
    ],
    grad: ["#3B0F1E", "#C96A2E"], accent: "#F6D9C4",
    brief: "A single flyer for our nail and lash studio in Lugbe, Abuja. Needs to carry the full service list and location without losing the glam — and make people want to book on the spot.",
    challenge: "A flyer that has to do a lot of jobs at once — services, pricing context, location, contact, a CTA — for a brand whose only existing asset was a playful, hand-lettered logo. The risk was cramming it full and losing the personality that logo already had.",
    thinking: "I designed everything around that hand-lettered mark instead of fighting it — a deep wine-to-amber gradient behind it for warmth, and let the actual nail work do the selling: three real photos anchored along the bottom instead of illustrations. Services and location live in one clean card on the right so the eye has somewhere to land, and the 'Book now' pill echoes the same loose, hand-drawn energy as the logo — so the CTA feels like part of the brand, not a sticker on top of it.",
  },
];

const CYCLE = {
  week: 4,
  opened: "Aug 11",
  deadline: "Aug 22",
  pickDate: "Aug 22, 5:00 PM WAT",
  nextOpen: "Aug 22", // when the pool reopens for the following week, once this one is picked
  status: "open", // open | picked | designing | delivered
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

function Eyebrow({ children, dot = true }) {
  const C = useC();
  return (
    <div className="f-mono flex items-center gap-2 uppercase tracking-widest text-xs" style={{ color: C.mid }}>
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
function SubmitCTA({ go, variant = "primary", label = "Submit a brief", icon, className = "", asLink = false }) {
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
    <Button variant={variant} onClick={() => go("submit")} icon={icon} className={className}>
      {label}
    </Button>
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
    Submitted: C.mid, Picked: C.ink, Designing: C.accent, Delivered: "#2E9C5B", Completed: "#2E9C5B", Rejected: C.faint,
  };
  return (
    <span className="f-mono uppercase tracking-widest text-[10px] px-2.5 py-1 rounded-full" style={{ color: C.white, backgroundColor: map[status] || C.mid }}>
      {status}
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
        <button onClick={() => go("home")} className="f-display flex items-center gap-2 tracking-tight group" style={{ fontSize: 20, fontWeight: 700, color: C.ink }}>
          PICKED
          <span className="inline-block w-1.5 h-1.5 rounded-full mt-1 transition-transform duration-300 group-hover:scale-150" style={{ backgroundColor: C.accent }} />
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
          <SubmitCTA go={go} variant="ghost" className="!py-2.5 !px-4" />
        </div>
      </div>
    </div>
  );
}

function Footer({ go }) {
  const C = useC();
  return (
    <div style={{ borderTop: `1px solid ${C.line}` }} className="mt-24">
      {/* Special work — commissions outside the weekly pick */}
      <div style={{ borderBottom: `1px solid ${C.line}`, backgroundColor: C.paperDim }}>
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16 sm:py-20">
          <span className="f-mono uppercase text-[10px] tracking-widest" style={{ color: C.faint }}>Not everyone wants to wait for Friday</span>
          <div className="f-display mt-3 max-w-xl" style={{ fontSize: "clamp(24px,3.2vw,34px)", lineHeight: 1.3, fontWeight: 500, color: C.ink }}>
            If you'd rather just hire me for a proper campaign, gig, or one-off — that's on the table too.
          </div>
          <p className="f-body mt-4 max-w-lg" style={{ fontSize: 15, lineHeight: 1.7, color: C.mid }}>
            No brief pool, no waiting your turn. Just email me directly and tell me what you need.
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
      </div>

      {/* Creator credit — its own section, not a footnote */}
      <div style={{ borderBottom: `1px solid ${C.line}` }}>
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16 sm:py-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div>
            <span className="f-mono uppercase text-[10px] tracking-widest" style={{ color: C.faint }}>Designed by</span>
            <div className="f-display mt-3" style={{ fontSize: "clamp(30px,4.5vw,48px)", fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>
              Isaac Oreoluwa
            </div>
          </div>
          <a href="https://isaacoreoluwa.xyz" target="_blank" rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 f-mono uppercase text-xs tracking-widest px-6 py-3.5 rounded-full shrink-0 btn-press"
            style={{ border: `1px solid ${C.ink}`, color: C.ink, transition: "background-color .25s ease, color .25s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.ink; e.currentTarget.style.color = C.paper; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = C.ink; }}
          >
            isaacoreoluwa.xyz <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-14 flex flex-col sm:flex-row justify-between gap-8">
        <div>
          <div className="f-display" style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>PICKED</div>
          <p className="f-body text-sm mt-2 max-w-xs" style={{ color: C.mid }}>
            One designer. One campaign a week. I miss making real stuff for real businesses — so here we are.
          </p>
        </div>
        <div className="flex gap-16">
          <div className="flex flex-col gap-2">
            <span className="f-mono uppercase text-[10px] tracking-widest mb-1" style={{ color: C.faint }}>Platform</span>
            <button onClick={() => go("home")} className="f-body text-sm text-left" style={{ color: C.ink }}>Home</button>
            <button onClick={() => go("archive")} className="f-body text-sm text-left" style={{ color: C.ink }}>Archive</button>
            <SubmitCTA go={go} asLink className="f-body text-sm text-left" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="f-mono uppercase text-[10px] tracking-widest mb-1" style={{ color: C.faint }}>Elsewhere</span>
            <span className="f-body text-sm flex items-center gap-1.5" style={{ color: C.mid }}><Instagram size={13} /> @picked.studio</span>
            <span className="f-body text-sm flex items-center gap-1.5" style={{ color: C.mid }}><Globe size={13} /> picked.design</span>
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
function PoolIllustration({ count }) {
  const C = useC();
  const hash = (n) => {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const W = 200, H = 240, PAD = 20;
  const dots = Array.from({ length: Math.max(count, 1) }, (_, i) => ({
    x: PAD + hash(i * 3.7 + 1) * (W - PAD * 2),
    y: PAD + hash(i * 9.1 + 4) * (H - PAD * 2 - 40), // keep clear of the label band at the bottom
  }));
  const pick = dots[Math.min(3, dots.length - 1)];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
      {/* corner registration marks */}
      <path d={`M10,26 L10,10 L26,10`} stroke={C.lineStrong} strokeWidth="1" fill="none" />
      <path d={`M${W - 26},10 L${W - 10},10 L${W - 10},26`} stroke={C.lineStrong} strokeWidth="1" fill="none" />
      <path d={`M10,${H - 26} L10,${H - 10} L26,${H - 10}`} stroke={C.lineStrong} strokeWidth="1" fill="none" />
      <path d={`M${W - 26},${H - 10} L${W - 10},${H - 10} L${W - 10},${H - 26}`} stroke={C.lineStrong} strokeWidth="1" fill="none" />

      {/* faint diagonal, purely compositional */}
      <line x1={PAD} y1={H - PAD - 30} x2={W - PAD} y2={PAD} stroke={C.line} strokeWidth="0.75" opacity="0.5" />

      {/* the pool — one hollow ring per brief */}
      {dots.map((d, i) => (
        d === pick ? null : <circle key={i} cx={d.x} cy={d.y} r="2.5" fill="none" stroke={C.lineStrong} strokeWidth="1" />
      ))}

      {/* the pick — crosshair + target ring around one node */}
      {pick && (
        <g>
          <line x1={pick.x - 22} y1={pick.y} x2={pick.x + 22} y2={pick.y} stroke={C.accent} strokeWidth="0.75" opacity="0.55" />
          <line x1={pick.x} y1={pick.y - 22} x2={pick.x} y2={pick.y + 22} stroke={C.accent} strokeWidth="0.75" opacity="0.55" />
          <circle cx={pick.x} cy={pick.y} r="13" fill="none" stroke={C.accent} strokeWidth="1" strokeDasharray="2 3" />
          <circle cx={pick.x} cy={pick.y} r="4" fill={C.accent} />
        </g>
      )}
    </svg>
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
  const Entry = ({ index, meta, children, first = false }) => (
    <div
      className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 grid grid-cols-[56px_1fr] sm:grid-cols-[96px_1fr] gap-6 sm:gap-10 py-12 sm:py-16"
      style={{ borderTop: first ? "none" : `1px solid ${C.line}` }}
    >
      <div className="pt-1">
        <div className="f-mono text-xs sm:text-sm" style={{ color: C.faint }}>{index}</div>
        {meta && <div className="f-mono uppercase text-[9px] sm:text-[10px] tracking-widest mt-2 leading-relaxed" style={{ color: C.mid }}>{meta}</div>}
      </div>
      <div>{children}</div>
    </div>
  );

  return (
    <div>
      {/* 00 — the intro note, standing in for a hero */}
      <Entry index="00" meta={<>Vol. 1<br />Ongoing</>} first>
        <div className="rise max-w-2xl">
          <p className="f-display" style={{ fontSize: "clamp(24px,3.4vw,34px)", lineHeight: 1.3, fontWeight: 500, color: C.ink }}>
            I miss making proper creative work for real businesses — the idea, the direction, the type, the tiny details nobody asked about. So I started doing it again.
          </p>
          <p className="f-body mt-5" style={{ fontSize: 15, lineHeight: 1.7, color: C.mid }}>
            One business, one campaign, every week — picked from whoever submits a brief. Free, because that's the whole point. Here's what's happened so far.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-7">
            <SubmitCTA go={go} />
            <Button variant="ghost" icon={null} onClick={() => go("archive")}>See the archive</Button>
          </div>
        </div>
      </Entry>

      {/* This week — open for submissions, or already in progress */}
      {submissionsOpen ? (
        <Entry
          index={`W${String(CYCLE.week).padStart(2, "0")}`}
          meta={<>{CYCLE.opened}<br /><span className="inline-flex items-center gap-1.5" style={{ color: C.accent }}><span className="inline-block w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: C.accent }} />Open</span></>}
        >
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="flex-1">
                <div className="f-display" style={{ fontSize: 26, fontWeight: 600, color: C.ink }}>The pool is open.</div>
                <p className="f-body mt-4 text-sm leading-relaxed max-w-md" style={{ color: C.mid }}>
                  Drop a brief before {CYCLE.deadline} and it's in the running. I pick one Friday — no shortlist, no funnel, just whichever one I can't stop thinking about.
                </p>
                <SubmitCTA go={go} className="mt-6" />
              </div>
              <div className="w-full md:w-56 shrink-0">
                <div className="w-full aspect-[4/5] rounded relative overflow-hidden" style={{ border: `1px solid ${C.line}`, backgroundColor: C.paperDim }}>
                  <PoolIllustration count={POOL.length} />
                  <div className="absolute inset-x-0 bottom-0 px-5 pt-10 pb-5" style={{ background: `linear-gradient(to top, ${C.paperDim} 50%, transparent)` }}>
                    <StatBlock value={String(POOL.length)} label="In the pool" />
                  </div>
                </div>
                <p className="f-mono text-[10px] mt-2" style={{ color: C.faint }}>Pick happens {CYCLE.pickDate}.</p>
              </div>
            </div>
          </Reveal>
        </Entry>
      ) : (
        <Entry
          index={`W${String(CYCLE.week).padStart(2, "0")}`}
          meta={<>{CYCLE.opened}<br /><span className="inline-flex items-center gap-1.5" style={{ color: C.accent }}><span className="inline-block w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: C.accent }} />In progress</span></>}
        >
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="flex-1">
                <div className="f-display" style={{ fontSize: 26, fontWeight: 600, color: C.ink }}>{currentBrief.business}</div>
                <div className="f-mono uppercase text-[10px] tracking-widest mt-1.5" style={{ color: C.mid }}>{currentBrief.category}</div>
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
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock size={20} color={C.faint} />
                  </div>
                </div>
                <p className="f-mono text-[10px] mt-2" style={{ color: C.faint }}>Hidden until it's done — next pool opens {CYCLE.nextOpen}.</p>
              </div>
            </div>
          </Reveal>
        </Entry>
      )}

      {/* Past weeks — the actual work, same log format */}
      {ARCHIVE.map((a, i) => (
        <Entry key={a.week} index={`W${String(a.week).padStart(2, "0")}`} meta={a.category}>
          <Reveal delay={i * 80}>
            <button onClick={() => openBrief(a)} className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8 text-left group w-full">
              <div className="w-full md:w-64 shrink-0 aspect-[4/5] rounded relative overflow-hidden" style={{ background: a.images ? C.paperDim : `linear-gradient(150deg, ${a.grad[0]}, ${a.grad[1]})` }}>
                {a.images ? (
                  <img src={a.images[0]} alt={`${a.business} — ${a.title}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
                ) : (
                  <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110" />
                )}
              </div>
              <div className="pt-1">
                <div className="f-display transition-colors duration-300 group-hover:opacity-60" style={{ fontSize: 22, fontWeight: 600, color: C.ink }}>{a.business}</div>
                <div className="f-body text-sm mt-2 leading-relaxed max-w-md" style={{ color: C.mid }}>{a.brief}</div>
                <span className="f-mono text-[11px] uppercase tracking-widest flex items-center gap-1 group mt-4" style={{ color: C.ink }}>
                  Read the thinking <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          </Reveal>
        </Entry>
      ))}

      {/* Fine print — mechanics, kept quiet and appendix-like */}
      <Entry index="—" meta="The fine print">
        <Reveal>
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-14 max-w-2xl">
            {[
              ["Drop a brief", "Tell me what you need, who it's for, and what it should say."],
              ["One gets picked, every Friday", "No shortlist, no rounds — just one, from everyone who submitted."],
              ["It lands in your inbox", "Fully art-directed, free, ready to publish."],
            ].map(([t, d]) => (
              <div key={t} className="flex-1">
                <div className="f-body text-sm font-medium" style={{ color: C.ink }}>{t}</div>
                <p className="f-body text-xs mt-1.5 leading-relaxed" style={{ color: C.mid }}>{d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Entry>
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
        <Eyebrow>Week {CYCLE.week}</Eyebrow>
        <h1 className="f-display mt-4" style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 600, color: C.ink }}>The current cycle.</h1>
        <p className="f-body mt-4 max-w-lg" style={{ color: C.mid, fontSize: 16 }}>
          {submissionsOpen
            ? `${POOL.length} briefs submitted so far. One gets picked ${CYCLE.deadline}.`
            : `${POOL.length} briefs were submitted this week. One got picked — here's where it stands.`}
        </p>
      </Reveal>

      {submissionsOpen ? (
        <Reveal delay={120}>
          <div className="mt-14 rounded p-8 sm:p-10 hover-lift text-center flex flex-col items-center" style={{ border: `1px solid ${C.line}` }}>
            <Eyebrow>The pool is open</Eyebrow>
            <div className="f-display mt-4" style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>Nothing's been picked yet.</div>
            <p className="f-body mt-3 max-w-md" style={{ color: C.mid, fontSize: 15, lineHeight: 1.65 }}>
              Drop a brief before {CYCLE.deadline} and it's in the running for this week's pick.
            </p>
            <SubmitCTA go={go} className="mt-7" />
          </div>
        </Reveal>
      ) : (
        <Reveal delay={120}>
          <div className="mt-14">
            <div className="rounded p-8 sm:p-10 hover-lift" style={{ border: `1px solid ${C.line}` }}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Eyebrow>This week's brief</Eyebrow>
                <StatusPill status="Designing" />
              </div>
              <div className="f-display mt-4" style={{ fontSize: 32, fontWeight: 600, color: C.ink }}>{currentBrief.business}</div>
              <div className="f-mono uppercase text-[11px] tracking-widest mt-1" style={{ color: C.mid }}>{currentBrief.category}</div>
              <p className="f-body mt-5 max-w-2xl" style={{ color: C.ink, fontSize: 16, lineHeight: 1.6 }}>"{currentBrief.brief}"</p>
              <div className="mt-8">
                <ProgressTrack status="Designing" />
              </div>
              <div className="mt-10 rounded flex flex-col items-center justify-center text-center py-14 float-slow" style={{ backgroundColor: C.paperDim }}>
                <div className="f-display" style={{ fontSize: 24, fontWeight: 600, color: C.ink }}>Design in progress.</div>
                <p className="f-body text-sm mt-2" style={{ color: C.mid }}>"Come back Friday."</p>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      <div className="mt-16 flex justify-center">
        <SubmitCTA go={go} label="Submit your own brief" />
      </div>
    </div>
  );
}

/* ============================================================
   PROJECT / REVEAL PAGE
   ============================================================ */
function ProjectPage({ project, go }) {
  const C = useC();
  const p = project || ARCHIVE[0];

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

  const downloadAll = () => {
    if (!p.images?.length) return;
    p.images.forEach((src, idx) => {
      setTimeout(() => downloadOne(src, `${p.business} — ${p.title} ${idx + 1}`), idx * 350);
    });
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
          <Eyebrow>Week 0{p.week} · The design is ready</Eyebrow>
          <h1 className="f-display mt-5" style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 600, color: C.ink }}>
            Designed for {p.business}.
          </h1>
          <div className="f-mono uppercase text-xs tracking-widest mt-2" style={{ color: C.mid }}>{p.category}</div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
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
      </Reveal>

      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16 grid sm:grid-cols-2 gap-12">
        <Reveal>
          <div>
            <Eyebrow>The brief</Eyebrow>
            <p className="f-body mt-4 leading-relaxed" style={{ color: C.ink, fontSize: 16 }}>{p.brief}</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div>
            <Eyebrow>The thinking</Eyebrow>
            <p className="f-body mt-4 leading-relaxed" style={{ color: C.ink, fontSize: 16 }}>{p.thinking}</p>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="flex flex-col items-center gap-5 pb-24">
          {p.images && <Button icon={Download} onClick={downloadAll}>Download design</Button>}
          <div className="f-display" style={{ fontSize: 20, fontWeight: 600, color: C.ink }}>Want me to design yours?</div>
          <SubmitCTA go={go} variant="ghost" icon={null} label="Submit another brief" />
        </div>
      </Reveal>
    </div>
  );
}

/* ============================================================
   ARCHIVE
   ============================================================ */
function ArchivePage({ go, openBrief }) {
  const C = useC();
  return (
    <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-16 pb-24">
      <Reveal>
        <Eyebrow>All completed weeks</Eyebrow>
        <h1 className="f-display mt-4" style={{ fontSize: "clamp(32px,5vw,58px)", fontWeight: 600, color: C.ink }}>The design archive.</h1>
        <p className="f-body mt-4 max-w-lg" style={{ color: C.mid, fontSize: 16 }}>Every brief that's been picked, designed, and delivered — free, one a week.</p>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
        {ARCHIVE.map((a, i) => (
          <Reveal delay={i * 100} key={a.week}>
            <button onClick={() => openBrief(a)} className="text-left group w-full">
              <div className="w-full aspect-[4/5] rounded relative overflow-hidden" style={{ backgroundColor: a.images ? C.paperDim : "transparent" }}>
                {a.images ? (
                  <img src={a.images[0]} alt={`${a.business} — ${a.title}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
                ) : (
                  <>
                    <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110" style={{ background: `linear-gradient(150deg, ${a.grad[0]}, ${a.grad[1]})` }} />
                    <div className="absolute inset-0 flex items-center justify-center opacity-90">
                      <span className="f-display transition-transform duration-500 group-hover:-translate-y-1 inline-block" style={{ color: a.accent, fontSize: 26, fontWeight: 700 }}>{a.title}</span>
                    </div>
                  </>
                )}
                <div className="absolute top-4 left-4 f-mono text-[10px] uppercase tracking-widest" style={{ color: "#fff", opacity: 0.85, textShadow: a.images ? "0 1px 4px rgba(0,0,0,0.5)" : "none" }}>Week 0{a.week}</div>
              </div>
              <div className="f-display mt-3 transition-colors duration-300 group-hover:opacity-60" style={{ fontSize: 18, fontWeight: 600, color: C.ink }}>{a.business}</div>
              <div className="f-mono uppercase text-[10px] tracking-widest mt-1" style={{ color: C.mid }}>{a.category}</div>
            </button>
          </Reveal>
        ))}
      </div>

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
        businessName: "", category: "",
        instagram: "", facebook: "", tiktok: "", twitter: "", website: "",
        brief: "", email: "", phone: "",
      };
    } catch {
      return {
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
  const steps = ["About your business", "Your post", "If you're picked", "Delivery", "Review"];
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
          This week's brief is already being designed. Submissions reopen {CYCLE.nextOpen} — come back then.
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
          <StatusPill status="Submitted" />
          <p className="f-body text-sm mt-4" style={{ color: C.mid }}>Every Friday, one brief gets picked. Your social campaign brief is officially in the pool for Week {CYCLE.week}.</p>
          <div className="mt-8">
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
        <Eyebrow>Submit a social campaign brief</Eyebrow>
        <span className="f-mono text-[10px] uppercase tracking-widest" style={{ color: C.faint }}>{step + 1} / {steps.length}</span>
      </div>
      <div className="w-full h-px mb-10" style={{ backgroundColor: C.line }}>
        <div className="h-px transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%`, backgroundColor: C.accent }} />
      </div>

      <h2 className="f-display" style={{ fontSize: 32, fontWeight: 600, color: C.ink }}>{steps[step]}</h2>

      <div className="mt-9 rise" key={step}>
        {step === 0 && (
          <div className="flex flex-col gap-6">
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
          <div>
            <textarea
              value={data.brief} onChange={(e) => set("brief", e.target.value)}
              placeholder="What story do you want your social campaign to tell?"
              rows={8}
              className="f-body w-full p-5 rounded outline-none resize-none"
              style={{ border: `1px solid ${C.line}`, backgroundColor: C.paper, fontSize: 15, lineHeight: 1.6 }}
            />
            <p className="f-body text-xs mt-3" style={{ color: C.mid }}>
              Tell me what you're trying to achieve, who it's for, what it should communicate, and anything else I should know. Every brief here is for one art-directed social campaign — nothing else.
            </p>
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
              ["Business", data.businessName || "—"],
              ["Category", data.category || "—"],
              ["Format", "Social campaign"],
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
      <Eyebrow>What happens next</Eyebrow>
      <h1 className="f-display mt-4" style={{ fontSize: 38, fontWeight: 600, color: C.ink }}>Your brief is in.</h1>
      <p className="f-body text-sm mt-4 max-w-lg" style={{ color: C.mid }}>
        There's no dashboard to refresh and no ticket number to track — just one designer working through everything
        that comes in. Here's exactly what happens from here.
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
              <div className="f-body text-sm font-medium" style={{ color: C.ink }}>One brief gets picked</div>
              <p className="f-body text-sm mt-1" style={{ color: C.mid }}>Every Friday, one is chosen for that week's free post — no shortlist, no rounds.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="f-mono text-xs mt-1" style={{ color: C.faint }}>03</span>
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
const SAMPLE_IMG = "https://res.cloudinary.com/dmqyultl0/image/upload/v1787210430/Instagram_post_-_5_u1nxqq.png";

function FloatingSample() {
  const C = useC();
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: null, y: null });
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const drag = useRef({ dragging: false, moved: false, offX: 0, offY: 0 });

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
              width: 148, border: `2px solid ${C.ink}`, borderRadius: 10,
              backgroundColor: C.paper, padding: 8,
              boxShadow: hover ? "0 18px 34px rgba(18,18,18,0.22)" : "0 10px 24px rgba(18,18,18,0.16)",
              transition: "box-shadow .3s ease",
            }}
          >
            <div style={{ width: "100%", aspectRatio: "1 / 1", overflow: "hidden", borderRadius: 4 }}>
              <img src={SAMPLE_IMG} alt="Sample social campaign design" draggable={false}
                style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
            </div>
            <div className="f-mono uppercase text-[9px] tracking-widest mt-2 text-center" style={{ color: C.mid }}>
              A social campaign
            </div>
          </div>
          <div
            className="f-mono uppercase text-[8px] tracking-widest absolute -bottom-5 right-0"
            style={{ color: C.faint, transform: "rotate(4deg)" }}
          >
            Click or drag
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
            <div className="flex items-center justify-between mb-4">
              <span className="f-mono uppercase text-[10px] tracking-widest" style={{ color: "rgba(255,255,255,0.6)" }}>Sample social campaign</span>
              <button onClick={() => setOpen(false)} className="f-mono uppercase text-[10px] tracking-widest flex items-center gap-1.5 transition-transform duration-200 hover:rotate-90" style={{ color: "#fff" }}>
                <X size={14} />
              </button>
            </div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
              <img src={SAMPLE_IMG} alt="Sample social campaign design — full size" style={{ width: "100%", display: "block" }} />
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
        {view === "project" && <ProjectPage project={project} go={go} />}
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
