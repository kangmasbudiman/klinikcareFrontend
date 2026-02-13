"use client";

import {
  Stethoscope,
  Syringe,
  Pill,
  Microscope,
  Scan,
  HeartPulse,
  Thermometer,
  ClipboardList,
  Activity,
  BedDouble,
  Scissors,
  Droplet,
  Eye,
  Ear,
  Bone,
  CircleDot,
} from "lucide-react";

type ServiceIconType =
  | "stethoscope"
  | "syringe"
  | "pill"
  | "microscope"
  | "scan"
  | "heart-pulse"
  | "thermometer"
  | "clipboard"
  | "activity"
  | "bed"
  | "scissors"
  | "droplet"
  | "eye"
  | "ear"
  | "bone";

interface ServiceIconProps {
  icon: string | null;
  className?: string;
}

const iconMap: Record<ServiceIconType, React.ComponentType<{ className?: string }>> = {
  stethoscope: Stethoscope,
  syringe: Syringe,
  pill: Pill,
  microscope: Microscope,
  scan: Scan,
  "heart-pulse": HeartPulse,
  thermometer: Thermometer,
  clipboard: ClipboardList,
  activity: Activity,
  bed: BedDouble,
  scissors: Scissors,
  droplet: Droplet,
  eye: Eye,
  ear: Ear,
  bone: Bone,
};

export function ServiceIcon({ icon, className }: ServiceIconProps) {
  if (!icon || !iconMap[icon as ServiceIconType]) {
    return <CircleDot className={className} />;
  }

  const IconComponent = iconMap[icon as ServiceIconType];
  return <IconComponent className={className} />;
}
