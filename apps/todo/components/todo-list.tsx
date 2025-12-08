"use client"

import { useState } from "react"
import { toggleTodo } from "@/actions/todo-actions"
import { Button, Checkbox } from "@aliveui"
import { Icon } from "@aliveui"
import type { Todo, Project } from "@/types/todo"
import { EditTaskDialog } from "./edit-task-dialog"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@aliveui"
import { Pencil } from "lucide-react"

interface TodoItemProps {
  todo: Todo
  projects?: Project[]
  onToggle?: () => void
}

export function TodoItem({ todo, projects = [], onToggle }: TodoItemProps) {
  const [isToggling, setIsToggling] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      await toggleTodo(todo.todoId, !todo.completed)
      onToggle?.()
    } catch (error) {
      console.error("Failed to toggle todo:", error)
    } finally {
      setIsToggling(false)
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
          <div className="group flex items-start gap-3 py-2 px-0.5 hover:bg-accent/50 rounded-md transition-colors select-none">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={handleToggle}
              disabled={isToggling}
              className="mt-0.5"
            />
            <div className="flex-1 flex flex-col gap-1">
              <span className={`text-sm ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                {todo.content}
              </span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {todo.emoji && <span className="mr-1">{todo.emoji}</span>}

                {todo.priority && (
                  <Flag className={`w-3 h-3 ${getPriorityColor(todo.priority)}`} />
                )}

                {todo.dueDate && (
                  <div className="flex items-center gap-1">
                    <Icon icon="calendar" className="w-3 h-3" />
                    <span>{new Date(todo.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                )}

                {todo.recurrence && (
                  <Repeat className="w-3 h-3" />
                )}

                {/* Fallback for "Today" if no specific date but created today - optional logic */}
                {!todo.dueDate && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Icon icon="calendar" className="w-3 h-3" />
                    <span>Today</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Task
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

interface TodoListProps {
  todos: Todo[]
  projects?: Project[]
  onToggle?: () => void
}

export function TodoList({ todos, projects = [], onToggle }: TodoListProps) {
  if (todos.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col">
      {todos.map((todo) => (
        <TodoItem key={todo.todoId} todo={todo} projects={projects} onToggle={onToggle} />
      ))}
    </div>
  )
}
