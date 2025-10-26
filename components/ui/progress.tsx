import * as React from "react";
import { clsx } from "clsx";

export function Progress({ value, className, label }: { value: number; className?: string; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={clsx("w-full", className)}>
      {label ? <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
        <span>{label}</span><span className="tabular-nums">{v.toFixed(0)}%</span>
      </div> : null}
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div className="h-2 rounded-full bg-gray-900 transition-all" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
