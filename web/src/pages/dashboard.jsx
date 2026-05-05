  import React, { useState, useEffect } from "react";
  import { api } from "../api/apiFetch";

  // ── Color tokens ──────────────────────────────────────────────────────────────
  // Primary : red-600 (#dc2626), red-700 (#b91c1c), red-300 (#fca5a5)
  // Neutral : gray-50/100/200/300/400/500/700/800/900

  // ── Icon paths ────────────────────────────────────────────────────────────────
  const ICONS = {
    dashboard: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M3 14h7v7H3z", "M14 14h7v7h-7z"],
    profile:   ["M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0", "M4 20c0-4 3.58-7 8-7s8 3 8 7"],
    hospitals: ["M3 10h18M3 6h18M3 14h18M3 18h18", "M3 4h18v16H3z"],
    requests:  ["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 3h6v4H9z", "M9 12h6M9 16h4"],
    stock:     ["M12 2C8 7 5 11 5 15a7 7 0 0014 0c0-4-3-8-7-13z"],
    history:   ["M12 21a9 9 0 100-18 9 9 0 000 18z", "M12 7v5l3 3"],
    settings:  ["M12 15a3 3 0 100-6 3 3 0 000 6z", "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"],
    bell:      ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 01-3.46 0"],
    hospital:  ["M3 6h18v14H3z", "M8 6V4h8v2", "M12 10v8M8 14h8"],
    check:     ["M20 6L9 17l-5-5"],
    clipboard: ["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 3h6v4H9z"],
    user:      ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 3a4 4 0 100 8 4 4 0 000-8z"],
  };
  // ── Sidebar nav sections ──────────────────────────────────────────────────────
  const NAV_SECTIONS = [
    {
      label: "Main",
      items: [
        { id: "dashboard", label: "Dashboard", icon: "dashboard" },
        { id: "profile",   label: "Profile",   icon: "profile"   },
        { id: "hospitals", label: "Hospitals", icon: "hospitals" },
      ],
    },
    {
      label: "Blood",
      items: [
        { id: "requests", label: "Requests",    icon: "requests" },
        { id: "stock",    label: "Blood Stock", icon: "stock"    },
        { id: "history",  label: "History",     icon: "history"  },
      ],
    },
    {
      label: "System",
      items: [{ id: "settings", label: "Settings", icon: "settings" }],
    },
  ];

  // ── Bottom-nav items (mobile) ─────────────────────────────────────────────────
  const BOTTOM_NAV_ITEMS = [
    { id: "dashboard", label: "Home",      icon: "dashboard" },
    { id: "hospitals", label: "Hospitals", icon: "hospitals" },
    { id: "requests",  label: "Requests",  icon: "requests"  },
    { id: "stock",     label: "Stock",     icon: "stock"     },
    { id: "profile",   label: "Profile",   icon: "profile"   },
  ];

  // ── Helpers ───────────────────────────────────────────────────────────────────

  /** Renders icon paths from the ICONS map into an <svg> element. */
  const NavIcon = ({ iconKey, size = 16, className = "" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`flex-shrink-0 ${className}`}
    >
      {(Array.isArray(ICONS[iconKey]) ? ICONS[iconKey] : [ICONS[iconKey]]).map(
        (d, i) => <path key={i} d={d} />
      )}
    </svg>
  );
  // ── Sub-components ────────────────────────────────────────────────────────────

  const PlaceholderPage = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        className="opacity-30"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 9h6M9 13h6M9 17h4" />
      </svg>
      <p className="text-lg font-semibold text-gray-500">{title}</p>
      <p className="text-sm text-gray-400">This page will be built soon.</p>
    </div>
  );
  const StatCard = ({
    label,
    value,
    sub,
    iconKey,
    accentClass,
    iconBgClass,
    iconColorClass,
  }) => (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 border-l-4 ${accentClass}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </span>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBgClass}`}
        >
          <NavIcon iconKey={iconKey} size={16} className={iconColorClass} />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-400 mt-1">{sub}</div>
      </div>
    </div>
  );


  const EmptyState = ({ iconKey, message, action }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-10 flex flex-col items-center gap-3 mb-5">
      <NavIcon iconKey={iconKey} size={40} className="text-gray-300" />
      <p className="text-sm text-gray-400">{message}</p>
      {action}
    </div>
  );

  const DashboardPage = ({ onNavigate }) => (
    <div className="p-6 flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Hospitals"
          value="—"
          sub="Active listings"
          iconKey="hospital"
          accentClass="border-l-red-600"
          iconBgClass="bg-red-50"
          iconColorClass="text-red-600"
        />
        <StatCard
          label="My Requests"
          value="0"
          sub="All time"
          iconKey="clipboard"
          accentClass="border-l-blue-500"
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-500"
        />
        <StatCard
          label="Approved"
          value="0"
          sub="Fulfilled requests"
          iconKey="check"
          accentClass="border-l-green-600"
          iconBgClass="bg-green-50"
          iconColorClass="text-green-600"
        />
      </div>
  
      {/* Recent Requests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800">Recent Requests</h2>
          <button
            onClick={() => onNavigate("requests")}
            className="text-xs text-red-600 hover:underline font-medium"
          >
            See all
          </button>
        </div>
        <EmptyState
          iconKey="clipboard"
          message="No requests yet"
          action={
            <button
              onClick={() => onNavigate("hospitals")}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              <NavIcon iconKey="hospital" size={14} />
              Browse Hospitals
            </button>
          }
        />
      </div>
  
      {/* Hospitals with Available Blood */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800">
            Hospitals with Available Blood
          </h2>
          <button
            onClick={() => onNavigate("hospitals")}
            className="text-xs text-red-600 hover:underline font-medium"
          >
            View all
          </button>
        </div>
        <EmptyState
          iconKey="hospital"
          message="No hospitals have posted stock yet."
        />
      </div>
    </div>
  );
  
  const SidebarContent = ({ activePage, onNavigate, user }) => (
    <>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-red-500">
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center mb-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#dc2626"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2C8 7 5 11 5 15a7 7 0 0014 0c0-4-3-8-7-13z" />
          </svg>
        </div>
        <p className="text-white text-sm font-semibold">DugoSugbo</p>
        
      </div>
  
      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-2">
            <p className="text-red-300 text-xs font-semibold uppercase tracking-widest px-4 py-2">
              {section.label}
            </p>
            {section.items.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-red-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <NavIcon iconKey={item.icon} />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
  
      {/* User */}
      <div className="px-3 py-3 border-t border-red-500">
        <div className="flex items-center gap-2 px-1 py-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <NavIcon iconKey="user" size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">
            {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
            </p>
            <p className="text-red-200 text-xs truncate">
            {user ? user.email : ""}
            </p>
          </div>
        </div>
      </div>
    </>
  );
  
  // ── Main export ───────────────────────────────────────────────────────────────
  
  export default function dashboard() {
    const [activePage, setActivePage] = useState("dashboard");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
      const loadUser = async () => {
        try {
          const data = await api.getMe();
          setUser(data);
        } catch (err) {
          console.error("Failed to load user:", err.message);
     }
  };

  loadUser();
}, []);
  
    const pageTitle =
      NAV_SECTIONS.flatMap((s) => s.items).find((i) => i.id === activePage)
        ?.label ?? "Dashboard";
  
    const navigate = (id) => {
      setActivePage(id);
      setDrawerOpen(false);
    };
  
    return (
      <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-52 flex-shrink-0 bg-red-600 flex-col">
          <SidebarContent activePage={activePage} onNavigate={navigate} />
        </aside>
  
        {/* Mobile drawer overlay */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        )}
  
        {/* Mobile drawer panel */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-red-600 flex flex-col transform transition-transform duration-300 md:hidden ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setDrawerOpen(false)}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <SidebarContent activePage={activePage} onNavigate={navigate} />
        </aside>
  
        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Hamburger — mobile only */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#374151"
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </button>
              <h1 className="text-base font-semibold text-gray-800">{pageTitle}</h1>
            </div>
  
            <div className="flex items-center gap-3">
              <button className="relative w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <NavIcon iconKey="bell" size={16} className="text-gray-500" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-600 rounded-full" />
              </button>
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                <NavIcon iconKey="user" size={15} className="text-white" />
              </div>
            </div>
          </header>
  
          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 pb-16 md:pb-0">
            {activePage === "dashboard" ? (
              <DashboardPage onNavigate={navigate} />
            ) : (
              <PlaceholderPage title={pageTitle} />
            )}
          </main>
        </div>
  
        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 flex md:hidden">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                  isActive ? "text-red-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <NavIcon iconKey={item.icon} size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  }