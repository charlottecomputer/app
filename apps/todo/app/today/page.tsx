"use client"

import { useState, useMemo } from "react"
import { Button, Text } from "@aliveui"
import { Icon } from "@aliveui"
import type { Subtask } from "@/types/todo"
import { SubtaskCube } from "@/components/subtask-cube"
import { useTodos } from "@/hooks/use-todos"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription
} from "@aliveui"
import { AddHabitForm } from "@/components/add-habit-form"

export default function TodayPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { todayTasks, refreshTasks } = useTodos()

  const todaySubtasks = useMemo(() => {
    const subtasks: Subtask[] = []
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday

    todayTasks.forEach(task => {
      if (task.subtasks) {
        task.subtasks.forEach(subtask => {
          // If frequency is defined, check if today is included
          // If frequency is undefined, assume daily (show every day)
          if (!subtask.frequency || subtask.frequency.includes(dayOfWeek)) {
            subtasks.push(subtask)
          }
        })
      }
    })
    return subtasks
  }, [todayTasks])

  return (
    <div className="flex flex-col h-full gap-4 max-w-5xl mx-auto py-8 px-4">

      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <Text variant="bold" className="text-3xl">Today</Text>
            <Text variant="regular" className="text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </Text>
          </div>

          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button size="sm">
                Add Subtask
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm h-[85vh] flex flex-col">
                <DrawerHeader>
                  <DrawerTitle>Add New Habit</DrawerTitle>
                  <DrawerDescription>Create a new daily habit.</DrawerDescription>
                </DrawerHeader>
                <div className="flex-1 overflow-y-auto p-4 pb-8">
                  <AddHabitForm
                    onCancel={() => setIsDrawerOpen(false)}
                    onSuccess={() => {
                      setIsDrawerOpen(false)
                      refreshTasks()
                    }}
                  />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {todaySubtasks.length === 0 ? (
          <div className="flex flex-col min-h-[400px] items-center justify-center flex-1 gap-4 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
              <Icon icon="calendar" className="w-8 h-8 text-muted-foreground" />
            </div>
            <Text variant="medium" className="text-lg">No subtasks for today</Text>
            <Text variant="regular" className="text-muted-foreground">Add tasks with subtasks to see them here.</Text>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {todaySubtasks.map(subtask => (
              <SubtaskCube
                key={subtask.subtaskId}
                subtask={subtask}
                onUpdate={refreshTasks}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

