"use client"

import { KeyResult, Objective } from "@/types/key-results"
import { KeyResultSquare } from "./key-result-square"
import { Text } from "@aliveui"
import { format } from "date-fns"

interface TodayViewProps {
    keyResults: KeyResult[]
    objectives?: Objective[]
}

export function TodayView({ keyResults, objectives = [] }: TodayViewProps) {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0-6

    const todayKeyResults = keyResults.filter(keyResult => {
        // 1. If completed today (optional logic, maybe we hide completed?)
        // 2. If recurrence matches today
        if (keyResult.recurrence) {
            if (keyResult.recurrence.type === 'daily') return true
            if (keyResult.recurrence.type === 'weekly' && keyResult.recurrence.days?.includes(dayOfWeek)) return true
        }

        // 3. If created today (for non-recurring)
        const createdDate = new Date(keyResult.createdAt)
        if (createdDate.toDateString() === today.toDateString()) return true

        // 4. If not completed and not recurring (backlog) - optional, for now let's just show active stuff
        if (!keyResult.completed && !keyResult.recurrence) return true

        return false
    })

    if (todayKeyResults.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-3xl border border-dashed">
                <Text variant="medium" className="text-muted-foreground">No key results for today</Text>
                <Text variant="regular" className="text-sm text-muted-foreground/60">Enjoy your free time!</Text>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-baseline justify-between">
                <Text variant="bold" className="text-2xl font-bold">Today</Text>
                <Text variant="regular" className="text-muted-foreground">
                    {format(today, "EEEE, MMMM do")}
                </Text>
            </div>

            <div className="flex flex-wrap gap-4">
                {todayKeyResults.map(keyResult => (
                    <KeyResultSquare
                        key={keyResult.keyResultId}
                        {...keyResult}
                        objectives={objectives}
                    />
                ))}
            </div>
        </div>
    )
}
