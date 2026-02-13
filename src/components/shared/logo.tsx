"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useClinicSettings } from "@/providers/clinic-settings-provider";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "default" | "white" | "gradient";
  animated?: boolean;
  animatedText?: boolean;
  useClinicLogo?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
};

// Animated gradient text component
function AnimatedGradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      className={cn(
        "bg-clip-text text-transparent bg-[length:200%_auto]",
        "bg-gradient-to-r from-blue-600 via-emerald-500 to-violet-600",
        className,
      )}
      animate={{
        backgroundPosition: ["0% center", "200% center"],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #2563eb, #10b981, #8b5cf6, #2563eb)",
      }}
    >
      {children}
    </motion.span>
  );
}

// Image size mapping for Next.js Image component
const imageSizePixels = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

export function Logo({
  className,
  size = "md",
  showText = true,
  variant = "default",
  animated = true,
  animatedText = false,
  useClinicLogo = false,
}: LogoProps) {
  const { settings, isLoading } = useClinicSettings();

  // Get clinic name and logo from settings
  const clinicName = settings?.name || "KlinikCare";
  const clinicTagline = settings?.tagline || "Healthcare Management";
  const clinicLogo = settings?.logo_url;

  // Custom logo from clinic settings
  const CustomLogo = () => {
    if (!clinicLogo) return null;

    return (
      <div
        className={cn(
          sizeClasses[size],
          "relative shrink-0 rounded-xl overflow-hidden",
        )}
      >
        <Image
          src={clinicLogo}
          alt={clinicName}
          width={imageSizePixels[size]}
          height={imageSizePixels[size]}
          className="object-contain w-full h-full"
          unoptimized
        />
      </div>
    );
  };

  const DefaultLogoIcon = () => (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], "shrink-0")}
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="crossGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Main circle background */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="url(#logoGradient)"
        filter="url(#shadow)"
      />

      {/* Inner decorative ring */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />

      {/* Medical cross */}
      <g filter="url(#shadow)">
        {/* Vertical bar */}
        <rect
          x="42"
          y="22"
          width="16"
          height="56"
          rx="4"
          fill="url(#crossGradient)"
        />
        {/* Horizontal bar */}
        <rect
          x="22"
          y="42"
          width="56"
          height="16"
          rx="4"
          fill="url(#crossGradient)"
        />
      </g>

      {/* Heart accent in center */}
      <path
        d="M50 62 C50 62, 38 52, 38 45 C38 40, 42 38, 46 38 C48 38, 50 40, 50 40 C50 40, 52 38, 54 38 C58 38, 62 40, 62 45 C62 52, 50 62, 50 62Z"
        fill="#EF4444"
        opacity="0.9"
      />

      {/* Pulse line accent */}
      <path
        d="M25 70 L35 70 L40 60 L45 78 L50 65 L55 75 L60 68 L65 70 L75 70"
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Determine which logo to show
  const shouldUseClinicLogo = useClinicLogo && clinicLogo && !isLoading;

  const LogoIcon = shouldUseClinicLogo ? CustomLogo : DefaultLogoIcon;

  const textColorClass =
    variant === "white"
      ? "text-white"
      : variant === "gradient"
        ? "bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent"
        : "text-foreground";

  const Wrapper = animated ? motion.div : "div";
  const wrapperProps = animated
    ? {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, ease: "easeOut" },
      }
    : {};

  // Display name based on whether we're using clinic settings
  const displayName = useClinicLogo ? clinicName : "KlinikCare";
  const displayTagline = useClinicLogo
    ? clinicTagline
    : "Healthcare Management";

  return (
    <Wrapper
      className={cn("flex items-center gap-3", className)}
      {...wrapperProps}
    >
      {animated && !shouldUseClinicLogo ? (
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <LogoIcon />
        </motion.div>
      ) : (
        <LogoIcon />
      )}
      {showText && (
        <div className="flex flex-col min-w-0">
          {animatedText ? (
            <AnimatedGradientText
              className={cn(
                "font-bold leading-tight tracking-tight truncate",
                textSizeClasses[size],
              )}
            >
              {displayName}
            </AnimatedGradientText>
          ) : (
            <span
              className={cn(
                "font-bold leading-tight tracking-tight truncate",
                textSizeClasses[size],
                textColorClass,
              )}
            >
              {displayName}
            </span>
          )}
          {displayTagline && (
            <span
              className={cn(
                "leading-tight truncate",
                size === "sm" ? "text-[10px]" : "text-xs",
                variant === "white" ? "text-white/70" : "text-muted-foreground",
              )}
            >
              {displayTagline}
            </span>
          )}
        </div>
      )}
    </Wrapper>
  );
}

// Mini logo for favicon or small spaces
export function LogoMini({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-8 h-8", className)}
    >
      <defs>
        <linearGradient id="miniGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#miniGradient)" />
      <rect x="42" y="22" width="16" height="56" rx="4" fill="white" />
      <rect x="22" y="42" width="56" height="16" rx="4" fill="white" />
      <path
        d="M50 60 C50 60, 40 52, 40 46 C40 42, 43 40, 46 40 C48 40, 50 42, 50 42 C50 42, 52 40, 54 40 C57 40, 60 42, 60 46 C60 52, 50 60, 50 60Z"
        fill="#EF4444"
      />
    </svg>
  );
}
