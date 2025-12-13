"use client"

import { useState, useEffect } from "react"
import { Button, Text } from "@aliveui"
import { Icon } from "@aliveui"
import { getKeyResults } from "@/actions/key-results-actions"
import type { KeyResult, Objective } from "@/types/key-results"
import { KeyResultSquare } from "@/components/key-result-square"
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
  const [inboxKeyResults, setInboxKeyResults] = useState<KeyResult[]>([])
  const [objectives, setObjectives] = useState<Objective[]>([])

  const loadData = async () => {
    try {
      const response = await getKeyResults()
      if (response.keyResults) {
        // Show ALL incomplete key results
        const incomplete = response.keyResults.filter(kr => !kr.completed)
        setInboxKeyResults(incomplete)
        setObjectives(response.objectives || [])
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
              All incomplete key results
            </Text>
          </div>

          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger>
              <Button size="sm" icon={<Plus className="h-4 w-4" />}>
                Add Key Result
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm h-[85vh] flex flex-col">
                <DrawerHeader>
                  <DrawerTitle>Add New Key Result</DrawerTitle>
                  <DrawerDescription>Create a new key result or habit.</DrawerDescription>
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

        {inboxKeyResults.length === 0 ? (
          <div className="flex flex-col min-h-[400px] items-center justify-center flex-1 gap-4 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
              <Icon icon="power" className="w-8 h-8 text-muted-foreground" />
            </div>
            <Text variant="medium" className="text-lg">All caught up!</Text>
            <Text variant="regular" className="text-muted-foreground">No pending key results found.</Text>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {inboxKeyResults.map(keyResult => (
              <KeyResultSquare
                key={keyResult.keyResultId}
                {...keyResult}
                objectives={objectives}
                onClick={() => {
                  // Optional: open edit dialog or details
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
