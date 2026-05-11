"use client";

import { JobStatus, STATUS_CONFIG } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: JobStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border",
        cfg.color,
        cfg.bg,
        cfg.border,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      {cfg.label}
    </span>
  );
}
