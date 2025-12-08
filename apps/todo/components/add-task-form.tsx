"use client"

import { useState } from "react"
import { Button, Input, Label, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, cn } from "@aliveui"
import { createTask } from "@/actions/todo-actions"
import { Project, Priority } from "@/types/todo"
import { Plus, X, ChevronDown, Flag } from "lucide-react"
import { TaskDatePicker } from "./task-date-picker"
import { TaskRecurrencePicker } from "./task-recurrence-picker"

export function AddTaskForm({ projects = [], onSuccess, onCancel, defaultProjectId }: { projects?: Project[], onSuccess?: () => void, onCancel?: () => void, defaultProjectId?: string }) {
  const [content, setContent] = useState("")
  const [projectId, setProjectId] = useState(defaultProjectId || "inbox")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [recurrence, setRecurrence] = useState<any>(undefined)
  const [priority, setPriority] = useState<Priority>('medium')
  const [subtasks, setSubtasks] = useState<{ content: string; requiredTouches: number; emoji: string }[]>([])
  const [newSubtask, setNewSubtask] = useState("")
  const [newSubtaskTouches, setNewSubtaskTouches] = useState(1)
  const [newSubtaskEmoji, setNewSubtaskEmoji] = useState("🍎")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsLoading(true)
    try {
      await createTask({
        content,
        projectId: projectId === "inbox" ? undefined : projectId,
        dueDate: dueDate?.toISOString(),
        recurrence,
        priority,
        subtasks
      })
      setContent("")
      setSubtasks([])
      onSuccess?.()
    } catch (error) {
      console.error("Failed to create task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addSubtask = () => {
    if (!newSubtask.trim()) return
    setSubtasks([...subtasks, { content: newSubtask, requiredTouches: newSubtaskTouches, emoji: newSubtaskEmoji }])
    setNewSubtask("")
    setNewSubtaskTouches(1)
    // Rotate emoji automatically for variety
    const emojis = ["🍎", "💧", "📚", "🏃", "🧘", "💊", "💻", "🧹"]
    const current = emojis.indexOf(newSubtaskEmoji)
    setNewSubtaskEmoji(emojis[(current + 1) % emojis.length])
  }

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index))
  }

  const selectedProject = projects.find(p => p.projectId === projectId)

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-xl bg-card">
      <div className="grid gap-2">
        <Label htmlFor="new-task">New Task</Label>
        <Input
          id="new-task"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What needs to be done?"
          className="text-lg"
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

      {/* Subtasks Input */}
      <div className="space-y-2">
        <Label>Subtasks (Gamified)</Label>
        <div className="flex gap-2">
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => {
                // Simple emoji rotation for now, or could use a picker
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
            placeholder="Subtask (e.g. Read 10 pages)"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addSubtask()
              }
            }}
          />
          <Input
            type="number"
            value={newSubtaskTouches}
            onChange={(e) => setNewSubtaskTouches(parseInt(e.target.value) || 1)}
            className="w-20"
            min={1}
            placeholder="Clicks"
          />
          <Button type="button" size="icon" variant="secondary" onClick={addSubtask}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {subtasks.length > 0 && (
          <div className="space-y-1 mt-2">
            {subtasks.map((sub, i) => (
              <div key={i} className="flex items-center justify-between bg-muted/50 p-2 rounded text-sm">
                <div className="flex items-center gap-2">
                  <span>{sub.emoji}</span>
                  <span>{sub.content} <span className="text-muted-foreground text-xs">({sub.requiredTouches} clicks)</span></span>
                </div>
                <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeSubtask(i)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !content.trim()}>
        {isLoading ? "Creating..." : "Create Task"}
      </Button>
    </form>
  )
}
