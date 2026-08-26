import React from "react"
import { cn } from "@/lib/utils"

interface BrandLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  /** Compact icon-only mode — used in sidebars, mobile headers */
  iconOnly?: boolean
  /** Size variant */
  size?: "sm" | "md" | "lg"
}

/**
 * SIID Professional Brand Logo
 * ─────────────────────────────
 * Icon:  Two geometric skyscraper towers with a glowing circuit-diamond apex.
 * Type:  "SIID" in a tight geometric sans — amber/gold gradient.
 * Sub:   "SMART INFRASTRUCTURE" micro-label in slate.
 */
export function BrandLogo({
  className,
  iconOnly = false,
  size = "md",
  ...props
}: BrandLogoProps) {
  const dims = {
    sm: { w: 88,  h: 28 },
    md: { w: 130, h: 38 },
    lg: { w: 180, h: 52 },
  }[size]

  if (iconOnly) {
    return (
      <div className={cn("flex items-center flex-shrink-0", className)} {...props}>
        <svg
          width={dims.h}
          height={dims.h}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ig-a" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          {/* Left tower */}
          <rect x="4"  y="14" width="10" height="22" rx="1.5" fill="url(#ig-a)" />
          {/* Right tower */}
          <rect x="26" y="14" width="10" height="22" rx="1.5" fill="url(#ig-a)" />
          {/* Center tower */}
          <rect x="15" y="8"  width="10" height="28" rx="1.5" fill="url(#ig-a)" />
          {/* Diamond apex */}
          <path d="M20 2L23 6H20H17L20 2Z" fill="#FCD34D" />
          <circle cx="20" cy="6" r="2.5" fill="white" fillOpacity="0.95" />
          {/* Baseline */}
          <rect x="4" y="36" width="32" height="1.5" rx="0.75" fill="url(#ig-a)" />
        </svg>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center flex-shrink-0", className)} {...props}>
      <svg
        width={dims.w}
        height={dims.h}
        viewBox="0 0 260 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="SIID – Smart Infrastructure"
      >
        <defs>
          {/* Amber gold gradient — icon */}
          <linearGradient id="lg-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          {/* Text gradient */}
          <linearGradient id="lg-text" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#FCD34D" />
            <stop offset="60%"  stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── ICON MARK (left side) ── */}
        <g transform="translate(4, 4)">
          {/* Left tower */}
          <rect x="0"  y="22" width="13" height="36" rx="2" fill="url(#lg-gold)" />
          {/* Right tower */}
          <rect x="27" y="22" width="13" height="36" rx="2" fill="url(#lg-gold)" />
          {/* Center tower (tallest) */}
          <rect x="13.5" y="10" width="13" height="48" rx="2" fill="url(#lg-gold)" />
          {/* Apex diamond */}
          <path d="M20 0 L24.5 8 L20 12 L15.5 8 Z" fill="#FCD34D" filter="url(#glow)" />
          {/* Glow dot */}
          <circle cx="20" cy="8" r="3.5" fill="white" fillOpacity="0.9" filter="url(#glow)" />
          {/* Window detail — center tower */}
          <rect x="16" y="20" width="4" height="4" rx="0.5" fill="white" fillOpacity="0.35" />
          <rect x="16" y="28" width="4" height="4" rx="0.5" fill="white" fillOpacity="0.35" />
          <rect x="16" y="36" width="4" height="4" rx="0.5" fill="white" fillOpacity="0.35" />
          {/* Window detail — left tower */}
          <rect x="3"  y="28" width="3.5" height="3" rx="0.5" fill="white" fillOpacity="0.3" />
          <rect x="3"  y="35" width="3.5" height="3" rx="0.5" fill="white" fillOpacity="0.3" />
          {/* Window detail — right tower */}
          <rect x="29.5" y="28" width="3.5" height="3" rx="0.5" fill="white" fillOpacity="0.3" />
          <rect x="29.5" y="35" width="3.5" height="3" rx="0.5" fill="white" fillOpacity="0.3" />
          {/* Ground line */}
          <rect x="0" y="58" width="40" height="1.5" rx="0.75" fill="url(#lg-gold)" opacity="0.7" />
        </g>

        {/* ── WORDMARK: "SIID" ── */}
        <text
          x="58"
          y="46"
          fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
          fontSize="36"
          fontWeight="800"
          letterSpacing="-0.5"
          fill="url(#lg-text)"
        >
          SIID
        </text>

        {/* ── SUB-LABEL: "SMART INFRASTRUCTURE" ── */}
        <text
          x="59"
          y="60"
          fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
          fontSize="7.5"
          fontWeight="600"
          letterSpacing="2.5"
          fill="#94A3B8"
        >
          SMART INFRASTRUCTURE
        </text>
      </svg>
    </div>
  )
}
