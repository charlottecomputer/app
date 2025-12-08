"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import confetti from "canvas-confetti"
import { cn } from "@aliveui"
import { deleteTask, updateSubtask, updateTask, createSubtask } from "@/actions/todo-actions"
import { Project, Task, Subtask } from "@/types/todo"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@aliveui"
import { Pencil, Trash, Flag, Repeat, Plus } from "lucide-react"
import { EditTaskDialog } from "./edit-task-dialog"

interface TodoSquareProps extends Task {
    projects?: Project[]
    hideSubtasks?: boolean
    onClick?: () => void
}

function SubtaskItem({ subtask, onUpdate }: { subtask: Subtask; onUpdate: () => void }) {
    const [clicks, setClicks] = useState<{ id: number; x: number; y: number; text: string }[]>([])

    const requiredTouches = subtask.requiredTouches || 1
    const currentTouches = subtask.currentTouches || 0
    const progress = Math.min(currentTouches / requiredTouches, 1) * 100
    const isCompleted = subtask.completed

    const handleTouch = async (e: React.MouseEvent) => {
        if (isCompleted) return

        e.stopPropagation()

        // Add floating click effect
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const id = Date.now()

        setClicks(prev => [...prev, { id, x, y, text: "+1" }])
        setTimeout(() => {
            setClicks(prev => prev.filter(c => c.id !== id))
        }, 1000)

        const newTouches = currentTouches + 1

        try {
            if (newTouches >= requiredTouches) {
                // Trigger confetti
                const centerRect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                const centerX = centerRect.left + centerRect.width / 2
                const centerY = centerRect.top + centerRect.height / 2

                confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: {
                        x: centerX / window.innerWidth,
                        y: centerY / window.innerHeight
                    },
                    colors: ['#FFD700', '#FFA500', '#FF4500', '#32CD32', '#1E90FF'],
                    disableForReducedMotion: true,
                    zIndex: 1000,
                })

                await updateSubtask({
                    subtaskId: subtask.subtaskId,
                    taskId: subtask.taskId,
                    completed: true,
                    currentTouches: newTouches
                })
            } else {
                await updateSubtask({
                    subtaskId: subtask.subtaskId,
                    taskId: subtask.taskId,
                    currentTouches: newTouches
                })
            }
            onUpdate()
        } catch (error) {
            console.error("Failed to update subtask:", error)
        }
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative h-12 w-full rounded-xl overflow-hidden cursor-pointer select-none border border-border/50 bg-muted/50 mb-2",
                "hover:border-primary/20 transition-colors",
                isCompleted && "opacity-80"
            )}
            onClick={handleTouch}
        >
            {/* Liquid Fill Animation */}
            <div
                className={cn(
                    "absolute bottom-0 left-0 top-0 bg-primary/20 transition-all duration-500 ease-out",
                    isCompleted && "bg-primary/30"
                )}
                style={{ width: `${progress}%` }}
            />

            {/* Floating Clicks */}
            <AnimatePresence>
                {clicks.map(click => (
                    <motion.div
                        key={click.id}
                        initial={{ opacity: 1, y: click.y, x: click.x, scale: 0.5 }}
                        animate={{ opacity: 0, y: click.y - 40, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute pointer-events-none text-primary font-black text-lg z-50"
                        style={{ left: 0, top: 0, textShadow: "0 1px 0 rgba(255,255,255,0.5)" }}
                    >
                        {click.text}
                    </motion.div>
                ))}
            </AnimatePresence>

            <div className="relative z-10 h-full flex items-center justify-between px-3">
                <div className="flex items-center gap-2 overflow-hidden">
                    {subtask.emoji && <span className="text-lg">{subtask.emoji}</span>}
                    <span className={cn("text-sm font-medium truncate", isCompleted && "line-through text-muted-foreground")}>
                        {subtask.content}
                    </span>
                </div>
                <span className="text-xs text-muted-foreground font-mono shrink-0 ml-2">
                    {currentTouches}/{requiredTouches}
                </span>
            </div>
        </motion.div>
    )
}

