import * as React from "react";
import clsx from "clsx";

type AllowedVariant = "primary" | "secondary" | "ghost" | "default" | "outline";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AllowedVariant;
  size?: "sm" | "md";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  // map “design names” to actual styles you already have
  const variantMap: Record<AllowedVariant, "primary" | "secondary" | "ghost"> = {
    default: "primary",
    outline: "ghost",
    primary: "primary",
    secondary: "secondary",
    ghost: "ghost",
  };

  const base =
    "inline-flex items-center justify-center rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-300",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
  };

  const resolved = variantMap[variant];

  return (
    <button
      className={clsx(base, variants[resolved], sizes[size], className)}
      {...props}
    />
  );
}
