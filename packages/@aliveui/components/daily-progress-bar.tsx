"use client"

import { motion } from "motion/react"
import { cn } from "../lib/utils"
import { useEffect, useState } from "react"

interface DailyProgressBarProps {
    current: number
    total: number
    className?: string
}

export function DailyProgressBar({ current, total, className }: DailyProgressBarProps) {
    const [prevCurrent, setPrevCurrent] = useState(current)
    const progress = total > 0 ? Math.min(current / total, 1) * 100 : 0
    const isFull = progress === 100 && total > 0

    useEffect(() => {
        setPrevCurrent(current)
    }, [current])

    return (
        <div className={cn("w-full max-w-md mx-auto px-4 py-2", className)}>
            <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Daily Goal</span>
                <span className="text-xs font-bold font-mono">
                    {current}/{total}
                </span>
            </div>
            <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden shadow-inner">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "4px 4px" }}
                />

                {/* Fill Bar */}
                <motion.div
                    className={cn(
                        "absolute top-0 left-0 h-full rounded-full bg-primary shadow-[0_0_10px_rgba(0,0,0,0.2)]",
                        isFull && "shadow-[0_0_15px_var(--primary)]"
                    )}
                    initial={{ width: `${(prevCurrent / total) * 100}%` }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                >
                    {/* Shimmer Effect */}
                    <motion.div
                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    />
                </motion.div>
            </div>

            {/* Celebration Text */}
            {isFull && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-1 text-[10px] font-bold text-primary animate-pulse"
                >
                    GOAL REACHED! 🎉
                </motion.div>
            )}
        </div>
    )
}
