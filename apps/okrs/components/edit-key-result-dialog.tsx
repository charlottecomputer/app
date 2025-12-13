"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button, Input, Label, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, cn } from "@aliveui"
import { updateKeyResult, deleteKeyResult } from "@/actions/key-results-actions"
import { Objective, KeyResult, Priority } from "@/types/key-results"
import { TaskDatePicker } from "./task-date-picker"
import { TaskRecurrencePicker } from "./task-recurrence-picker"
import { Flag, ChevronDown } from "lucide-react"

interface EditKeyResultDialogProps {
    keyResult: KeyResult
    objectives?: Objective[]
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditKeyResultDialog({ keyResult, objectives = [], open, onOpenChange }: EditKeyResultDialogProps) {
    const [content, setContent] = useState(keyResult.content)
    const [projectId, setProjectId] = useState(keyResult.projectId || "inbox")
    const [dueDate, setDueDate] = useState<Date | undefined>(keyResult.dueDate ? new Date(keyResult.dueDate) : undefined)
    const [recurrence, setRecurrence] = useState(keyResult.recurrence)
    const [priority, setPriority] = useState<Priority>(keyResult.priority || 'medium')
    const [requiredTouches, setRequiredTouches] = useState(keyResult.requiredTouches || 1)
    const [icon, setIcon] = useState(keyResult.icon || "📝")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (open) {
            setContent(keyResult.content)
            setProjectId(keyResult.projectId || "inbox")
            setDueDate(keyResult.dueDate ? new Date(keyResult.dueDate) : undefined)
            setRecurrence(keyResult.recurrence)
            setPriority(keyResult.priority || 'medium')
            setRequiredTouches(keyResult.requiredTouches || 1)
            setIcon(keyResult.icon || "📝")
        }
    }, [open, keyResult])

    const handleSave = async () => {
        if (!content.trim()) return

        setIsLoading(true)
        try {
            await updateKeyResult({
                keyResultId: keyResult.keyResultId,
                content,
                projectId: projectId === "inbox" ? undefined : projectId,
                dueDate: dueDate?.toISOString(),
                recurrence,
                priority,
                requiredTouches,
                icon
            })
            onOpenChange(false)
        } catch (error) {
            console.error("Failed to update keyResult:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this keyResult?")) {
            setIsLoading(true)
            try {
                await deleteKeyResult(keyResult.keyResultId)
                onOpenChange(false)
            } catch (error) {
                console.error("Failed to delete keyResult:", error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const selectedObjective = objectives.find(p => p.projectId === projectId)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Key Result</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="content">Key Result</Label>
                        <Input
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What needs to be achieved?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Due Date</Label>
                            <TaskDatePicker date={dueDate} onDateChange={setDueDate} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Recurrence</Label>
                            <TaskRecurrencePicker recurrence={recurrence} onRecurrenceChange={setRecurrence} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Priority</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        <div className="flex items-center gap-2">
                                            <Flag className={cn(
                                                "h-4 w-4",
                                                priority === 'high' ? 'text-red-500' :
                                                    priority === 'medium' ? 'text-yellow-500' :
                                                        priority === 'low' ? 'text-blue-500' : 'text-muted-foreground'
                                            )} />
                                            <span className="capitalize">{priority}</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[200px]">
                                    <DropdownMenuItem onClick={() => setPriority('low')}>
                                        <Flag className="mr-2 h-4 w-4 text-blue-500" /> Low
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setPriority('medium')}>
                                        <Flag className="mr-2 h-4 w-4 text-yellow-500" /> Medium
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setPriority('high')}>
                                        <Flag className="mr-2 h-4 w-4 text-red-500" /> High
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="grid gap-2">
                            <Label>Objective</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        <div className="flex items-center gap-2 truncate">
                                            <span>{selectedObjective?.icon || "📥"}</span>
                                            <span className="truncate">{selectedObjective?.name || "Inbox"}</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[200px]">
                                    <DropdownMenuItem onClick={() => setProjectId("inbox")}>
                                        📥 Inbox
                                    </DropdownMenuItem>
                                    {objectives.map((objective) => (
                                        <DropdownMenuItem key={objective.projectId} onClick={() => setProjectId(objective.projectId)}>
                                            {objective.icon} {objective.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Required Touches</Label>
                            <Input
                                type="number"
                                min={1}
                                value={requiredTouches}
                                onChange={(e) => setRequiredTouches(parseInt(e.target.value) || 1)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Icon</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        const emojis = ["🍎", "💧", "📚", "🏃", "🧘", "💊", "💻", "🧹", "📝", "🎯", "🚀"]
                                        const current = emojis.indexOf(icon)
                                        setIcon(emojis[(current + 1) % emojis.length])
                                    }}
                                >
                                    {icon}
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                        Delete
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading}>
                            Save Changes
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
