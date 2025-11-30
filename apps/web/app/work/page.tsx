"use client"

import { useRef, useState, useEffect } from "react"
import { useScroll, useMotionValueEvent } from "motion/react"
import { Navigation } from "@aliveui"
import { WorkClock } from "../../components/work-clock"
import { WorkList } from "../../components/work-list"

const projects = [
    { id: "1", title: "Calendar", category: "Productivity", year: "Check your schedule for today", image: "/static/media/ab/0.jpg", bg: "#E0E0E0" },
    { id: "2", title: "Todo", category: "Productivity", year: "Create a list of tasks for today", image: "/static/media/ab/0.jpg", bg: "#D8D8D8" },
    { id: "3", title: "Projects", category: "Safer Everyday", year: "2024", image: "/static/media/ab/0.jpg", bg: "#F0F0F0" },
    { id: "4", title: "Documents", category: "Carlos Alcaraz", year: "2023", image: "/static/media/ab/0.jpg", bg: "#E5E5E5" },
    { id: "5", title: "Journal", category: "GHO", year: "2022", image: "/static/media/ab/0.jpg", bg: "#CCCCCC" },
    { id: "6", title: "Augen Pro", category: "AI Wearables", year: "2024", image: "/static/media/ab/0.jpg", bg: "#D4D4D4" },
    { id: "7", title: "Kriss.ai", category: "AI Sales Tool", year: "2024", image: "/static/media/ab/0.jpg", bg: "#DDDDDD" },
    { id: "8", title: "Recipe App", category: "Ovechkin800", year: "2022", image: "/static/media/ab/0.jpg", bg: "#EEEEEE" },
    { id: "9", title: "Aave", category: "Dumpling.FM", year: "2022", image: "/static/media/ab/0.jpg", bg: "#E8E8E8" },
    { id: "10", title: "Madklubben", category: "Restaurant Portal", year: "2022", image: "/static/media/ab/0.jpg", bg: "#F5F5F5" },
    { id: "11", title: "Aave", category: "Dumpling.TV", year: "2022", image: "/static/media/ab/0.jpg", bg: "#DFDFDF" },
    { id: "12", title: "Journal", category: "The Ever Grid", year: "2022", image: "/static/media/ab/0.jpg", bg: "#D0D0D0" },
]

export default function WorkPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    // Increase scroll distance to allow for more rotations if needed
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const [activeIndex, setActiveIndex] = useState(0)

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // 12 projects = 30 degrees per project.
        // We want 1 full rotation to cover all 12 projects.
        // So 0-1 scroll = 0-360 degrees (or multiples).

        const totalRotations = 1
        const degrees = latest * 360 * totalRotations
        // Add a small offset to ensure it snaps at the right moment? 
        // Actually, floor(degrees / 30) is correct for 0-30 -> index 0, 30-60 -> index 1.
        const step = Math.floor(degrees / 30)

        // Modulo to loop through projects
        const index = step % projects.length

        if (index !== activeIndex) {
            setActiveIndex(index)
        }
    })

    return (
        <div ref={containerRef} className="relative h-[2000vh]">
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Dynamic Background Layer */}
                <div
                    className="absolute inset-0 z-0 transition-colors duration-700 ease-in-out"
                    style={{ backgroundColor: projects[activeIndex]?.bg || '#f7f7f7' }}
                />

                <WorkClock scrollYProgress={scrollYProgress} totalProjects={projects.length} rotations={1} />
                <WorkList projects={projects} activeIndex={activeIndex} />

                {/* Counter */}
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-50 mix-blend-difference text-white font-mono text-sm">
                    <span className="text-xl md:text-2xl font-bold block">
                        {String(activeIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="opacity-50">
                        / {projects.length}
                    </span>
                </div>
            </div>
        </div>
    )
}
