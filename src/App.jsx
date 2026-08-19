import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ArrowRight, ArrowLeft, ArrowUpRight, Check, X, Upload, Clock,
  ChevronDown, ChevronRight, Search, Instagram, Globe, Lock,
  Download, Sparkles, Circle, CircleDot, Plus, Minus
} from "lucide-react";

/* ============================================================
   TOKENS
   ============================================================ */
const C = {
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
};

const FONTS = `
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
  input:focus, textarea:focus { border-color:${C.accent} !important; box-shadow:0 0 0 3px ${C.accentDim}; }
  @media (prefers-reduced-motion: reduce){ .marquee-track,.rise,.pulse-dot,.digit-in,.float-slow,.btn-press,.hover-lift{animation:none !important; transition:none !important;} }
`;

/* ============================================================
   MOCK DATA
   ============================================================ */
const CATEGORIES = ["Food & Hospitality", "Fashion", "Fitness", "Retail", "Beauty", "Music", "Real Estate", "Nonprofit"];

const STATUS_ORDER = ["Submitted", "Picked", "Designing", "Delivered"];

const POOL = [
  { id: "0241", business: "Lagos Street Food Co.", category: "Food & Hospitality", brief: "We need an Instagram post set for our weekend food festival — three posts and a story that feel loud, hot, and a little chaotic, like the market itself.", status: "Designing", submitted: "Aug 11" },
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
    week: 3, business: "Marlowe & Finch", category: "Fashion", title: "Resort Capsule Lookbook",
    grad: ["#F0EDE4", "#D8CFC0"], accent: "#8A6E4B",
    brief: "A social media post announcing our resort collection. We wanted something that felt like quiet luxury — not loud, not trendy. Lots of negative space, one strong typographic moment.",
    challenge: "Marlowe & Finch's existing catalogue leaned generic — stock-photo energy with centred logo treatments. The brief asked for restraint, which is harder to design than spectacle.",
    thinking: "I picked this one because 'quiet' briefs are the ones people underestimate. I built the whole cover around a single oversized numeral — 03, for their third collection — set in a warm serif against a sand gradient, with the product photography cropped tight and off-centre. The restraint is the design.",
  },
  {
    week: 2, business: "Third Place Coffee", category: "Food & Hospitality", title: "Promo Flyer",
    grad: ["#2B2B2B", "#4A3A2C"], accent: "#E8A33D",
    brief: "We're opening a second location and want a flyer we can print and hand out around the neighbourhood — warm, a little rough around the edges, not corporate.",
    challenge: "The client wanted something printable at low cost — single colour on kraft paper — while still feeling considered.",
    thinking: "I leaned into the constraint. One ink colour, a hand-set feeling headline, and copy that reads like it was written by an actual person behind the counter, not a marketing team.",
  },
  {
    week: 1, business: "Halcyon Studio", category: "Fitness", title: "Launch Campaign",
    grad: ["#101820", "#1F3A5F"], accent: "#5EE6D3",
    brief: "We're a new Pilates studio opening in Ikoyi and need a launch campaign — three social posts that introduce who we are.",
    challenge: "Zero existing brand assets. I was designing the studio's first impression from nothing.",
    thinking: "Week one, so I wanted the format itself to say something: a three-part visual rhythm across the grid, each post a movement in a sequence, echoing the discipline of the practice itself.",
  },
];

const CYCLE = {
  week: 4,
  opened: "Aug 11",
  deadline: "Aug 22",
  pickDate: "Aug 22, 5:00 PM WAT",
  status: "designing", // open | picked | designing | delivered
};

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
  return (
    <div className="f-mono flex items-center gap-2 uppercase tracking-widest text-xs" style={{ color: C.mid }}>
      {dot && <span className="inline-block w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: C.accent }} />}
      {children}
    </div>
  );
}

function Rule({ tight }) {
  return <div style={{ borderTop: `1px solid ${C.line}`, width: "100%" }} className={tight ? "my-4" : "my-10"} />;
}

