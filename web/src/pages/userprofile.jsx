
import { useState } from "react";
import { api } from "../api/apiFetch";
import {
  Button, Ic, Skeleton, ErrorState, InfoRow,
  fullName, formatDate,
} from "../components/shared";

/* ── Edit Profile Modal — fields match UserEntity ── */
function EditProfileModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    firstName:     user.firstName     ?? "",
    lastName:      user.lastName      ?? "",
    email:         user.email         ?? "",
    contactNumber: user.contactNumber ?? "",
    address:       user.address       ?? "",
    birthdate:     user.birthdate     ?? "",  // "YYYY-MM-DD"
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

  // Matches every writable field in UserEntity
  const fields = [
    { label: "First Name",     key: "firstName",     type: "text",  placeholder: "Maria",                 col: 1 },
    { label: "Last Name",      key: "lastName",      type: "text",  placeholder: "Santos",                col: 1 },
    { label: "Email Address",  key: "email",         type: "email", placeholder: "maria@example.com",     col: 2 },
    { label: "Contact Number", key: "contactNumber", type: "tel",   placeholder: "+63 912 345 6789",      col: 1 },
    { label: "Birthdate",      key: "birthdate",     type: "date",  placeholder: "",                      col: 1 },
    { label: "Address",        key: "address",       type: "text",  placeholder: "Cebu City, Philippines", col: 2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Edit Profile</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
            <Ic.X />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {fields.map(f => (
              <div key={f.key} className={f.col === 2 ? "col-span-2" : ""}>
                <label className="text-xs font-semibold text-gray-600 block mb-1">{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  placeholder={f.placeholder}
                  onChange={set(f.key)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition"
                />
              </div>
            ))}
          </div>

          {err && (
            <p className="text-xs text-red-600 font-semibold bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {err}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button variant="tertiary" size="md" fullWidth onClick={onClose}>Cancel</Button>
            <Button variant="primary"  size="md" fullWidth loading={saving} onClick={save}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ProfilePage ── */
export default function ProfilePage({
  user, userLoading, userError, refetchUser,
  requests, reqsLoading,
  onLogout,
}) {
  const [editOpen, setEditOpen] = useState(false);

  const requestList   = requests ?? [];
  const approvedCount = requestList.filter(r => r.status === "approved").length;
  const pendingCount  = requestList.filter(r => r.status === "pending").length;
  const displayName   = fullName(user);
  const displayInitial = displayName !== "—" ? displayName.charAt(0).toUpperCase() : "?";

  if (userLoading) {
    return (
      <div className="max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <Skeleton className="h-40 rounded-none" />
          <div className="p-6 flex flex-col gap-4">
            {[...Array(5)].map((_,i) => <Skeleton key={i} className="h-12" />)}
          </div>
        </div>
      </div>
    );
  }

  if (userError) {
    return <ErrorState message={userError} onRetry={refetchUser} />;
  }

  return (
    <div className="max-w-md">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

        {/* Red banner header */}
        <div className="bg-red-600 px-6 pt-8 pb-14">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-red-600 font-extrabold text-2xl shadow-lg">
            {displayInitial}
          </div>
          {/* firstName + lastName from UserEntity */}
          <h2 className="text-white font-bold text-lg mt-3">{displayName}</h2>
          <p className="text-white/70 text-xs mt-0.5">{user?.email ?? "—"}</p>
        </div>

        {/* Email badge overlapping the banner */}
        <div className="relative px-6 -mt-6 mb-2">
          <span className="inline-flex items-center gap-1.5 bg-white border-2 border-red-200 text-red-600 text-sm font-extrabold px-3 py-1.5 rounded-xl shadow-sm">
            <Ic.Mail c="w-4 h-4" /> {user?.email ?? "—"}
          </span>
        </div>

        {/* All UserEntity fields displayed as info rows */}
        <div className="px-6 pb-2">
          <InfoRow
            icon={<Ic.User c="w-4 h-4" />}
            label="Full Name"
            value={displayName}
          />
          <InfoRow
            icon={<Ic.Mail c="w-4 h-4" />}
            label="Email"
            value={user?.email}
          />
          <InfoRow
            icon={<Ic.Phone c="w-4 h-4" />}
            label="Contact Number"
            value={user?.contactNumber}
          />
          <InfoRow
            icon={<Ic.Calendar c="w-4 h-4" />}
            label="Birthdate"
            value={formatDate(user?.birthdate)}
          />
          <InfoRow
            icon={<Ic.MapPin c="w-4 h-4" />}
            label="Address"
            value={user?.address}
          />
        </div>

        {/* Request stats mini-dashboard */}
        <div className="mx-6 mb-5 grid grid-cols-3 gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          {[
            { label: "Total",    value: requestList.length, color: "text-gray-900"   },
            { label: "Approved", value: approvedCount,       color: "text-green-600"  },
            { label: "Pending",  value: pendingCount,        color: "text-yellow-600" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={`text-xl font-extrabold ${s.color}`}>
                {reqsLoading ? "…" : s.value}
              </p>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-2">
          <Button
            variant="primary" size="md" fullWidth
            onClick={() => setEditOpen(true)}
            leftIcon={<Ic.Edit c="w-4 h-4" />}>
            Edit Profile
          </Button>
          <Button
            variant="tertiary" size="md"
            onClick={onLogout}
            leftIcon={<Ic.Logout c="w-4 h-4" />}>
            Logout
          </Button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editOpen && user && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSaved={() => { refetchUser(); setEditOpen(false); }}
        />
      )}
    </div>
  );
}