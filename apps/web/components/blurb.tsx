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

import { useScrollContainer } from "../../../packages/@aliveui"

export function Blurb() {
    const { scrollContainerRef } = useScrollContainer()
    const [scrollProgress, setScrollProgress] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const stickyRef = useRef<HTMLDivElement>(null)

    const text = `Your daily life revolves around `
    const text2 = `Get a suite`
    const text3 = ` and your hectic life.`

    // Calculate total characters for scroll range
    const totalChars = text.length + text2.length + text3.length
    const scrollRange = totalChars * 20 // 20px per character

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current
            const sticky = stickyRef.current
            if (!container || !sticky) return

            // const containerRect = container.getBoundingClientRect()
            // const stickyRect = sticky.getBoundingClientRect()

            const startY = container.offsetTop
            // const endY = startY + scrollRange

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
                                                <span>apps</span>
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
                                                <span>that actually fit you</span>
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
                                    <span className="home-blurb-item" style={{ opacity: 1, display: 'inline-block' }}>
                                        <span className="home-blurb-item__content">
                                            <span className="home-blurb-item__content--text">
                                                <span>no tutorial needed.</span>
                                            </span>
                                        </span>
                                    </span>
                                    {" "}
                                </p>
                            </div>
                        </h4>
                    </div>
                </div>
            </section>
        </div>
    )
}

