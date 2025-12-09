"use client"

import { useState } from "react"
import { createOrphanSubtask } from "@/actions/todo-actions"
import { Button, Input, Label, cn } from "@aliveui"
import { Plus, Check, X } from "lucide-react"

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

const EMOJIS = ["🍎", "💧", "📚", "🏃", "🧘", "💊", "💻", "🧹", "🏋️", "🎨", "🎸", "📝"]

export function AddHabitForm({ onSuccess, onCancel }: { onSuccess?: () => void, onCancel?: () => void }) {
    const [content, setContent] = useState("")
    const [emoji, setEmoji] = useState("🍎")
    const [color, setColor] = useState(COLORS[0])
    const [mode, setMode] = useState<'single' | 'count'>('single')
    const [target, setTarget] = useState(1)
    const [unit, setUnit] = useState("times")
    const [frequency, setFrequency] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]) // Default to all days
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setIsLoading(true)
        try {
            await createOrphanSubtask(
                content,
                mode === 'single' ? 1 : target,
                emoji,
                unit,
                color,
                frequency
            )
            setContent("")
            setTarget(1)
            onSuccess?.()
        } catch (error) {
            console.error("Failed to create habit:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleDay = (dayIndex: number) => {
        setFrequency(prev =>
            prev.includes(dayIndex)
                ? prev.filter(d => d !== dayIndex)
                : [...prev, dayIndex]
        )
    }

    const toggleAllDays = () => {
        if (frequency.length === 7) {
            setFrequency([])
        } else {
            setFrequency([0, 1, 2, 3, 4, 5, 6])
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
                            <span className="text-lg">🏈</span>
                        </div>
                    </div>

                    <div
                        className="flex items-center gap-3 p-4 rounded-2xl transition-colors"
                        style={{ backgroundColor: color + "40" }} // 25% opacity
                    >
                        <div className="relative group">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-12 w-12 rounded-xl bg-white/50 hover:bg-white/80 shrink-0"
                                onClick={() => {
                                    const current = EMOJIS.indexOf(emoji)
                                    setEmoji(EMOJIS[(current + 1) % EMOJIS.length])
                                }}
                            >
                                <span className="text-2xl">{emoji}</span>
                            </Button>
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

                {/* Frequency */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Frequency</Label>
                        <div className="flex bg-muted rounded-lg p-1">
                            <button
                                type="button"
                                onClick={toggleAllDays}
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                    frequency.length === 7 ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Every Day
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between gap-1">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                            // Adjust index so 0 is Monday for display, but logic uses 0=Sunday if that's standard JS Date
                            // JS Date: 0=Sun, 1=Mon, ..., 6=Sat
                            // Let's map display index to JS Date index
                            // Display: Mon(0), Tue(1), ..., Sun(6)
                            // JS Date: Mon(1), Tue(2), ..., Sun(0)
                            const jsDayIndex = i === 6 ? 0 : i + 1
                            const isSelected = frequency.includes(jsDayIndex)

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => toggleDay(jsDayIndex)}
                                    className={cn(
                                        "flex-1 h-10 rounded-lg flex items-center justify-center text-xs font-medium border-2 transition-all",
                                        isSelected
                                            ? "border-black bg-primary/20"
                                            : "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
                                    )}
                                >
                                    {day}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="pt-4 flex gap-2 mt-auto">
                <Button type="submit" className="flex-1 h-12 text-lg font-medium" disabled={isLoading || !content.trim()}>
                    {isLoading ? "Creating..." : "Create Habit"}
                </Button>
            </div>
        </form>
    )
}
