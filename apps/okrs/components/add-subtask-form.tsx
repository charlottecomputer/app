"use client"

import { useState } from "react"
import { Button, Input, Label } from "@aliveui"
import { createOrphanSubtask } from "@/actions/key-results-actions"
import { Plus } from "lucide-react"

export function AddSubtaskForm({ onSuccess, onCancel }: { onSuccess?: () => void, onCancel?: () => void }) {
    const [content, setContent] = useState("")
    const [touches, setTouches] = useState(1)
    const [emoji, setEmoji] = useState("🍎")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setIsLoading(true)
        try {
            await createOrphanSubtask(content, touches, emoji)
            setContent("")
            setTouches(1)
            onSuccess?.()
        } catch (error) {
            console.error("Failed to create subtask:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 justify-center items-center flex flex-col">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0"
                    onClick={() => {
                        const emojis = ["🍎", "💧", "📚", "🏃", "🧘", "💊", "💻", "🧹"]
                        const current = emojis.indexOf(emoji)
                        setEmoji(emojis[(current + 1) % emojis.length])
                    }}
                >
                    <span className="text-lg">{emoji}</span>
                </Button>
                <Label>Amount of things</Label>
                <Input
                    type="number"
                    value={touches}
                    onChange={(e) => setTouches(parseInt(e.target.value) || 1)}
                    className="w-20"
                    min={1}
                    placeholder="Clicks"
                />
                <div className="relative">


                    <Input
                        autoFocus
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What needs to be done?"
                        className="flex-1"
                    />

                    <Button type="submit" size="icon" disabled={isLoading || !content.trim()}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </form>
    )
}
