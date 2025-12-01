"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Card } from "../../../packages/@aliveui/ui/card"
import { Text } from "../../../packages/@aliveui/ui/text"

const words = [
    "Todo Lists",
    "Mindfulness",
    "Cybersecurity",
    "Glucose Tracking",
    "Blood Pressure",
    "Spam Call Blocking",
    "Group Texting",
    "Reading",
    "Menu Bars",
    "Meditation",
    "Consumer Software",
    "Mobile Apps",
]

export function Hero() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isScrolling, setIsScrolling] = useState(false)
    const lastScrollY = useRef(0)
    const scrollAccumulator = useRef(0)
    const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

    useEffect(() => {
        // Fallback timer in case user doesn't scroll
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % words.length)
        }, 3000)

        // Track scroll position via RAF since Lenis updates on animation frame
        let lastScrollY = 0
        let scrollAccumulator = 0

        const handleRAF = () => {
            const scrollY = window.scrollY
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
    }, [])

    return (
        <section className="layout-fh">
            <div className="home-hero__content">
                <Card>
                    <Text
                        variant="h1"
                        className="flex flex-col justify-center items-center text-center relative select-none leading-[1.01]"
                        style={{ opacity: 1 }}
                        aria-label={`Reinventing ${words.join(", ")}`}
                    >
                        <div className="relative z-10">
                            <div className="word-top relative w-[100vw]">
                                <motion.div
                                    className="overflow-hidden relative whitespace-nowrap w-full"
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    Reinventing
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
                            <div className="word-bottom relative w-[100vw] text-[var(--grey-300)] h-[17.0666666667vw] md:h-[8.6111111111vw]">
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
            <div className="scroll-label">
                <p className="b-small" style={{ opacity: 1 }}>
                    <span>scroll</span>
                </p>
            </div>
        </section>
    )
}
