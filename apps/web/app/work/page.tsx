"use client"

import { useRef, useState, useEffect } from "react"
import { useScroll, useMotionValueEvent } from "motion/react"
import { Navigation, useScrollContainer } from "@aliveui"
import { WorkClock } from "../../components/work-clock"
import { WorkList } from "../../components/work-list"

import { Calendar, Coffee, ListTodo, KanbanSquare, CheckSquare, Map, FileText, Dumbbell, Utensils, BookOpen, LucideIcon } from "lucide-react"

interface Project {
    id: string
    title: string
    category: string
    year: string
    image: string
    bg: string
    icon: LucideIcon
    time: number // Hour of the day (0-23)
}

const projects: Project[] = [
    { id: "1", title: "Calendar", category: "Wake Up", year: "7:00 AM", image: "/static/media/ab/0.jpg", bg: "#E0E0E0", icon: Calendar, time: 7 },
    { id: "2", title: "Coffee", category: "Morning Brew", year: "8:00 AM", image: "/static/media/ab/0.jpg", bg: "#D8D8D8", icon: Coffee, time: 8 },
    { id: "3", title: "Todo", category: "Daily Plan", year: "9:00 AM", image: "/static/media/ab/0.jpg", bg: "#F0F0F0", icon: ListTodo, time: 9 },
    { id: "4", title: "Planner", category: "New Project", year: "10:00 AM", image: "/static/media/ab/0.jpg", bg: "#E5E5E5", icon: KanbanSquare, time: 10 },
    { id: "5", title: "Todo", category: "Check-in", year: "12:00 PM", image: "/static/media/ab/0.jpg", bg: "#CCCCCC", icon: CheckSquare, time: 12 },
    { id: "6", title: "Roadmap", category: "Progress", year: "2:00 PM", image: "/static/media/ab/0.jpg", bg: "#D4D4D4", icon: Map, time: 14 },
    { id: "7", title: "Notion", category: "Documentation", year: "4:00 PM", image: "/static/media/ab/0.jpg", bg: "#DDDDDD", icon: FileText, time: 16 },
    { id: "8", title: "Gym", category: "Workout", year: "6:00 PM", image: "/static/media/ab/0.jpg", bg: "#EEEEEE", icon: Dumbbell, time: 18 },
    { id: "9", title: "Recipe", category: "Dinner", year: "7:00 PM", image: "/static/media/ab/0.jpg", bg: "#E8E8E8", icon: Utensils, time: 19 },
    { id: "10", title: "Journal", category: "Reflect", year: "10:00 PM", image: "/static/media/ab/0.jpg", bg: "#F5F5F5", icon: BookOpen, time: 22 },
]

export default function WorkPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollContainerRef } = useScrollContainer()

    // Increase scroll distance to allow for more rotations if needed
    const { scrollYProgress } = useScroll({
        target: containerRef,
        container: scrollContainerRef,
        offset: ["start start", "end end"]
    })

    const [activeIndex, setActiveIndex] = useState(0)

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Range: 7:00 AM (7) to 10:00 PM (22)
        // Total duration: 15 hours
        const currentHour = 7 + (latest * 15)

        // Find the project that is closest to the current hour, 
        // but only if we have reached its time? 
        // Or just simple segments?

        // Let's find the project with the largest time <= currentHour
        // But since projects are sorted by time, we can just findLastIndex?
        // Or just iterate.

        let newActiveIndex = 0
        for (let i = 0; i < projects.length; i++) {
            if (projects[i] && currentHour >= projects[i].time - 0.5) { // Buffer of 30 mins
                newActiveIndex = i
            }
        }

        if (newActiveIndex !== activeIndex) {
            setActiveIndex(newActiveIndex)
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

                <WorkClock scrollYProgress={scrollYProgress} projects={projects} activeIndex={activeIndex} rotations={1} useScrollTime={true} />
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
