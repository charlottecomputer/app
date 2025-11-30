"use client"

import { motion } from "motion/react"
import { cn } from "../lib/utils"

interface MarqueeProps {
    children: React.ReactNode
    className?: string
    reverse?: boolean
    duration?: number
}

export function Marquee({ children, className, reverse = false, duration = 20 }: MarqueeProps) {
    return (
        <div className={cn("flex overflow-hidden whitespace-nowrap", className)}>
            <motion.div
                className="flex min-w-full shrink-0 items-center gap-4 pr-4"
                initial={{ x: reverse ? "-100%" : "0%" }}
                animate={{ x: reverse ? "0%" : "-100%" }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {children}
                {children}
                {children}
                {children}
            </motion.div>
            <motion.div
                className="flex min-w-full shrink-0 items-center gap-4 pr-4"
                initial={{ x: reverse ? "-100%" : "0%" }}
                animate={{ x: reverse ? "0%" : "-100%" }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {children}
                {children}
                {children}
                {children}
            </motion.div>
        </div>
    )
}
