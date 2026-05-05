// src/pages/LoginPage.jsx
import { useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

// Simple Icons
const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

// Input Field Component
const InputField = ({ label, id, type="text", placeholder, value, onChange, icon, rightElement, error }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-semibold text-gray-700">{label}</label>
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">{icon}</div>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-10 py-2 rounded border text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 ${error ? "border-red-400" : "border-gray-300 hover:border-gray-400"}`}
      />
      {rightElement && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{rightElement}</div>}
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters.";
    return errs;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const errs = validate();
  if (Object.keys(errs).length > 0) {
    setErrors(errs);
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({  
        email,
        password
      })
    });

    if (!res.ok) {
      const err = await res.json();
      setErrors({ general: err.message });
      setLoading(false);
      return;
    }

    const user = await res.json();

    // store logged-in user
    localStorage.setItem("user", JSON.stringify(user));

    navigate("/dashboard");

  } catch (error) {
    console.error(error);
  }

  setLoading(false);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-5">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-5 text-sm">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            label="Email Address"
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }}
            icon={<MailIcon />}
            error={errors.email}
          />

          <InputField
            label="Password"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: "" })); }}
            icon={<LockIcon />}
            error={errors.password}
            rightElement={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                {showPassword ? "Hide" : "Show"}
              </button>
            }
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="w-4 h-4 text-red-600" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <button type="button" className="text-red-600 text-sm hover:underline">Forgot password?</button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            Sign In
          </Button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <Button variant="secondary" fullWidth leftIcon={<span>G</span>}>Google</Button>
          
        </form>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Need an account? <button type="button" className="text-red-600 font-semibold hover:underline" onClick={() => navigate("/register")}>Sign Up</button>
        </p>
      </div>
    </div>
  );
}