function Button({ children, variant = "primary", onClick, icon: Icon = ArrowRight, className = "", type = "button", magnetic = true }) {
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

function StatBlock({ value, label, animated = true }) {
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
  const links = [
    ["home", "Home"], ["week", "This Week"], ["archive", "Archive"],
  ];
  return (
    <div className="sticky top-0 z-40 backdrop-blur" style={{ backgroundColor: "rgba(250,249,245,0.86)", borderBottom: `1px solid ${C.line}` }}>
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
        <Button variant="ghost" onClick={() => go("submit")} className="!py-2.5 !px-4">Submit a brief</Button>
      </div>
    </div>
  );
}

function Footer({ go }) {
  return (
    <div style={{ borderTop: `1px solid ${C.line}` }} className="mt-24">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-14 flex flex-col sm:flex-row justify-between gap-8">
        <div>
          <div className="f-display" style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>PICKED</div>
          <p className="f-body text-sm mt-2 max-w-xs" style={{ color: C.mid }}>
            One designer. One social media post a week. Free — because I miss making things for real businesses.
          </p>
        </div>
        <div className="flex gap-16">
          <div className="flex flex-col gap-2">
            <span className="f-mono uppercase text-[10px] tracking-widest mb-1" style={{ color: C.faint }}>Platform</span>
            <button onClick={() => go("home")} className="f-body text-sm text-left" style={{ color: C.ink }}>Home</button>
            <button onClick={() => go("archive")} className="f-body text-sm text-left" style={{ color: C.ink }}>Archive</button>
            <button onClick={() => go("submit")} className="f-body text-sm text-left" style={{ color: C.ink }}>Submit a brief</button>
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
   HOME
   ============================================================ */
function Home({ go, openBrief }) {
  const target = useMemo(() => Date.now() + (4 * 3600 + 22 * 60 + 10) * 1000, []);
  const names = POOL.map((b) => b.business);
  return (
    <div>
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-16 sm:pt-24 pb-10">
        <div className="rise">
          <Eyebrow>Week {CYCLE.week} · Briefs open {CYCLE.opened} – {CYCLE.deadline}</Eyebrow>
          <h1 className="f-display mt-6" style={{ fontSize: "clamp(40px,7vw,84px)", lineHeight: 0.98, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em" }}>
            Someone's getting a<br />free social media post this week.
          </h1>
          <p className="f-body mt-7 max-w-lg" style={{ fontSize: 18, lineHeight: 1.55, color: C.mid }}>
            Business owners submit a real brief. Every week, I pick one and turn it into a finished social media post — for free.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-9">
            <Button onClick={() => go("submit")}>Submit a brief</Button>
            <Button variant="ghost" icon={null} onClick={() => go("archive")}>See previous posts</Button>
          </div>
        </div>
      </div>

      {/* Marquee ticker of the pool — signature motion moment */}
      <div className="overflow-hidden py-4" style={{ borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <div className="flex whitespace-nowrap marquee-track" style={{ width: "max-content" }}>
          {[...names, ...names].map((n, i) => (
            <span key={i} className="f-mono uppercase text-xs tracking-widest flex items-center gap-6 pr-6" style={{ color: C.faint }}>
              {n}
              <span className="inline-block w-1 h-1 rounded-full" style={{ backgroundColor: C.accent }} />
            </span>
          ))}
        </div>
      </div>

      {/* Live cycle strip — simplified to one clear fact */}
      <div style={{ borderBottom: `1px solid ${C.line}`, backgroundColor: C.paperDim }}>
        <Reveal>
          <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-10 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12">
            <StatBlock value="18" label="Briefs in the pool" />
            <p className="f-body text-sm max-w-sm" style={{ color: C.mid }}>
              One gets picked from all of them, every Friday. No shortlist, no rounds — just one.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Countdown block — signature */}
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16 sm:py-20">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-10" style={{ borderBottom: `1px solid ${C.line}` }}>
            <div>
              <Eyebrow>Design in progress</Eyebrow>
              <div className="f-display mt-3" style={{ fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 600, color: C.ink }}>
                Next pick opens Friday.
              </div>
            </div>
            <Countdown target={target} />
          </div>
        </Reveal>

        {/* current brief teaser */}
        <Reveal delay={100}>
          <div className="grid md:grid-cols-2 gap-0 mt-10 hover-lift" style={{ border: `1px solid ${C.line}`, borderRadius: 4, overflow: "hidden" }}>
            <div className="p-8 sm:p-10 flex flex-col justify-between" style={{ backgroundColor: C.ink, color: C.paper, minHeight: 320 }}>
              <div>
                <Eyebrow dot={false}><span style={{ color: C.faint }}>This week's brief</span></Eyebrow>
                <div className="f-display mt-4" style={{ fontSize: 34, fontWeight: 600 }}>{currentBrief.business}</div>
                <div className="f-mono uppercase text-[11px] tracking-widest mt-2" style={{ color: C.faint }}>{currentBrief.category}</div>
                <p className="f-body mt-5 text-sm leading-relaxed" style={{ color: "#C9C7BE", maxWidth: 400 }}>{currentBrief.brief}</p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <span className="f-mono text-xs uppercase tracking-widest flex items-center gap-1.5" style={{ color: C.accent }}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: C.accent }} /> Designing
                </span>
                <button onClick={() => go("week")} className="f-mono text-xs uppercase tracking-widest flex items-center gap-1 group" style={{ color: C.paper }}>
                  Follow along <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
            <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center gap-4" style={{ backgroundColor: C.paperDim }}>
              <div className="f-display" style={{ fontSize: 22, fontWeight: 600, color: C.ink }}>Come back Friday.</div>
              <p className="f-body text-sm max-w-xs" style={{ color: C.mid }}>The finished post stays hidden while it's in progress. That's part of the fun.</p>
              <div className="w-full h-40 rounded relative overflow-hidden mt-2 float-slow" style={{ border: `1px dashed ${C.lineStrong}` }}>
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(135deg, ${C.line} 0px, ${C.line} 1px, transparent 1px, transparent 12px)`,
                }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock size={22} color={C.faint} />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* how it works */}
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pb-20">
        <Reveal><Eyebrow>How it works</Eyebrow></Reveal>
        <div className="grid sm:grid-cols-3 gap-10 mt-8">
          {[
            ["Drop a brief", "Tell me what you need, who it's for, and what it should say. Takes a few minutes."],
            ["I pick one, every Friday", "One brief, chosen from everyone who submitted that week."],
            ["You get a finished post", "Delivered to your inbox — free, ready to publish."],
          ].map(([t, d], i) => (
            <Reveal delay={i * 100} key={t}>
              <div className="group">
                <div className="f-mono text-xs transition-transform duration-300 group-hover:translate-x-1 inline-block" style={{ color: C.accent }}>0{i + 1}</div>
                <div className="f-display mt-3" style={{ fontSize: 21, fontWeight: 600, color: C.ink }}>{t}</div>
                <p className="f-body text-sm mt-2 leading-relaxed" style={{ color: C.mid }}>{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* recent archive strip */}
      <div style={{ borderTop: `1px solid ${C.line}` }}>
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <Eyebrow>Previously picked</Eyebrow>
              <button onClick={() => go("archive")} className="f-mono uppercase text-[11px] tracking-widest flex items-center gap-1 group" style={{ color: C.ink }}>
                View archive <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-6">
            {ARCHIVE.map((a, i) => (
              <Reveal delay={i * 100} key={a.week}>
                <button onClick={() => openBrief(a)} className="text-left group w-full">
                  <div className="w-full aspect-[4/5] rounded relative overflow-hidden" style={{ background: `linear-gradient(150deg, ${a.grad[0]}, ${a.grad[1]})` }}>
                    <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110 flex items-end p-5">
                      <span className="f-mono uppercase text-[10px] tracking-widest" style={{ color: "#fff", opacity: 0.85 }}>Week 0{a.week}</span>
                    </div>
                  </div>
                  <div className="f-display mt-3 transition-colors duration-300 group-hover:opacity-60" style={{ fontSize: 17, fontWeight: 600, color: C.ink }}>{a.business}</div>
                  <div className="f-mono uppercase text-[10px] tracking-widest mt-1" style={{ color: C.mid }}>{a.category}</div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   WEEK PAGE (current cycle detail)
   ============================================================ */
function WeekPage({ go }) {
  return (
    <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-14 pb-24">
      <Reveal>
        <Eyebrow>Week {CYCLE.week}</Eyebrow>
        <h1 className="f-display mt-4" style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 600, color: C.ink }}>The current cycle.</h1>
        <p className="f-body mt-4 max-w-lg" style={{ color: C.mid, fontSize: 16 }}>18 briefs were submitted this week. One got picked — here's where it stands.</p>
      </Reveal>

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

      <div className="mt-16 flex justify-center">
        <Button onClick={() => go("submit")}>Submit your own brief</Button>
      </div>
    </div>
  );
}

/* ============================================================
   PROJECT / REVEAL PAGE
   ============================================================ */
function ProjectPage({ project, go }) {
  const p = project || ARCHIVE[0];
  return (
    <div>
      <Reveal>
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-16 pb-8 text-center">
          <Eyebrow>Week 0{p.week} · The design is ready</Eyebrow>
          <h1 className="f-display mt-5" style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 600, color: C.ink }}>
            Designed for {p.business}.
          </h1>
          <div className="f-mono uppercase text-xs tracking-widest mt-2" style={{ color: C.mid }}>{p.category}</div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
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
        </div>
      </Reveal>

      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16 grid sm:grid-cols-2 gap-12">
        <Reveal>
          <div>
            <Eyebrow>The brief</Eyebrow>
            <p className="f-body mt-4 leading-relaxed" style={{ color: C.ink, fontSize: 16 }}>{p.brief}</p>
            <Eyebrow>The challenge</Eyebrow>
            <p className="f-body mt-4 leading-relaxed" style={{ color: C.mid, fontSize: 15 }}>{p.challenge}</p>
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
          <Button icon={Download}>Download design</Button>
          <div className="f-display" style={{ fontSize: 20, fontWeight: 600, color: C.ink }}>Want me to design yours?</div>
          <Button variant="ghost" icon={null} onClick={() => go("submit")}>Submit another brief</Button>
        </div>
      </Reveal>
    </div>
  );
}

/* ============================================================
   ARCHIVE
   ============================================================ */
function ArchivePage({ go, openBrief }) {
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
              <div className="w-full aspect-[4/5] rounded relative overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110" style={{ background: `linear-gradient(150deg, ${a.grad[0]}, ${a.grad[1]})` }} />
                <div className="absolute inset-0 flex items-center justify-center opacity-90">
                  <span className="f-display transition-transform duration-500 group-hover:-translate-y-1 inline-block" style={{ color: a.accent, fontSize: 26, fontWeight: 700 }}>{a.title}</span>
                </div>
                <div className="absolute top-4 left-4 f-mono text-[10px] uppercase tracking-widest" style={{ color: "#fff", opacity: 0.85 }}>Week 0{a.week}</div>
              </div>
              <div className="f-display mt-3 transition-colors duration-300 group-hover:opacity-60" style={{ fontSize: 18, fontWeight: 600, color: C.ink }}>{a.business}</div>
              <div className="f-mono uppercase text-[10px] tracking-widest mt-1" style={{ color: C.mid }}>{a.category}</div>
            </button>
          </Reveal>
        ))}
      </div>

      <div className="mt-20 flex justify-center">
        <Button onClick={() => go("submit")}>Submit a brief</Button>
      </div>
    </div>
  );
}

/* ============================================================
   SUBMISSION FLOW
   ============================================================ */
function SubmitFlow({ go }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    businessName: "", category: "",
    instagram: "", facebook: "", tiktok: "", twitter: "", website: "",
    brief: "", email: "", phone: "",
  });
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const steps = ["About your business", "Your post", "Upload references", "Delivery", "Review"];
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const submitBrief = async () => {
    setSending(true);
    setError("");
    try {
      const res = await fetch("https://formspree.io/f/xqpzgoap", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setDone(true);
      } else {
        setError("Something went wrong sending your brief. Please try again.");
      }
    } catch {
      setError("Something went wrong sending your brief. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const canNext = () => {
    if (step === 0) return data.businessName.trim().length > 1 && data.category;
    if (step === 1) return data.brief.trim().length > 12;
    if (step === 3) return /\S+@\S+\.\S+/.test(data.email);
    return true;
  };

  if (done) {
    return (
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-24 pb-24 text-center rise">
        <Eyebrow>Submission received</Eyebrow>
        <h1 className="f-display mt-5" style={{ fontSize: 44, fontWeight: 600, color: C.ink }}>You're in.</h1>
        <div className="f-mono text-sm mt-3" style={{ color: C.mid }}>BRIEF #0259</div>

        <div className="mt-10 rounded p-8" style={{ border: `1px solid ${C.line}` }}>
          <StatusPill status="Submitted" />
          <p className="f-body text-sm mt-4" style={{ color: C.mid }}>Every Friday, one brief gets picked. Your social media post request is officially in the pool for Week {CYCLE.week}.</p>
          <div className="mt-8">
            <ProgressTrack status="Submitted" />
          </div>
        </div>

        <p className="f-body text-sm mt-8" style={{ color: C.mid }}>
          We'll email <span style={{ color: C.ink }}>{data.email || "you"}</span> the moment anything changes. You can also check back anytime with your brief ID.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button onClick={() => go("status")}>Track my brief</Button>
          <Button variant="ghost" icon={null} onClick={() => go("home")}>Back home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-14 pb-24">
      <div className="flex items-center justify-between mb-3">
        <Eyebrow>Submit a social media post brief</Eyebrow>
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
                  <input value={data.website} onChange={(e) => set("website", e.target.value)} placeholder="yourbusiness.com" style={inputStyle} />
                </div>
              </div>
            </Field>
          </div>
        )}

        {step === 1 && (
          <div>
            <textarea
              value={data.brief} onChange={(e) => set("brief", e.target.value)}
              placeholder="What do you want your social media post to say?"
              rows={8}
              className="f-body w-full p-5 rounded outline-none resize-none"
              style={{ border: `1px solid ${C.line}`, backgroundColor: C.white, fontSize: 15, lineHeight: 1.6 }}
            />
            <p className="f-body text-xs mt-3" style={{ color: C.mid }}>
              Tell me what you're trying to achieve, who it's for, what it should communicate, and anything else I should know. Every brief here is for a social media post — nothing else.
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="rounded p-12 flex flex-col items-center gap-3 text-center" style={{ border: `1px dashed ${C.lineStrong}` }}>
              <Upload size={20} color={C.mid} />
              <div className="f-body text-sm" style={{ color: C.ink }}>Drop reference images or assets</div>
              <div className="f-mono text-[10px] uppercase tracking-widest" style={{ color: C.faint }}>Optional · PNG, JPG, PDF up to 20MB</div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <Field label="Email address">
              <input value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="you@business.com" style={inputStyle} />
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
              ["Format", "Social media post"],
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
  return (
    <div>
      <div className="f-mono uppercase text-[10px] tracking-widest mb-2.5 flex items-center gap-2" style={{ color: C.mid }}>
        {label} {optional && <span style={{ color: C.faint }}>(optional)</span>}
      </div>
      {children}
    </div>
  );
}
const inputStyle = { border: `1px solid ${C.line}`, backgroundColor: C.white, padding: "13px 16px", borderRadius: 3, width: "100%", fontSize: 15, fontFamily: "'Inter',sans-serif", outline: "none", color: C.ink, transition: "border-color .2s ease, box-shadow .2s ease" };

function Chip({ children, active, onClick }) {
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
  const [id, setId] = useState("0241");
  const [lookedUp, setLookedUp] = useState(true);
  const brief = POOL.find((b) => b.id === id) || POOL[0];

  return (
    <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-16 pb-24">
      <Eyebrow>Track a brief</Eyebrow>
      <h1 className="f-display mt-4" style={{ fontSize: 38, fontWeight: 600, color: C.ink }}>Where's my brief?</h1>
      <div className="flex gap-3 mt-8">
        <input value={id} onChange={(e) => setId(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="0248" style={{ ...inputStyle, fontFamily: "'IBM Plex Mono',monospace" }} />
        <Button icon={Search} onClick={() => setLookedUp(true)}>Find</Button>
      </div>

      {lookedUp && brief && (
        <div className="mt-10 rounded p-8 rise" style={{ border: `1px solid ${C.line}` }}>
          <div className="flex items-center justify-between">
            <span className="f-mono text-xs tracking-widest" style={{ color: C.faint }}>BRIEF #{brief.id}</span>
            <StatusPill status={brief.status} />
          </div>
          <div className="f-display mt-4" style={{ fontSize: 24, fontWeight: 600, color: C.ink }}>{brief.business}</div>
          <div className="f-mono uppercase text-[10px] tracking-widest mt-1" style={{ color: C.mid }}>{brief.category} · Submitted {brief.submitted}</div>

          <div className="mt-8">
            <ProgressTrack status={brief.status} />
          </div>

          <Rule />

          {brief.status === "Designing" || brief.status === "Picked" ? (
            <div className="text-center py-4">
              <div className="f-display" style={{ fontSize: 22, fontWeight: 700, color: C.accent }}>YOU'VE BEEN PICKED</div>
              <p className="f-body text-sm mt-2" style={{ color: C.mid }}>Your design is being made right now. Keep an eye on your inbox.</p>
            </div>
          ) : brief.status === "Delivered" ? (
            <div className="text-center py-4">
              <div className="f-display" style={{ fontSize: 20, fontWeight: 600, color: "#2E9C5B" }}>Delivered</div>
              <p className="f-body text-sm mt-2" style={{ color: C.mid }}>Check your inbox — your finished post is waiting.</p>
            </div>
          ) : (
            <p className="f-body text-sm text-center py-2" style={{ color: C.mid }}>
              "Every Friday, one brief gets picked." Your brief is still in the running for Week {CYCLE.week}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   FLOATING SAMPLE STICKER — draggable, click-to-expand
   ============================================================ */
const SAMPLE_IMG = "https://res.cloudinary.com/dmqyultl0/image/upload/v1787108898/Instagram_post_-_17_iep814.png";

function FloatingSample() {
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
              <img src={SAMPLE_IMG} alt="Sample social media post" draggable={false}
                style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
            </div>
            <div className="f-mono uppercase text-[9px] tracking-widest mt-2 text-center" style={{ color: C.mid }}>
              A social post
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
              <span className="f-mono uppercase text-[10px] tracking-widest" style={{ color: "rgba(255,255,255,0.6)" }}>Sample social media post</span>
              <button onClick={() => setOpen(false)} className="f-mono uppercase text-[10px] tracking-widest flex items-center gap-1.5 transition-transform duration-200 hover:rotate-90" style={{ color: "#fff" }}>
                <X size={14} />
              </button>
            </div>
            <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
              <img src={SAMPLE_IMG} alt="Sample social media post — full size" style={{ width: "100%", display: "block" }} />
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
export default function App() {
  const [view, setView] = useState("home");
  const [project, setProject] = useState(null);
  const go = (v) => { setView(v); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openBrief = (p) => { setProject(p); go("project"); };

  return (
    <div className="f-body min-h-screen w-full" style={{ backgroundColor: C.paper, color: C.ink }}>
      <style>{FONTS}</style>
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
      <FloatingSample />
    </div>
  );
}
