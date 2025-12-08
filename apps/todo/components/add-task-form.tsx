"use client"

import { useState } from "react"
import { createTodo } from "@/actions/todo-actions"
import { Button, Input } from "@aliveui"
import { Icon } from "@aliveui"

interface AddTaskFormProps {
  onCancel?: () => void
  onSuccess?: () => void
}

export function AddTaskForm({ onCancel, onSuccess }: AddTaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      const result = await createTodo(title)
      if (result.success) {
        setTitle("")
        setDescription("")
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
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task name"
          className="text-base font-medium border-none shadow-none px-0 focus-visible:ring-0"
          autoFocus
        />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="text-sm text-muted-foreground border-none shadow-none px-0 focus-visible:ring-0"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button type="button" variant="outline" size="sm" className="h-7 gap-1">
          <Icon icon="calendar" className="w-3.5 h-3.5 text-green-600" />
          Today
          <Icon icon="plus" className="w-3 h-3" />
        </Button>

        <Button type="button" variant="outline" size="sm" className="h-7 gap-1">
          <Icon icon="filter" className="w-3.5 h-3.5" />
          Priority
        </Button>

        <Button type="button" variant="outline" size="sm" className="h-7 gap-1">
          <Icon icon="calendar" className="w-3.5 h-3.5" />
          Reminders
        </Button>

        <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Icon icon="plus" className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between pt-2 border-t">
        <Button type="button" variant="ghost" size="sm" className="gap-1">
          <Icon icon="inbox" className="w-4 h-4" />
          Inbox
        </Button>

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
            className="bg-red-400 hover:bg-red-600 text-white"
          >
            Add task
          </Button>
        </div>
      </div>
    </form>
  )
}
