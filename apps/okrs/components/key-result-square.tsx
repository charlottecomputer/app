"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import confetti from "canvas-confetti"
import { cn, Icon } from "@aliveui"
import { updateKeyResult, deleteKeyResult } from "@/actions/key-results-actions"
import { KeyResult, Objective } from "@/types/key-results"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    Badge,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@aliveui"
import { Plus, Check, X, Pencil, Trash, Flag, ChevronDown, MoreHorizontal, Repeat } from "lucide-react"
import { EditKeyResultDrawer } from "./edit-key-result-drawer"
import { getRecurrenceLabel } from "@/lib/recurrence"

interface KeyResultSquareProps extends KeyResult {
    objectives?: Objective[]
    onClick?: () => void
}

export function KeyResultSquare({ objectives = [], onClick, ...keyResult }: KeyResultSquareProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [clicks, setClicks] = useState<{ id: number; x: number; y: number; text: string }[]>([])

    const requiredTouches = keyResult.requiredTouches || 1
    const currentTouches = keyResult.currentTouches || 0
    const progress = Math.min(currentTouches / requiredTouches, 1) * 100
    const isCompleted = keyResult.completed

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

                await updateKeyResult({
                    keyResultId: keyResult.keyResultId,
                    completed: true,
                    currentTouches: newTouches
                })
            } else {
                await updateKeyResult({
                    keyResultId: keyResult.keyResultId,
                    currentTouches: newTouches
                })
            }
        } catch (error) {
            console.error("Failed to update keyResult:", error)
        }
    }

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
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                            "relative flex flex-col p-4 rounded-3xl bg-card border shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer select-none group",
                            "w-full sm:w-[200px] h-[200px] space-y-3 justify-between", // Fixed size for square look
                            isCompleted && "opacity-70"
                        )}
                        onClick={handleTouch}
                    >
                        {/* Liquid Fill Animation */}
                        <div
                            className={cn(
                                "absolute bottom-0 left-0 right-0 bg-primary/10 transition-all duration-500 ease-out pointer-events-none",
                                isCompleted && "bg-primary/20"
                            )}
                            style={{ height: `${progress}%` }}
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

                        {/* Header */}
                        <div className="relative z-10 flex items-start justify-between gap-2">
                            <Icon icon={keyResult.icon} className="text-3xl"/>
                            <div className="flex gap-1 items-center">
                                {keyResult.priority && (
                                    <Flag className={`w-4 h-4 ${getPriorityColor(keyResult.priority)}`} />
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            onClick={(e) => e.stopPropagation()}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded-full outline-none focus:opacity-100"
                                        >
                                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation()
                                            setIsEditing(true)
                                        }}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={async (e) => {
                                                e.stopPropagation()
                                                if (confirm("Are you sure you want to delete this keyResult?")) {
                                                    await deleteKeyResult(keyResult.keyResultId)
                                                }
                                            }}
                                        >
                                            <Trash className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                {keyResult.recurrence && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                                        <Repeat className="w-3 h-3" />
                                        <span>{getRecurrenceLabel(keyResult.recurrence)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col gap-1 flex-1 justify-center">
                            <h3 className={cn("font-semibold text-lg leading-tight line-clamp-3", isCompleted && "line-through text-muted-foreground")}>
                                {keyResult.content}
                            </h3>
                        
                        </div>

                        {/* Footer / Progress */}
                        <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground font-mono">
                           
                           <div> <span>{currentTouches} / {requiredTouches}</span>
                            {requiredTouches > 1 && <span>{Math.round(progress)}%</span>}
                            </div>

                                {keyResult.recurrence && (
                                <div className="flex items-center gap-1">
                                    <Badge variant="secondary" className="text-[10px] px-1.5 h-5 font-normal">
                                        {keyResult.recurrence.type === 'weekly' && keyResult.frequency
                                            ? keyResult.frequency.length === 7
                                                ? 'Daily'
                                                : keyResult.frequency.length === 5 && !keyResult.frequency.includes(0) && !keyResult.frequency.includes(6)
                                                    ? 'Weekdays'
                                                    : `${keyResult.frequency.length} days/wk`
                                            : keyResult.recurrence.type}
                                    </Badge>
                                </div>
                            )}
                        </div>

                    </motion.div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={() => setIsEditing(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </ContextMenuItem>
                    <ContextMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={async () => {
                            if (confirm("Are you sure you want to delete this keyResult?")) {
                                await deleteKeyResult(keyResult.keyResultId)
                            }
                        }}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

            <EditKeyResultDrawer
                keyResult={keyResult}
                open={isEditing}
                onOpenChange={setIsEditing}
            />
        </>
    )
}
