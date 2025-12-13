"use client"

import { useState, useEffect } from "react"
import { Button, Text, Icon } from "@aliveui"
import { getTodayKeyResults } from "@/actions/get-today-key-results"
import { getObjectives } from "@/actions/objective-actions"
import type { KeyResult, Objective } from "@/types/key-results"
import { KeyResultSquare } from "@/components/key-result-square"
import { AddKeyResultDrawer } from "@/components/add-key-result-drawer"

export default function TodayPage() {
  const [keyResults, setKeyResults] = useState<KeyResult[]>([])
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    try {
      const [todayResults, objectivesData] = await Promise.all([
        getTodayKeyResults(),
        getObjectives()
      ])
      setKeyResults(todayResults)
      setObjectives(objectivesData.objectives || [])
    } catch (error) {
      console.error("Failed to load today's data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="flex flex-col h-full gap-4 max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Icon icon="calendar" className="w-5 h-5 text-primary" />
            </div>
            <Text variant="bold" className="text-3xl">Today</Text>
          </div>
          <Text variant="regular" className="text-muted-foreground">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </div>
        <AddKeyResultDrawer onSuccess={loadData} />
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : keyResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center min-h-[400px]">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
            <Icon icon="check" className="w-8 h-8 text-muted-foreground" />
          </div>
          <Text variant="medium" className="text-lg">All clear for today!</Text>
          <Text variant="regular" className="text-muted-foreground">
            No key results scheduled for today.
          </Text>
          <AddKeyResultDrawer 
            onSuccess={loadData}
            trigger={
              <Button variant="outline" className="mt-4">
                Add something for today
              </Button>
            }
          />
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {keyResults.map(keyResult => (
            <KeyResultSquare
              key={keyResult.keyResultId}
              {...keyResult}
              objectives={objectives}
              onClick={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}
