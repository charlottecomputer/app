"use client"

import { useState, useEffect } from "react"
import { Button, Text } from "@aliveui"
import { Icon } from "@aliveui"
import { AddTaskForm } from "@/components/add-task-form"
import { getTodos } from "@/actions/todo-actions"
import type { Project } from "@/types/todo"

export default function TodayPage() {
  const [showForm, setShowForm] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getTodos()
        if (response.projects) {
          setProjects(response.projects)
        }
      } catch (error) {
        console.error("Failed to load projects:", error)
      }
    }
    loadData()
  }, [])

  return (
    <div className="flex flex-col h-full gap-4 max-w-3xl mx-auto py-8">

      <div className="flex flex-col gap-2">
        <Text variant="bold" className="text-3xl">Today</Text>
        <Text variant="regular" className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </Text>

        {showForm ? (
          <AddTaskForm
            onCancel={() => setShowForm(false)}
            onSuccess={() => setShowForm(false)}
            projects={projects}
          />

        ) : (
          <>
            {/* Empty state - no data screen */}
            <div className="flex flex-col min-h-full pt-24 items-center justify-center flex-1 gap-4 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                <Icon icon="calendar" className="w-8 h-8 text-muted-foreground" />
              </div>
              <Text variant="medium" className="text-lg">Welcome to your Today view</Text>
              <Text variant="regular" className="text-muted-foreground">See everything due today across all your projects.</Text>
              {/* </div> */}
              <Button
                onClick={() => setShowForm(true)}
                className="mt-4"
              >
                <Icon icon="plus" className="mr-2" />
                Add task
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
