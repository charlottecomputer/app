"use client"

import { useState } from "react"
import { updateTodo, deleteTodo } from "@/actions/todo-actions"
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@aliveui"
import { Icon } from "@aliveui"
import { Todo, Project, UpdateTodoInput, Recurrence, Priority } from "@/types/todo"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@aliveui"
import { Trash, Flag } from "lucide-react"
import { TaskDatePicker } from "./task-date-picker"
import { TaskRecurrencePicker } from "./task-recurrence-picker"

interface EditTaskDialogProps {
    todo: Todo
    projects?: Project[]
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditTaskDialog({ todo, projects = [], open, onOpenChange }: EditTaskDialogProps) {
    const [content, setContent] = useState(todo.content)
    const [touches, setTouches] = useState(todo.requiredTouches || 1)
    const [emoji, setEmoji] = useState(todo.emoji || "📝")
    const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(todo.projectId)
    const [dueDate, setDueDate] = useState<Date | undefined>(todo.dueDate ? new Date(todo.dueDate) : undefined)
    const [recurrence, setRecurrence] = useState<Recurrence | undefined>(todo.recurrence)
    const [priority, setPriority] = useState<Priority | undefined>(todo.priority)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const selectedProject = projects.find(p => p.projectId === selectedProjectId)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setIsSubmitting(true)
        try {
            const input: UpdateTodoInput = {
                todoId: todo.todoId,
                content: content,
                requiredTouches: touches,
                emoji: emoji,
                projectId: selectedProjectId,
                dueDate: dueDate?.toISOString(),
                recurrence: recurrence,
                priority: priority,
            }

            const result = await updateTodo(input)
            if (result.success) {
                onOpenChange(false)
            }
        } catch (error) {
            console.error("Failed to update todo:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this task?")) return

        setIsSubmitting(true)
        try {
            await deleteTodo(todo.todoId)
            onOpenChange(false)
        } catch (error) {
            console.error("Failed to delete todo:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
                    <div className="flex gap-2">
                        <Input
                            value={emoji}
                            onChange={(e) => setEmoji(e.target.value)}
                            className="w-12 text-center text-xl h-auto py-2"
                            placeholder="📝"
                        />
                        <Input
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What needs to be done?"
                            className="flex-1 text-lg h-auto py-2"
                            autoFocus
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        <TaskDatePicker date={dueDate} onDateChange={setDueDate} />

                        <TaskRecurrencePicker recurrence={recurrence} onRecurrenceChange={setRecurrence} />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className={!priority ? "text-muted-foreground" : ""}>
                                    <Flag className={`mr - 2 h - 4 w - 4 ${priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-yellow-500' : priority === 'low' ? 'text-blue-500' : ''} `} />
                                    {priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : "Priority"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setPriority('high')}>
                                    <Flag className="mr-2 h-4 w-4 text-red-500" /> High
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setPriority('medium')}>
                                    <Flag className="mr-2 h-4 w-4 text-yellow-500" /> Medium
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setPriority('low')}>
                                    <Flag className="mr-2 h-4 w-4 text-blue-500" /> Low
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setPriority(undefined)}>
                                    No Priority
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex items-center gap-1 border rounded-md px-2 py-1 bg-background">
                            <span className="text-xs text-muted-foreground">Touches:</span>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={touches}
                                onChange={(e) => setTouches(parseInt(e.target.value) || 1)}
                                className="w-8 text-xs bg-transparent border-none focus:outline-none"
                            />
                        </div>

                        <div className="flex-1" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button type="button" variant="ghost" size="sm" className="h-8 gap-1">
                                    {selectedProject ? (
                                        <>
                                            <span className="text-xs">{selectedProject.emoji || "📁"}</span>
                                            {selectedProject.name}
                                        </>
                                    ) : (
                                        <>
                                            <Icon icon="inbox" className="w-3.5 h-3.5" />
                                            Inbox
                                        </>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedProjectId(undefined)}>
                                    <Icon icon="inbox" className="w-4 h-4 mr-2" />
                                    Inbox
                                </DropdownMenuItem>
                                {projects.map(project => (
                                    <DropdownMenuItem
                                        key={project.projectId}
                                        onClick={() => setSelectedProjectId(project.projectId)}
                                    >
                                        <span className="mr-2">{project.emoji || "📁"}</span>
                                        {project.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <DialogFooter className="flex justify-between sm:justify-between items-center w-full">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                        >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!content.trim() || isSubmitting}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
