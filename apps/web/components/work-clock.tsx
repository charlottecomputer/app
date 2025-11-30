"use client"

import { cn } from "../../../packages/@aliveui/lib/utils"

import { motion, useScroll, useTransform, useSpring, MotionValue } from "motion/react"
import { useEffect, useState } from "react"

interface WorkClockProps {
    scrollYProgress: MotionValue<number>
    totalProjects: number
    colorClass?: string
}

export function WorkClock({ scrollYProgress, totalProjects, colorClass, rotations = 1 }: WorkClockProps & { rotations?: number }) {
    // Map scroll progress (0 to 1) to rotation (0 to 360 * totalProjects/12 * rotations)
    // Let's say scrolling the full page rotates the clock multiple times
    // The user said "when the clock minute hand hits 1/12 of the circuit the slideshow changes"
    // So 360 degrees = 12 steps.
    // We want the clock to rotate based on scroll.

    const [time, setTime] = useState<Date | null>(null)
    const [initialMinutes, setInitialMinutes] = useState(0)

    useEffect(() => {
        const now = new Date()
        setTime(now)
        // Capture the initial minutes to offset the rotation
        setInitialMinutes(now.getMinutes())

        const timer = setInterval(() => setTime(new Date()), 1000 * 60) // Update every minute
        return () => clearInterval(timer)
    }, [])

    // Calculate hour hand rotation
    // Hours * 30deg + Minutes * 0.5deg
    const hourRotation = time ? (time.getHours() % 12) * 30 + time.getMinutes() * 0.5 : 0

    // Initial rotation in degrees based on current minutes (6 degrees per minute)
    const startRotation = initialMinutes * 6

    // Total rotation added by scroll: 360 degrees * rotations
    // Actually, the user logic in page.tsx is: degrees = latest * 360 * totalRotations
    // So we should match that.
    const endRotation = startRotation + (360 * rotations)

    const rotate = useTransform(scrollYProgress, [0, 1], [startRotation, endRotation])
    const smoothRotate = useSpring(rotate, { damping: 50, stiffness: 400 })

    return (
        <div className={cn("absolute inset-0 flex items-center justify-center pointer-events-none z-10 mix-blend-difference", colorClass || "text-white")}>
            <div className="relative w-[60vh] h-[60vh] md:w-[80vh] md:h-[80vh] max-w-[90vw] max-h-[90vw]">
                {/* Clock Face / Dial */}
                <div className="absolute inset-0 rounded-full border border-current " />

                {/* Clock Steps / Numbers (12 total) */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={`step-${i}`}
                        className="absolute top-0 left-1/2 -translate-x-1/2 origin-bottom h-1/2"
                        style={{
                            transform: `rotate(${i * 30}deg)`,
                        }}
                    >
                        {/* Tick/Marker - Aligned with border */}
                        {/* top-[-5px] to center 10px tick on the border line */}
                        <div className="w-[1px] h-[10px] bg-current absolute top-[-5px] left-1/2 -translate-x-1/2" />
                    </div>
                ))}

                {/* Hour Hand (Real Time) */}
                {time && (
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ transform: `rotate(${hourRotation}deg)` }}
                    >
                        <div className="absolute top-[25%] left-1/2 w-[1.5px] h-[25%] bg-current -translate-x-1/2 origin-bottom" />
                    </div>
                )}

                {/* Minute/Scroll Hand */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ rotate: smoothRotate }}
                >
                    {/* Half diameter line (radius) */}
                    {/* h-1/2 puts it from top to center. origin-bottom makes it rotate around center. */}
                    <div className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-current -translate-x-1/2 opacity-80 origin-bottom" />
                </motion.div>
            </div>
        </div>
    )
}
