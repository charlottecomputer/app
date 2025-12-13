"use client"

import { useState } from "react"
import { createObjective } from "@/actions/objective-actions"
import { Button, Input, Label, cn, IconPicker, Icon } from "@aliveui"

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



export function AddObjectiveForm({ onSuccess, onCancel }: { onSuccess?: () => void, onCancel?: () => void }) {
    const [name, setName] = useState("")
    const [icon, setIcon] = useState("target")
    const [color, setColor] = useState(COLORS[0])
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setIsLoading(true)
        try {
            await createObjective({
                name,
                icon,
                color,
            })
            setName("")
            onSuccess?.()
        } catch (error) {
            console.error("Failed to create objective:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6">
                {/* Name & Icon */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Objective Name</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Example</span>
                            <Icon icon="target" className="w-6 h-6" />
                        </div>
                    </div>

                    <div
                        className="flex items-center gap-3 p-4 rounded-2xl transition-colors"
                        style={{ backgroundColor: color + "40" }} // 25% opacity
                    >
                        <div className="relative group w-12">
                            <IconPicker
                                value={icon}
                                onChange={setIcon}
                            />
                        </div>
                        <Input
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name your objective..."
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
            </div>

            <div className="pt-4 flex gap-2 mt-auto">
                <Button type="submit" className="flex-1 h-12 text-lg font-medium" disabled={isLoading || !name.trim()}>
                    {isLoading ? "Creating..." : "Create Objective"}
                </Button>
            </div>
        </form>
    )
}
