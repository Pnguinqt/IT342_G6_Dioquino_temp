import React, { useState } from "react";

// ─── Button Component (from design system) ───────────────────────────────────
const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  onClick,
  type = "button",
  children,
  className = "",
}) => {
  const base = "inline-flex items-center justify-center rounded font-semibold transition";
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100",
    tertiary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 disabled:bg-gray-50",
  };
  const sizes = { sm: "px-3 py-1 text-sm", md: "px-5 py-2 text-sm", lg: "px-6 py-3 text-base" };
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled || loading ? "cursor-not-allowed opacity-70" : "cursor-pointer";
  return (
    <button
      type={type}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledClass} ${className}`}
    >
      {loading ? "Loading..." : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const config = {
    PENDING:      { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
    "UNDER REVIEW": { bg: "bg-blue-100",   text: "text-blue-700",   dot: "bg-blue-500" },
    COMPLETED:    { bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500" },
    REJECTED:     { bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-400"   },
  };
  const c = config[status] || config.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ─── Initial Data ─────────────────────────────────────────────────────────────
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const initialInventory = [
  { id: 1, bloodType: "A+", units: 15, type: "Whole Blood", expires: "2025-06-15", status: "Available" },
  { id: 2, bloodType: "O+", units: 8,  type: "Packed RBC",  expires: "2025-06-10", status: "Available" },
  { id: 3, bloodType: "B-", units: 3,  type: "Plasma",      expires: "2025-05-30", status: "Low Stock" },
  { id: 4, bloodType: "AB+",units: 0,  type: "Platelets",   expires: "2025-05-20", status: "Out of Stock" },
];

const initialBookings = [
  {
    id: 1, name: "Juan dela Cruz", bloodType: "A+", units: 2,
    purpose: "Surgery", type: "Request", date: "2025-05-07",
    status: "PENDING", feedback: "", requirements: [],
    contact: "09171234567", docs: ["Government ID", "Medical Certificate"],
  },
  {
    id: 2, name: "Maria Santos", bloodType: "O+", units: 1,
    purpose: "Donation Drive", type: "Donation", date: "2025-05-06",
    status: "UNDER REVIEW", feedback: "", requirements: [],
    contact: "09281234567", docs: ["Government ID"],
  },
  {
    id: 3, name: "Pedro Reyes", bloodType: "B+", units: 3,
    purpose: "Emergency", type: "Request", date: "2025-05-05",
    status: "COMPLETED", feedback: "All requirements submitted.", requirements: [],
    contact: "09351234567", docs: ["Government ID", "Medical Certificate", "Doctor's Referral"],
  },
  {
    id: 4, name: "Ana Gomez", bloodType: "AB-", units: 1,
    purpose: "Voluntary Donation", type: "Donation", date: "2025-05-04",
    status: "REJECTED", feedback: "Blood pressure too high. Please consult your physician first.",
    requirements: ["Medical Clearance"], contact: "09451234567", docs: ["Government ID"],
  },
];

const ALL_REQUIREMENTS = [
  "Government ID", "Medical Certificate", "Doctor's Referral",
  "Blood Test Results", "Medical Clearance", "Donor Health Form",
  "Insurance Card", "Hospital Admission Slip",
];

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = ["Dashboard", "Blood Inventory", "Bookings", "Posts"];

// ═════════════════════════════════════════════════════════════════════════════
export default function HospitalDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [inventory, setInventory] = useState(initialInventory);
  const [bookings, setBookings] = useState(initialBookings);
  const [posts, setPosts] = useState([
    { id: 1, bloodType: "O-", units: 5, message: "Urgent need for O- blood donors. Please contact us ASAP.", date: "2025-05-06", urgent: true },
    { id: 2, bloodType: "A+", units: 10, message: "A+ blood is now available for request. Stocks replenished.", date: "2025-05-05", urgent: false },
  ]);

  // Modals
  const [bookingModal, setBookingModal] = useState(null);
  const [inventoryModal, setInventoryModal] = useState(false);
  const [postModal, setPostModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(null);

  // Forms
  const [newInventory, setNewInventory] = useState({ bloodType: "A+", units: "", type: "Whole Blood", expires: "" });
  const [newPost, setNewPost] = useState({ bloodType: "A+", units: "", message: "", urgent: false });
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [bookingFilter, setBookingFilter] = useState("ALL");

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = {
    totalUnits: inventory.reduce((s, i) => s + i.units, 0),
    available: inventory.filter(i => i.status === "Available").length,
    pendingBookings: bookings.filter(b => b.status === "PENDING").length,
    todayBookings: bookings.filter(b => b.date === "2025-05-07").length,
  };

  // ── Booking Actions ────────────────────────────────────────────────────────
  const updateBookingStatus = (id, status) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const openFeedback = (booking) => {
    setFeedbackModal(booking);
    setFeedbackText(booking.feedback || "");
    setSelectedRequirements(booking.requirements || []);
  };

  const saveFeedback = () => {
    setBookings(prev =>
      prev.map(b => b.id === feedbackModal.id
        ? { ...b, feedback: feedbackText, requirements: selectedRequirements }
        : b
      )
    );
    setFeedbackModal(null);
  };

  const toggleRequirement = (req) => {
    setSelectedRequirements(prev =>
      prev.includes(req) ? prev.filter(r => r !== req) : [...prev, req]
    );
  };

  // ── Inventory ──────────────────────────────────────────────────────────────
  const addInventory = () => {
    if (!newInventory.units || !newInventory.expires) return;
    const units = parseInt(newInventory.units);
    setInventory(prev => [...prev, {
      id: Date.now(),
      ...newInventory,
      units,
      status: units === 0 ? "Out of Stock" : units <= 5 ? "Low Stock" : "Available",
    }]);
    setNewInventory({ bloodType: "A+", units: "", type: "Whole Blood", expires: "" });
    setInventoryModal(false);
  };

  const deleteInventory = (id) => setInventory(prev => prev.filter(i => i.id !== id));

  // ── Posts ──────────────────────────────────────────────────────────────────
  const addPost = () => {
    if (!newPost.message) return;
    setPosts(prev => [{
      id: Date.now(),
      ...newPost,
      units: parseInt(newPost.units) || 0,
      date: new Date().toISOString().split("T")[0],
    }, ...prev]);
    setNewPost({ bloodType: "A+", units: "", message: "", urgent: false });
    setPostModal(false);
  };

  const deletePost = (id) => setPosts(prev => prev.filter(p => p.id !== id));

  // ── Filtered Bookings ──────────────────────────────────────────────────────
  const filteredBookings = bookingFilter === "ALL"
    ? bookings
    : bookings.filter(b => b.status === bookingFilter);

  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Sidebar ── */}
      <div className="flex h-screen overflow-hidden">
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm flex-shrink-0">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm leading-tight">LifeSource</p>
                <p className="text-xs text-gray-400">Hospital Portal</p>
              </div>
            </div>
          </div>

          {/* Hospital Info */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-red-700">Logged in as</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">Cebu City Medical</p>
              <p className="text-xs text-gray-500">Blood Bank Unit</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-red-600 text-white shadow-md shadow-red-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-base">
                  {tab === "Dashboard" ? "📊" : tab === "Blood Inventory" ? "🩸" : tab === "Bookings" ? "📋" : "📢"}
                </span>
                {tab}
                {tab === "Bookings" && stats.pendingBookings > 0 && (
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === tab ? "bg-white text-red-600" : "bg-red-100 text-red-600"}`}>
                    {stats.pendingBookings}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
              <span>🚪</span> Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{activeTab}</h1>
                <p className="text-sm text-gray-400">May 7, 2025 · Cebu City Medical Center</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{stats.pendingBookings}</span>
                  <button className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition text-base">🔔</button>
                </div>
                <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">CC</div>
              </div>
            </div>
          </header>

          <div className="p-8">

            {/* ════════════ DASHBOARD ════════════ */}
            {activeTab === "Dashboard" && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Blood Units", value: stats.totalUnits, icon: "🩸", color: "red" },
                    { label: "Available Types", value: stats.available, icon: "✅", color: "green" },
                    { label: "Pending Bookings", value: stats.pendingBookings, icon: "⏳", color: "yellow" },
                    { label: "Today's Bookings", value: stats.todayBookings, icon: "📅", color: "blue" },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                          <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <span className="text-2xl">{stat.icon}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Blood Availability Overview */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Blood Type Availability</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {BLOOD_TYPES.map(bt => {
                      const item = inventory.find(i => i.bloodType === bt);
                      const units = item?.units ?? 0;
                      const pct = Math.min((units / 20) * 100, 100);
                      return (
                        <div key={bt} className="flex flex-col items-center gap-2">
                          <div className="relative w-12 h-16 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                            <div
                              className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${units === 0 ? "bg-gray-300" : units <= 5 ? "bg-red-400" : "bg-red-600"}`}
                              style={{ height: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-700">{bt}</span>
                          <span className={`text-xs font-semibold ${units === 0 ? "text-gray-400" : units <= 5 ? "text-red-500" : "text-green-600"}`}>{units}u</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Recent Bookings</h3>
                    <button onClick={() => setActiveTab("Bookings")} className="text-sm text-red-600 font-semibold hover:underline">View all →</button>
                  </div>
                  <div className="space-y-3">
                    {bookings.slice(0, 4).map(b => (
                      <div key={b.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-red-600 font-bold text-sm">{b.bloodType}</div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{b.name}</p>
                            <p className="text-xs text-gray-400">{b.type} · {b.units} unit{b.units > 1 ? "s" : ""}</p>
                          </div>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ════════════ BLOOD INVENTORY ════════════ */}
            {activeTab === "Blood Inventory" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-sm">{inventory.length} blood entries tracked</p>
                  <Button leftIcon="+" onClick={() => setInventoryModal(true)}>Add Blood Stock</Button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {["Blood Type", "Units", "Component", "Expires", "Status", "Actions"].map(h => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {inventory.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center justify-center w-10 h-10 bg-red-100 text-red-700 font-bold text-sm rounded-xl">{item.bloodType}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{item.units}</span>
                              <span className="text-gray-400 text-sm">units</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.type}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.expires}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              item.status === "Available" ? "bg-green-100 text-green-700" :
                              item.status === "Low Stock" ? "bg-yellow-100 text-yellow-700" :
                              "bg-gray-100 text-gray-500"
                            }`}>{item.status}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Button variant="secondary" size="sm" onClick={() => deleteInventory(item.id)}>Remove</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {inventory.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-4xl mb-2">🩸</p>
                      <p className="font-medium">No inventory records yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════════════ BOOKINGS ════════════ */}
            {activeTab === "Bookings" && (
              <div className="space-y-5">
                {/* Filter Tabs */}
                <div className="flex items-center gap-2 flex-wrap">
                  {["ALL", "PENDING", "UNDER REVIEW", "COMPLETED", "REJECTED"].map(f => (
                    <button
                      key={f}
                      onClick={() => setBookingFilter(f)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                        bookingFilter === f
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-red-300"
                      }`}
                    >
                      {f}
                      {f !== "ALL" && (
                        <span className="ml-1.5 opacity-70">({bookings.filter(b => b.status === f).length})</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {filteredBookings.map(booking => (
                    <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-700 font-bold flex-shrink-0">{booking.bloodType}</div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-gray-900">{booking.name}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${booking.type === "Donation" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>{booking.type}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">{booking.purpose} · {booking.units} unit{booking.units > 1 ? "s" : ""} · {booking.date}</p>
                            <p className="text-sm text-gray-400">📞 {booking.contact}</p>
                            {booking.feedback && (
                              <div className="mt-2 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 border-l-2 border-red-300">
                                💬 {booking.feedback}
                              </div>
                            )}
                            {booking.requirements?.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                <span className="text-xs text-gray-500 font-semibold">Missing:</span>
                                {booking.requirements.map(r => (
                                  <span key={r} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100">{r}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <StatusBadge status={booking.status} />
                          <div className="flex gap-2">
                            <Button variant="tertiary" size="sm" onClick={() => openFeedback(booking)}>Feedback</Button>
                            <Button variant="tertiary" size="sm" onClick={() => setBookingModal(booking)}>Manage</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredBookings.length === 0 && (
                    <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
                      <p className="text-4xl mb-2">📋</p>
                      <p className="font-medium">No bookings found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════════════ POSTS ════════════ */}
            {activeTab === "Posts" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-sm">{posts.length} announcement{posts.length !== 1 ? "s" : ""} published</p>
                  <Button leftIcon="📢" onClick={() => setPostModal(true)}>Create Post</Button>
                </div>

                <div className="space-y-4">
                  {posts.map(post => (
                    <div key={post.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${post.urgent ? "border-red-200 bg-red-50/30" : "border-gray-100"}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${post.urgent ? "bg-red-600 text-white" : "bg-red-100 text-red-700"}`}>
                            {post.bloodType}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {post.urgent && <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-semibold">🚨 URGENT</span>}
                              <span className="text-xs text-gray-400">{post.units} units available</span>
                              <span className="text-xs text-gray-300">·</span>
                              <span className="text-xs text-gray-400">{post.date}</span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">{post.message}</p>
                          </div>
                        </div>
                        <button onClick={() => deletePost(post.id)} className="text-gray-300 hover:text-red-500 transition ml-3 flex-shrink-0 text-lg">✕</button>
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
                      <p className="text-4xl mb-2">📢</p>
                      <p className="font-medium">No posts yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ══════════ MODALS ══════════ */}

      {/* Manage Booking Modal */}
      <Modal open={!!bookingModal} onClose={() => setBookingModal(null)} title="Manage Booking">
        {bookingModal && (
          <div className="space-y-5">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-700 font-bold">{bookingModal.bloodType}</div>
                <div>
                  <p className="font-bold text-gray-900">{bookingModal.name}</p>
                  <p className="text-sm text-gray-500">{bookingModal.type} · {bookingModal.units} unit{bookingModal.units > 1 ? "s" : ""}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600"><span className="font-medium">Purpose:</span> {bookingModal.purpose}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Contact:</span> {bookingModal.contact}</p>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Documents Submitted:</p>
                <div className="flex flex-wrap gap-1">
                  {bookingModal.docs.map(d => (
                    <span key={d} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{d}</span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Current Status</p>
              <StatusBadge status={bookingModal.status} />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Update Status</p>
              <div className="grid grid-cols-2 gap-2">
                {["PENDING", "UNDER REVIEW", "COMPLETED", "REJECTED"].map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      updateBookingStatus(bookingModal.id, s);
                      setBookingModal(prev => ({ ...prev, status: s }));
                    }}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition ${
                      bookingModal.status === s
                        ? "border-red-600 bg-red-50 text-red-700"
                        : "border-gray-200 text-gray-600 hover:border-red-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <Button fullWidth onClick={() => setBookingModal(null)}>Save Changes</Button>
          </div>
        )}
      </Modal>

      {/* Feedback Modal */}
      <Modal open={!!feedbackModal} onClose={() => setFeedbackModal(null)} title="Provide Feedback">
        {feedbackModal && (
          <div className="space-y-5">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="font-semibold text-gray-900">{feedbackModal.name}</p>
              <p className="text-sm text-gray-500">{feedbackModal.type} · {feedbackModal.bloodType}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Feedback Message</label>
              <textarea
                rows={4}
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                placeholder="Enter feedback for the client (e.g., missing documents, health conditions, requirements needed)..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Missing Requirements</label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {ALL_REQUIREMENTS.map(req => (
                  <button
                    key={req}
                    onClick={() => toggleRequirement(req)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition ${
                      selectedRequirements.includes(req)
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-red-300"
                    }`}
                  >
                    {selectedRequirements.includes(req) ? "✓ " : ""}{req}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setFeedbackModal(null)}>Cancel</Button>
              <Button fullWidth onClick={saveFeedback}>Save Feedback</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Inventory Modal */}
      <Modal open={inventoryModal} onClose={() => setInventoryModal(false)} title="Add Blood Stock">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Blood Type</label>
              <select
                value={newInventory.bloodType}
                onChange={e => setNewInventory(p => ({ ...p, bloodType: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                {BLOOD_TYPES.map(bt => <option key={bt}>{bt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Units</label>
              <input
                type="number" min="0"
                value={newInventory.units}
                onChange={e => setNewInventory(p => ({ ...p, units: e.target.value }))}
                placeholder="e.g. 10"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Blood Component</label>
            <select
              value={newInventory.type}
              onChange={e => setNewInventory(p => ({ ...p, type: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              {["Whole Blood", "Packed RBC", "Plasma", "Platelets", "Cryoprecipitate"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry Date</label>
            <input
              type="date"
              value={newInventory.expires}
              onChange={e => setNewInventory(p => ({ ...p, expires: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={() => setInventoryModal(false)}>Cancel</Button>
            <Button fullWidth onClick={addInventory}>Add to Inventory</Button>
          </div>
        </div>
      </Modal>

      {/* Create Post Modal */}
      <Modal open={postModal} onClose={() => setPostModal(false)} title="Create Announcement">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Blood Type</label>
              <select
                value={newPost.bloodType}
                onChange={e => setNewPost(p => ({ ...p, bloodType: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                {BLOOD_TYPES.map(bt => <option key={bt}>{bt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Units Available</label>
              <input
                type="number" min="0"
                value={newPost.units}
                onChange={e => setNewPost(p => ({ ...p, units: e.target.value }))}
                placeholder="e.g. 5"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
            <textarea
              rows={4}
              value={newPost.message}
              onChange={e => setNewPost(p => ({ ...p, message: e.target.value }))}
              placeholder="Write your announcement here..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setNewPost(p => ({ ...p, urgent: !p.urgent }))}
              className={`w-10 h-6 rounded-full transition-colors ${newPost.urgent ? "bg-red-600" : "bg-gray-300"} relative`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${newPost.urgent ? "left-4" : "left-0.5"}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">Mark as Urgent</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={() => setPostModal(false)}>Cancel</Button>
            <Button fullWidth onClick={addPost}>Publish Post</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}