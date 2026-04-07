// src/components/Button.jsx
import React from "react";

const Button = ({
  variant = "primary",  // primary, secondary, tertiary
  size = "md",          // sm, md, lg
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

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-5 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled || loading ? "cursor-not-allowed opacity-70" : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledClass} ${className}`}
    >
      {loading ? (
        "Loading..."
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;