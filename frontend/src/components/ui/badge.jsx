import React from "react";

export function Badge({ children, className = "", variant = "default", ...props }) {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium " +
    (variant === "secondary"
      ? "bg-gray-100 text-gray-800"
      : "bg-blue-100 text-blue-800");
  return (
    <span className={`${base} ${className}`} {...props}>
      {children}
    </span>
  );
} 