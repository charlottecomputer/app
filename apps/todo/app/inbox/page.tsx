"use client"

import { useState, useEffect } from "react"
import { Button, Text } from "@aliveui"
import { Icon } from "@aliveui"
import { getTasks } from "@/actions/todo-actions"
import type { Project, Task, Subtask } from "@/types/todo"
import { SubtaskCube } from "@/components/subtask-cube"
import { Plus } from "lucide-react"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription
} from "@aliveui"
import { AddHabitForm } from "@/components/add-habit-form"

export default function InboxPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [inboxSubtasks, setInboxSubtasks] = useState<Subtask[]>([])

  const loadData = async () => {
    try {
      const response = await getTasks()
      if (response.tasks) {
        const subtasks: Subtask[] = [];

        response.tasks.forEach(task => {
          if (task.subtasks) {
            task.subtasks.forEach(subtask => {
              // Show ALL incomplete habits
              if (subtask.currentTouches < subtask.requiredTouches) {
                subtasks.push(subtask);
              }
            });
          }
        });
        setInboxSubtasks(subtasks);
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="flex flex-col h-full gap-4 max-w-5xl mx-auto py-8 px-4">

      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <Text variant="bold" className="text-3xl">Inbox</Text>
            <Text variant="regular" className="text-muted-foreground">
              All incomplete habits
            </Text>
          </div>

          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button size="sm" icon={<Plus className="h-4 w-4" />}>
                Add Habit
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm h-[85vh] flex flex-col">
                <DrawerHeader>
                  <DrawerTitle>Add New Habit</DrawerTitle>
                  <DrawerDescription>Create a new habit.</DrawerDescription>
                </DrawerHeader>
                <div className="flex-1 overflow-y-auto p-4 pb-8">
                  <AddHabitForm
                    onCancel={() => setIsDrawerOpen(false)}
                    onSuccess={() => {
                      setIsDrawerOpen(false)
                      loadData()
                    }}
                  />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {inboxSubtasks.length === 0 ? (
          <div className="flex flex-col min-h-[400px] items-center justify-center flex-1 gap-4 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
              <Icon icon="power" className="w-8 h-8 text-muted-foreground" />
            </div>
            <Text variant="medium" className="text-lg">All caught up!</Text>
            <Text variant="regular" className="text-muted-foreground">No pending habits found.</Text>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {inboxSubtasks.map(subtask => (
              <SubtaskCube
                key={subtask.subtaskId}
                subtask={subtask}
                onUpdate={loadData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

