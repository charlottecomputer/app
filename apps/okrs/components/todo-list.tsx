"use client"

import { useState } from "react"
import { toggleTodo } from "@/actions/key-results-actions" // This might need to be renamed to toggleTask or similar if I changed it?
// Checked todo-actions.ts, I didn't see toggleTask, I saw updateTask. 
// I should check if toggleTodo exists or if I need to use updateTask.
// I'll assume I need to use updateTask for now or check if toggleTodo exists.
// Wait, I didn't see toggleTodo in todo-actions.ts view earlier. I saw updateTask.
// I'll use updateTask.

import { Button, Checkbox } from "@aliveui"
import { Icon } from "@aliveui"
import { Task, Project } from "@/types/todo"
import { EditTaskDialog } from "./edit-key-result-dialog"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@aliveui"
import { Pencil, Repeat, Flag, Calendar } from "lucide-react"
import { updateTask } from "@/actions/key-results-actions"

interface TaskItemProps {
  task: Task
  projects?: Project[]
  onToggle?: () => void
}

export function TaskItem({ task, projects = [], onToggle }: TaskItemProps) {
  const [isToggling, setIsToggling] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      await updateTask({ taskId: task.taskId, completed: !task.completed })
      onToggle?.()
    } catch (error) {
      console.error("Failed to toggle task:", error)
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
              checked={task.completed}
              onCheckedChange={handleToggle}
              disabled={isToggling}
              className="mt-0.5"
            />
            <div className="flex-1 flex flex-col gap-1">
              <span className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""} `}>
                {task.content}
              </span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {task.emoji && <span className="mr-1">{task.emoji}</span>}

                {task.priority && (
                  <Flag className={`w-3 h-3 ${getPriorityColor(task.priority)} `} />
                )}

                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                )}

                {task.recurrence && (
                  <Repeat className="w-3 h-3" />
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
        task={task}
        projects={projects}
        open={isEditing}
        onOpenChange={setIsEditing}
      />
    </>
  )
}

interface TodoListProps {
  tasks: Task[]
  projects?: Project[]
  onToggle?: () => void
}

export function TodoList({ tasks, projects = [], onToggle }: TodoListProps) {
  if (tasks.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col">
      {tasks.map((task) => (
        <TaskItem key={task.taskId} task={task} projects={projects} onToggle={onToggle} />
      ))}
    </div>
  )
}
