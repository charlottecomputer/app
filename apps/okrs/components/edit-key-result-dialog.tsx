"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button, Input, Label, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, cn } from "@aliveui"
import { updateKeyResult, deleteKeyResult, createSubtask, updateSubtask } from "@/actions/key-results-actions"
import { Project, KeyResult, Priority } from "@/types/key-results"
import { TaskDatePicker } from "./task-date-picker"
import { TaskRecurrencePicker } from "./task-recurrence-picker"
import { Flag, Plus, X, ChevronDown } from "lucide-react"

interface EditKeyResultDialogProps {
    keyResult: KeyResult
    objectives?: Objective[]
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditKeyResultDialog({ keyResult, objectives = [], open, onOpenChange }: EditKeyResultDialogProps) {
    const [content, setContent] = useState(task.content)
    const [projectId, setProjectId] = useState(task.projectId || "inbox")
    const [dueDate, setDueDate] = useState<Date | undefined>(task.dueDate ? new Date(task.dueDate) : undefined)
    const [recurrence, setRecurrence] = useState(task.recurrence)
    const [priority, setPriority] = useState<Priority>(task.priority || 'medium')
    const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || [])
    const [newSubtask, setNewSubtask] = useState("")
    const [newSubtaskEmoji, setNewSubtaskEmoji] = useState("🍎")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (open) {
            setContent(task.content)
            setProjectId(task.projectId || "inbox")
            setDueDate(task.dueDate ? new Date(task.dueDate) : undefined)
            setRecurrence(task.recurrence)
            setPriority(task.priority || 'medium')
            setSubtasks(task.subtasks || [])
        }
    }, [open, task])

    const handleSave = async () => {
        if (!content.trim()) return

        setIsLoading(true)
        try {
            await updateTask({
                taskId: task.taskId,
                content,
                projectId: projectId === "inbox" ? undefined : projectId,
                dueDate: dueDate?.toISOString(),
                recurrence,
                priority
            })
            onOpenChange(false)
        } catch (error) {
            console.error("Failed to update task:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this task?")) {
            setIsLoading(true)
            try {
                await deleteTask(task.taskId)
                onOpenChange(false)
            } catch (error) {
                console.error("Failed to delete task:", error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleAddSubtask = async () => {
        if (!newSubtask.trim()) return

        // Optimistic update
        const tempId = `temp-${Date.now()}`
        const tempSub: Subtask = {
            subtaskId: tempId,
            taskId: task.taskId,
            content: newSubtask,
            completed: false,
            requiredTouches: 1, // Default
            currentTouches: 0,
            createdAt: new Date().toISOString(),
            emoji: newSubtaskEmoji
        }
        setSubtasks([...subtasks, tempSub])
        setNewSubtask("")

        // Rotate emoji
        const emojis = ["🍎", "💧", "📚", "🏃", "🧘", "💊", "💻", "🧹"]
        const current = emojis.indexOf(newSubtaskEmoji)
        setNewSubtaskEmoji(emojis[(current + 1) % emojis.length])

        try {
            await createSubtask(task.taskId, newSubtask, 1, newSubtaskEmoji)
            // Ideally we'd re-fetch or get the real ID back, but for now revalidatePath handles it on next render
        } catch (error) {
            console.error("Failed to add subtask", error)
            setSubtasks(subtasks) // Revert
        }
    }

    const selectedProject = projects.find(p => p.projectId === projectId)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="content">Task</Label>
                        <Input
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What needs to be done?"
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
                            <Label>Project</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        <div className="flex items-center gap-2 truncate">
                                            <span>{selectedProject?.emoji || "📥"}</span>
                                            <span className="truncate">{selectedProject?.name || "Inbox"}</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[200px]">
                                    <DropdownMenuItem onClick={() => setProjectId("inbox")}>
                                        📥 Inbox
                                    </DropdownMenuItem>
                                    {projects.map((project) => (
                                        <DropdownMenuItem key={project.projectId} onClick={() => setProjectId(project.projectId)}>
                                            {project.emoji} {project.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Subtasks Management */}
                    <div className="grid gap-2">
                        <Label>Subtasks</Label>
                        <div className="space-y-2">
                            {subtasks.map(sub => (
                                <div key={sub.subtaskId} className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <span>{sub.emoji}</span>
                                        <span className="text-sm">{sub.content}</span>
                                    </div>
                                    {/* Add delete/edit subtask buttons here if needed */}
                                </div>
                            ))}
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 shrink-0"
                                        onClick={() => {
                                            // Simple emoji rotation for now
                                            const emojis = ["🍎", "💧", "📚", "🏃", "🧘", "💊", "💻", "🧹"]
                                            const current = emojis.indexOf(newSubtaskEmoji)
                                            setNewSubtaskEmoji(emojis[(current + 1) % emojis.length])
                                        }}
                                    >
                                        <span className="text-lg">{newSubtaskEmoji}</span>
                                    </Button>
                                </div>
                                <Input
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                    placeholder="Add a subtask..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAddSubtask()
                                        }
                                    }}
                                />
                                <Button size="icon" variant="ghost" onClick={handleAddSubtask}>
                                    <Plus className="h-4 w-4" />
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
