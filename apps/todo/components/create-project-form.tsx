"use client"

import { useState } from "react"
import { createProject } from "@/actions/todo-actions"
import { Button, Input, Text } from "@aliveui"
import { Icon } from "@aliveui"
import { CreateProjectInput } from "@/types/todo"

interface CreateProjectFormProps {
    onCancel?: () => void
    onSuccess?: () => void
}

export function CreateProjectForm({ onCancel, onSuccess }: CreateProjectFormProps) {
    const [name, setName] = useState("")
    const [emoji, setEmoji] = useState("📁")
    const [color, setColor] = useState("bg-primary")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setIsSubmitting(true)
        try {
            const input: CreateProjectInput = {
                name: name,
                emoji: emoji,
                color: color,
            }

            const result = await createProject(input)
            if (result.success) {
                setName("")
                setEmoji("📁")
                onSuccess?.()
            }
        } catch (error) {
            console.error("Failed to create project:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-3 bg-card">
            <div className="space-y-2">
                <div className="flex gap-2">
                    <Input
                        value={emoji}
                        onChange={(e) => setEmoji(e.target.value)}
                        className="w-12 text-center text-xl border-none shadow-none px-0 focus-visible:ring-0"
                        placeholder="📁"
                    />
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Project name"
                        className="flex-1 text-base font-medium border-none shadow-none px-0 focus-visible:ring-0"
                        autoFocus
                    />
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        size="sm"
                        disabled={!name.trim() || isSubmitting}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Create Project
                    </Button>
                </div>
            </div>
        </form>
    )
}
