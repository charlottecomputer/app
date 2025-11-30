"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from "motion/react"

interface Project {
    id: string
    title: string
    category: string
    image: string
    year: string
}

const projects: Project[] = [
    {
        id: "1",
        title: "Reinventing the Wheel",
        category: "Product Design",
        image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop",
        year: "2024"
    },
    {
        id: "2",
        title: "Digital Oasis",
        category: "Web Development",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        year: "2023"
    },
    {
        id: "3",
        title: "Abstract Reality",
        category: "Art Direction",
        image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop",
        year: "2023"
    },
    {
        id: "4",
        title: "Modern Architecture",
        category: "Photography",
        image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=2574&auto=format&fit=crop",
        year: "2022"
    },
    {
        id: "5",
        title: "Neon Nights",
        category: "Branding",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
        year: "2022"
    }
]

export function WorkSlider() {
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [constraints, setConstraints] = useState({ left: 0, right: 0 })
    const x = useMotionValue(0)

    useEffect(() => {
        const updateConstraints = () => {
            if (containerRef.current && contentRef.current) {
                const containerWidth = containerRef.current.offsetWidth
                const contentWidth = contentRef.current.scrollWidth
                // We want to drag from 0 to -(contentWidth - containerWidth)
                // But we have padding-left of 20vw, so we start at 0?
                // Let's just measure the scrollWidth vs clientWidth
                setConstraints({ left: -(contentWidth - containerWidth), right: 0 })
            }
        }

        updateConstraints()
        window.addEventListener('resize', updateConstraints)
        return () => window.removeEventListener('resize', updateConstraints)
    }, [])

    return (
        <div ref={containerRef} className="w-full h-full overflow-hidden bg-[#f7f7f7] cursor-grab active:cursor-grabbing">
            <motion.div
                ref={contentRef}
                className="flex gap-[10vw] px-[20vw] h-full items-center"
                drag="x"
                dragConstraints={constraints}
                style={{ x }}
            >
                {projects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        className="shrink-0 w-[60vw] h-[70vh] relative flex flex-col justify-end group"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="absolute inset-0 overflow-hidden rounded-lg shadow-2xl">
                            <motion.img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover pointer-events-none"
                                initial={{ scale: 1.2 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                        </div>

                        <div className="relative z-10 p-8 text-white mix-blend-difference pointer-events-none">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <p className="font-mono text-sm mb-2 opacity-80">{project.category} — {project.year}</p>
                                <h2 className="font-serif text-6xl md:text-8xl leading-[0.9]">{project.title}</h2>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="fixed bottom-8 left-8 z-50 mix-blend-difference text-white pointer-events-none">
                <p className="font-mono text-sm">DRAG TO EXPLORE</p>
            </div>
        </div>
    )
}
