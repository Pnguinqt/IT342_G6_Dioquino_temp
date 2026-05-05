import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";



/* ── SVG Icons ───────────────────────────────────────────────────────────── */
const DropIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0C19 10.5 12 2 12 2z" />
  </svg>
);
const HeartIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const ArrowRightIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);
const ChartBarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const BoltIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const ShieldCheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const UsersIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const HospitalIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

/* ── Navbar ──────────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur shadow-sm border-b border-gray-100" : "bg-white/80 backdrop-blur"}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <DropIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">Dugo-Sugbo</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {["Home", "About", "Services", "Contact"].map((item) => (
            <a key={item} href="#" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
              {item}
            </a>
          ))}
        </div>

        {/* Nav CTA — primary Button */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="tertiary" size="md" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button 
          variant="primary" 
          size="md" 
          rightIcon={<ArrowRightIcon className="w-3.5 h-3.5" />}
          onClick={() => navigate("/register")}
          >
            Register Now
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded text-gray-600 hover:bg-gray-100 transition" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen
            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          }
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 flex flex-col gap-4">
          {["Home", "About", "Services", "Contact"].map((item) => (
            <a key={item} href="#" className="text-sm font-medium text-gray-700 hover:text-red-600">{item}</a>
          ))}
          <Button variant="primary" size="md" fullWidth>Register Now</Button>
        </div>
      )}
    </nav>
  );
}

/* ── Live Ticker ─────────────────────────────────────────────────────────── */
function LiveTicker() {
  const updates = [
    "New donation registered — Cebu City Medical Center",
    "Request fulfilled — Type O+  ·  2 units delivered",
    "New donor registered — Juan dela Cruz",
    "Hospital request — Type AB-  ·  marked urgent",
    "Donation completed — Type B+  ·  1 unit",
    "Stock replenished — Type A+  ·  5 units added",
  ];
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx((i) => (i + 1) % updates.length); setVisible(true); }, 350);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm max-w-lg mx-auto">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
      <p className="text-xs sm:text-sm text-gray-600 font-medium truncate transition-opacity duration-300" style={{ opacity: visible ? 1 : 0 }}>
        {updates[idx]}
      </p>
    </div>
  );
}

/* ── Floating Icon Pill ──────────────────────────────────────────────────── */
function FloatingPill({ posClass, icon, bg = "bg-white shadow-md", delay = "0s" }) {
  return (
    <div
      className={`absolute ${posClass} ${bg} rounded-2xl p-3 hidden lg:flex items-center justify-center animate-bounce`}
      style={{ animationDelay: delay, animationDuration: "3s" }}
    >
      {icon}
    </div>
  );
}

