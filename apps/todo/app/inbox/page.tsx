"use client"

import { useState, useEffect } from "react"
import { getTasks } from "@/actions/todo-actions"
import { Button, Text } from "@aliveui"
import { Icon } from "@aliveui"
import { AddTaskForm } from "@/components/add-task-form"
import { TodoList } from "@/components/todo-list"
import type { Task, Project } from "@/types/todo"

export default function InboxPage() {
  const [showForm, setShowForm] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadTodos = async () => {
    setIsLoading(true)
    try {
      const response = await getTasks()
      console.log("getTasks response:", response)
      if (response.tasks) {
        console.log("Setting tasks:", response.tasks)
        setTasks(response.tasks)
      }
      if (response.projects) {
        setProjects(response.projects)
      }
    } catch (error) {
      console.error("Failed to load todos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  const handleSuccess = () => {
    setShowForm(false)
    loadTodos()
  }

  console.log("Inbox render - tasks:", tasks, "length:", tasks.length, "isLoading:", isLoading)

  return (
    <div className="flex flex-col h-full gap-4 max-w-3xl mx-auto py-8">
      <div className="flex flex-col gap-2">
        <Text variant="bold" className="text-3xl">Inbox</Text>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center flex-1">
          <Text variant="regular" className="text-muted-foreground">Loading...</Text>
        </div>
      ) : (
        <>
          <TodoList tasks={tasks} projects={projects} />

          {showForm ? (
            <AddTaskForm
              onCancel={() => setShowForm(false)}
              onSuccess={handleSuccess}
              projects={projects}
            />
          ) : (
            <Button
              variant="ghost"
              className="justify-start gap-2 text-red-400 hover:text-red-600 hover:bg-transparent"
              onClick={() => setShowForm(true)}
            >
              <Icon icon="plus" className="w-4 h-4" />
              Add task
            </Button>
          )}
        </>
      )}
    </div>
  )
}
