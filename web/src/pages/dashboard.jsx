/**
 * UserDashboard.jsx — LifeLink / DugoSugbo Blood Donation Management System
 *
 * All data is fetched from the Spring Boot backend. No hardcoded mock data.
 *
 * ─── API Contracts (match your UserEntity exactly) ────────────────────────
 *
 * GET  /api/auth/me
 *   → {
 *       id, firstName, lastName, email,
 *       birthdate,        // "YYYY-MM-DD"
 *       contactNumber,
 *       address
 *     }
 *
 * PUT  /api/auth/me
 *   body → { firstName, lastName, email, contactNumber, address }
 *   → updated UserEntity JSON
 *
 * POST /api/auth/logout
 *
 * GET  /api/hospitals
 *   → [{
 *       id, name, address, distance, verified, postedAt,
 *       stock: [{ type, units, status }],   // status: "high"|"med"|"low"|"none"
 *       urgent: ["B-", …]
 *     }]
 *
 * GET  /api/requests?userId=<id>
 *   → [{
 *       id, hospitalId, hospitalName, bloodType,
 *       units, status, createdAt
 *     }]
 *
 * POST /api/requests
 *   body → { hospitalId, bloodType, units, notes }
 *   → created request JSON
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   API LAYER
   Change BASE_URL to your Spring Boot server (e.g. http://localhost:8080)
───────────────────────────────────────────────────────────────────────── */
const BASE_URL = "/api";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed (${res.status})`);
  }
  return res.json();
}

const api = {
  getMe:         ()     => apiFetch("/auth/me"),
  updateMe:      (body) => apiFetch("/auth/me",      { method: "PUT",  body: JSON.stringify(body) }),
  logout:        ()     => apiFetch("/auth/logout",  { method: "POST" }),
  getHospitals:  ()     => apiFetch("/hospitals"),
  getRequests:   (uid)  => apiFetch(`/requests?userId=${uid}`),
  submitRequest: (body) => apiFetch("/requests",     { method: "POST", body: JSON.stringify(body) }),
};

/* ─────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────── */

/** Combine firstName + lastName from UserEntity */
const fullName = (user) =>
  user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "—" : "—";

/** Format "YYYY-MM-DD" birthdate to readable string */
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

/** Format ISO timestamp for request rows */
const formatDateTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

/* ─────────────────────────────────────────────────────────────────────────
   CUSTOM HOOK — useFetch
───────────────────────────────────────────────────────────────────────── */
function useFetch(fetcher, deps = []) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetcher());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, refetch: load };
}

/* ─────────────────────────────────────────────────────────────────────────
   BUTTON COMPONENT  (exact as provided)
───────────────────────────────────────────────────────────────────────── */
const Button = ({
  variant = "primary", size = "md", fullWidth = false,
  disabled = false, loading = false,
  leftIcon, rightIcon, onClick,
  type = "button", children, className = "",
}) => {
  const base = "inline-flex items-center justify-center rounded font-semibold transition";
  const variants = {
    primary:   "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100",
    tertiary:  "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 disabled:bg-gray-50",
  };
  const sizes = { sm: "px-3 py-1 text-sm", md: "px-5 py-2 text-sm", lg: "px-6 py-3 text-base" };
  return (
    <button
      type={type}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${disabled || loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"} ${className}`}
    >
      {loading
        ? <span className="flex items-center gap-2"><Spinner className="w-4 h-4" />Loading…</span>
        : <>{leftIcon && <span className="mr-2">{leftIcon}</span>}{children}{rightIcon && <span className="ml-2">{rightIcon}</span>}</>}
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────────────────── */
const Ic = {
  Drop:     ({ c="w-5 h-5" }) => <svg className={c} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0C19 10.5 12 2 12 2z"/></svg>,
  Bell:     ({ c="w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
  Search:   ({ c="w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  Home:     ({ c="w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  Clip:     ({ c="w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
  Hospital: ({ c="w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>,
  User:     ({ c="w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
  Logout:   ({ c="w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  Filter:   ({ c="w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>,
  Check:    ({ c="w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  XCirc:    ({ c="w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  Pin:      ({ c="w-3.5 h-3.5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Clock:    ({ c="w-3.5 h-3.5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  Menu:     ({ c="w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>,
  X:        ({ c="w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  Refresh:  ({ c="w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>,
  Edit:     ({ c="w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
  Phone:    ({ c="w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>,
  Mail:     ({ c="w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Calendar: ({ c="w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  MapPin:   ({ c="w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
};

/* ─────────────────────────────────────────────────────────────────────────
   SMALL SHARED UI
───────────────────────────────────────────────────────────────────────── */
function Spinner({ className = "w-5 h-5" }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />;
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center py-14 gap-3 text-center">
      <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
        <Ic.XCirc c="w-6 h-6 text-red-500" />
      </div>
      <p className="font-bold text-gray-700 text-sm">Something went wrong</p>
      <p className="text-xs text-gray-400 max-w-xs">{message}</p>
      <Button variant="secondary" size="sm" onClick={onRetry} leftIcon={<Ic.Refresh c="w-3.5 h-3.5" />}>
        Try again
      </Button>
    </div>
  );
}

function NavItem({ icon, label, active, badge, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        active ? "bg-red-600 text-white shadow-md shadow-red-600/25" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}>
      {icon}{label}
      {badge > 0 && (
        <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-red-100 text-red-600"}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ label, value, sub, bg, icon, loading: isLoading }) {
  return (
    <div className={`rounded-2xl p-4 flex flex-col gap-2 ${bg}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold opacity-70">{label}</span>
        <div className="opacity-60">{icon}</div>
      </div>
      {isLoading
        ? <Skeleton className="h-7 w-16 bg-white/30" />
        : <p className="text-2xl font-extrabold leading-none">{value ?? "—"}</p>}
      {sub && <p className="text-xs opacity-60 font-medium">{sub}</p>}
    </div>
  );
}

/* ── Profile info row ── */
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   BLOOD STOCK
───────────────────────────────────────────────────────────────────────── */
const BLOOD_TYPES = ["All","A+","A-","B+","B-","O+","O-","AB+","AB-"];

const pillStyle = {
  high: "bg-green-50  text-green-700  border-green-200",
  med:  "bg-yellow-50 text-yellow-700 border-yellow-200",
  low:  "bg-red-50    text-red-600    border-red-200",
  none: "bg-gray-100  text-gray-400   border-gray-200",
};

function BloodPill({ type, units, status, urgent }) {
  return (
    <div className={`flex flex-col items-center rounded-lg border px-2 py-1.5 min-w-[44px] ${pillStyle[status] ?? pillStyle.none} ${urgent ? "ring-2 ring-red-400 ring-offset-1" : ""}`}>
      <span className="font-extrabold text-[11px] leading-none">{type}</span>
      <span className="text-[10px] font-medium mt-0.5">{status === "none" || units === 0 ? "—" : `${units}u`}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    approved: { cls: "bg-green-50 text-green-700 border-green-200",    icon: <Ic.Check c="w-3 h-3" /> },
    pending:  { cls: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: <Ic.Clock c="w-3 h-3" /> },
    declined: { cls: "bg-red-50 text-red-600 border-red-200",          icon: <Ic.XCirc c="w-3 h-3" /> },
  };
  const { cls, icon } = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cls}`}>
      {icon}{status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   HOSPITAL CARD
───────────────────────────────────────────────────────────────────────── */
function HospitalCard({ hospital, onRequest }) {
  const [expanded, setExpanded] = useState(false);
  const stock   = hospital.stock   ?? [];
  const urgent  = hospital.urgent  ?? [];
  const avail   = stock.filter(s => s.status !== "none" && s.units > 0).length;
  const shown   = expanded ? stock : stock.slice(0, 6);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-red-200 hover:shadow-md transition-all duration-200 flex flex-col">
      <div className="p-4 sm:p-5 flex-1">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Ic.Hospital c="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-gray-900 text-sm leading-tight">{hospital.name}</h3>
              {hospital.verified && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-blue-100">
                  <Ic.Check c="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
              <span className="flex items-center gap-1 text-xs text-gray-400"><Ic.Pin />{hospital.address}</span>
              {hospital.postedAt && (
                <span className="flex items-center gap-1 text-xs text-gray-400"><Ic.Clock />{hospital.postedAt}</span>
              )}
            </div>
          </div>
          {hospital.distance && (
            <span className="flex-shrink-0 text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-lg">
              {hospital.distance}
            </span>
          )}
        </div>

        {/* Urgent banner */}
        {urgent.length > 0 && (
          <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
            <p className="text-xs text-red-700 font-semibold">Urgent need: {urgent.join(", ")}</p>
          </div>
        )}

        {/* Blood stock pills */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">
              Blood Stock <span className="text-gray-400 font-normal">({avail}/{stock.length} available)</span>
            </span>
            {stock.length > 6 && (
              <button onClick={() => setExpanded(!expanded)} className="text-xs text-red-600 font-semibold hover:underline">
                {expanded ? "Show less" : "See all"}
              </button>
            )}
          </div>
          {stock.length === 0
            ? <p className="text-xs text-gray-400 italic">No stock information posted yet.</p>
            : (
              <div className="flex flex-wrap gap-1.5">
                {shown.map(s => (
                  <BloodPill key={s.type} type={s.type} units={s.units} status={s.status} urgent={urgent.includes(s.type)} />
                ))}
                {!expanded && stock.length > 6 && (
                  <button onClick={() => setExpanded(true)}
                    className="px-2 py-1.5 text-[10px] font-bold text-gray-400 border border-dashed border-gray-300 rounded-lg hover:border-red-300 hover:text-red-500 transition">
                    +{stock.length - 6}
                  </button>
                )}
              </div>
            )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 sm:px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${avail > 4 ? "bg-green-500" : avail > 1 ? "bg-yellow-500" : "bg-red-500"}`} />
          <span className="text-xs text-gray-500 font-medium">
            {avail > 4 ? "Well stocked" : avail > 1 ? "Moderate stock" : "Critical stock"}
          </span>
        </div>
        <Button variant="primary" size="sm" onClick={() => onRequest(hospital)} leftIcon={<Ic.Drop c="w-3.5 h-3.5" />}>
          Request Blood
        </Button>
      </div>
    </div>
  );
}

function HospitalCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {[...Array(8)].map((_,i) => <Skeleton key={i} className="h-9 w-11" />)}
      </div>
      <Skeleton className="h-8 w-32 self-end" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   REQUEST MODAL
───────────────────────────────────────────────────────────────────────── */
function RequestModal({ hospital, onClose, onSuccess }) {
  const [selType,    setSelType]    = useState("");
  const [units,      setUnits]      = useState(1);
  const [notes,      setNotes]      = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);
  const [err,        setErr]        = useState(null);

  const available = (hospital.stock ?? []).filter(s => s.status !== "none" && s.units > 0);

  const submit = async () => {
    if (!selType) return;
    setSubmitting(true);
    setErr(null);
    try {
      await api.submitRequest({ hospitalId: hospital.id, bloodType: selType, units, notes });
      setDone(true);
      setTimeout(() => { onSuccess(); onClose(); }, 1600);
    } catch (e) {
      setErr(e.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">Request Blood</h3>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Ic.Hospital c="w-3.5 h-3.5" />{hospital.name}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"><Ic.X /></button>
        </div>

        {done ? (
          <div className="flex flex-col items-center py-14 px-6 gap-3">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <Ic.Check c="w-7 h-7 text-green-600" />
            </div>
            <p className="font-bold text-gray-900">Request Submitted!</p>
            <p className="text-sm text-gray-500 text-center">Your request has been sent to <span className="font-semibold">{hospital.name}</span>.</p>
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-5">
            {/* Blood type picker */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Select Blood Type</p>
              {available.length === 0
                ? <p className="text-sm text-gray-400 italic">No blood types currently available.</p>
                : (
                  <div className="flex flex-wrap gap-2">
                    {available.map(s => (
                      <button key={s.type} onClick={() => setSelType(s.type)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                          selType === s.type
                            ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-red-300 hover:text-red-600"
                        }`}>
                        {s.type}
                        {(hospital.urgent ?? []).includes(s.type) &&
                          <span className="ml-1 text-[9px] opacity-80 uppercase tracking-wide">urgent</span>}
                      </button>
                    ))}
                  </div>
                )}
              {(hospital.urgent ?? []).length > 0 && (
                <p className="text-[11px] text-red-500 font-semibold mt-2 flex items-center gap-1">
                  <Ic.Drop c="w-3 h-3" /> Urgent need: {hospital.urgent.join(", ")}
                </p>
              )}
            </div>

            {/* Units stepper */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Units Needed</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setUnits(u => Math.max(1, u - 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold transition">−</button>
                <span className="w-8 text-center font-extrabold text-gray-900">{units}</span>
                <button onClick={() => setUnits(u => Math.min(10, u + 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold transition">+</button>
                <span className="text-xs text-gray-400">max 10 units</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">
                Notes <span className="font-normal text-gray-400">(optional)</span>
              </p>
              <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Surgery on April 20, patient needs A-..."
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition"/>
            </div>

            {err && (
              <p className="text-xs text-red-600 font-semibold bg-red-50 border border-red-100 rounded-lg px-3 py-2">{err}</p>
            )}

            <div className="flex gap-2">
              <Button variant="tertiary" size="md" fullWidth onClick={onClose}>Cancel</Button>
              <Button variant="primary" size="md" fullWidth
                disabled={!selType || available.length === 0} loading={submitting}
                onClick={submit} leftIcon={!submitting && <Ic.Drop c="w-4 h-4" />}>
                Submit Request
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   EDIT PROFILE MODAL  — fields match UserEntity exactly
───────────────────────────────────────────────────────────────────────── */
function EditProfileModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    firstName:     user.firstName     ?? "",
    lastName:      user.lastName      ?? "",
    email:         user.email         ?? "",
    contactNumber: user.contactNumber ?? "",
    address:       user.address       ?? "",
    birthdate:     user.birthdate     ?? "",   // "YYYY-MM-DD"
  });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState(null);

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const save = async () => {
    setSaving(true);
    setErr(null);
    try {
      const updated = await api.updateMe(form);
      onSaved(updated);
      onClose();
    } catch (e) {
      setErr(e.message);
      setSaving(false);
    }
  };

  const fields = [
    { label: "First Name",      key: "firstName",     type: "text",  placeholder: "Maria" },
    { label: "Last Name",       key: "lastName",      type: "text",  placeholder: "Santos" },
    { label: "Email Address",   key: "email",         type: "email", placeholder: "maria@example.com" },
    { label: "Contact Number",  key: "contactNumber", type: "tel",   placeholder: "+63 912 345 6789" },
    { label: "Birthdate",       key: "birthdate",     type: "date",  placeholder: "" },
    { label: "Address",         key: "address",       type: "text",  placeholder: "Cebu City, Philippines" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Edit Profile</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"><Ic.X /></button>
        </div>
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {fields.map(f => (
              <div key={f.key} className={f.key === "address" ? "col-span-2" : ""}>
                <label className="text-xs font-semibold text-gray-600 block mb-1">{f.label}</label>
                <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                  onChange={set(f.key)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition"/>
              </div>
            ))}
          </div>

          {err && <p className="text-xs text-red-600 font-semibold bg-red-50 border border-red-100 rounded-lg px-3 py-2">{err}</p>}

          <div className="flex gap-2 pt-1">
            <Button variant="tertiary" size="md" fullWidth onClick={onClose}>Cancel</Button>
            <Button variant="primary"  size="md" fullWidth loading={saving} onClick={save}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────────────────────────────────── */
export default function UserDashboard() {
  const [activeNav,   setActiveNav]   = useState("dashboard");
  const [search,      setSearch]      = useState("");
  const [filterType,  setFilterType]  = useState("All");
  const [modal,       setModal]       = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifCount,  setNotifCount]  = useState(0);

  /* ── Remote data ── */
  const { data: user,      loading: userLoading,  error: userError,  refetch: refetchUser }
    = useFetch(api.getMe);

  const { data: hospitals, loading: hospsLoading, error: hospsError, refetch: refetchHospitals }
    = useFetch(api.getHospitals);

  // Only fetch requests once we have the user id
  const { data: requests,  loading: reqsLoading,  error: reqsError,  refetch: refetchRequests }
    = useFetch(() => user?.id ? api.getRequests(user.id) : Promise.resolve([]), [user?.id]);

  useEffect(() => {
    if (requests) setNotifCount(requests.filter(r => r.status === "pending").length);
  }, [requests]);

  /* ── Derived values ── */
  const hospitalList  = hospitals ?? [];
  const requestList   = requests  ?? [];
  const approvedCount = requestList.filter(r => r.status === "approved").length;
  const pendingCount  = requestList.filter(r => r.status === "pending").length;

  const filteredHospitals = hospitalList.filter(h => {
    const q = search.toLowerCase();
    const matchSearch = h.name.toLowerCase().includes(q) || (h.address ?? "").toLowerCase().includes(q);
    const matchType   = filterType === "All" ||
      (h.stock ?? []).some(s => s.type === filterType && s.status !== "none" && s.units > 0);
    return matchSearch && matchType;
  });

  const handleLogout = async () => {
    try { await api.logout(); } catch (_) {}
    window.location.href = "/login";
  };

  /* ── Computed display name from UserEntity fields ── */
  const displayName   = fullName(user);
  const displayInitial = displayName !== "—" ? displayName.charAt(0).toUpperCase() : "?";

  const pageTitle = { dashboard: "Dashboard", hospitals: "Hospital Blood Stock", requests: "My Requests", profile: "My Profile" };
  const pageSub   = {
    dashboard: userLoading ? "Loading…" : `Welcome back, ${user?.firstName ?? ""}!`,
    hospitals: "Browse hospitals and request blood",
    requests:  "Track your blood request history",
    profile:   "Manage your donor profile",
  };

  /* ── Sidebar ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
          <Ic.Drop c="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-900 text-base tracking-tight">DugoSugbo</span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1">Menu</p>
        {[
          { key: "dashboard", icon: <Ic.Home />,     label: "Dashboard"    },
          { key: "hospitals", icon: <Ic.Hospital />, label: "Hospitals"    },
          { key: "requests",  icon: <Ic.Clip />,     label: "My Requests", badge: pendingCount },
          { key: "profile",   icon: <Ic.User />,     label: "Profile"      },
        ].map(item => (
          <NavItem key={item.key} icon={item.icon} label={item.label}
            active={activeNav === item.key} badge={item.badge ?? 0}
            onClick={() => { setActiveNav(item.key); setSidebarOpen(false); }} />
        ))}
      </nav>

      {/* User strip — firstName + lastName from UserEntity */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
          {userLoading
            ? <Skeleton className="w-8 h-8 rounded-full" />
            : (
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold text-sm flex-shrink-0">
                {displayInitial}
              </div>
            )}
          <div className="flex-1 min-w-0">
            {userLoading
              ? <><Skeleton className="h-3 w-24 mb-1" /><Skeleton className="h-2.5 w-20" /></>
              : <>
                  <p className="text-xs font-bold text-gray-900 truncate">{displayName}</p>
                  <p className="text-[10px] text-gray-400 truncate">{user?.email ?? "—"}</p>
                </>}
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 transition flex-shrink-0">
            <Ic.Logout c="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  /* ─── RENDER ─── */
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-100 fixed top-0 left-0 h-screen z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-56 bg-white h-full z-50 shadow-2xl"><SidebarContent /></div>
        </div>
      )}

      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition" onClick={() => setSidebarOpen(true)}>
                <Ic.Menu />
              </button>
              <div>
                <h1 className="font-bold text-gray-900 leading-none">{pageTitle[activeNav]}</h1>
                <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">{pageSub[activeNav]}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition" onClick={() => setNotifCount(0)}>
                <Ic.Bell />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {notifCount}
                  </span>
                )}
              </button>
              {userLoading
                ? <Skeleton className="w-8 h-8 rounded-full" />
                : (
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold text-sm">
                    {displayInitial}
                  </div>
                )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-5xl w-full mx-auto">

          {/* ══════ DASHBOARD ══════ */}
          {activeNav === "dashboard" && (
            <div className="flex flex-col gap-6">
              {/* Stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="Full Name" value={displayName} sub={user?.email}
                  bg="bg-red-600 text-white" icon={<Ic.User c="w-5 h-5" />} loading={userLoading} />
                <StatCard label="Hospitals" value={hospitalList.length || "—"} sub="Active listings"
                  bg="bg-white border border-gray-200 text-gray-900" icon={<Ic.Hospital c="w-5 h-5 text-gray-400" />} loading={hospsLoading} />
                <StatCard label="My Requests" value={requestList.length} sub="All time"
                  bg="bg-white border border-gray-200 text-gray-900" icon={<Ic.Clip c="w-5 h-5 text-gray-400" />} loading={reqsLoading} />
                <StatCard label="Approved" value={approvedCount} sub="Fulfilled requests"
                  bg="bg-emerald-50 border border-emerald-100 text-emerald-900" icon={<Ic.Check c="w-5 h-5 text-emerald-600" />} loading={reqsLoading} />
              </div>

              {/* Recent requests */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-gray-900 text-sm">Recent Requests</h2>
                  <button onClick={() => setActiveNav("requests")} className="text-xs text-red-600 font-semibold hover:underline">See all</button>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {reqsLoading ? (
                    <div className="divide-y divide-gray-100">
                      {[...Array(3)].map((_,i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3">
                          <Skeleton className="w-8 h-8 flex-shrink-0" />
                          <div className="flex-1 flex flex-col gap-2"><Skeleton className="h-3.5 w-2/3" /><Skeleton className="h-2.5 w-1/2" /></div>
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : reqsError ? (
                    <ErrorState message={reqsError} onRetry={refetchRequests} />
                  ) : requestList.length === 0 ? (
                    <div className="flex flex-col items-center py-10 gap-2">
                      <Ic.Clip c="w-8 h-8 text-gray-300" />
                      <p className="text-sm text-gray-400">No requests yet</p>
                      <Button variant="primary" size="sm" onClick={() => setActiveNav("hospitals")} leftIcon={<Ic.Hospital c="w-3.5 h-3.5" />}>
                        Browse Hospitals
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {requestList.slice(0,3).map(r => (
                        <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                          <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Ic.Drop c="w-4 h-4 text-red-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{r.hospitalName}</p>
                            <p className="text-xs text-gray-400">{r.bloodType} · {r.units} unit{r.units>1?"s":""} · {formatDateTime(r.createdAt)}</p>
                          </div>
                          <StatusBadge status={r.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Hospital preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-gray-900 text-sm">Hospitals with Available Blood</h2>
                  <button onClick={() => setActiveNav("hospitals")} className="text-xs text-red-600 font-semibold hover:underline">View all</button>
                </div>
                {hospsLoading ? (
                  <div className="grid sm:grid-cols-2 gap-4"><HospitalCardSkeleton /><HospitalCardSkeleton /></div>
                ) : hospsError ? (
                  <ErrorState message={hospsError} onRetry={refetchHospitals} />
                ) : hospitalList.length === 0 ? (
                  <div className="flex flex-col items-center py-10 gap-2 bg-white rounded-2xl border border-gray-200">
                    <Ic.Hospital c="w-8 h-8 text-gray-300" />
                    <p className="text-sm text-gray-400">No hospitals have posted stock yet.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {hospitalList.slice(0,2).map(h => <HospitalCard key={h.id} hospital={h} onRequest={setModal} />)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════ HOSPITALS ══════ */}
          {activeNav === "hospitals" && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Ic.Search c="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="text" placeholder="Search hospitals by name or location…"
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 text-gray-700 placeholder-gray-400 transition"/>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <Ic.Filter c="text-gray-400 flex-shrink-0 w-4 h-4" />
                  {BLOOD_TYPES.map(t => (
                    <button key={t} onClick={() => setFilterType(t)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        filterType === t ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600"
                      }`}>{t}</button>
                  ))}
                </div>
              </div>

              {hospsLoading ? (
                <div className="grid sm:grid-cols-2 gap-4">{[...Array(4)].map((_,i) => <HospitalCardSkeleton key={i} />)}</div>
              ) : hospsError ? (
                <ErrorState message={hospsError} onRetry={refetchHospitals} />
              ) : (
                <>
                  <p className="text-xs text-gray-500">
                    Showing <span className="font-bold text-gray-900">{filteredHospitals.length}</span> hospital{filteredHospitals.length!==1?"s":""}
                    {filterType !== "All" && <> with <span className="text-red-600 font-bold">{filterType}</span> available</>}
                  </p>
                  {filteredHospitals.length === 0 ? (
                    <div className="flex flex-col items-center py-16 gap-3 text-center">
                      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <Ic.Hospital c="w-7 h-7 text-gray-400" />
                      </div>
                      <p className="font-bold text-gray-700">No hospitals found</p>
                      <p className="text-sm text-gray-400">{hospitalList.length === 0 ? "No hospitals have posted blood stock yet." : "Try a different search or blood type filter."}</p>
                      {hospitalList.length > 0 && (
                        <Button variant="secondary" size="sm" onClick={() => { setSearch(""); setFilterType("All"); }}>Clear filters</Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {filteredHospitals.map(h => <HospitalCard key={h.id} hospital={h} onRequest={setModal} />)}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══════ REQUESTS ══════ */}
          {activeNav === "requests" && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900 text-sm">All Blood Requests</h2>
                {!reqsLoading && <span className="text-xs text-gray-400">{requestList.length} total</span>}
              </div>
              {reqsLoading ? (
                <div className="divide-y divide-gray-100">
                  {[...Array(5)].map((_,i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-4">
                      <Skeleton className="w-9 h-9 flex-shrink-0" />
                      <div className="flex-1 flex flex-col gap-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/2" /></div>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : reqsError ? (
                <ErrorState message={reqsError} onRetry={refetchRequests} />
              ) : requestList.length === 0 ? (
                <div className="flex flex-col items-center py-14 gap-3">
                  <Ic.Clip c="w-10 h-10 text-gray-300" />
                  <p className="text-sm text-gray-500">No requests yet</p>
                  <Button variant="primary" size="sm" onClick={() => setActiveNav("hospitals")} leftIcon={<Ic.Hospital c="w-3.5 h-3.5" />}>
                    Browse Hospitals
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {requestList.map(r => (
                    <div key={r.id} className="flex items-center gap-4 px-5 py-4">
                      <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Ic.Drop c="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{r.hospitalName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Type: <span className="font-semibold text-gray-600">{r.bloodType}</span> · {r.units} unit{r.units>1?"s":""} · {formatDateTime(r.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════ PROFILE ══════ */}
          {activeNav === "profile" && (
            <div className="max-w-md">
              {userLoading ? (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <Skeleton className="h-36 rounded-none" />
                  <div className="p-6 flex flex-col gap-4">{[...Array(6)].map((_,i) => <Skeleton key={i} className="h-12" />)}</div>
                </div>
              ) : userError ? (
                <ErrorState message={userError} onRetry={refetchUser} />
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {/* Red header banner */}
                  <div className="bg-red-600 px-6 pt-8 pb-14">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-red-600 font-extrabold text-2xl shadow-lg">
                      {displayInitial}
                    </div>
                    {/* firstName + lastName from UserEntity */}
                    <h2 className="text-white font-bold text-lg mt-3">{displayName}</h2>
                    <p className="text-white/70 text-xs mt-0.5">{user?.email ?? "—"}</p>
                  </div>

                  {/* Overlapping email badge */}
                  <div className="relative px-6 -mt-6 mb-2">
                    <span className="inline-flex items-center gap-1.5 bg-white border-2 border-red-200 text-red-600 text-sm font-extrabold px-3 py-1.5 rounded-xl shadow-sm">
                      <Ic.Mail c="w-4 h-4" /> {user?.email ?? "—"}
                    </span>
                  </div>

                  {/* All UserEntity fields as info rows */}
                  <div className="px-6 pb-2">
                    <InfoRow icon={<Ic.User c="w-4 h-4" />}     label="Full Name"      value={displayName} />
                    <InfoRow icon={<Ic.Mail c="w-4 h-4" />}     label="Email"          value={user?.email} />
                    <InfoRow icon={<Ic.Phone c="w-4 h-4" />}    label="Contact Number" value={user?.contactNumber} />
                    <InfoRow icon={<Ic.Calendar c="w-4 h-4" />} label="Birthdate"      value={formatDate(user?.birthdate)} />
                    <InfoRow icon={<Ic.MapPin c="w-4 h-4" />}   label="Address"        value={user?.address} />
                  </div>

                  {/* Request stats */}
                  <div className="mx-6 mb-5 grid grid-cols-3 gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    {[
                      { label: "Total",    value: requestList.length,                                          color: "text-gray-900" },
                      { label: "Approved", value: approvedCount,                                               color: "text-green-600" },
                      { label: "Pending",  value: requestList.filter(r => r.status === "pending").length,      color: "text-yellow-600" },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <p className={`text-xl font-extrabold ${s.color}`}>{reqsLoading ? "…" : s.value}</p>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 border-t border-gray-100 flex gap-2">
                    <Button variant="primary" size="md" fullWidth onClick={() => setEditProfile(true)} leftIcon={<Ic.Edit c="w-4 h-4" />}>
                      Edit Profile
                    </Button>
                    <Button variant="tertiary" size="md" onClick={handleLogout} leftIcon={<Ic.Logout c="w-4 h-4" />}>
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Request modal */}
      {modal && (
        <RequestModal hospital={modal} onClose={() => setModal(null)} onSuccess={refetchRequests} />
      )}

      {/* Edit profile modal — passes real UserEntity fields */}
      {editProfile && user && (
        <EditProfileModal user={user} onClose={() => setEditProfile(false)} onSaved={refetchUser} />
      )}
    </div>
  );
}