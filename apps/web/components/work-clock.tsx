"use client"

import { cn } from "../../../packages/@aliveui/lib/utils"
import { motion, useScroll, useTransform, useSpring, MotionValue, useMotionValueEvent, AnimatePresence } from "motion/react"
import { useEffect, useState } from "react"

import { LucideIcon } from "lucide-react"

interface Project {
    id: string
    title: string
    category: string
    year: string
    image: string
    bg: string
    icon: LucideIcon
    time: number
}

interface WorkClockProps {
    scrollYProgress: MotionValue<number>
    projects: Project[]
    activeIndex: number
    colorClass?: string
    rotations?: number
    useScrollTime?: boolean
}

export function WorkClock({ scrollYProgress, projects, activeIndex, colorClass, rotations = 1, useScrollTime = false }: WorkClockProps) {
    const [time, setTime] = useState<Date | null>(null)
    const [initialMinutes, setInitialMinutes] = useState(0)
    const [isPm, setIsPm] = useState(false)

    useEffect(() => {
        const now = new Date()
        setTime(now)
        setInitialMinutes(now.getMinutes())

        const timer = setInterval(() => setTime(new Date()), 1000) // Update every second for second hand
        return () => clearInterval(timer)
    }, [])

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Range: 7:00 AM (7) to 10:00 PM (22)
        // Total duration: 15 hours
        const currentHour = 7 + (latest * 15)

        // 12pm is hour 12.
        // Let's say we want it to be dark from 12pm onwards? 
        // Or just "when it hits 12pm" implies a specific point?
        // "turns the entire site from light to dark mode when it hits 12pm, and the experience continues as dark mode"
        // "if you scroll back up the page past 12pm again it turns light mode"

        if (currentHour >= 12) {
            document.documentElement.classList.add("dark")
            setIsPm(true)
        } else {
            document.documentElement.classList.remove("dark")
            setIsPm(false)
        }
    })

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            document.documentElement.classList.remove("dark")
        }
    }, [])

    // Hour hand: Real time OR Scroll controlled
    const realTimeHourRotation = time ? (time.getHours() % 12) * 30 + time.getMinutes() * 0.5 : 0
    // Scroll controlled: 7:00 AM (210deg) to 10:00 PM (22:00 = 660deg)
    // 15 hours range = 450 degrees
    const scrollHourRotation = useTransform(scrollYProgress, [0, 1], [210, 660])
    const smoothScrollHourRotation = useSpring(scrollHourRotation, { damping: 50, stiffness: 400 })

    const hourRotation = useScrollTime ? smoothScrollHourRotation : realTimeHourRotation

    // Minute hand: Scroll controlled (if not using scroll time for hour) OR Real time?
    // If hour is scroll controlled, minute hand should probably just spin fast to show time passing?
    // 15 hours = 15 * 360 = 5400 degrees for minute hand
    const startMinuteRotation = initialMinutes * 6
    const endMinuteRotation = startMinuteRotation + (360 * rotations)
    // If useScrollTime, let minute hand spin 15 times
    const scrollMinuteRotation = useTransform(scrollYProgress, [0, 1], [0, 360 * 15])

    const rotate = useScrollTime ? scrollMinuteRotation : useTransform(scrollYProgress, [0, 1], [startMinuteRotation, endMinuteRotation])
    const smoothRotate = useSpring(rotate, { damping: 50, stiffness: 400 })

    // Second hand: Real time
    const secondRotation = time ? time.getSeconds() * 6 + time.getMilliseconds() * 0.006 : 0

    return (
        <div className={cn("absolute inset-0 flex items-center justify-center pointer-events-none z-10", colorClass)}>
            <div className="glass-clock-container relative w-[350px] h-[350px] flex justify-center items-center z-[2] mt-[20px]">
                <div className="glass-effect-wrapper relative z-[2] rounded-full bg-transparent pointer-events-none transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] perspective-[1000px] transform-style-3d backface-hidden will-change-transform active:scale-[0.97]">

                    {/* Outer Shadow */}
                    <div className="glass-effect-shadow absolute w-[calc(100%+3em)] h-[calc(100%+3em)] top-[calc(0%-1.5em)] left-[calc(0%-1.5em)] blur-[10px] pointer-events-none z-[1] transition-all duration-400 opacity-[var(--outer-shadow-opacity)]">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[rgba(0,0,0,0.4)] to-[rgba(0,0,0,0.2)] w-[calc(100%-3em-0.25em)] h-[calc(100%-3em-0.25em)] top-[calc(3em-0.5em)] left-[calc(3em-0.875em)] p-[0.125em] opacity-80 shadow-[0_10px_30px_rgba(0,0,0,0.05),0_15px_25px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.05)] mask-linear-gradient-exclude" />
                    </div>

                    {/* Clock Face */}
                    <div className="glass-clock-face relative w-[350px] h-[350px] rounded-full bg-[rgba(255,255,255,0.03)] backdrop-blur-[1px] shadow-[inset_0_0.4em_0.4em_rgba(0,0,0,0.1),inset_0_-0.4em_0.4em_rgba(255,255,255,0.5),10px_5px_10px_rgba(0,0,0,var(--shadow-layer1-opacity)),10px_20px_20px_rgba(0,0,0,var(--shadow-layer2-opacity)),10px_55px_50px_rgba(0,0,0,var(--shadow-layer3-opacity))] z-[3] overflow-hidden pointer-events-auto cursor-pointer transition-all duration-400 select-none transform-style-3d backface-hidden will-change-transform-box-shadow">

                        {/* Glossy Overlay */}
                        <div className="glass-glossy-overlay absolute w-[350px] h-[350px] rounded-full top-0 left-0 bg-gradient-to-br from-[rgba(255,255,255,0.9)] via-[rgba(255,255,255,0.3)] to-[rgba(255,255,255,0.1)] pointer-events-none z-[6] mix-blend-overlay opacity-[var(--glossy-opacity)] blur-[10px]" />

                        {/* Edge Highlight */}
                        <div className="glass-edge-highlight absolute w-[350px] h-[350px] rounded-full top-0 left-0 border border-[rgba(255,255,255,0.8)] shadow-[0_0_10px_rgba(255,255,255,0.5)] z-[8] pointer-events-none opacity-60" />

                        {/* Edge Shadow */}
                        <div className="glass-edge-shadow absolute w-[350px] h-[350px] rounded-full top-0 left-0 shadow-[inset_-5px_5px_15px_rgba(0,0,0,0.3),inset_-8px_8px_20px_rgba(0,0,0,0.2)] z-[7] pointer-events-none opacity-[var(--inner-shadow-opacity)]" />

                        {/* Dark Edge */}
                        <div className="glass-dark-edge absolute z-[9] inset-0 rounded-full w-[calc(100%+clamp(2px,0.0625em,4px))] h-[calc(100%+clamp(2px,0.0625em,4px))] top-[calc(0%-clamp(2px,0.0625em,4px)/2)] left-[calc(0%-clamp(2px,0.0625em,4px)/2)] p-[clamp(2px,0.0625em,4px)] opacity-[var(--inner-shadow-opacity)] will-change-background"
                            style={{
                                background: `conic-gradient(from var(--dark-edge-angle) at 50% 50%, rgba(0,0,0,0.5), rgba(0,0,0,0) 5% 40%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 60% 95%, rgba(0,0,0,0.5))`,
                                mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                                maskComposite: "exclude"
                            }}
                        />

                        {/* Reflection */}
                        <div className="glass-reflection absolute w-[350px] h-[175px] top-0 left-0 bg-gradient-to-b from-[rgba(255,255,255,0.7)] to-transparent rounded-t-[175px] pointer-events-none z-[10] mix-blend-soft-light opacity-[var(--reflection-opacity)] blur-[10px]" />

                        {/* Reflection Overlay */}
                        <div className="glass-reflection-overlay absolute w-[330px] h-[330px] rounded-full top-[10px] left-[10px] bg-[radial-gradient(ellipse_at_30%_30%,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0.3)_30%,rgba(255,255,255,0.1)_60%,transparent_100%)] pointer-events-none z-[15] mix-blend-overlay opacity-70 rotate-[-15deg] blur-[10px]" />

                        {/* Hour Marks */}
                        <div className="clock-hour-marks absolute top-0 left-0 w-full h-full z-[14]">
                            {Array.from({ length: 60 }).map((_, i) => {
                                if (i % 5 === 0) {
                                    const hourIndex = i / 5 === 0 ? 12 : i / 5;
                                    const angle = (i * 6 * Math.PI) / 180;
                                    const radius = 145;
                                    const left = 175 + Math.sin(angle) * radius - 15;
                                    const top = 175 - Math.cos(angle) * radius - 10;
                                    return (
                                        <div key={i} className="clock-number absolute text-[16px] font-medium text-[var(--hour-number-color)] text-center w-[30px] h-[20px] leading-[20px]  z-[15] opacity-[var(--hour-number-opacity)] select-none pointer-events-none transition-colors duration-700 ease-in-out" style={{ left: `${left}px`, top: `${top}px` }}>
                                            {hourIndex}
                                        </div>
                                    )
                                } else {
                                    return (

                                        <div key={i} className="minute-marker absolute w-[1px] h-[10px] bg-[var(--minute-marker-color)] top-[10px] left-[175px] origin-[center_165px] shadow-[0_0_2px_rgba(255,255,255,0.3)] opacity-[var(--minute-marker-opacity)] transition-colors duration-700 ease-in-out" style={{ transform: `rotate(${i * 6}deg)` }} />

                                    )
                                }
                            })}
                        </div>

                        {/* App Indicators */}
                        <div className="clock-app-indicators absolute top-0 left-0 w-full h-full z-[14]">
                            <AnimatePresence mode="wait">
                                {isPm ? (
                                    // PM Projects
                                    projects.filter(p => p.time >= 12).map((project, index) => {
                                        // Adjust index for PM set if needed, or just find in original array
                                        const originalIndex = projects.findIndex(p => p.id === project.id);
                                        const hour = project.time % 12;
                                        const angle = hour * 30;
                                        const radius = 110;
                                        const radian = (angle * Math.PI) / 180;
                                        const left = 175 + Math.sin(radian) * radius - 12;
                                        const top = 175 - Math.cos(radian) * radius - 12;
                                        const isActive = originalIndex === activeIndex;

                                        return (
                                            <motion.div
                                                key={project.id}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: "backOut" }}
                                                className="absolute w-[24px] h-[24px] flex items-center justify-center z-[16]"
                                                style={{
                                                    left: `${left}px`,
                                                    top: `${top}px`,
                                                }}
                                            >
                                                <div style={{
                                                    transform: isActive ? 'scale(1.5)' : 'scale(1)',
                                                    opacity: isActive ? 1 : 0.6,
                                                    transition: 'all 0.3s ease'
                                                }}>
                                                    <project.icon
                                                        size={16}
                                                        className={cn(
                                                            "transition-colors duration-700 ease-in-out",
                                                            isActive ? "text-foreground" : "text-muted-foreground"
                                                        )}
                                                        strokeWidth={isActive ? 3 : 2.5}
                                                    />
                                                </div>
                                            </motion.div>
                                        )
                                    })
                                ) : (
                                    // AM Projects
                                    projects.filter(p => p.time < 12).map((project, index) => {
                                        const originalIndex = projects.findIndex(p => p.id === project.id);
                                        const hour = project.time % 12;
                                        const angle = hour * 30;
                                        const radius = 110;
                                        const radian = (angle * Math.PI) / 180;
                                        const left = 175 + Math.sin(radian) * radius - 12;
                                        const top = 175 - Math.cos(radian) * radius - 12;
                                        const isActive = originalIndex === activeIndex;

                                        return (
                                            <motion.div
                                                key={project.id}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: "backOut" }}
                                                className="absolute w-[24px] h-[24px] flex items-center justify-center z-[16]"
                                                style={{
                                                    left: `${left}px`,
                                                    top: `${top}px`,
                                                }}
                                            >
                                                <div style={{
                                                    transform: isActive ? 'scale(1.5)' : 'scale(1)',
                                                    opacity: isActive ? 1 : 0.6,
                                                    transition: 'all 0.3s ease'
                                                }}>
                                                    <project.icon
                                                        size={16}
                                                        className={cn(
                                                            "transition-colors duration-700 ease-in-out",
                                                            isActive ? "text-foreground" : "text-muted-foreground"
                                                        )}
                                                        strokeWidth={isActive ? 3 : 2.5}
                                                    />
                                                </div>
                                            </motion.div>
                                        )
                                    })
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Hands */}
                        {/* Hour Hand */}
                        <motion.div className="hour-hand clock-hand absolute w-[6px] h-[70px] bg-[var(--hand-color)] -ml-[3px] rounded-[3px] shadow-[0_0_5px_rgba(0,0,0,0.3)] origin-[center_bottom] bottom-[175px] left-[175px] z-[15] will-change-transform transition-colors duration-700 ease-in-out" style={{ rotate: hourRotation }} />

                        {/* Minute Hand (Scroll Controlled) */}
                        <motion.div className="minute-hand clock-hand absolute w-[4px] h-[100px] bg-[var(--hand-color)] -ml-[2px] rounded-[2px] shadow-[0_0_5px_rgba(0,0,0,0.3)] origin-[center_bottom] bottom-[175px] left-[175px] z-[15] will-change-transform transition-colors duration-700 ease-in-out" style={{ rotate: smoothRotate }} />

                        {/* Second Hand Container */}
                        <div className="second-hand-container absolute w-[2px] h-[120px] top-[55px] left-[174px] origin-[1px_120px] z-[17] will-change-transform" style={{ transform: `rotate(${secondRotation}deg)` }}>
                            <div className="second-hand absolute w-[2px] h-[120px] bg-[var(--second-hand-color)] bottom-0 left-0 shadow-[0_0_5px_rgba(255,107,0,0.5)]" />
                            <div className="second-hand-counterweight absolute w-[6px] h-[14px] bg-[var(--second-hand-color)] -bottom-[14px] -left-[2px] rounded-b-[4px] shadow-[0_0_5px_rgba(255,107,0,0.5)]" />
                        </div>

                        {/* Second Hand Shadow */}
                        <div className="second-hand-shadow absolute w-[2px] h-[120px] top-[55px] left-[174px] origin-[1px_120px] z-[14] blur-[2px] opacity-30 will-change-transform" style={{ transform: `rotate(${secondRotation + 0.5}deg)` }}>
                            <div className="absolute w-[2px] h-[120px] bg-transparent bottom-0 left-0 shadow-[0_0_5px_1px_rgba(0,0,0,0.15)]" />
                            <div className="absolute w-[8px] h-[16px] bg-transparent -bottom-[16px] -left-[3px] shadow-[0_0_5px_1px_rgba(0,0,0,0.15)]" />
                        </div>

                        {/* Center Dot & Blur */}
                        <div className="clock-center-dot absolute w-[12px] h-[12px] bg-[var(--second-hand-color)] rounded-full top-[169px] left-[169px] z-[17] shadow-[0_0_8px_rgba(255,107,0,0.4)]" />
                        <div className="clock-center-blur absolute w-[36px] h-[36px] top-[157px] left-[157px] bg-[rgba(255,255,255,0.35)] rounded-full backdrop-blur-[4px] z-[16] pointer-events-none shadow-[0_0_20px_rgba(255,255,255,0.4),inset_0_0_8px_rgba(255,255,255,0.6)]" />

                        {/* Logo
                        <div className="clock-logo absolute w-full h-[20px] top-[110px] left-[135px] z-[15] opacity-90">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/1/16/Braun_Logo.svg" alt="Braun Logo" width="80" height="30" className="opacity-80" style={{ imageRendering: "pixelated" }} />
                        </div> */}

                        {/* Date */}
                        <div className="clock-date absolute text-[12px] font-normal text-[var(--hour-number-color)] text-center w-[140px] h-auto leading-none bottom-[115px] left-[105px] z-[15] select-none pointer-events-none transition-colors duration-700 ease-in-out">
                            {time && `${time.toLocaleString('default', { month: 'short' })} ${time.getDate()}`}
                        </div>

                        {/* Timezone */}
                        <div className="clock-timezone absolute text-[12px] font-normal text-[var(--hour-number-color)] text-center w-[140px] h-auto leading-none bottom-[100px] left-[105px] z-[15] select-none pointer-events-none transition-colors duration-700 ease-in-out">
                            GMT
                        </div>

                        {/* Enhanced Border Effect (After pseudo-element equivalent) */}
                        <div className="absolute z-[10] inset-0 rounded-full w-[calc(100%+clamp(2px,0.0625em,4px))] h-[calc(100%+clamp(2px,0.0625em,4px))] top-[calc(0%-clamp(2px,0.0625em,4px)/2)] left-[calc(0%-clamp(2px,0.0625em,4px)/2)] p-[clamp(2px,0.0625em,4px)] opacity-90 will-change-background-box-shadow pointer-events-none"
                            style={{
                                background: `conic-gradient(from var(--primary-light-angle) at 50% 50%, rgba(255,255,255,1), rgba(255,255,255,0.2) 5% 40%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.2) 60% 95%, rgba(255,255,255,1)), linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.5))`,
                                mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                                maskComposite: "exclude",
                                boxShadow: "inset 0 0 0 calc(clamp(2px, 0.0625em, 4px) / 2) rgba(255, 255, 255, 0.9), 0 0 12px rgba(255, 255, 255, 0.8)"
                            }}
                        />

                    </div>
                </div>
            </div>
        </div>
    )
}
