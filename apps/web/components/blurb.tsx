"use client"

import { useEffect, useState, useRef } from "react"

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

export function Blurb() {
    const [scrollProgress, setScrollProgress] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const stickyRef = useRef<HTMLDivElement>(null)

    const text = `is reinventing mobile apps. We craft and curate `
    const text2 = ` with an emphasis on excellent, elegant, and ethical design. For users lost in a sea of dark patterns, we aspire to be a beacon of light. `
    const text3 = ` to build different.`

    // Calculate total characters for scroll range
    const totalChars = text.length + text2.length + text3.length
    const scrollRange = totalChars * 20 // 20px per character

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current
            const sticky = stickyRef.current
            if (!container || !sticky) return

            const containerRect = container.getBoundingClientRect()
            const stickyRect = sticky.getBoundingClientRect()

            // Calculate progress based on how far the container has scrolled past the sticky element
            // When container top hits the top of the viewport (or offset), progress starts
            // When container bottom hits the bottom of the sticky element, progress ends

            const startY = container.offsetTop
            const endY = startY + scrollRange
            const scrollY = window.scrollY

            // We want the animation to happen while the element is sticky
            // The element becomes sticky when scrollY >= startY - topOffset
            // And stops being sticky when scrollY >= endY - windowHeight + bottomOffset

            // Simplified: map the scroll position within the container's height to 0-1
            // We add some buffer so it starts/ends smoothly

            const progress = Math.min(1, Math.max(0, (scrollY - startY + window.innerHeight * 0.5) / scrollRange))

            setScrollProgress(progress)
        }

        window.addEventListener("scroll", handleScroll)
        handleScroll() // Initial call
        return () => window.removeEventListener("scroll", handleScroll)
    }, [scrollRange])

    const currentCharIndex = Math.floor(scrollProgress * totalChars)

    const words1 = text.split(" ")
    const words2 = text2.split(" ")
    const words3 = text3.split(" ")

    let charCounter = 0

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                height: `${scrollRange}px`,
                marginTop: "144px",
                marginBottom: "144px"
            }}
        >
            <section
                ref={stickyRef}
                className="home-blurb layout-fh"
                style={{
                    position: "sticky",
                    top: "125px",
                    left: "0",
                    width: "100%",
                    height: "600px",
                    margin: 0,
                    padding: "24.6px",
                    boxSizing: "border-box",
                    zIndex: 10,
                }}
            >
                <div className="layout-grid">
                    <div className="home-blurb__content layout-block">
                        <h4>
                            <div className="storyblok-content body">
                                <p>
                                    <span className="home-blurb-item" style={{ opacity: 1, display: 'inline-block' }}>
                                        <span className="home-blurb-item__content">
                                            <span className="home-blurb-item__content--text">
                                                <span>charlotte.computer</span>
                                            </span>
                                        </span>
                                    </span>
                                    {" "}
                                    {words1.map((word, i) => {
                                        const startIdx = charCounter
                                        charCounter += word.length
                                        const element = (
                                            <>
                                                <Word
                                                    key={i}
                                                    word={word}
                                                    startIndex={startIdx}
                                                    currentCharIndex={currentCharIndex}
                                                    totalChars={totalChars}
                                                />
                                                {i < words1.length - 1 && " "}
                                            </>
                                        )
                                        charCounter += 1 // space
                                        return element
                                    })}
                                    <span className="home-blurb-item" style={{ opacity: 1, display: 'inline-block', justifyContent: 'center', alignItems: 'center' }}>
                                        <span className="home-blurb-item__content">
                                            <span className="home-blurb-item__content--text">
                                                <span>brands</span>
                                            </span>
                                        </span>
                                    </span>
                                    {" "}
                                    {words2.map((word, i) => {
                                        const startIdx = charCounter
                                        charCounter += word.length
                                        const element = (
                                            <>
                                                <Word
                                                    key={i}
                                                    word={word}
                                                    startIndex={startIdx}
                                                    currentCharIndex={currentCharIndex}
                                                    totalChars={totalChars}
                                                />
                                                {i < words2.length - 1 && " "}
                                            </>
                                        )
                                        charCounter += 1 // space
                                        return element
                                    })}
                                    <span className="home-blurb-item" style={{ opacity: 1, display: 'inline-block' }}>
                                        <span className="home-blurb-item__content">
                                            <span className="home-blurb-item__content--text">
                                                <span>Join us</span>
                                            </span>
                                        </span>
                                    </span>
                                    {" "}
                                    {words3.map((word, i) => {
                                        const startIdx = charCounter
                                        charCounter += word.length
                                        const element = (
                                            <>
                                                <Word
                                                    key={i}
                                                    word={word}
                                                    startIndex={startIdx}
                                                    currentCharIndex={currentCharIndex}
                                                    totalChars={totalChars}
                                                />
                                                {i < words3.length - 1 && " "}
                                            </>
                                        )
                                        charCounter += 1 // space
                                        return element
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

