"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "motion/react"
import { cn } from "@aliveui"
import { deleteTodo, updateTodoProgress } from "@/actions/todo-actions"
import { Project, Todo } from "@/types/todo"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@aliveui"
import { Pencil, Trash, Flag, Repeat } from "lucide-react"
import { EditTaskDialog } from "./edit-task-dialog"

interface TodoSquareProps extends Todo {
    projects?: Project[]
}

export function TodoSquare({ projects = [], ...todo }: TodoSquareProps) {
    const [isEditing, setIsEditing] = useState(false)
    const requiredTouches = todo.requiredTouches || 1
    const currentTouches = todo.currentTouches || 0
    const progress = Math.min(currentTouches / requiredTouches, 1) * 100

    const handleTouch = async () => {
        if (todo.completed) return

        const newTouches = currentTouches + 1

        try {
            if (newTouches >= requiredTouches) {
                await updateTodo({
                    todoId: todo.todoId,
                    completed: true,
                    currentTouches: newTouches
                })
            } else {
                await updateTodo({
                    todoId: todo.todoId,
                    currentTouches: newTouches
                })
            }
        } catch (error) {
            console.error("Failed to update todo:", error)
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
                    <div
                        className={cn(
                            "relative aspect-square rounded-3xl overflow-hidden cursor-pointer transition-transform active:scale-95 select-none w-32 h-32 sm:w-40 sm:h-40",
                            "bg-muted/30 hover:bg-muted/50 border-2 border-transparent hover:border-primary/10",
                            todo.completed && "opacity-50 grayscale"
                        )}
                        onClick={handleTouch}
                    >
                        {/* Liquid Fill Animation */}
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all duration-500 ease-out"
                            style={{ height: `${progress}%` }}
                        />

                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 text-center gap-2">
                            <div className="text-3xl sm:text-4xl animate-in zoom-in duration-300">
                                {todo.emoji || "📝"}
                            </div>
                            <div className="font-medium text-sm sm:text-base line-clamp-2 leading-tight">
                                {todo.content}
                            </div>
                            <div className="flex gap-1 items-center justify-center">
                                {todo.priority && (
                                    <Flag className={`w-3 h-3 ${getPriorityColor(todo.priority)}`} />
                                )}
                                {todo.recurrence && (
                                    <Repeat className="w-3 h-3 text-muted-foreground" />
                                )}
                            </div>
                            {requiredTouches > 1 && (
                                <div className="text-xs text-muted-foreground font-medium">
                                    {currentTouches}/{requiredTouches}
                                </div>
                            )}
                        </div>
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={() => setIsEditing(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Task
                    </ContextMenuItem>
                    <ContextMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={async () => {
                            if (confirm("Are you sure you want to delete this task?")) {
                                await deleteTodo(todo.todoId)
                            }
                        }}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Task
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

            <EditTaskDialog
                todo={todo}
                projects={projects}
                open={isEditing}
                onOpenChange={setIsEditing}
            />
        </>
    )
}
