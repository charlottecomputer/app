"use client"

import { useState, useEffect } from "react"
import { createTodo } from "@/actions/todo-actions"
import { Button, Input, Text } from "@aliveui"
import { Icon } from "@aliveui"
import { CreateTodoInput, Project } from "@/types/todo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@aliveui"

interface AddTaskFormProps {
  onCancel?: () => void
  onSuccess?: () => void
  projects?: Project[]
  defaultProjectId?: string
}

export function AddTaskForm({ onCancel, onSuccess, projects = [], defaultProjectId }: AddTaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [touches, setTouches] = useState(1)
  const [emoji, setEmoji] = useState("📝")
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(defaultProjectId)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset selected project if default changes (e.g. opening form in different context)
  useEffect(() => {
    if (defaultProjectId) {
      setSelectedProjectId(defaultProjectId)
    }
  }, [defaultProjectId])

  const selectedProject = projects.find(p => p.projectId === selectedProjectId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      const input: CreateTodoInput = {
        content: title,
        requiredTouches: touches,
        emoji: emoji,
        projectId: selectedProjectId,
      }

      const result = await createTodo(input)
      if (result.success) {
        setTitle("")
        setDescription("")
        setTouches(1)
        // Don't reset selected project so user can add multiple tasks to same project easily
        onSuccess?.()
      }
    } catch (error) {
      console.error("Failed to create todo:", error)
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
            placeholder="📝"
          />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task name"
            className="flex-1 text-base font-medium border-none shadow-none px-0 focus-visible:ring-0"
            autoFocus
          />
        </div>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="text-sm text-muted-foreground border-none shadow-none px-0 focus-visible:ring-0"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 border rounded-md px-2 py-1">
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

        <Button type="button" variant="outline" size="sm" className="h-7 gap-1">
          <Icon icon="calendar" className="w-3.5 h-3.5 text-green-600" />
          Today
        </Button>

        <Button type="button" variant="outline" size="sm" className="h-7 gap-1">
          <Icon icon="filter" className="w-3.5 h-3.5" />
          Priority
        </Button>
      </div>

      <div className="flex items-center justify-between pt-2 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="gap-1">
              {selectedProject ? (
                <>
                  <span className="text-base">{selectedProject.emoji || "📁"}</span>
                  {selectedProject.name}
                </>
              ) : (
                <>
                  <Icon icon="inbox" className="w-4 h-4" />
                  Inbox
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
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
            disabled={!title.trim() || isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Add task
          </Button>
        </div>
      </div>
    </form>
  )
}
