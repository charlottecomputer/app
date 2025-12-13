import { useMemo } from "react"
import { useKeyResultsContext } from "../context/key-results-context"

export function useKeyResults() {
    const { keyResults, objectives, isLoading, refreshKeyResults } = useKeyResultsContext()

    const todayKeyResults = useMemo(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return keyResults.filter(keyResult => {
            // 1. Check specific due date
            if (keyResult.dueDate) {
                const dueDate = new Date(keyResult.dueDate)
                dueDate.setHours(0, 0, 0, 0)
                if (dueDate.getTime() === today.getTime()) return true
            }

            // 2. Check recurrence
            if (keyResult.recurrence) {
                const { type, days } = keyResult.recurrence
                const dayOfWeek = today.getDay() // 0 = Sunday

                if (type === 'daily') return true
                if (type === 'weekdays') return dayOfWeek >= 1 && dayOfWeek <= 5
                if (type === 'weekly' && days?.includes(dayOfWeek)) return true
                if (type === 'monthly') return today.getDate() === (keyResult.recurrence.dayOfMonth || new Date(keyResult.createdAt).getDate())
                if (type === 'yearly') {
                    const created = new Date(keyResult.createdAt)
                    return today.getDate() === created.getDate() && today.getMonth() === created.getMonth()
                }
            }

            return false
        })
    }, [keyResults])

    const dailyProgress = useMemo(() => {
        const total = todayKeyResults.length
        const completed = todayKeyResults.filter(k => k.completed).length
        return { total, current: completed }
    }, [todayKeyResults])

    return {
        keyResults,
        objectives,
        isLoading,
        refreshKeyResults,
        todayKeyResults,
        dailyProgress
    }
}
