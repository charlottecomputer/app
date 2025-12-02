"use client"

import React, { useEffect, useState, useRef } from "react"
import { cn } from "../../lib/utils"
import { useScrollContainer } from "../../ui/scroll-context"

interface CharProps {
    char: string
    opacity: number
}

function Char({ char, opacity }: CharProps) {
    return (
        <span
            className="char"
            style={{
                position: "relative",
                display: "inline-block",
                opacity: Math.max(0.25, Math.min(1, opacity))
            }}
        >
            {char}
        </span>
    )
}

interface WordProps {
    word: string
    startIndex: number
    currentCharIndex: number
    totalChars: number
}

function Word({ word, startIndex, currentCharIndex, totalChars }: WordProps) {
    return (
        <span style={{ position: "relative", display: "inline-block" }}>
            {word.split("").map((char, i) => {
                const charIndex = startIndex + i
                const progress = (currentCharIndex - charIndex) / 20 + 1
                return <Char key={i} char={char} opacity={progress} />
            })}
        </span>
    )
}

export interface RevealOnScrollSegment {
    type: 'text' | 'label';
    content: string;
    className?: string;
}

export interface RevealOnScrollProps {
    segments: RevealOnScrollSegment[];
    className?: string;
}

export function RevealOnScroll({ segments, className }: RevealOnScrollProps) {
    const { scrollContainerRef } = useScrollContainer()
    const [scrollProgress, setScrollProgress] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const stickyRef = useRef<HTMLDivElement>(null)

    // Calculate total characters for scroll range
    const totalChars = segments.reduce((acc, segment) => acc + segment.content.length, 0)
    const scrollRange = totalChars * 20 // 20px per character

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current
            const sticky = stickyRef.current
            if (!container || !sticky) return

            const startY = container.offsetTop

            const scrollContainer = scrollContainerRef.current || window
            const scrollY = scrollContainer instanceof Window ? scrollContainer.scrollY : (scrollContainer as HTMLElement).scrollTop

            const progress = Math.min(1, Math.max(0, (scrollY - startY + window.innerHeight * 0.5) / scrollRange))

            setScrollProgress(progress)
        }

        const scrollContainer = scrollContainerRef.current || window
        scrollContainer.addEventListener("scroll", handleScroll)
        handleScroll() // Initial call
        return () => scrollContainer.removeEventListener("scroll", handleScroll)
    }, [scrollRange, scrollContainerRef])

    const currentCharIndex = Math.floor(scrollProgress * totalChars)

    let charCounter = 0

    return (
        <div
            ref={containerRef}
            className={cn("relative mt-[144px] mb-[144px]", className)}
            style={{
                height: `${scrollRange}px`,
            }}
        >
            <section
                ref={stickyRef}
                className="h-auto w-full"
                style={{
                    position: "sticky",
                    top: "125px",
                    left: "0",
                    height: "600px",
                    zIndex: 10,
                }}
            >
                <div className="layout-grid">
                    <div className="flex col-span-4 relative select-none md:col-span-14 md:text-center layout-block">
                        <h4 className="font-[var(--font-itc)] text-[8.533vw] font-light leading-[1.12] md:text-[3.889vw]">
                            <div className="storyblok-content body">
                                <p>
                                    {segments.map((segment, segmentIndex) => {
                                        if (segment.type === 'label') {
                                            return (
                                                <span
                                                    key={segmentIndex}
                                                    className={cn(
                                                        "mr-[1.5vw] opacity-25 overflow-hidden relative whitespace-nowrap h-min",
                                                        "md:border md:border-grey-100 md:rounded-[14.3px] md:mr-[0.5vw] md:w-min md:h-min md:inline md:py-[0.3vw] md:px-[0.65vw]",
                                                        segment.className
                                                    )}
                                                    style={{ opacity: 1, display: 'inline-block' }}
                                                >
                                                    <span className="text-[var(--theme-contrast)] pointer-events-none">
                                                        <span className="home-blurb-item__content--text">
                                                            <span>{segment.content}</span>
                                                        </span>
                                                    </span>
                                                </span>
                                            )
                                        }

                                        const words = segment.content.split(/(\s+)/)

                                        return (
                                            <React.Fragment key={segmentIndex}>
                                                {words.map((word, i) => {
                                                    // Handle spaces explicitly
                                                    if (word.match(/^\s+$/)) {
                                                        charCounter += word.length
                                                        return <span key={i}>{word}</span>
                                                    }

                                                    const startIdx = charCounter
                                                    charCounter += word.length

                                                    return (
                                                        <Word
                                                            key={i}
                                                            word={word}
                                                            startIndex={startIdx}
                                                            currentCharIndex={currentCharIndex}
                                                            totalChars={totalChars}
                                                        />
                                                    )
                                                })}
                                            </React.Fragment>
                                        )
                                    })}
                                </p>
                            </div>
                        </h4>
                    </div>
                </div>
            </section>
        </div>
    )
}
