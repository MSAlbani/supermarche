import React from "react";

/**
 * Props du composant Badge
 */

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  className = "",
  children,
}) => {
  // Styles selon la variante
  const variants = {
    default: "bg-gray-100 text-gray-800",
    secondary: "bg-green-100 text-green-800",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
