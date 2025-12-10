"use client"

import { motion } from "motion/react"
import { cn } from "../lib/utils"
import { useEffect, useState } from "react"

interface SmileyProgressProps {
    current: number
    total: number
    className?: string
    onClick?: () => void
}

export function SmileyProgress({ current, total, className, onClick }: SmileyProgressProps) {
    const [prevProgress, setPrevProgress] = useState(0)
    const progress = total > 0 ? Math.min(current / total, 1) : 0

    // Calculate mouth curve based on progress
    // 0% -> Sad (curve down)
    // 50% -> Neutral (flat)
    // 100% -> Happy (curve up)

    // SVG Path command for quadratic bezier curve: Q control-point-x control-point-y, end-x end-y
    // Start point: M 30 65
    // End point: 70 65
    // Control point x is always 50 (center)
    // Control point y varies:
    // Sad: 45 (curves up, making mouth frown)
    // Neutral: 65 (flat)
    // Happy: 85 (curves down, making mouth smile)

    // Map progress 0-1 to control point Y range 45-85
    const controlY = 45 + (progress * 40)

    useEffect(() => {
        setPrevProgress(progress)
    }, [progress])

    return (
        <motion.div
            className={cn(
                "relative w-10 h-10 rounded-full bg-[#00D664] flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-shadow",
                className
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
        >
            <svg width="40" height="40" viewBox="0 0 100 100" className="w-full h-full">
                {/* Eyes */}
                <circle cx="35" cy="40" r="6" fill="#1a1a1a" />
                <circle cx="65" cy="40" r="6" fill="#1a1a1a" />

                {/* Mouth */}
                <motion.path
                    d={`M 30 65 Q 50 ${controlY} 70 65`}
                    fill="transparent"
                    stroke="#1a1a1a"
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ d: `M 30 65 Q 50 ${45 + (prevProgress * 40)} 70 65` }}
                    animate={{ d: `M 30 65 Q 50 ${controlY} 70 65` }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                />
            </svg>
        </motion.div>
    )
}
