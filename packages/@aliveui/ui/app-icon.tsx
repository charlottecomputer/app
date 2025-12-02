"use client"

import * as React from "react"
import { cn } from "@aliveui/ui"
import { Icon, type IconName } from "@aliveui/ui/icon"

interface AppIconProps {
  icon: IconName
  label: string
  active?: boolean
  color?: "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5"
  size?: "md" | "lg"
  className?: string
  noBackground?: boolean
}

export function AppIcon({ noBackground = false, icon, label, active, color, size = "lg", className }: AppIconProps) {
  const iconSize = size === "lg" ? "w-20 h-20" : "w-12 h-12"
  const noBackgroundIconSize = "pt-0 mt-0 "
  const iconInnerSize = size === "lg" ? "!w-12 !h-12" : "!w-8 !h-8"

  return (

    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 cursor-pointer",
        className
      )}
    >
      {noBackground ? (
        <div
          className={cn(
            // "flex items-start justify-center p-3 rounded-[3px] overflow-none  transition-transform hover:scale-105 active:scale-95",
            noBackgroundIconSize,

          )}
        >
          <Icon icon={icon} className="w-full h-full" />
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center justify-center p-3 rounded-[3px] overflow-none text-white shadow-sm transition-transform hover:scale-105 active:scale-95",
            iconSize,
            color
          )}
        >
          <Icon icon={icon} className={iconInnerSize} />
        </div>
      )}
      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
    </div>
  )
}
