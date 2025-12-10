import { useTodoContext } from "../context/todo-context"
import { useMemo } from "react"

export function useTodos() {
    const { tasks, projects, isLoading, refreshTasks } = useTodoContext()

    const todayTasks = useMemo(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return tasks.filter(task => {
            // 1. Check specific due date
            if (task.dueDate) {
                const dueDate = new Date(task.dueDate)
                dueDate.setHours(0, 0, 0, 0)
                if (dueDate.getTime() === today.getTime()) return true
            }

            // 2. Check recurrence
            if (task.recurrence) {
                const { type, days } = task.recurrence
                const dayOfWeek = today.getDay() // 0 = Sunday

                if (type === 'daily') return true
                if (type === 'weekdays') return dayOfWeek >= 1 && dayOfWeek <= 5
                if (type === 'weekly' && days?.includes(dayOfWeek)) return true
                if (type === 'monthly') return today.getDate() === (task.recurrence.dayOfMonth || new Date(task.createdAt).getDate())
                if (type === 'yearly') {
                    const created = new Date(task.createdAt)
                    return today.getDate() === created.getDate() && today.getMonth() === created.getMonth()
                }
            }

            return false
        })
    }, [tasks])

    const dailyProgress = useMemo(() => {
        const total = todayTasks.length
        const completed = todayTasks.filter(t => t.completed).length
        return { total, current: completed }
    }, [todayTasks])

    return {
        tasks,
        projects,
        isLoading,
        refreshTasks,
        todayTasks,
        dailyProgress
    }
}
