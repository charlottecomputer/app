"use client"

import { useState, useEffect } from "react"
import { getKeyResults } from "@/actions/key-results-actions"
import { getObjectives } from "@/actions/objective-actions"
import { ObjectivesAccordion } from "@/components/objectives-accordion"
import { KeyResult, Objective } from "@/types/key-results"
import { Button, Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, Icon } from "@aliveui"
import { AddObjectiveForm } from "@/components/add-objective-form"
import { Plus } from "lucide-react"

export default function ObjectivesPage() {
  const [keyResults, setKeyResults] = useState<KeyResult[]>([])
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const loadData = async () => {
    const { keyResults } = await getKeyResults()
    const { objectives } = await getObjectives()
    setKeyResults(keyResults)
    setObjectives(objectives || [])
  }

  useEffect(() => {
    loadData()
  }, [])

  // Group keyResults by objective
  const keyResultsByObjective = keyResults.reduce((acc, keyResult) => {
    if (keyResult.projectId) {
      if (!acc[keyResult.projectId]) acc[keyResult.projectId] = []
      acc[keyResult.projectId].push(keyResult)
    }
    return acc
  }, {} as Record<string, KeyResult[]>)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Objectives</h1>
          <p className="text-muted-foreground">Track your high-level goals and their key results.</p>
        </div>

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Objective
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm h-[85vh] flex flex-col">
              <DrawerHeader>
                <DrawerTitle>New Objective</DrawerTitle>
              </DrawerHeader>
              <div className="flex-1 overflow-y-auto p-4 pb-8">
                <AddObjectiveForm
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

      <ObjectivesAccordion
        objectives={objectives}
        keyResultsByObjective={keyResultsByObjective}
      />
    </div>
  )
}
