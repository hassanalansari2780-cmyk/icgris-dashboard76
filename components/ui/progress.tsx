import * as React from "react";
import { clsx } from "clsx";

type ProgressProps = {
  value: number;
  label?: string;
  className?: string;       // wrapper
  trackClassName?: string;  // track (background line)
  barClassName?: string;    // filled bar color
};

export function Progress({
  value,
  label,
  className,
  trackClassName,
  barClassName,
}: ProgressProps) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={clsx("w-full", className)}>
      {label ? (
        <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
          <span>{label}</span>
          <span className="tabular-nums">{v.toFixed(0)}%</span>
        </div>
      ) : null}
      <div className={clsx("h-2 w-full rounded-full bg-gray-200", trackClassName)}>
        <div
          className={clsx("h-2 rounded-full transition-all", barClassName ?? "bg-gray-900")}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

