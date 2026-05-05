/**
 * shared.jsx — DugoSugbo Shared Components & Utilities
 *
 * Import what you need in each page:
 *   import { Button, Ic, Skeleton, useFetch, fullName, formatDate, formatDateTime,
 *            BloodPill, StatusBadge, ErrorState, Spinner, InfoRow } from "./shared";
 */

import { useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────── */

/** Combine firstName + lastName from UserEntity */
export const fullName = (user) =>
  user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "—" : "—";

/** Format "YYYY-MM-DD" birthdate → "April 19, 2025" */
export const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

/** Format ISO timestamp → "Apr 19, 2025" */
export const formatDateTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

/* ─────────────────────────────────────────────────────────────────────────
   CUSTOM HOOK — useFetch
───────────────────────────────────────────────────────────────────────── */
export function useFetch(fetcher, deps = []) {
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
export const Button = ({
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
        : <>{leftIcon && <span className="mr-2">{leftIcon}</span>}{children}{rightIcon && <span className="ml-2">{rightIcon}</span>}</>
      }
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────────────────── */
export const Ic = {
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
   SMALL UI ATOMS
───────────────────────────────────────────────────────────────────────── */

export function Spinner({ className = "w-5 h-5" }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />;
}

export function ErrorState({ message, onRetry }) {
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

/** Blood-type stock pill */
export const PILL_STYLE = {
  high: "bg-green-50  text-green-700  border-green-200",
  med:  "bg-yellow-50 text-yellow-700 border-yellow-200",
  low:  "bg-red-50    text-red-600    border-red-200",
  none: "bg-gray-100  text-gray-400   border-gray-200",
};

export function BloodPill({ type, units, status, urgent }) {
  return (
    <div className={`flex flex-col items-center rounded-lg border px-2 py-1.5 min-w-[44px] ${PILL_STYLE[status] ?? PILL_STYLE.none} ${urgent ? "ring-2 ring-red-400 ring-offset-1" : ""}`}>
      <span className="font-extrabold text-[11px] leading-none">{type}</span>
      <span className="text-[10px] font-medium mt-0.5">{status === "none" || units === 0 ? "—" : `${units}u`}</span>
    </div>
  );
}

/** Request status badge */
export function StatusBadge({ status }) {
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

/** Stat summary card */
export function StatCard({ label, value, sub, bg, icon, loading: isLoading }) {
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

/** Profile info row */
export function InfoRow({ icon, label, value }) {
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

/** Sidebar nav item */
export function NavItem({ icon, label, active, badge, onClick }) {
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

/** Blood-type filter options */
export const BLOOD_TYPES = ["All","A+","A-","B+","B-","O+","O-","AB+","AB-"];