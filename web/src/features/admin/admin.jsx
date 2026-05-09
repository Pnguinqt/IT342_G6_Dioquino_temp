/**
 * Admin.jsx — DugoSugbo Admin Dashboard
 * React + Tailwind CSS
 *
 * Features:
 *  - Overview stats (total hospitals, pending, verified, users)
 *  - Hospital registration queue with verification workflow
 *  - Manage existing verified hospitals
 *  - View all user bookings across hospitals
 *  - Send feedback email to hospital
 *  - Responsive sidebar layout
 *
 * API contracts (wire up to your Spring Boot backend):
 *  GET  /api/admin/hospitals           → all hospital registrations
 *  GET  /api/admin/hospitals/:id       → single hospital detail
 *  PUT  /api/admin/hospitals/:id/verify   body: { status: "VERIFIED"|"REJECTED" }
 *  POST /api/admin/hospitals/:id/feedback body: { subject, message }
 *  GET  /api/admin/bookings            → all user bookings
 *  GET  /api/admin/stats               → dashboard counts    
 */

import { useState, useEffect } from "react";
import Button from "../features/shared/Button.jsx";
import { useNotifications } from "../features/api/notificationAPI.js";
import api from "../features/api/hospitalFetchAPI.js";

/* ── Button (exact as provided) ── */

/* ─────────────────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────────────────── */
const Ic = {
  Drop:      () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0C19 10.5 12 2 12 2z"/></svg>,
  Home:      () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  Hospital:  () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>,
  Users:     () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  Clip:      () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
  Bell:      () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
  Check:     () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
  X:         () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  Mail:      () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Eye:       () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
  Search:    () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  Shield:    () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
  Menu:      () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>,
  Logout:    () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  MapPin:    () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Phone:     () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>,
  Clock:     () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  ChevronR:  () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>,
  Refresh:   () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>,
};



