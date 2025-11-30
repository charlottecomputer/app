"use client"

import { useEffect, useState, useRef } from "react"

interface CharProps {
    char: string
    opacity: number
}

function Char({ char, opacity }: CharProps) {
    return (
        <div
            className="char"
            style={{
                position: "relative",
                display: "inline-block",
                opacity: Math.max(0.25, Math.min(1, opacity))
            }}
        >
            {char}
        </div>
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
        <div style={{ position: "relative", display: "inline-block" }}>
            {word.split("").map((char, i) => {
                const charIndex = startIndex + i
                const progress = (currentCharIndex - charIndex) / 20 + 1
                return <Char key={i} char={char} opacity={progress} />
            })}
        </div>
    )
}

export function Blurb() {
    const [scrollProgress, setScrollProgress] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const text = `is reinventing mobile apps. We craft and curate `
    const text2 = ` with an emphasis on excellent, elegant, and ethical design. For users lost in a sea of dark patterns, we aspire to be a beacon of light. `
    const text3 = ` to build different.`

    // Calculate total characters for scroll range
    const totalChars = text.length + text2.length + text3.length
    const scrollRange = totalChars * 20 // 20px per character

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current
            if (!container) return

            const rect = container.getBoundingClientRect()
            const containerTop = container.offsetTop
            const scrollY = window.scrollY

            // Calculate how far we've scrolled into this section
            const scrollIntoView = scrollY - containerTop + window.innerHeight * 0.2
            const progress = Math.min(1, Math.max(0, scrollIntoView / scrollRange))

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
                className="home-blurb layout-fh"
                style={{
                    position: scrollProgress > 0 && scrollProgress < 1 ? "fixed" : "absolute",
                    top: scrollProgress >= 1 ? "auto" : "125px",
                    bottom: scrollProgress >= 1 ? "0" : "auto",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "100vw",
                    maxWidth: "1107px",
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
                                    <div className="home-blurb-item" style={{ opacity: 1 }}>
                                        <span className="home-blurb-item__content">
                                            <span className="home-blurb-item__content--text">
                                                <span>Applause</span>
                                            </span>
                                        </span>
                                    </div>
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
                                </p>
                                <p>
                                    <div className="home-blurb-item" style={{ opacity: 1 }}>
                                        <span className="home-blurb-item__content">
                                            <span className="home-blurb-item__content--text">
                                                <span>brands</span>
                                            </span>
                                        </span>
                                    </div>
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
                                </p>
                                <p>
                                    <div className="home-blurb-item" style={{ opacity: 1 }}>
                                        <span className="home-blurb-item__content">
                                            <span className="home-blurb-item__content--text">
                                                <span>Join us</span>
                                            </span>
                                        </span>
                                    </div>
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
