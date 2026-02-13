"use client";

import {
  Stethoscope,
  Baby,
  Heart,
  Eye,
  Ear,
  Hand,
  FlaskConical,
  Scan,
  Pill,
  Syringe,
  Hospital,
  Activity,
  CircleDot,
} from "lucide-react";
import type { DepartmentIcon as IconType } from "@/types/department";

// Custom Tooth icon since Lucide doesn't have one
function ToothIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2C9.5 2 7.5 3 7 5c-.5 2-1 4-1 6 0 3 .5 5 1 7s1 4 2 4c1.5 0 2-2 3-2s1.5 2 3 2c1 0 1.5-2 2-4s1-4 1-7c0-2-.5-4-1-6-.5-2-2.5-3-5-3z" />
    </svg>
  );
}

// Custom Bandage icon
function BandageIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18.5 5.5 5.5 18.5" />
      <path d="m15 9 .01.01" />
      <path d="m9 15 .01.01" />
      <path d="M5.5 5.5 18.5 18.5" />
      <path d="M5.5 18.5 2 22" />
      <path d="m22 2-3.5 3.5" />
    </svg>
  );
}

interface DepartmentIconProps {
  icon: IconType | null;
  className?: string;
}

const iconMap: Record<IconType, React.ComponentType<{ className?: string }>> = {
  stethoscope: Stethoscope,
  tooth: ToothIcon,
  baby: Baby,
  heart: Heart,
  eye: Eye,
  ear: Ear,
  hand: Hand,
  flask: FlaskConical,
  scan: Scan,
  pill: Pill,
  syringe: Syringe,
  bandage: BandageIcon,
  hospital: Hospital,
  activity: Activity,
};

export function DepartmentIcon({ icon, className }: DepartmentIconProps) {
  // Handle null, undefined, or invalid icon values
  if (!icon || !iconMap[icon]) {
    return <CircleDot className={className} />;
  }

  const IconComponent = iconMap[icon];
  return <IconComponent className={className} />;
}
