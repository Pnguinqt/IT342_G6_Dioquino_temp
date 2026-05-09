import React, { useState } from "react";
import Button from "../features/shared/Button";


// ─── Button Component (Design System) ────────────────────────────────────────


// ─── Input Field ──────────────────────────────────────────────────────────────
const Field = ({ label, required, hint, error, children }) => (
  <div className="space-y-1">
    <label className="block text-xs font-semibold text-gray-600 tracking-wide uppercase">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

const Input = ({ error, className = "", ...props }) => (
  <input  
    {...props}
    className={`w-full border ${error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"} rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition ${className}`}
  />
);

const Select = ({ error, children, className = "", ...props }) => (
  <select
    {...props}
    className={`w-full border ${error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"} rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition appearance-none cursor-pointer ${className}`}
  >
    {children}
  </select>
);

// ─── Step Indicator ───────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Basic Info",      icon: "🏥" },
  { id: 2, label: "Location",        icon: "📍" },
  { id: 3, label: "Contact",         icon: "📞" },
  { id: 4, label: "Classification",  icon: "🏷️" },
  { id: 5, label: "Operations",      icon: "⚙️" },
  { id: 6, label: "Account",         icon: "🔐" },
];

// ─── Toggle Switch ────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, label, description }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition cursor-pointer" onClick={() => onChange(!checked)}>
    <div className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors mt-0.5 ${checked ? "bg-red-600" : "bg-gray-300"}`}>
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${checked ? "left-5" : "left-0.5"}`} />
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
export default function HospitalRegister() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    // Basic Info
    name: "",
    hospitalType: "",
    classification: "",
    licenseNumber: "",
    accreditationBody: "",
    // Location
    address: "",
    city: "",
    province: "",
    region: "",
    zipCode: "",
    // Contact
    contactNumber: "",
    email: "",
    website: "",
    // Operations
    operatingHours: "",
    operatingHoursCustom: "",
    emergencyServices: false,
    bloodBankAvailable: false,
    // Account
    adminName: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  };

  // ── Validation per step ──────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.name.trim()) e.name = "Hospital name is required";
      if (!form.hospitalType) e.hospitalType = "Please select a hospital type";
      if (!form.licenseNumber.trim()) e.licenseNumber = "License number is required";
    }
    if (step === 2) {
      if (!form.address.trim()) e.address = "Address is required";
      if (!form.city.trim()) e.city = "City is required";
      if (!form.province.trim()) e.province = "Province is required";
      if (!form.region) e.region = "Region is required";
      if (form.zipCode && !/^\d{4}$/.test(form.zipCode)) e.zipCode = "ZIP code must be 4 digits";
    }
    if (step === 3) {
      if (!form.contactNumber.trim()) e.contactNumber = "Contact number is required";
      else if (!/^(09|\+639)\d{9}$/.test(form.contactNumber.replace(/\s/g, "")))
        e.contactNumber = "Enter a valid PH mobile number (09xxxxxxxxx)";
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = "Enter a valid email address";
    }
    if (step === 5) {
      if (!form.operatingHours) e.operatingHours = "Please select operating hours";
    }
    if (step === 6) {
      if (!form.adminName.trim()) e.adminName = "Admin name is required";
      if (!form.adminEmail.trim()) e.adminEmail = "Admin email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail)) e.adminEmail = "Invalid email";
      if (!form.password) e.password = "Password is required";
      else if (form.password.length < 8) e.password = "Password must be at least 8 characters";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
      if (!form.agreeTerms) e.agreeTerms = "You must agree to the terms";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, STEPS.length)); };
  const prev = () => setStep(s => Math.max(s - 1, 1));
  const handleSubmit = () => { if (validate()) setSubmitted(true); };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  // ── Success Screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            <span className="font-semibold text-gray-800">{form.name}</span> has been registered successfully.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Your application is now <span className="font-semibold text-yellow-600">PENDING</span> review. Our team will verify your details and notify you via <span className="font-semibold">{form.adminEmail || form.email}</span>.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-6 border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Submitted Details</p>
            {[
              ["Hospital", form.name],
              ["Type", form.hospitalType],
              ["City", `${form.city}, ${form.province}`],
              ["Contact", form.contactNumber],
              ["License No.", form.licenseNumber],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-gray-500">{k}</span>
                <span className="font-semibold text-gray-800">{v || "—"}</span>
              </div>
            ))}
          </div>
          <Button fullWidth onClick={() => { setSubmitted(false); setStep(1); setForm({ name:"",hospitalType:"",classification:"",licenseNumber:"",accreditationBody:"",address:"",city:"",province:"",region:"",zipCode:"",contactNumber:"",email:"",website:"",operatingHours:"",operatingHoursCustom:"",emergencyServices:false,bloodBankAvailable:false,adminName:"",adminEmail:"",password:"",confirmPassword:"",agreeTerms:false }); }}>
            Register Another Hospital
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-start justify-center p-4 py-10">
      <div className="w-full max-w-2xl">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black text-gray-900 leading-tight">DugoSugbo</h1>
              <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Hospital Registration</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">Register your hospital or blood bank to connect with donors and patients across Cebu.</p>
        </div>

        {/* ── Step Indicators ── */}
        <div className="mb-6">
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-200 rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="flex justify-between">
            {STEPS.map(s => (
              <div key={s.id} className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all duration-300 ${
                  s.id < step ? "bg-red-600 text-white shadow-md shadow-red-200" :
                  s.id === step ? "bg-red-600 text-white shadow-lg shadow-red-300 scale-110" :
                  "bg-gray-100 text-gray-400"
                }`}>
                  {s.id < step ? "✓" : s.icon}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${s.id === step ? "text-red-600" : "text-gray-400"}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Form Card ── */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="px-8 py-5 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{STEPS[step - 1].icon}</span>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Step {step} of {STEPS.length}</p>
                <h2 className="text-lg font-bold text-gray-900">{STEPS[step - 1].label}</h2>
              </div>
            </div>
          </div>

          <div className="px-8 py-7 space-y-5">

            {/* ──────── STEP 1: Basic Info ──────── */}
            {step === 1 && (
              <>
                <Field label="Hospital / Clinic Name" required error={errors.name}>
                  <Input
                    placeholder="e.g. Cebu City Medical Center"
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                    error={errors.name}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Hospital Type" required error={errors.hospitalType}>
                    <div className="relative">
                      <Select value={form.hospitalType} onChange={e => set("hospitalType", e.target.value)} error={errors.hospitalType}>
                        <option value="">Select type...</option>
                        <option>Public</option>
                        <option>Private</option>
                        <option>Government</option>
                        <option>Clinic</option>
                        <option>Blood Bank</option>
                      </Select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▾</span>
                    </div>
                  </Field>

                  <Field label="DOH Classification" hint="Level 1, 2, or 3">
                    <div className="relative">
                      <Select value={form.classification} onChange={e => set("classification", e.target.value)}>
                        <option value="">Select level...</option>
                        <option>Level 1</option>
                        <option>Level 2</option>
                        <option>Level 3</option>
                        <option>Special</option>
                        <option>Infirmary</option>
                      </Select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▾</span>
                    </div>
                  </Field>
                </div>

                <Field label="DOH License / Permit Number" required error={errors.licenseNumber} hint="Found on your DOH Certificate of Accreditation">
                  <Input
                    placeholder="e.g. DOH-VII-2024-1234"
                    value={form.licenseNumber}
                    onChange={e => set("licenseNumber", e.target.value)}
                    error={errors.licenseNumber}
                  />
                </Field>

                <Field label="Accreditation Body" hint="e.g. DOH, PhilHealth, JCI">
                  <Input
                    placeholder="e.g. DOH, PhilHealth Accredited"
                    value={form.accreditationBody}
                    onChange={e => set("accreditationBody", e.target.value)}
                  />
                </Field>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex gap-3">
                  <span className="text-blue-500 text-lg flex-shrink-0">ℹ️</span>
                  <p className="text-xs text-blue-600 leading-relaxed">Your registration will go through a <strong>verification process</strong>. Please ensure all details match your official DOH documents.</p>
                </div>
              </>
            )}

            {/* ──────── STEP 2: Location ──────── */}
            {step === 2 && (
              <>
                <Field label="Street Address" required error={errors.address}>
                  <Input
                    placeholder="e.g. 123 Osmeña Blvd, Brgy. Luz"
                    value={form.address}
                    onChange={e => set("address", e.target.value)}
                    error={errors.address}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="City / Municipality" required error={errors.city}>
                    <Input
                      placeholder="e.g. Cebu City"
                      value={form.city}
                      onChange={e => set("city", e.target.value)}
                      error={errors.city}
                    />
                  </Field>
                  <Field label="Province" required error={errors.province}>
                    <Input
                      placeholder="e.g. Cebu"
                      value={form.province}
                      onChange={e => set("province", e.target.value)}
                      error={errors.province}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Region" required error={errors.region}>
                    <div className="relative">
                      <Select value={form.region} onChange={e => set("region", e.target.value)} error={errors.region}>
                        <option value="">Select region...</option>
                        <option>Region I – Ilocos</option>
                        <option>Region II – Cagayan Valley</option>
                        <option>Region III – Central Luzon</option>
                        <option>Region IV-A – CALABARZON</option>
                        <option>Region IV-B – MIMAROPA</option>
                        <option>Region V – Bicol</option>
                        <option>Region VI – Western Visayas</option>
                        <option>Region VII – Central Visayas</option>
                        <option>Region VIII – Eastern Visayas</option>
                        <option>Region IX – Zamboanga Peninsula</option>
                        <option>Region X – Northern Mindanao</option>
                        <option>Region XI – Davao</option>
                        <option>Region XII – SOCCSKSARGEN</option>
                        <option>Region XIII – Caraga</option>
                        <option>NCR – Metro Manila</option>
                        <option>CAR – Cordillera</option>
                        <option>BARMM</option>
                      </Select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▾</span>
                    </div>
                  </Field>
                  <Field label="ZIP Code" error={errors.zipCode} hint="4-digit Philippine ZIP">
                    <Input
                      placeholder="e.g. 6000"
                      value={form.zipCode}
                      onChange={e => set("zipCode", e.target.value)}
                      error={errors.zipCode}
                      maxLength={4}
                    />
                  </Field>
                </div>
              </>
            )}

            {/* ──────── STEP 3: Contact ──────── */}
            {step === 3 && (
              <>
                <Field label="Contact Number" required error={errors.contactNumber} hint="Philippine mobile or landline number">
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium flex-shrink-0">
                      🇵🇭 +63
                    </div>
                    <Input
                      placeholder="9XX XXX XXXX"
                      value={form.contactNumber}
                      onChange={e => set("contactNumber", e.target.value)}
                      error={errors.contactNumber}
                    />
                  </div>
                  {errors.contactNumber && <p className="text-xs text-red-500 font-medium mt-1">{errors.contactNumber}</p>}
                </Field>

                <Field label="Official Email Address" error={errors.email} hint="Used for official correspondence">
                  <Input
                    type="email"
                    placeholder="e.g. bloodbank@hospital.ph"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                    error={errors.email}
                  />
                </Field>

                <Field label="Website" hint="Optional — hospital website or Facebook page URL">
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-gray-100 border border-gray-200 rounded-xl text-xs text-gray-500 flex-shrink-0">https://</span>
                    <Input
                      placeholder="www.yourhospital.ph"
                      value={form.website}
                      onChange={e => set("website", e.target.value)}
                    />
                  </div>
                </Field>
              </>
            )}

            {/* ──────── STEP 4: Classification ──────── */}
            {step === 4 && (
              <>
                <p className="text-sm text-gray-500">This information helps match your facility with appropriate donors and patients.</p>

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Hospital Type</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {["Public", "Private", "Government", "Clinic", "Blood Bank", "Other"].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set("hospitalType", t)}
                        className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                          form.hospitalType === t
                            ? "border-red-600 bg-red-50 text-red-700 shadow-md shadow-red-100"
                            : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {errors.hospitalType && <p className="text-xs text-red-500 font-medium">{errors.hospitalType}</p>}
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">DOH Classification Level</p>
                  <div className="space-y-2">
                    {[
                      { val: "Level 1", desc: "Basic inpatient care, simple procedures" },
                      { val: "Level 2", desc: "Specialty services, blood banking" },
                      { val: "Level 3", desc: "Sub-specialty services, teaching hospital" },
                      { val: "Special",  desc: "Specialized care (e.g. Lung Center, Heart Center)" },
                      { val: "Infirmary", desc: "Limited inpatient care, rural areas" },
                    ].map(({ val, desc }) => (
                      <div
                        key={val}
                        onClick={() => set("classification", val)}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          form.classification === val
                            ? "border-red-600 bg-red-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${form.classification === val ? "border-red-600 bg-red-600" : "border-gray-300"}`}>
                          {form.classification === val && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${form.classification === val ? "text-red-700" : "text-gray-800"}`}>{val}</p>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ──────── STEP 5: Operations ──────── */}
            {step === 5 && (
              <>
                <Field label="Operating Hours" required error={errors.operatingHours}>
                  <div className="space-y-2">
                    {["24/7", "Mon-Fri 8AM-5PM", "Mon-Sat 8AM-5PM", "Mon-Sat 7AM-8PM", "Custom"].map(h => (
                      <div
                        key={h}
                        onClick={() => set("operatingHours", h)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                          form.operatingHours === h
                            ? "border-red-600 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${form.operatingHours === h ? "border-red-600 bg-red-600" : "border-gray-300"}`}>
                          {form.operatingHours === h && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span className={`text-sm font-medium ${form.operatingHours === h ? "text-red-700" : "text-gray-700"}`}>{h}</span>
                      </div>
                    ))}
                  </div>
                  {errors.operatingHours && <p className="text-xs text-red-500 font-medium mt-1">{errors.operatingHours}</p>}
                </Field>

                {form.operatingHours === "Custom" && (
                  <Field label="Specify Operating Hours">
                    <Input
                      placeholder="e.g. Mon-Thu 8AM-6PM, Fri 8AM-12PM"
                      value={form.operatingHoursCustom}
                      onChange={e => set("operatingHoursCustom", e.target.value)}
                    />
                  </Field>
                )}

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Available Services</p>
                  <Toggle
                    checked={form.emergencyServices}
                    onChange={v => set("emergencyServices", v)}
                    label="Emergency Services (ER)"
                    description="24-hour emergency room and trauma care available"
                  />
                  <Toggle
                    checked={form.bloodBankAvailable}
                    onChange={v => set("bloodBankAvailable", v)}
                    label="Blood Bank Available"
                    description="Facility has an operational blood bank unit"
                  />
                </div>
              </>
            )}

            {/* ──────── STEP 6: Account ──────── */}
            {step === 6 && (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
                  <span className="text-yellow-500 flex-shrink-0">⚠️</span>
                  <p className="text-xs text-yellow-700 leading-relaxed">Create the <strong>administrator account</strong> that will manage this hospital's profile. This account will receive all notifications and verification updates.</p>
                </div>

                <Field label="Administrator Full Name" required error={errors.adminName}>
                  <Input
                    placeholder="e.g. Dr. Maria Santos"
                    value={form.adminName}
                    onChange={e => set("adminName", e.target.value)}
                    error={errors.adminName}
                  />
                </Field>

                <Field label="Administrator Email" required error={errors.adminEmail} hint="Used for login and notifications">
                  <Input
                    type="email"
                    placeholder="admin@hospital.ph"
                    value={form.adminEmail}
                    onChange={e => set("adminEmail", e.target.value)}
                    error={errors.adminEmail}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Password" required error={errors.password} hint="Minimum 8 characters">
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => set("password", e.target.value)}
                      error={errors.password}
                    />
                  </Field>
                  <Field label="Confirm Password" required error={errors.confirmPassword}>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={e => set("confirmPassword", e.target.value)}
                      error={errors.confirmPassword}
                    />
                  </Field>
                </div>

                {form.password && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 font-medium">Password strength</p>
                    <div className="flex gap-1">
                      {[8, 12, 16].map((len, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${
                          form.password.length >= len
                            ? i === 0 ? "bg-red-400" : i === 1 ? "bg-yellow-400" : "bg-green-500"
                            : "bg-gray-200"
                        }`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {form.password.length < 8 ? "Too short" : form.password.length < 12 ? "Weak — add more characters" : form.password.length < 16 ? "Good" : "Strong ✓"}
                    </p>
                  </div>
                )}

                <div
                  onClick={() => set("agreeTerms", !form.agreeTerms)}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.agreeTerms ? "border-red-500 bg-red-50" : errors.agreeTerms ? "border-red-300 bg-red-50/50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center mt-0.5 border-2 transition-colors ${form.agreeTerms ? "bg-red-600 border-red-600" : "border-gray-300"}`}>
                    {form.agreeTerms && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    I confirm that all information provided is accurate and I agree to the <span className="text-red-600 font-semibold">Terms of Service</span> and <span className="text-red-600 font-semibold">Privacy Policy</span> of DugoSugbo.
                  </p>
                </div>
                {errors.agreeTerms && <p className="text-xs text-red-500 font-medium -mt-3">{errors.agreeTerms}</p>}
              </>
            )}
          </div>

          {/* ── Footer Nav ── */}
          <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
            <Button
              variant="tertiary"
              onClick={prev}
              disabled={step === 1}
              leftIcon="←"
            >
              Back
            </Button>

            <div className="flex items-center gap-1">
              {STEPS.map(s => (
                <div key={s.id} className={`transition-all duration-300 rounded-full ${s.id === step ? "w-5 h-2 bg-red-600" : s.id < step ? "w-2 h-2 bg-red-400" : "w-2 h-2 bg-gray-300"}`} />
              ))}
            </div>

            {step < STEPS.length ? (
              <Button onClick={next} rightIcon="→">Continue</Button>
            ) : (
              <Button onClick={handleSubmit} leftIcon="🏥">Submit Registration</Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Already registered? <span className="text-red-600 font-semibold cursor-pointer hover:underline">Sign in here</span>
        </p>
      </div>
    </div>
  );
}