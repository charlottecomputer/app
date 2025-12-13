"use client"

import { useState } from "react"
import { updateProject } from "@/actions/key-results-actions"
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle } from "@aliveui"
import { Project, UpdateProjectInput } from "@/types/todo"

interface EditProjectDialogProps {
    project: Project
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditProjectDialog({ project, open, onOpenChange }: EditProjectDialogProps) {
    const [name, setName] = useState(project.name)
    const [emoji, setEmoji] = useState(project.emoji || "📁")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setIsSubmitting(true)
        try {
            const input: UpdateProjectInput = {
                projectId: project.projectId,
                name: name,
                emoji: emoji,
            }

            const result = await updateProject(input)
            if (result.success) {
                onOpenChange(false)
            }
        } catch (error) {
            console.error("Failed to update project:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="flex gap-2">
                        <Input
                            value={emoji}
                            onChange={(e) => setEmoji(e.target.value)}
                            className="w-12 text-center text-xl"
                            placeholder="📁"
                        />
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Project name"
                            className="flex-1"
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!name.trim() || isSubmitting}
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