/* ─────────────────────────────────────────────────────────────────────────
   STATUS HELPERS
───────────────────────────────────────────────────────────────────────── */
const HOSP_STATUS = {
  PENDING:  { label: "Pending",  cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  VERIFIED: { label: "Verified", cls: "bg-green-50  text-green-700  border-green-200"  },
  REJECTED: { label: "Rejected", cls: "bg-red-50    text-red-600    border-red-200"    },
};

const BOOK_STATUS = {
  PENDING:      { label: "Pending",      cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  UNDER_REVIEW: { label: "Under Review", cls: "bg-blue-50   text-blue-700   border-blue-200"   },
  COMPLETED:    { label: "Completed",    cls: "bg-green-50  text-green-700  border-green-200"  },
  REJECTED:     { label: "Rejected",     cls: "bg-red-50    text-red-600    border-red-200"    },
};

function StatusBadge({ status, map }) {
  const s = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-600 border-gray-200" };
  return (
    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${s.cls}`}>
      {s.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────────────────────────────────── */
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />;
}

/* ─────────────────────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────────────────────── */
function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div className={`rounded-2xl p-5 border flex flex-col gap-3 ${accent}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest opacity-60">{label}</span>
        <div className="opacity-50">{icon}</div>
      </div>
      <p className="text-3xl font-extrabold leading-none">{value}</p>
      {sub && <p className="text-xs opacity-60 font-medium">{sub}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   FEEDBACK MODAL
───────────────────────────────────────────────────────────────────────── */
function FeedbackModal({ hospital, onClose, onSend }) {
  const [subject, setSubject] = useState(`Action Required: Hospital Registration — ${hospital.name}`);
  const [message, setMessage] = useState(
    `Dear ${hospital.name} Team,\n\nThank you for registering on the DugoSugbo platform.\n\nAfter reviewing your application, we found the following requirements are missing or need clarification:\n\n• [List missing documents here]\n• [List any other requirements]\n\nPlease submit the required documents at your earliest convenience so we can proceed with the verification process.\n\nFor questions, please reply to this email.\n\nBest regards,\nDugoSugbo Admin Team`
  );
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);

  const send = async () => {
    setSending(true);
    // TODO: await api.sendFeedback(hospital.id, { subject, message })
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setTimeout(() => { onSend(); onClose(); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <Ic.Mail />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Send Feedback Email</h3>
              <p className="text-xs text-gray-400 mt-0.5">To: <span className="font-semibold text-gray-600">{hospital.email}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition">
            <Ic.X />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center py-14 gap-3 px-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <p className="font-bold text-gray-900">Email Sent Successfully!</p>
            <p className="text-sm text-gray-500 text-center">Feedback has been sent to <span className="font-semibold">{hospital.email}</span>.</p>
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-4 overflow-y-auto">
            {/* Subject */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Subject</label>
              <input value={subject} onChange={e => setSubject(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 bg-gray-50
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition"
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Message</label>
              <textarea rows={12} value={message} onChange={e => setMessage(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 text-gray-800 bg-gray-50
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition resize-none font-mono"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button variant="tertiary" size="md" fullWidth onClick={onClose}>Cancel</Button>
              <Button variant="primary"  size="md" fullWidth loading={sending} onClick={send}
                leftIcon={!sending && <Ic.Mail />}>
                Send Email
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   HOSPITAL DETAIL MODAL
───────────────────────────────────────────────────────────────────────── */
function HospitalDetailModal({ hospital, onClose, onVerify, onReject, onFeedback }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <Ic.Hospital />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{hospital.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Hospital Registration Details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={hospital.status} map={HOSP_STATUS} />
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 ml-1 transition">
              <Ic.X />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-5">

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: <Ic.Mail />,   label: "Email",     value: hospital.email    },
              { icon: <Ic.Phone />,  label: "Phone",     value: hospital.phone    },
              { icon: <Ic.MapPin />, label: "Address",   value: hospital.address  },
              { icon: <Ic.Shield />, label: "Type",      value: hospital.type     },
              { icon: <Ic.Shield />, label: "License No.", value: hospital.license || "Not provided" },
              { icon: <Ic.Clock />,  label: "Registered", value: hospital.registeredAt },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-red-500 flex-shrink-0 border border-gray-200 mt-0.5">
                  {f.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5 break-words">{f.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Submitted documents */}
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Submitted Documents</p>
            <div className="flex flex-wrap gap-2">
              {hospital.documents.map(doc => (
                <span key={doc} className="inline-flex items-center gap-1.5 bg-green-50 text-green-700
                                           text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  {doc}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          {hospital.notes && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Admin Notes</p>
              <p className="text-sm text-gray-700">{hospital.notes}</p>
            </div>
          )}

          {/* Actions */}
          {hospital.status === "PENDING" && (
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100">
              <Button variant="primary" size="md" fullWidth onClick={() => onVerify(hospital)}
                leftIcon={<Ic.Check />}>
                Verify Hospital
              </Button>
              <Button variant="secondary" size="md" fullWidth onClick={() => onFeedback(hospital)}
                leftIcon={<Ic.Mail />}>
                Send Feedback
              </Button>
              <Button variant="tertiary" size="md" fullWidth onClick={() => onReject(hospital)}
                leftIcon={<Ic.X />}>
                Reject
              </Button>
            </div>
          )}
          {hospital.status === "VERIFIED" && (
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Button variant="secondary" size="md" fullWidth onClick={() => onFeedback(hospital)}
                leftIcon={<Ic.Mail />}>
                Send Message
              </Button>
              <Button variant="tertiary" size="md" fullWidth onClick={() => onReject(hospital)}
                leftIcon={<Ic.X />}>
                Revoke Verification
              </Button>
            </div>
          )}
          {hospital.status === "REJECTED" && (
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Button variant="primary" size="md" fullWidth onClick={() => onVerify(hospital)}
                leftIcon={<Ic.Check />}>
                Reconsider & Verify
              </Button>
              <Button variant="secondary" size="md" fullWidth onClick={() => onFeedback(hospital)}
                leftIcon={<Ic.Mail />}>
                Send Feedback
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   BOOKING DETAIL MODAL
───────────────────────────────────────────────────────────────────────── */
const BOOKING_STATUSES = ["PENDING", "UNDER_REVIEW", "COMPLETED", "REJECTED"];

function BookingDetailModal({ booking, onClose, onStatusChange }) {
  const [status,   setStatus]   = useState(booking.status);
  const [feedback, setFeedback] = useState("");
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  const save = async () => {
    setSaving(true);
    // TODO: await api.updateBooking(booking.id, { status, feedback })
    await new Promise(r => setTimeout(r, 800));
    setSaved(true);
    setTimeout(() => { onStatusChange(booking.id, status, feedback); onClose(); }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <Ic.Clip />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Manage Booking</h3>
              <p className="text-xs text-gray-400 mt-0.5">{booking.userName} — {booking.type}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition">
            <Ic.X />
          </button>
        </div>

        {saved ? (
          <div className="flex flex-col items-center py-14 gap-3 px-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <p className="font-bold text-gray-900">Booking Updated!</p>
            <p className="text-sm text-gray-500">Status changed to <span className="font-semibold">{status.replace("_", " ")}</span>.</p>
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-5 overflow-y-auto">

            {/* Booking info */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Client",      value: booking.userName     },
                { label: "Email",       value: booking.userEmail    },
                { label: "Hospital",    value: booking.hospitalName },
                { label: "Type",        value: booking.type         },
                { label: "Blood Type",  value: booking.bloodType    },
                { label: "Units",       value: `${booking.units} unit${booking.units > 1 ? "s" : ""}` },
                { label: "Date",        value: booking.date         },
                { label: "Current Status", value: <StatusBadge status={booking.status} map={BOOK_STATUS} /> },
              ].map(f => (
                <div key={f.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{f.label}</p>
                  <div className="text-sm font-semibold text-gray-800 mt-0.5">{f.value}</div>
                </div>
              ))}
            </div>

            {/* Status change */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
                Update Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BOOKING_STATUSES.map(s => {
                  const style = BOOK_STATUS[s];
                  return (
                    <button key={s} onClick={() => setStatus(s)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                        status === s
                          ? `${style.cls} ring-2 ring-offset-1 ring-current`
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}>
                      {style.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback / requirements */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
                Feedback / Missing Requirements
                <span className="ml-1 text-gray-400 normal-case font-normal">(optional — sent to client)</span>
              </label>
              <textarea rows={4} value={feedback} onChange={e => setFeedback(e.target.value)}
                placeholder="e.g. Please provide a valid government-issued ID. Your blood type confirmation is required before proceeding..."
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400
                           bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                           transition resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="tertiary" size="md" fullWidth onClick={onClose}>Cancel</Button>
              <Button variant="primary"  size="md" fullWidth loading={saving} onClick={save}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SIDEBAR NAV ITEM
───────────────────────────────────────────────────────────────────────── */
function NavItem({ icon, label, active, badge, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        active ? "bg-red-600 text-white shadow-md shadow-red-600/25" : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}>
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {badge > 0 && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
          active ? "bg-white/20 text-white" : "bg-red-600 text-white"
        }`}>{badge}</span>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN ADMIN DASHBOARD
───────────────────────────────────────────────────────────────────────── */
export default function Admin() {
  const [activeNav,    setActiveNav]    = useState("dashboard");
  const [hospitals,    setHospitals]    = useState([]);
  const [bookings,     setBookings]     = useState([]);
  const [loadingHosp,   setLoadingHosp]   = useState(true);
  const [loadingBook,   setLoadingBook]   = useState(true);
  const [detailHosp,   setDetailHosp]   = useState(null);
  const [detailBook,   setDetailBook]   = useState(null);
  const [feedbackHosp, setFeedbackHosp] = useState(null);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [search,       setSearch]       = useState("");
  const [hospFilter,   setHospFilter]   = useState("ALL");
  const [bookFilter,   setBookFilter]   = useState("ALL");
  const { notifications } = useNotifications();

  /* ── Derived counts ── */
  const pendingHospitals  = hospitals.filter(h => h.status === "PENDING").length;
  const verifiedHospitals = hospitals.filter(h => h.status === "VERIFIED").length;
  const pendingBookings   = bookings.filter(b  => b.status === "PENDING").length;

  /* ── Actions ── */
  const handleVerify = (hospital) => {
    // TODO: await api.verifyHospital(hospital.id)
    setHospitals(prev => prev.map(h => h.id === hospital.id ? { ...h, status: "VERIFIED" } : h));
    setDetailHosp(null);
  };
  const handleReject = (hospital) => {
    // TODO: await api.rejectHospital(hospital.id)
    setHospitals(prev => prev.map(h => h.id === hospital.id ? { ...h, status: "REJECTED" } : h));
    setDetailHosp(null);
  };
  const handleBookingUpdate = (id, status, feedback) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  /* ── Filtered lists ── */
  const filteredHospitals = hospitals.filter(h => {
    const q = search.toLowerCase();
    const matchQ = h.name.toLowerCase().includes(q) || h.email.toLowerCase().includes(q);
    const matchF = hospFilter === "ALL" || h.status === hospFilter;
    return matchQ && matchF;
  });
  const filteredBookings = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchQ = b.userName.toLowerCase().includes(q) || b.hospitalName.toLowerCase().includes(q);
    const matchF = bookFilter === "ALL" || b.status === bookFilter;
    return matchQ && matchF;
  });

  /* ── Page meta ── */
  const PAGE = {
    dashboard:  { title: "Dashboard",           sub: "System overview and quick actions" },
    hospitals:  { title: "Hospital Management", sub: "Review and verify hospital registrations" },
    bookings:   { title: "Booking Management",  sub: "Manage all user blood requests and donations" },
  };

  /* ── Sidebar ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-800">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
          <Ic.Drop />
        </div>
        <div>
          <span className="font-bold text-white text-base tracking-tight">DugoSugbo</span>
          <span className="block text-[10px] text-gray-500 font-semibold uppercase tracking-widest">Admin Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 mb-2">Navigation</p>
        <NavItem icon={<Ic.Home />}     label="Dashboard"            active={activeNav === "dashboard"} onClick={() => { setActiveNav("dashboard"); setSidebarOpen(false); }} />
        <NavItem icon={<Ic.Hospital />} label="Hospitals"            active={activeNav === "hospitals"} badge={pendingHospitals} onClick={() => { setActiveNav("hospitals"); setSidebarOpen(false); }} />
        <NavItem icon={<Ic.Clip />}     label="Bookings"             active={activeNav === "bookings"}  badge={pendingBookings}  onClick={() => { setActiveNav("bookings");  setSidebarOpen(false); }} />
      </nav>

      {/* Admin user strip */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-800">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Administrator</p>
            <p className="text-[10px] text-gray-500 truncate">admin@dugosugbo.com</p>
          </div>
          <button className="text-gray-500 hover:text-red-400 transition flex-shrink-0">
            <Ic.Logout />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-gray-900 fixed top-0 left-0 h-screen z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-60 h-full z-50 shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"
                onClick={() => setSidebarOpen(true)}>
                <Ic.Menu />
              </button>
              <div>
                <h1 className="font-bold text-gray-900 leading-none">{PAGE[activeNav].title}</h1>
                <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">{PAGE[activeNav].sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition">
               <Ic.Bell />
                  {notifications.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
              </button>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 px-4 sm:px-6 py-6 max-w-6xl w-full mx-auto">

          {/* ══════ DASHBOARD ══════ */}
          {activeNav === "dashboard" && (
            <div className="flex flex-col gap-6">

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Hospitals" value={hospitals.length}     sub="Registered"           icon={<Ic.Hospital />} accent="bg-white border-gray-100 text-gray-900" />
                <StatCard label="Pending Review"  value={pendingHospitals}     sub="Awaiting verification" icon={<Ic.Clock />}    accent="bg-yellow-50 border-yellow-100 text-yellow-800" />
                <StatCard label="Verified"        value={verifiedHospitals}    sub="Active hospitals"      icon={<Ic.Shield />}   accent="bg-green-50 border-green-100 text-green-800" />
                <StatCard label="Pending Bookings" value={pendingBookings}     sub="Needs action"          icon={<Ic.Clip />}     accent="bg-red-50 border-red-100 text-red-700" />
              </div>

              {/* Pending hospitals quick list */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-gray-900 text-sm">Pending Hospital Registrations</h2>
                    {pendingHospitals > 0 && (
                      <span className="bg-yellow-100 text-yellow-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-yellow-200">
                        {pendingHospitals} pending
                      </span>
                    )}
                  </div>
                  <button onClick={() => setActiveNav("hospitals")}
                    className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1">
                    View all <Ic.ChevronR />
                  </button>
                </div>

                {hospitals.filter(h => h.status === "PENDING").length === 0 ? (
                  <div className="flex flex-col items-center py-10 gap-2">
                    <Ic.Shield />
                    <p className="text-sm text-gray-400">No pending registrations</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {hospitals.filter(h => h.status === "PENDING").map(h => (
                      <div key={h.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition">
                        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-red-600 flex-shrink-0">
                          <Ic.Hospital />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{h.name}</p>
                          <p className="text-xs text-gray-400">{h.email} · Registered {h.registeredAt}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button variant="primary"   size="sm" onClick={() => handleVerify(h)}   leftIcon={<Ic.Check />}>Verify</Button>
                          <Button variant="secondary" size="sm" onClick={() => setDetailHosp(h)}  leftIcon={<Ic.Eye />}>Review</Button>
                          <Button variant="tertiary"  size="sm" onClick={() => setFeedbackHosp(h)} leftIcon={<Ic.Mail />} className="hidden sm:inline-flex">Feedback</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent bookings */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900 text-sm">Recent Bookings</h2>
                  <button onClick={() => setActiveNav("bookings")}
                    className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1">
                    View all <Ic.ChevronR />
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {bookings.slice(0, 4).map(b => (
                    <div key={b.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition">
                      <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 flex-shrink-0">
                        <Ic.Users />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{b.userName}</p>
                        <p className="text-xs text-gray-400">{b.type} · {b.bloodType} · {b.hospitalName}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={b.status} map={BOOK_STATUS} />
                        <Button variant="secondary" size="sm" onClick={() => setDetailBook(b)}>Manage</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════ HOSPITALS ══════ */}
          {activeNav === "hospitals" && (
            <div className="flex flex-col gap-5">

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Ic.Search />
                  </div>
                  <input type="text" placeholder="Search hospitals by name or email…"
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
                               focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400
                               text-gray-700 placeholder-gray-400 transition"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {["ALL", "PENDING", "VERIFIED", "REJECTED"].map(f => (
                    <button key={f} onClick={() => setHospFilter(f)}
                      className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        hospFilter === f
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-red-300"
                      }`}>
                      {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hospital cards */}
              <div className="grid gap-4">
                {filteredHospitals.length === 0 ? (
                  <div className="flex flex-col items-center py-16 gap-3 bg-white rounded-2xl border border-gray-100">
                    <Ic.Hospital />
                    <p className="font-bold text-gray-700">No hospitals found</p>
                    <Button variant="secondary" size="sm" onClick={() => { setSearch(""); setHospFilter("ALL"); }}>Clear filters</Button>
                  </div>
                ) : filteredHospitals.map(h => (
                  <div key={h.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:border-red-100 hover:shadow-md transition-all">
                    {/* Card header */}
                    <div className="flex items-start gap-4 p-5">
                      <div className="w-11 h-11 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center text-red-600 flex-shrink-0">
                        <Ic.Hospital />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{h.name}</h3>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{h.type}</span>
                          <StatusBadge status={h.status} map={HOSP_STATUS} />
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <span className="flex items-center gap-1 text-xs text-gray-500"><Ic.Mail /> {h.email}</span>
                          <span className="flex items-center gap-1 text-xs text-gray-500"><Ic.MapPin /> {h.address}</span>
                          <span className="flex items-center gap-1 text-xs text-gray-500"><Ic.Clock /> {h.registeredAt}</span>
                        </div>
                        {/* Docs */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {h.documents.map(d => (
                            <span key={d} className="text-[10px] font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setDetailHosp(h)}    leftIcon={<Ic.Eye />}>Review</Button>
                      {h.status === "PENDING"  && <Button variant="primary"   size="sm" onClick={() => handleVerify(h)}   leftIcon={<Ic.Check />}>Verify</Button>}
                      {h.status === "VERIFIED" && <Button variant="tertiary"  size="sm" onClick={() => handleReject(h)}   leftIcon={<Ic.X />}>Revoke</Button>}
                      {h.status === "REJECTED" && <Button variant="primary"   size="sm" onClick={() => handleVerify(h)}   leftIcon={<Ic.Check />}>Reconsider</Button>}
                      <Button variant="tertiary" size="sm" onClick={() => setFeedbackHosp(h)} leftIcon={<Ic.Mail />}>Send Feedback</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════ BOOKINGS ══════ */}
          {activeNav === "bookings" && (
            <div className="flex flex-col gap-5">

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Ic.Search />
                  </div>
                  <input type="text" placeholder="Search by client name or hospital…"
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
                               focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400
                               text-gray-700 placeholder-gray-400 transition"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {["ALL", "PENDING", "UNDER_REVIEW", "COMPLETED", "REJECTED"].map(f => (
                    <button key={f} onClick={() => setBookFilter(f)}
                      className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        bookFilter === f
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-red-300"
                      }`}>
                      {f === "ALL" ? "All" : f.replace("_", " ").charAt(0) + f.replace("_", " ").slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking list */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900 text-sm">All Bookings</h2>
                  <span className="text-xs text-gray-400">{filteredBookings.length} total</span>
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="flex flex-col items-center py-14 gap-3">
                    <Ic.Clip />
                    <p className="text-sm text-gray-400">No bookings found</p>
                    <Button variant="secondary" size="sm" onClick={() => { setSearch(""); setBookFilter("ALL"); }}>Clear filters</Button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredBookings.map(b => (
                      <div key={b.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 flex-shrink-0">
                          <Ic.Users />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <p className="text-sm font-bold text-gray-900">{b.userName}</p>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{b.type}</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {b.hospitalName} · Blood: <span className="font-semibold text-gray-700">{b.bloodType}</span> · {b.units} unit{b.units > 1 ? "s" : ""} · {b.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <StatusBadge status={b.status} map={BOOK_STATUS} />
                          <Button variant="secondary" size="sm" onClick={() => setDetailBook(b)}>Manage</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── Modals ── */}
      {detailHosp && (
        <HospitalDetailModal
          hospital={detailHosp}
          onClose={() => setDetailHosp(null)}
          onVerify={(h) => { handleVerify(h); setDetailHosp(null); }}
          onReject={(h) => { handleReject(h); setDetailHosp(null); }}
          onFeedback={(h) => { setDetailHosp(null); setFeedbackHosp(h); }}
        />
      )}
      {feedbackHosp && (
        <FeedbackModal
          hospital={feedbackHosp}
          onClose={() => setFeedbackHosp(null)}
          onSend={() => setFeedbackHosp(null)}
        />
      )}
      {detailBook && (
        <BookingDetailModal
          booking={detailBook}
          onClose={() => setDetailBook(null)}
          onStatusChange={handleBookingUpdate}
        />
      )}
    </div>
  );
}

