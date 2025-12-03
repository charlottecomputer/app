"use client"

import * as React from "react"
import { cn } from "@aliveui"
import { Icon, type IconName } from "@aliveui"

interface AppIconProps {
  icon: IconName
  label?: string
  active?: boolean
  color?: string
  size?: "sm" | "md" | "lg" | "xl" | "full"
  className?: string
  noBackground?: boolean
  style?: React.CSSProperties
}

export function AppIcon({ noBackground = false, icon, label, active, color, size = "lg", className, style, ...props }: AppIconProps) {
  const iconSize = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
    full: "w-full h-full"
  }[size]

  const noBackgroundIconSize = "pt-0 mt-0 "

  const iconInnerSize = {
    sm: "!w-5 !h-5",
    md: "!w-8 !h-8",
    lg: "!w-12 !h-12",
    xl: "!w-20 !h-20",
    full: "!w-full !h-full"
  }[size]

  React.useEffect(() => {
    // @ts-ignore
    if (typeof CSS !== 'undefined' && 'paintWorklet' in CSS) {
      // @ts-ignore
      CSS.paintWorklet.addModule('https://unpkg.com/squircle-js/squircle.min.js');
    }
  }, [])

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 cursor-pointer group",
        className,
        iconSize,

      )}
    >
      {noBackground ? (
        <div
          className={cn(
            "flex items-start justify-center p-3 rounded-md overflow-none  transition-transform hover:scale-105 active:scale-95",
            noBackgroundIconSize,

          )}
        >
          <Icon icon={icon} className="w-full h-full" />
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center justify-center p-3 overflow-hidden text-white transition-transform group-hover:scale-105 active:scale-95",
            "bg-primary bg-[linear-gradient(180deg,rgba(255,255,255,0.17)_0%,rgba(255,255,255,0)_100%)] shadow-[var(--shadow-button-primary)]",
            iconSize,
            color
          )}
          style={{
            maskImage: "paint(squircle)",
            // @ts-ignore
            "--squircle-radius": "18px",
            "--squircle-smooth": "1",
            WebkitMaskImage: "paint(squircle)",
            ...style
          } as React.CSSProperties}
        >
          <Icon icon={icon} className={iconInnerSize} />
        </div>
      )}
      {label && <span className="text-[10px] font-medium text-muted-foreground">{label}</span>}
    </div>
  )
}
