"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "motion/react"
import { cn } from "@aliveui"
import { updateTodoProgress } from "@/actions/todo-actions"

interface TodoSquareProps {
    todoId: string
    content: string
    emoji?: string
    requiredTouches?: number
    currentTouches?: number
    completed: boolean
    onClick?: () => void
}

export function TodoSquare({
    todoId,
    content,
    emoji = "📝",
    requiredTouches = 1,
    currentTouches = 0,
    completed,
    onClick
}: TodoSquareProps) {
    const [touches, setTouches] = useState(currentTouches)
    const [isCompleted, setIsCompleted] = useState(completed)
    const controls = useAnimation()

    useEffect(() => {
        setTouches(currentTouches)
        setIsCompleted(completed)
    }, [currentTouches, completed])

    const handleInteraction = async () => {
        if (isCompleted) return

        const newTouches = touches + 1
        setTouches(newTouches)

        // Liquid fill animation trigger
        controls.start({
            scale: [1, 0.95, 1.05, 1],
            transition: { duration: 0.3 }
        })

        if (newTouches >= requiredTouches) {
            setIsCompleted(true)
            await updateTodoProgress(todoId, newTouches, true)
        } else {
            await updateTodoProgress(todoId, newTouches, false)
        }

        if (onClick) onClick()
    }

    const fillPercentage = Math.min((touches / requiredTouches) * 100, 100)

    return (
        <motion.button
            animate={controls}
            onClick={handleInteraction}
            className={cn(
                "relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-border bg-background transition-colors hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring",
                isCompleted && "border-primary opacity-50 cursor-default"
            )}
        >
            {/* Liquid Fill */}
            <div
                className="absolute bottom-0 left-0 w-full bg-primary/20 transition-all duration-500 ease-out"
                style={{ height: `${fillPercentage}%` }}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 z-10">
                <span className="text-2xl mb-1 select-none">{emoji}</span>
                <span className="text-xs font-medium text-center line-clamp-2 leading-tight text-foreground/80 select-none">
                    {content}
                </span>
            </div>

            {/* Touch Counter (if multi-touch) */}
            {requiredTouches > 1 && !isCompleted && (
                <div className="absolute top-1 right-2 text-[10px] text-muted-foreground font-mono">
                    {touches}/{requiredTouches}
                </div>
            )}
        </motion.button>
    )
}
