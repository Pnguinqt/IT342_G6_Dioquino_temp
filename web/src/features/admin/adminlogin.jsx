/**
 * AdminLogin.jsx — DugoSugbo Admin Portal Login
 * React + Tailwind CSS
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── Button (exact as provided) ── */
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
    <button type={type} onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${disabled || loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"} ${className}`}>
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Loading...
        </span>
      ) : (
        <>{leftIcon && <span className="mr-2">{leftIcon}</span>}{children}{rightIcon && <span className="ml-2">{rightIcon}</span>}</>
      )}
    </button>
  );
};

/* ── Icons ── */
const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);
const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
  </svg>
);
const EyeIcon = ({ open }) => open ? (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
) : (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
  </svg>
);
const DropIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0C19 10.5 12 2 12 2z"/>
  </svg>
);

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});
  const [loginErr, setLoginErr] = useState("");

  const validate = () => {
    const e = {};
    if (!email)    e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email.";
    if (!password) e.password = "Password is required.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setLoginErr(""); setLoading(true);
    try {
      // TODO: replace with real API call
      // await api.adminLogin({ email, password });
      await new Promise(r => setTimeout(r, 1200)); // mock delay
      navigate("/admin/dashboard");
    } catch (err) {
      setLoginErr(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background geometric decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-800/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-950/20 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-4 shadow-lg shadow-red-600/30">
            <DropIcon />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">DugoSugbo</h1>
          <p className="text-gray-500 text-sm mt-1">Admin Control Panel</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-800">
            <div className="w-10 h-10 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center justify-center text-red-500">
              <ShieldIcon />
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-none">Administrator Login</h2>
              <p className="text-gray-500 text-xs mt-0.5">Restricted access — authorized personnel only</p>
            </div>
          </div>

          {/* Global error */}
          {loginErr && (
            <div className="flex items-center gap-2 bg-red-950/50 border border-red-800/50 text-red-400 text-sm font-medium px-4 py-3 rounded-xl mb-5">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              {loginErr}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-600">
                  <MailIcon />
                </div>
                <input id="email" type="email" value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                  placeholder="admin@dugosugbo.com"
                  className={`w-full pl-11 pr-4 py-3 bg-gray-800 border rounded-xl text-sm text-white placeholder-gray-600
                             focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition
                             ${errors.email ? "border-red-500" : "border-gray-700 hover:border-gray-600"}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-600">
                  <LockIcon />
                </div>
                <input id="password" type={showPw ? "text" : "password"} value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-12 py-3 bg-gray-800 border rounded-xl text-sm text-white placeholder-gray-600
                             focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition
                             ${errors.password ? "border-red-500" : "border-gray-700 hover:border-gray-600"}`}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-600 hover:text-gray-400 transition">
                  <EyeIcon open={showPw} />
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-red-600" />
                <span className="text-sm text-gray-500">Remember me</span>
              </label>
              <button type="button" className="text-sm text-red-500 hover:text-red-400 font-medium transition">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}
              leftIcon={!loading && <ShieldIcon />}>
              Sign In to Admin Panel
            </Button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-600 mt-6">
            This portal is restricted to authorized administrators only.
            <br />Unauthorized access is prohibited.
          </p>
        </div>

        {/* Bottom brand */}
        <p className="text-center text-xs text-gray-700 mt-6">
          © {new Date().getFullYear()} DugoSugbo Blood Donation Management System
        </p>
      </div>
    </div>
  );
}