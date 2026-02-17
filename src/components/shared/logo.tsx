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
  const clinicName = settings?.name || "Clinexa";
  const clinicTagline = settings?.tagline || "Bicara. Catat. Sembuhkan.";
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

  // Default Clinexa logo (Stethoscope C — Variant F)
  const DefaultLogoIcon = () => (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], "shrink-0")}
    >
      <defs>
        <linearGradient id="clinexa-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="112"
        height="112"
        rx="24"
        fill="url(#clinexa-bg)"
      />
      <path
        d="M80 30C70 22 58 20 46 24C30 30 22 46 24 62C26 78 40 92 58 92C68 90 76 84 82 76"
        fill="none"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle
        cx="80"
        cy="30"
        r="6"
        fill="none"
        stroke="white"
        strokeWidth="3"
      />
      <circle cx="80" cy="30" r="2" fill="#67E8F9" />
      <circle
        cx="82"
        cy="76"
        r="10"
        fill="none"
        stroke="white"
        strokeWidth="3"
      />
      <circle cx="82" cy="76" r="5" fill="#67E8F9" />
      <path
        d="M36 58L44 58L48 48L54 68L58 52L62 58L70 58"
        fill="none"
        stroke="#67E8F9"
        strokeWidth="2.5"
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

  const subtextColorClass =
    variant === "white" ? "text-white/70" : "text-muted-foreground";

  const Wrapper = animated ? motion.div : "div";
  const wrapperProps = animated
    ? {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, ease: "easeOut" },
      }
    : {};

  // Display name based on whether we're using clinic settings
  const displayName = useClinicLogo ? clinicName : "Clinexa";
  const displayTagline = useClinicLogo
    ? clinicTagline
    : "Bicara. Catat. Sembuhkan.";

  // Render brand name with clin/exa split styling
  const renderBrandName = () => {
    if (useClinicLogo && clinicName !== "Clinexa") {
      // Custom clinic name — render as-is
      return displayName;
    }
    // Default Clinexa brand — split styling
    return (
      <>
        <span className="font-light">clin</span>
        <span className="font-bold">exa</span>
      </>
    );
  };

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
                "leading-tight tracking-tight truncate",
                textSizeClasses[size],
                textColorClass,
              )}
            >
              {renderBrandName()}
            </span>
          )}
          {displayTagline && (
            <span
              className={cn(
                "leading-tight truncate",
                size === "sm" ? "text-[10px]" : "text-xs",
                subtextColorClass,
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
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-8 h-8", className)}
    >
      <defs>
        <linearGradient id="miniClinexa" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="112"
        height="112"
        rx="24"
        fill="url(#miniClinexa)"
      />
      <path
        d="M80 30C70 22 58 20 46 24C30 30 22 46 24 62C26 78 40 92 58 92C68 90 76 84 82 76"
        fill="none"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle
        cx="80"
        cy="30"
        r="6"
        fill="none"
        stroke="white"
        strokeWidth="3"
      />
      <circle cx="80" cy="30" r="2" fill="#67E8F9" />
      <circle
        cx="82"
        cy="76"
        r="10"
        fill="none"
        stroke="white"
        strokeWidth="3"
      />
      <circle cx="82" cy="76" r="5" fill="#67E8F9" />
      <path
        d="M36 58L44 58L48 48L54 68L58 52L62 58L70 58"
        fill="none"
        stroke="#67E8F9"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
