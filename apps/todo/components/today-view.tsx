"use client"

import { Todo } from "@/types/todo"
import { TodoSquare } from "./todo-square"
import { Text } from "@aliveui"
import { format } from "date-fns"

interface TodayViewProps {
    todos: Todo[]
}

export function TodayView({ todos }: TodayViewProps) {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0-6

    const todayTodos = todos.filter(todo => {
        // 1. If completed today (optional logic, maybe we hide completed?)
        // 2. If recurrence matches today
        if (todo.recurrence) {
            if (todo.recurrence.type === 'daily') return true
            if (todo.recurrence.type === 'weekly' && todo.recurrence.days?.includes(dayOfWeek)) return true
        }

        // 3. If created today (for non-recurring)
        const createdDate = new Date(todo.createdAt)
        if (createdDate.toDateString() === today.toDateString()) return true

        // 4. If not completed and not recurring (backlog) - optional, for now let's just show active stuff
        if (!todo.completed && !todo.recurrence) return true

        return false
    })

    if (todayTodos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-3xl border border-dashed">
                <Text variant="medium" className="text-muted-foreground">No tasks for today</Text>
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
                {todayTodos.map(todo => (
                    <TodoSquare
                        key={todo.todoId}
                        {...todo}
                    />
                ))}
            </div>
        </div>
    )
}
