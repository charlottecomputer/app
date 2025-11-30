"use client"

import React, { useEffect, useState, useRef } from "react"
import { cn } from "../lib/utils"

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
                opacity: Math.max(0.25, Math.min(1, opacity)),
                transition: "opacity 0.1s linear" // Add slight transition for smoothness
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
}

function Word({ word, startIndex, currentCharIndex }: WordProps) {
    return (
        <span style={{ position: "relative", display: "inline-block", whiteSpace: "pre" }}>
            {word.split("").map((char, i) => {
                const charIndex = startIndex + i
                // Smoother progress calculation
                const progress = (currentCharIndex - charIndex) / 10 + 0.25
                return <Char key={i} char={char} opacity={progress} />
            })}
        </span>
    )
}

export interface ScrollRevealSegment {
    type: 'text' | 'label';
    content: string;
    className?: string;
}

export interface ScrollRevealTextProps {
    segments: ScrollRevealSegment[];
    className?: string;
    scrollRangeMultiplier?: number; // default 20
}

export function ScrollRevealText({ segments, className, scrollRangeMultiplier = 20 }: ScrollRevealTextProps) {
    const [scrollProgress, setScrollProgress] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const stickyRef = useRef<HTMLDivElement>(null)

    // Calculate total characters for scroll range
    const totalChars = segments.reduce((acc, segment) => acc + segment.content.length, 0)
    const scrollRange = totalChars * scrollRangeMultiplier

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current
            if (!container) return

            const rect = container.getBoundingClientRect()
            const scrollY = window.scrollY
            const windowHeight = window.innerHeight

            // Calculate the absolute top position of the container relative to the document
            const absoluteTop = rect.top + scrollY

            // Calculate how far we've scrolled into this section
            // We want the animation to start when the container enters the viewport (or slightly before/after)
            // and end when we've scrolled through the scrollRange

            // Current scroll position relative to the start of the container
            const currentScroll = scrollY - absoluteTop + windowHeight * 0.5

            const progress = Math.min(1, Math.max(0, currentScroll / scrollRange))

            setScrollProgress(progress)
        }

        window.addEventListener("scroll", handleScroll)
        handleScroll() // Initial call
        return () => window.removeEventListener("scroll", handleScroll)
    }, [scrollRange])

    const currentCharIndex = scrollProgress * totalChars

    let charCounter = 0

    return (
        <div
            ref={containerRef}
            className={cn("relative", className)}
            style={{
                height: `${scrollRange}px`,
                marginTop: "144px",
                marginBottom: "144px"
                // Ensure container has height to scroll through
            }}
        >
            <div
                ref={stickyRef}
                style={{
                    position: "sticky",
                    top: "125px", // Stick a bit from top
                    width: "100%",
                    height: "600px", // Fixed height for the sticky container
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                {/* Changed to h4 to match blurb.tsx styling */}
                <h4 className="text-center max-w-[1107px] p-[24.6px]">
                    {segments.map((segment, segmentIndex) => {
                        if (segment.type === 'label') {
                            // Use home-blurb-item classes to match blurb.tsx
                            return (
                                <div key={segmentIndex} className={cn("home-blurb-item inline-block align-middle mr-2 mb-2", segment.className)} style={{ opacity: 1 }}>
                                    <span className="home-blurb-item__content">
                                        <span className="home-blurb-item__content--text">
                                            <span>{segment.content}</span>
                                        </span>
                                    </span>
                                </div>
                            )
                        }

                        const words = segment.content.split(/(\s+)/) // Split by whitespace but keep delimiters

                        return (
                            <span key={segmentIndex} className={cn("inline", segment.className)}>
                                {words.map((word, i) => {
                                    const startIdx = charCounter
                                    charCounter += word.length

                                    return (
                                        <Word
                                            key={i}
                                            word={word}
                                            startIndex={startIdx}
                                            currentCharIndex={currentCharIndex}
                                        />
                                    )
                                })}
                            </span>
                        )
                    })}
                </h4>
            </div>
        </div>
    )
}
