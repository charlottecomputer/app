"use client"

import { useState, useEffect } from "react"
import { createKeyResult, updateKeyResult } from "@/actions/key-results-actions"
import { Button, Input, Label, cn, IconPicker, Icon } from "@aliveui"
import { Plus, Check, X } from "lucide-react"
import { TaskRecurrencePicker } from "./task-recurrence-picker"
import { Recurrence } from "@/types/key-results"

const COLORS = [
    "#FF6B6B", // Red
    "#FF9F43", // Orange
    "#FDCB6E", // Yellow
    "#2ECC71", // Green
    "#1ABC9C", // Teal
    "#3498DB", // Blue
    "#9B59B6", // Purple
    "#E74C3C", // Dark Red
    "#FF8A65", // Salmon
    "#F4D03F", // Gold
    "#A2D9CE", // Light Teal
    "#82E0AA", // Light Green
    "#85C1E9", // Light Blue
    "#D7BDE2", // Light Purple
    "#A04000", // Brown
]


interface AddKeyResultFormProps {
    onSuccess?: () => void
    onCancel?: () => void
    defaultProjectId?: string
    initialData?: KeyResult
}

export function AddKeyResultForm({ onSuccess, onCancel, defaultProjectId, initialData }: AddKeyResultFormProps) {
    const [content, setContent] = useState("")
    const [emoji, setEmoji] = useState("todo")
    const [color, setColor] = useState(COLORS[0])
    const [mode, setMode] = useState<'single' | 'count'>('single')
    const [target, setTarget] = useState(1)
    const [unit, setUnit] = useState("times")
    const [recurrence, setRecurrence] = useState<Recurrence | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (initialData) {
            setContent(initialData.content)
            setEmoji(initialData.icon || "todo")
            setColor(initialData.color || COLORS[0])
            setMode((initialData.requiredTouches || 1) > 1 ? 'count' : 'single')
            setTarget(initialData.requiredTouches || 1)
            setUnit(initialData.unit || "times")
            setRecurrence(initialData.recurrence)
        }
    }, [initialData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setIsLoading(true)
        try {
            const commonData = {
                content,
                projectId: defaultProjectId,
                requiredTouches: mode === 'single' ? 1 : target,
                icon: emoji,
                unit,
                color,
                recurrence
            }

            let result;
            if (initialData) {
                result = await updateKeyResult({
                    keyResultId: initialData.keyResultId,
                    ...commonData
                })
            } else {
                result = await createKeyResult(commonData)
            }

            if (result.success) {
                if (!initialData) {
                    setContent("")
                    setTarget(1)
                }
                onSuccess?.()
            } else {
                console.error("Operation failed:", result.error)
                alert(`Failed to save: ${result.error}`)
            }
        } catch (error) {
            console.error("Failed to save habit:", error)
            alert("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6">
                {/* Name & Emoji */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">What you want to do</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Example</span>
                            <Icon icon="todo" className="w-6 h-6" />
                        </div>
                    </div>

                    <div
                        className="flex items-center gap-3 p-4 rounded-2xl transition-colors"
                        style={{ backgroundColor: color + "40" }} // 25% opacity
                    >
                        <div className="relative group w-12">
                            <IconPicker
                                value={emoji}
                                onChange={setEmoji}
                            />
                        </div>
                        <Input
                            autoFocus
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Name your habit..."
                            className="flex-1 bg-transparent border-none text-lg font-medium placeholder:text-foreground/50 focus-visible:ring-0 px-0 h-auto"
                        />
                    </div>
                </div>

                {/* Color Picker */}
                <div className="space-y-2">
                    <div className="grid grid-cols-8 gap-3">
                        {COLORS.map((c) => (
                            <button
                                key={c}
                                type="button"
                                className={cn(
                                    "w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2",
                                    color === c && "ring-2 ring-offset-2 ring-black dark:ring-white scale-110"
                                )}
                                style={{ backgroundColor: c }}
                                onClick={() => setColor(c)}
                            />
                        ))}
                    </div>
                </div>

                {/* Target */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Target</Label>
                        <div className="flex bg-muted rounded-lg p-1">
                            <button
                                type="button"
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                    mode === 'single' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                                )}
                                onClick={() => setMode('single')}
                            >
                                Single Punch
                            </button>
                            <button
                                type="button"
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                    mode === 'count' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                                )}
                                onClick={() => setMode('count')}
                            >
                                Count Times
                            </button>
                        </div>
                    </div>

                    {mode === 'count' && (
                        <div className="p-4 bg-muted/30 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Set Target</Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-primary">{target}</span>
                                    <span className="text-sm text-muted-foreground">{unit}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    value={target}
                                    onChange={(e) => setTarget(parseInt(e.target.value) || 1)}
                                    className="flex-1"
                                    min={1}
                                />
                                <Input
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    placeholder="Unit (e.g. times)"
                                    className="w-24"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                0 or not set, then automatic cumulative times
                            </p>
                        </div>
                    )}
                </div>

                {/* Recurrence */}
                <div className="space-y-2">
                    <Label className="text-base font-semibold">Frequency</Label>
                    <div className="flex items-center gap-2">
                        <TaskRecurrencePicker
                            recurrence={recurrence}
                            onRecurrenceChange={setRecurrence}
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 flex gap-2 mt-auto">
                <Button type="submit" className="flex-1 h-12 text-lg font-medium" disabled={isLoading || !content.trim()}>
                    {isLoading ? (initialData ? "Saving..." : "Creating...") : (initialData ? "Save Changes" : "Create Habit")}
                </Button>
            </div>
        </form>
    )
}
