"use client"

import { useState } from "react"
import { createTodo } from "@/actions/todo-actions"
import { Button, Input } from "@aliveui"
import { Icon } from "@aliveui"
import { Flag } from "lucide-react"
import { Project, CreateTodoInput, Recurrence, Priority } from "@/types/todo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@aliveui"
import { TaskDatePicker } from "./task-date-picker"
import { TaskRecurrencePicker } from "./task-recurrence-picker"

interface AddTaskFormProps {
  onCancel: () => void
  onSuccess: () => void
  projects?: Project[]
  defaultProjectId?: string
}

export function AddTaskForm({ onCancel, onSuccess, projects = [], defaultProjectId }: AddTaskFormProps) {
  const [content, setContent] = useState("")
  const [touches, setTouches] = useState(1)
  const [emoji, setEmoji] = useState("📝")
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(defaultProjectId)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New fields
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [recurrence, setRecurrence] = useState<Recurrence | undefined>()
  const [priority, setPriority] = useState<Priority | undefined>()

  // Reset selected project if default changes (e.g. opening form in different context)
  // This useEffect is removed in the new code, so I will remove it.
  // useEffect(() => {
  //   if (defaultProjectId) {
  //     setSelectedProjectId(defaultProjectId)
  //   }
  // }, [defaultProjectId])

  const selectedProject = projects.find(p => p.projectId === selectedProjectId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      const input: CreateTodoInput = {
        content: content,
        projectId: selectedProjectId,
        requiredTouches: touches,
        emoji: emoji,
        recurrence: recurrence,
        dueDate: dueDate?.toISOString(),
        priority: priority,
      }

      const result = await createTodo(input)
      if (result.success) {
        setContent("")
        // setDescription("") // Removed
        // setTouches(1) // Removed
        // Don't reset selected project so user can add multiple tasks to same project easily
        onSuccess() // Changed from onSuccess?.()
      }
    } catch (error) {
      console.error("Failed to create todo:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded-xl bg-card shadow-sm animate-in fade-in zoom-in-95 duration-200">
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

      {/* Description input removed */}
      {/* <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="text-sm text-muted-foreground border-none shadow-none px-0 focus-visible:ring-0"
        /> */}

      <div className="flex flex-wrap gap-2 items-center">
        <TaskDatePicker date={dueDate} onDateChange={setDueDate} />

        <TaskRecurrencePicker recurrence={recurrence} onRecurrenceChange={setRecurrence} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={!priority ? "text-muted-foreground" : ""}>
              <Flag className={`mr-2 h-4 w-4 ${priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-yellow-500' : priority === 'low' ? 'text-blue-500' : ''}`} />
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

      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!content.trim() || isSubmitting}
        >
          Add Task
        </Button>
      </div>
    </form>
  )
}