export function TodoSquare({ projects = [], hideSubtasks = false, onClick, ...task }: TodoSquareProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isAddingSubtask, setIsAddingSubtask] = useState(false)
    const [newSubtaskContent, setNewSubtaskContent] = useState("")
    const [newSubtaskTouches, setNewSubtaskTouches] = useState(1)

    // If no subtasks, maybe treat the task itself as a single subtask visually?
    // Or just show "No subtasks".
    // For now, let's render the subtasks list.
    const subtasks = task.subtasks || []
    const allCompleted = subtasks.length > 0 && subtasks.every(s => s.completed)

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'high': return 'text-red-500'
            case 'medium': return 'text-yellow-500'
            case 'low': return 'text-blue-500'
            default: return 'text-muted-foreground'
        }
    }

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <div
                        onClick={onClick}
                        className={cn(
                            "relative flex flex-col p-4 rounded-3xl bg-card border shadow-sm hover:shadow-md transition-all",
                            "w-full h-auto min-h-[160px] space-y-3",
                            allCompleted && "opacity-70",
                            onClick && "cursor-pointer hover:border-primary/50"
                        )}>
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="text-2xl">{task.emoji || "📝"}</div>
                                <div className="flex flex-col">
                                    <h3 className={cn("font-semibold leading-tight", allCompleted && "line-through text-muted-foreground")}>
                                        {task.content}
                                    </h3>
                                    <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                        {task.priority && (
                                            <Flag className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
                                        )}
                                        {task.recurrence && (
                                            <div className="flex items-center gap-1">
                                                <Repeat className="w-3 h-3" />
                                                <span>{task.recurrence.type}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subtasks List - Only show if not hidden */}
                        {!hideSubtasks && (
                            <div className="flex-1 flex flex-col justify-end">
                                {subtasks.length > 0 && (
                                    subtasks.map(sub => (
                                        <SubtaskItem
                                            key={sub.subtaskId}
                                            subtask={sub}
                                            onUpdate={() => {
                                                // Optimistic update or revalidate handled by action
                                            }}
                                        />
                                    ))
                                )}

                                {/* Inline Add Subtask */}
                                {isAddingSubtask ? (
                                    <div className="relative h-12 w-full rounded-xl overflow-hidden border border-dashed border-primary/50 bg-muted/30 flex items-center px-3 gap-2">
                                        <input
                                            autoFocus
                                            className="bg-transparent border-none outline-none flex-1 text-sm placeholder:text-muted-foreground"
                                            placeholder="Type subtask..."
                                            value={newSubtaskContent}
                                            onChange={(e) => setNewSubtaskContent(e.target.value)}
                                            onKeyDown={async (e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    if (!newSubtaskContent.trim()) {
                                                        setIsAddingSubtask(false)
                                                        return
                                                    }

                                                    try {
                                                        // Simple rotation for emoji
                                                        const emojis = ["🍎", "💧", "📚", "🏃", "🧘", "💊", "💻", "🧹"]
                                                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]

                                                        await createSubtask(task.taskId, newSubtaskContent, newSubtaskTouches, randomEmoji)
                                                        setNewSubtaskContent("")
                                                        setNewSubtaskTouches(1)
                                                        setIsAddingSubtask(false)
                                                    } catch (error) {
                                                        console.error("Failed to create subtask", error)
                                                    }
                                                } else if (e.key === 'Escape') {
                                                    setIsAddingSubtask(false)
                                                }
                                            }}
                                            onBlur={() => {
                                                // Optional: save on blur or just cancel
                                                // setIsAddingSubtask(false)
                                            }}
                                        />
                                        <div className="flex items-center gap-1 border-l pl-2 border-border/50">
                                            <span className="text-xs text-muted-foreground">Clicks:</span>
                                            <input
                                                type="number"
                                                className="w-12 bg-transparent border-none outline-none text-sm text-right"
                                                value={newSubtaskTouches}
                                                min={1}
                                                onChange={(e) => setNewSubtaskTouches(parseInt(e.target.value) || 1)}
                                                onKeyDown={async (e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault()
                                                        if (!newSubtaskContent.trim()) {
                                                            setIsAddingSubtask(false)
                                                            return
                                                        }

                                                        try {
                                                            const emojis = ["🍎", "💧", "📚", "🏃", "🧘", "💊", "💻", "🧹"]
                                                            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]

                                                            await createSubtask(task.taskId, newSubtaskContent, newSubtaskTouches, randomEmoji)
                                                            setNewSubtaskContent("")
                                                            setNewSubtaskTouches(1)
                                                            setIsAddingSubtask(false)
                                                        } catch (error) {
                                                            console.error("Failed to create subtask", error)
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation() // Prevent context menu or other clicks
                                            setIsAddingSubtask(true)
                                        }}
                                        className="relative h-12 w-full rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-muted/50 transition-colors flex items-center justify-center text-muted-foreground hover:text-primary group"
                                    >
                                        <Plus className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Show count if hidden */}
                        {hideSubtasks && subtasks.length > 0 && (
                            <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="flex -space-x-2">
                                    {subtasks.slice(0, 3).map(s => (
                                        <div key={s.subtaskId} className="w-6 h-6 rounded-full bg-muted border border-card flex items-center justify-center text-xs">
                                            {s.emoji}
                                        </div>
                                    ))}
                                    {subtasks.length > 3 && (
                                        <div className="w-6 h-6 rounded-full bg-muted border border-card flex items-center justify-center text-[10px]">
                                            +{subtasks.length - 3}
                                        </div>
                                    )}
                                </div>
                                <span>{subtasks.filter(s => s.completed).length}/{subtasks.length} subtasks</span>
                            </div>
                        )}
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={() => setIsEditing(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Task
                    </ContextMenuItem>
                    <ContextMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={async () => {
                            if (confirm("Are you sure you want to delete this task?")) {
                                await deleteTask(task.taskId)
                            }
                        }}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Task
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

            <EditTaskDialog
                task={task} // Pass task instead of todo
                projects={projects}
                open={isEditing}
                onOpenChange={setIsEditing}
            />
        </>
    )
}
