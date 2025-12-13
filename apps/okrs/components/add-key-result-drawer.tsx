"use client"

import { useState } from "react"
import { Button } from "@aliveui"
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

interface AddKeyResultDrawerProps {
  onSuccess?: () => void
  trigger?: React.ReactNode
  projectId?: string
}

export function AddKeyResultDrawer({ onSuccess, trigger, projectId }: AddKeyResultDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Key Result
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm h-[85vh] flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Add New Key Result</DrawerTitle>
            <DrawerDescription>Create a new key result or habit.</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4 pb-8">
            <AddHabitForm
              defaultProjectId={projectId}
              onCancel={() => setIsDrawerOpen(false)}
              onSuccess={() => {
                setIsDrawerOpen(false)
                onSuccess?.()
              }}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
