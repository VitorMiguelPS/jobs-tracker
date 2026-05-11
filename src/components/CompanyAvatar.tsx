"use client";

import { getCompanyColor, getInitials } from "@/lib/utils";

interface CompanyAvatarProps {
  company: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "w-9 h-9 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-16 h-16 text-xl",
};

export function CompanyAvatar({ company, size = "md" }: CompanyAvatarProps) {
  const color = getCompanyColor(company);
  const initials = getInitials(company);

  return (
    <div
      className={`${sizes[size]} rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0 shadow-sm`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
