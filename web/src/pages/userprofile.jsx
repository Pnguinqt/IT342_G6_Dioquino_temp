/**
 * ProfilePage.jsx — User Profile (Responsive)
 *
 * All fields match UserEntity:
 *   id, firstName, lastName, email, birthdate, contactNumber, address
 *
 * Props:
 *  - user         : UserEntity object  (GET /auth/me)
 *  - userLoading  : boolean
 *  - userError    : string | null
 *  - refetchUser  : fn
 *  - requests     : array              (GET /requests?userId=)
 *  - reqsLoading  : boolean
 *  - onLogout     : fn
 */

import { useState, useEffect } from "react";
import {api} from "../api/apiFetch";
import { fullName, formatDate } from "../components/shared";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────────────────
   BUTTON  (exact as provided)
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
      {loading ? "Loading..." : (
        <>{leftIcon && <span className="mr-2">{leftIcon}</span>}{children}{rightIcon && <span className="ml-2">{rightIcon}</span>}</>
      )}
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────────────────── */
const Icons = {
  User:     (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
  Mail:     (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Phone:    (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>,
  Calendar: (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  MapPin:   (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Edit:     (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
  Logout:   (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  Check:    (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  Clock:    (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  Clip:     (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
  Shield:   (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
  X:        (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  Drop:     (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0C19 10.5 12 2 12 2z"/></svg>,
};

const ic = (name, cls = "w-4 h-4") => {
  const C = Icons[name];
  return <C className={cls} />;
};

/* ─────────────────────────────────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────────────────────────────────── */
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />;
}

/* ─────────────────────────────────────────────────────────────────────────
   INFO CARD
───────────────────────────────────────────────────────────────────────── */
function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm
                    hover:border-red-100 hover:shadow-md transition-all duration-200 min-w-0">
      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 text-red-500">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{label}</p>
        <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, bg, textColor, borderColor, loading: isLoading }) {
  return (
    <div className={`rounded-2xl p-5 flex flex-col gap-3 ${bg} border ${borderColor}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold uppercase tracking-widest ${textColor} opacity-70`}>{label}</span>
        <div className={`${textColor} opacity-50`}>{icon}</div>
      </div>
      {isLoading
        ? <Skeleton className="h-9 w-16" />
        : <p className={`text-4xl font-extrabold leading-none ${textColor}`}>{value ?? 0}</p>
      }
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   EDIT PROFILE MODAL
───────────────────────────────────────────────────────────────────────── */
function EditProfileModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    firstName:     user.firstName     ?? "",
    lastName:      user.lastName      ?? "",
    email:         user.email         ?? "",
    contactNumber: user.contactNumber ?? "",
    address:       user.address       ?? "",
    birthdate:     user.birthdate     ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState(null);

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const save = async () => {
    setSaving(true); setErr(null);
    try {
      const updated = await api.updateMe(form);
      onSaved(updated); onClose();
    } catch (e) { setErr(e.message); setSaving(false); }
  };

  const fields = [
    { label: "First Name",     key: "firstName",     type: "text",  placeholder: "Maria",                  span: 1 },
    { label: "Last Name",      key: "lastName",      type: "text",  placeholder: "Santos",                 span: 1 },
    { label: "Email Address",  key: "email",         type: "email", placeholder: "maria@example.com",      span: 2 },
    { label: "Contact Number", key: "contactNumber", type: "tel",   placeholder: "+63 912 345 6789",       span: 1 },
    { label: "Birthdate",      key: "birthdate",     type: "date",  placeholder: "",                       span: 1 },
    { label: "Address",        key: "address",       type: "text",  placeholder: "Cebu City, Philippines", span: 2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              {ic("Edit")}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Edit Profile</h3>
              <p className="text-xs text-gray-400 mt-0.5">Update your personal information</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
            {ic("X")}
          </button>
        </div>

        {/* Fields */}
        <div className="p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.key} className={f.span === 2 ? "sm:col-span-2" : ""}>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  {f.label}
                </label>
                <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                  onChange={set(f.key)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800
                             placeholder-gray-400 bg-gray-50 focus:bg-white
                             focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                />
              </div>
            ))}
          </div>

          {err && (
            <div className="flex items-center gap-2 text-xs text-red-700 font-semibold
                            bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {ic("X", "w-4 h-4 flex-shrink-0")} {err}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button variant="tertiary" size="md" fullWidth onClick={onClose}>Cancel</Button>
            <Button variant="primary"  size="md" fullWidth loading={saving} onClick={save}
              leftIcon={!saving && ic("Check")}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CHANGE PASSWORD MODAL
───────────────────────────────────────────────────────────────────────── */
function ChangePasswordModal({ onClose }) {
  const [form, setForm]     = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [done,   setDone]   = useState(false);
  const [err,    setErr]    = useState(null);
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    if (form.next !== form.confirm) { setErr("New passwords do not match."); return; }
    if (form.next.length < 6)       { setErr("Password must be at least 6 characters."); return; }
    setSaving(true); setErr(null);
    try {
      await api.changePassword?.({ currentPassword: form.current, newPassword: form.next });
      setDone(true);
      setTimeout(onClose, 1600);
    } catch (e) { setErr(e.message); setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              {ic("Shield")}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Change Password</h3>
              <p className="text-xs text-gray-400 mt-0.5">Keep your account secure</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition">{ic("X")}</button>
        </div>

        {done ? (
          <div className="flex flex-col items-center py-12 gap-3 px-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              {ic("Check", "w-7 h-7 text-green-600")}
            </div>
            <p className="font-bold text-gray-900">Password Updated!</p>
            <p className="text-sm text-gray-500 text-center">Your password has been changed successfully.</p>
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-4">
            {[
              { label: "Current Password", key: "current", ph: "Enter current password" },
              { label: "New Password",     key: "next",    ph: "At least 6 characters"  },
              { label: "Confirm Password", key: "confirm", ph: "Repeat new password"    },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  {f.label}
                </label>
                <input type="password" value={form[f.key]} placeholder={f.ph} onChange={set(f.key)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800
                             placeholder-gray-400 bg-gray-50 focus:bg-white
                             focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" />
              </div>
            ))}
            {err && (
              <div className="flex items-center gap-2 text-xs text-red-700 font-semibold
                              bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {ic("X", "w-4 h-4 flex-shrink-0")} {err}
              </div>
            )}
            <div className="flex gap-3 pt-1">
              <Button variant="tertiary" size="md" fullWidth onClick={onClose}>Cancel</Button>
              <Button variant="primary"  size="md" fullWidth loading={saving} onClick={save}
                leftIcon={!saving && ic("Shield")}>
                Update Password
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   PROFILE PAGE
───────────────────────────────────────────────────────────────────────── */
export default function ProfilePage({
  user, userLoading, userError, refetchUser,
  requests, reqsLoading,
  onLogout,
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen,   setPwOpen]   = useState(false);

  const requestList   = requests ?? [];
  const approvedCount = requestList.filter(r => r.status === "approved").length;
  const pendingCount  = requestList.filter(r => r.status === "pending").length;
  const displayName   = fullName(user);
  const initial       = displayName !== "—" ? displayName.charAt(0).toUpperCase() : "?";

  const navigate = useNavigate();

const handleLogout = () => {
  console.log("logout clicked");

  api.logout().finally(() => {
    localStorage.removeItem("token");

    navigate("/"); // landing page
  });
};

  

  /* ── Loading state ── */
  if (userLoading) {
    return (
      <div className="w-full flex flex-col gap-6">
        {/* Header skeleton */}
        <div className="w-full bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Skeleton className="w-20 h-20 rounded-2xl flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-3 w-full">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Skeleton className="h-9 w-32 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {[...Array(3)].map((_,i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        {/* Info skeleton */}
        <div className="w-full bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
          <div className="flex gap-3 mb-2">
            <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...Array(6)].map((_,i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (userError) {
    return (
      <div className="w-full flex flex-col items-center py-20 gap-4 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
          {ic("X", "w-7 h-7 text-red-400")}
        </div>
        <p className="font-bold text-gray-700">Failed to load profile</p>
        <p className="text-sm text-gray-400 max-w-xs">{userError}</p>
        <Button variant="secondary" size="sm" onClick={refetchUser}>Try again</Button>
      </div>
    );
  }

  

  return (
    <div className="w-full flex flex-col gap-6 pb-8">

      {/* ══════ PROFILE HEADER ══════ */}
      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Red accent top bar */}
        <div className="h-1.5 bg-red-600 w-full" />

        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center
                            text-white font-extrabold text-3xl shadow-lg shadow-red-600/25">
              {initial}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>

          {/* Name, email, address */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl font-extrabold text-gray-900">{displayName}</h2>
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700
                               text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-green-200">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Active Donor
              </span>
            </div>
            <p className="text-sm text-gray-500">{user?.email ?? "—"}</p>
            {user?.address && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1.5">
                {ic("MapPin", "w-3.5 h-3.5")} {user.address}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
            <Button variant="primary" size="md" className="flex-1 sm:flex-none"
              onClick={() => setEditOpen(true)}
              leftIcon={ic("Edit")}>
              Edit Profile
            </Button>
            <Button variant="tertiary" size="md"
              onClick={handleLogout}
              leftIcon={ic("Logout")}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* ══════ REQUEST STATS ══════ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <StatCard
          icon={ic("Clip", "w-5 h-5")}
          label="Total Requests" value={requestList.length}
          bg="bg-white"        textColor="text-gray-900"    borderColor="border-gray-100"
          loading={reqsLoading}
        />
        <StatCard
          icon={ic("Check", "w-5 h-5")}
          label="Approved"      value={approvedCount}
          bg="bg-emerald-50"   textColor="text-emerald-700" borderColor="border-emerald-100"
          loading={reqsLoading}
        />
        <StatCard
          icon={ic("Clock", "w-5 h-5")}
          label="Pending"       value={pendingCount}
          bg="bg-yellow-50"    textColor="text-yellow-700"  borderColor="border-yellow-100"
          loading={reqsLoading}
        />
      </div>

      {/* ══════ PERSONAL INFORMATION ══════ */}
      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Section header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-red-600 flex-shrink-0">
              {ic("User")}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Personal Information</h3>
              <p className="text-xs text-gray-400 mt-0.5">Your account details from the system</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}
            leftIcon={ic("Edit", "w-3.5 h-3.5")}>
            Edit
          </Button>
        </div>

        {/* 2-column info grid — 1 col on mobile, 2 col on sm+ */}
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoCard icon={ic("User")}     label="First Name"     value={user?.firstName}               />
          <InfoCard icon={ic("User")}     label="Last Name"      value={user?.lastName}                />
          <InfoCard icon={ic("Mail")}     label="Email Address"  value={user?.email}                   />
          <InfoCard icon={ic("Phone")}    label="Contact Number" value={user?.contactNumber}           />
          <InfoCard icon={ic("Calendar")} label="Birthdate"      value={formatDate(user?.birthdate)}   />
          <InfoCard icon={ic("MapPin")}   label="Address"        value={user?.address}                 />
        </div>
      </div>

      {/* ══════ ACCOUNT SECURITY ══════ */}
      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-gray-100">
          <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-red-600 flex-shrink-0">
            {ic("Shield")}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Account Security</h3>
            <p className="text-xs text-gray-400 mt-0.5">Manage your password and account access</p>
          </div>
        </div>

        <div className="px-5 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Password</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Use a strong password to protect your account
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" size="sm" onClick={() => setPwOpen(true)}
              leftIcon={ic("Shield", "w-3.5 h-3.5")}>
              Change Password
            </Button>
            <Button variant="primary" size="sm" onClick={onLogout}
              leftIcon={ic("Logout", "w-3.5 h-3.5")}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* ══════ MODALS ══════ */}
      {editOpen && user && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSaved={() => { refetchUser(); setEditOpen(false); }}
        />
      )}
      {pwOpen && (
        <ChangePasswordModal onClose={() => setPwOpen(false)} />
      )}
    </div>
  );
}