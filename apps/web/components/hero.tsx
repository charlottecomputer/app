"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Card } from "../../../packages/@aliveui/ui/card"
import { useScrollContainer } from "../../../packages/@aliveui"
import { MacOSDock, Text } from "@aliveui"

const apps = [
    {
        id: 'finder',
        name: 'Finder',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/finder-2021-09-10.png?rf=1024'
    },
    {
        id: 'calculator',
        name: 'Calculator',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/calculator-2021-04-29.png?rf=1024'
    },
    {
        id: 'terminal',
        name: 'Terminal',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/terminal-2021-06-03.png?rf=1024'
    },
    {
        id: 'mail',
        name: 'Mail',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/mail-2021-05-25.png?rf=1024'
    },
    {
        id: 'notes',
        name: 'Notes',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/notes-2021-05-25.png?rf=1024'
    },
    {
        id: 'safari',
        name: 'Safari',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/safari-2021-06-02.png?rf=1024'
    },
    {
        id: 'photos',
        name: 'Photos',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/photos-2021-05-28.png?rf=1024'
    },
    {
        id: 'music',
        name: 'Music',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/music-2021-05-25.png?rf=1024'
    },
    {
        id: 'calendar',
        name: 'Calendar',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/calendar-2021-04-29.png?rf=1024'
    },
]
const words = [
    "Productivity",
    "Accomplishment",
    "Efficiency",
    "Masterfulness",
    "Effortlessness"
]

export function Hero() {
    const { scrollContainerRef } = useScrollContainer()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isScrolling, setIsScrolling] = useState(false)
    const lastScrollY = useRef(0)
    const scrollAccumulator = useRef(0)
    const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const [openApps, setOpenApps] = useState<string[]>(['finder', 'safari'])

    const handleAppClick = (appId: string) => {
        console.log('App clicked:', appId)

        setOpenApps(prev =>
            prev.includes(appId)
                ? prev.filter(id => id !== appId)
                : [...prev, appId]
        )
    }
    useEffect(() => {
        // Fallback timer in case user doesn't scroll
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % words.length)
        }, 3000)

        // Track scroll position via RAF
        let lastScrollY = 0
        let scrollAccumulator = 0

        const handleRAF = () => {
            const container = scrollContainerRef.current || window
            const scrollY = container instanceof Window ? container.scrollY : (container as HTMLElement).scrollTop
            const scrollDelta = Math.abs(scrollY - lastScrollY)

            if (scrollDelta > 0) {
                scrollAccumulator += scrollDelta
                lastScrollY = scrollY

                // Mark as scrolling
                setIsScrolling(true)

                // Clear existing timeout
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current)
                }

                // Set timeout to mark scrolling as done
                scrollTimeoutRef.current = setTimeout(() => {
                    setIsScrolling(false)
                }, 150)

                // Every 15px of scroll, change word (super fast spinning dial effect)
                if (scrollAccumulator > 30) {
                    setCurrentIndex((prev) => (prev + 1) % words.length)
                    scrollAccumulator = 0
                }
            }

            rafId = requestAnimationFrame(handleRAF)
        }

        let rafId = requestAnimationFrame(handleRAF)

        return () => {
            clearInterval(timer)
            cancelAnimationFrame(rafId)
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }
        }
    }, [scrollContainerRef])

    return (

        <section className=" relative   align-items-center justify-center flex flex-col h-[calc(100vh-50px)] w-[100svw] ">
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-80"
                >
                    <source src="/gif.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0  backdrop-blur-[0.5px]" />
            </div>
            <div className="mx-auto h-full justify-between items-center space-between flex flex-col   relative z-10">
                <div className="flex flex-col justify-center items-center h-full">
                    <Card className="w-[80vw] liquid-glass">
                        <Text
                            variant="h1"
                            className="flex flex-col  justify-center items-center text-center relative select-none leading-[1.01]"
                            style={{ opacity: 1 }}
                            aria-label={`Reinventing ${words.join(", ")}`}
                        >
                            <div className="relative z-10">
                                <div className="word-top text-white relative w-full">
                                    <motion.div
                                        className=" relative whitespace-nowrap w-full"
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        Minimal tools for
                                    </motion.div>
                                </div>
                            </div>
                            <div
                                className="relative"
                                style={{
                                    maskImage: "linear-gradient(180deg, transparent 0, #000 10%, #000 90%, transparent)",
                                    WebkitMaskImage: "linear-gradient(180deg, transparent 0, #000 10%, #000 90%, transparent)"
                                }}
                            >
                                <div className="word-bottom relative w-full text-secondary h-[17.0666666667vw] md:h-[8.6111111111vw]">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentIndex}
                                            className="absolute w-full overflow-hidden relative whitespace-nowrap"
                                            initial={{ y: "100%" }}
                                            animate={{ y: 0 }}
                                            exit={{ y: 0 }}
                                            transition={{
                                                duration: isScrolling ? 0 : 0.2,
                                                ease: [0.16, 1, 0.3, 1]
                                            }}
                                        >
                                            <span>{words[currentIndex]}</span>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </Text>
                    </Card>
                </div>
                <div className="pb-8">

                    <MacOSDock
                        apps={apps}
                        onAppClick={handleAppClick}
                        openApps={openApps}
                    />
                </div>
            </div>

        </section>
    )
}
