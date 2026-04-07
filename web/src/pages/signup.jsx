// src/pages/SignUpPage.jsx
import { useState } from "react";
import Button from "../components/Button";

// Icons
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

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

// InputField Component
const InputField = ({ label, id, type = "text", placeholder, value, onChange, icon, rightElement, error, max }) => (
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
        max={max}
        className={`w-full pl-10 pr-10 py-2 rounded border text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 ${
          error ? "border-red-400" : "border-gray-300 hover:border-gray-400"
        }`}
      />
      {rightElement && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{rightElement}</div>}
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// PasswordStrength Component
const PasswordStrength = ({ password }) => {
  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  if (!password) return null;

  const score = getStrength(password);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];
  const textColors = ["", "text-red-500", "text-yellow-500", "text-blue-500", "text-green-600"];

  return (
    <div className="mt-1">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : "bg-gray-200"}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[score]}`}>{labels[score]}</p>
    </div>
  );
};

// Main SignUpPage Component
export default function SignUpPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthdate: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required.";
    if (!form.lastName.trim()) errs.lastName = "Last name is required.";
    if (!form.email) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email address.";
    if (form.phone && !/^\+?[\d\s\-()]{7,15}$/.test(form.phone))
      errs.phone = "Enter a valid phone number.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match.";
    if (!agreedToTerms) errs.terms = "You must agree to the terms to continue.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Account created successfully!");
      setForm({
        firstName: "",
        lastName: "",
        birthdate: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setAgreedToTerms(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
        <p className="text-gray-500 mb-5 text-sm">Fill in the details below to get started</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="First Name"
              id="firstName"
              placeholder="Juan"
              value={form.firstName}
              onChange={handleChange("firstName")}
              icon={<UserIcon />}
              error={errors.firstName}
            />
            <InputField
              label="Last Name"
              id="lastName"
              placeholder="Dela Cruz"
              value={form.lastName}
              onChange={handleChange("lastName")}
              icon={<UserIcon />}
              error={errors.lastName}
            />
          </div>

          <InputField
            label={
              <span>
                Birthdate <span className="text-gray-400 font-normal">(YYYY-MM-DD)</span>
              </span>
            }
            id="birthdate"
            type="date"
            value={form.birthdate}
            onChange={handleChange("birthdate")}
            max={new Date().toISOString().split("T")[0]}
          />

          <InputField
            label="Email Address"
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange("email")}
            icon={<MailIcon />}
            error={errors.email}
          />

          <InputField
            label={
              <span>
                Contact Number <span className="text-gray-400 font-normal">(optional)</span>
              </span>
            }
            id="phone"
            type="tel"
            placeholder="+63 912 345 6789"
            value={form.phone}
            onChange={handleChange("phone")}
            icon={<PhoneIcon />}
            error={errors.phone}
          />

          <div className="flex flex-col gap-1.5">
            <InputField
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange("password")}
              icon={<LockIcon />}
              error={errors.password}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 text-xs font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              }
            />
            <PasswordStrength password={form.password} />
          </div>

          <InputField
            label="Confirm Password"
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            icon={<LockIcon />}
            error={errors.confirmPassword}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-gray-400 hover:text-gray-600 text-xs font-medium"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            }
          />

          <div className="flex flex-col gap-1">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={() => {
                  setAgreedToTerms(!agreedToTerms);
                  setErrors((prev) => ({ ...prev, terms: "" }));
                }}
                className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0"
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <button type="button" className="text-red-600 font-semibold hover:underline">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button" className="text-red-600 font-semibold hover:underline">
                  Privacy Policy
                </button>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-500 ml-6">{errors.terms}</p>}
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            Create Account
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400">or sign up with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <Button variant="secondary" fullWidth leftIcon={<span>G</span>}>
            Google
          </Button>
        </form>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <button type="button" className="text-red-600 font-semibold hover:underline">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}