/* ── Blood Type Badge ────────────────────────────────────────────────────── */
function BloodBadge({ type, available }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl py-3 px-2 border-2 transition-all ${
      available ? "border-red-200 bg-red-50 text-red-700" : "border-gray-200 bg-gray-50 text-gray-400"
    }`}>
      <span className="font-extrabold text-sm leading-none">{type}</span>
      <span className="text-[10px] font-semibold mt-1 uppercase tracking-wide">
        {available ? "Ready" : "Low"}
      </span>
    </div>
  );
}

function useCounter(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      const value = Math.min(Math.floor((progress / duration) * end), end);
      setCount(value);

      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
}

/* ── Animated Number ─────────────────────────────────────────────────────── */
function AnimStat({ value, suffix = "", start }) {
  const n = useCounter(value, 1800, start);
  return <>{n.toLocaleString()}{suffix}</>;
}

/* ── Landing Page ────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.15 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const bloodTypes = [
    { type: "A+", available: true },
    { type: "A-", available: false },
    { type: "B+", available: true },
    { type: "B-", available: false },
    { type: "O+", available: true },
    { type: "O-", available: true },
    { type: "AB+", available: false },
    { type: "AB-", available: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="pt-28 pb-14 px-5 sm:px-8 max-w-7xl mx-auto">

        {/* Live ticker */}
        <div className="mb-8"><LiveTicker /></div>

        {/* ── Headline ── */}
        <div className="text-center mb-10 relative">

          {/* Floating pills — left */}
          <FloatingPill posClass="left-0 top-2"   icon={<HeartIcon className="w-5 h-5 text-red-500" />}  delay="0s" />
          <FloatingPill posClass="left-12 top-20" icon={<DropIcon className="w-4 h-4 text-white" />}     bg="bg-red-600 shadow-md" delay="0.5s" />

          {/* Floating pills — right */}
          <FloatingPill posClass="right-0 top-2"   icon={<ChartBarIcon className="w-5 h-5 text-green-600" />} delay="0.3s" />
          <FloatingPill posClass="right-12 top-20" icon={<UsersIcon className="w-5 h-5 text-blue-500" />}     delay="0.8s" />

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight max-w-4xl mx-auto">
            Saving Lives Through{" "}
            <span className="text-red-600">Smarter Blood</span>{" "}
            Donation Management
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Connecting donors, hospitals, and coordinators in real time. Faster matching, smarter tracking, and greater life-saving impact — all in one place.
          </p>

          {/* CTA row — Button component, primary + tertiary */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Button variant="primary" size="lg" leftIcon={<DropIcon className="w-4 h-4" />}>
              Donate Blood
            </Button>
            <Button variant="tertiary" size="lg" leftIcon={<HospitalIcon className="w-4 h-4" />}>
              Request Blood
            </Button>
          </div>
        </div>

        {/* ── 4-col Stats Cards (mirrors Prodmast layout) ── */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">

          {/* Card 1 — Primary red, like the photo card in Prodmast */}
          <div className="relative rounded-2xl overflow-hidden min-h-[180px] bg-red-600 flex flex-col justify-end p-5 col-span-1">
            <div className="absolute top-4 right-4 opacity-20">
              <DropIcon className="w-16 h-16 text-white" />
            </div>
            <p className="text-white/80 text-xs font-semibold uppercase tracking-wide mb-1">Active Donors</p>
            <div className="text-4xl font-extrabold text-white leading-none">
              <AnimStat value={12000} suffix="+" start={statsVisible} />
            </div>
            <p className="text-white/60 text-xs mt-1">Across all blood types</p>
          </div>

          {/* Card 2 — Dark card, like Prodmast's "Total Projects" card */}
          <div className="rounded-2xl bg-gray-900 min-h-[180px] flex flex-col justify-between p-5">
            <div className="flex items-start justify-between">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <ChartBarIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded-full">↑ 8%</span>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium mb-1">Total Donations</p>
              <div className="text-4xl font-extrabold text-white leading-none">
                <AnimStat value={1951} suffix="+" start={statsVisible} />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Increase of <span className="text-green-400 font-semibold">128</span> this month
              </p>
            </div>
          </div>

          {/* Card 3 — Light accent, like Prodmast's green "6+ Years" card */}
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 min-h-[180px] flex flex-col justify-between p-5">
            <div className="p-1.5 bg-emerald-100 rounded-lg w-fit">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <p className="text-emerald-600 text-xs font-medium mb-1">Years of Dedicated Service</p>
              <div className="text-4xl font-extrabold text-emerald-900 leading-none">
                <AnimStat value={6} suffix="+" start={statsVisible} />
              </div>
              <p className="text-emerald-500 text-xs mt-1">Trusted since 2019</p>
            </div>
          </div>

          {/* Card 4 — White CTA card, like Prodmast's last dark panel */}
          <div className="rounded-2xl bg-gray-900 min-h-[180px] flex flex-col justify-between p-5">
            <div className="p-1.5 bg-red-600/20 rounded-lg w-fit">
              <BoltIcon className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-snug mb-4">
                Achieve Optimal Matching and Boost Life-Saving Impact
              </p>
              {/* secondary Button inside card */}
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<ArrowRightIcon className="w-3 h-3" />}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* ── Live Blood Stock Panel ── */}
        <div className="mt-5 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="font-bold text-gray-900">Live Blood Stock</h3>
              <p className="text-xs text-gray-400 mt-0.5">Real-time inventory · Cebu City</p>
            </div>
            <div className="flex items-center gap-3">
              {/* tertiary Button */}
              <Button variant="tertiary" size="sm">View All</Button>
              <div className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-100">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live
              </div>
            </div>
          </div>

          {/* Blood type grid */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
            {bloodTypes.map((bt) => (
              <BloodBadge key={bt.type} type={bt.type} available={bt.available} />
            ))}
          </div>

          {/* Legend + action */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded border-2 border-red-300 bg-red-50" />
              Ready / Available
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded border-2 border-gray-200 bg-gray-50" />
              Low stock
            </div>
            <div className="sm:ml-auto">
              {/* primary Button — request urgent */}
              <Button variant="primary" size="sm" leftIcon={<HospitalIcon className="w-3.5 h-3.5" />}>
                Request Urgent Supply
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-6 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
              <DropIcon className="w-3 h-3 text-white" />
            </div>
            <p className="text-xs text-gray-400">© 2026 Dugo-Sugbo BMS · Every drop counts.</p>
          </div>
          <div className="flex items-center gap-4">
            {["Privacy", "Terms", "Support"].map((l) => (
              <a key={l} href="#" className="text-xs text-gray-400 hover:text-red-600 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}