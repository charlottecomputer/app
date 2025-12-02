"use client"

import { motion, AnimatePresence } from "motion/react"

interface Project {
    id: string
    title: string
    category: string
    year: string
}

interface WorkListProps {
    projects: Project[]
    activeIndex: number
}

export function WorkList({ projects, activeIndex }: WorkListProps) {
    const project = projects[activeIndex]

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20  ">
            <div className="w-full max-w-6xl px-8   flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <div className="h-24 md:h-32 relative ">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={project.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            // className="absolute inset-0 flex items-center"
                            >
                                <h2 className="  text-6xl md:text-8xl leading-none whitespace-nowrap">
                                    {project.title}
                                </h2 >
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="h-6 relative ">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={project.id}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.2, delay: 0.05 }}
                                className="absolute inset-0 flex items-center"
                            >
                                <p className="font-mono text-sm opacity-60 uppercase tracking-wider">
                                    {project.category}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="h-6 relative overflow-hidden w-24">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={project.id}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="absolute inset-0 flex items-center justify-end"
                        >
                            <p className="font-mono text-sm opacity-60">
                                {project.year}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
