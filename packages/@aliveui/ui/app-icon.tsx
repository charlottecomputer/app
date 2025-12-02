"use client"

import * as React from "react"
import { cn } from "@aliveui/ui"
import { Icon, type IconName } from "@aliveui/ui/icon"

interface AppIconProps {
  icon: IconName
  label: string
  active?: boolean
  color?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  noBackground?: boolean
}

export function AppIcon({ noBackground = false, icon, label, active, color, size = "lg", className }: AppIconProps) {
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

  return (

    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 cursor-pointer",
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
            "flex items-center justify-center p-3 rounded-md overflow-none text-white shadow-sm transition-transform hover:scale-105 active:scale-95",
            iconSize,
            color
          )}
        >
          <Icon icon={icon} className={iconInnerSize} />
        </div>
      )}
      {label && (<span className="text-[10px] font-medium text-muted-foreground">{label}</span>)}
    </div>
  )
}
