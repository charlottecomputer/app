"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getTasks } from "@/actions/todo-actions"
import type { Task, Project, TodosResponse } from "@/types/todo"

interface TodoContextType {
    tasks: Task[]
    projects: Project[]
    isLoading: boolean
    refreshTasks: () => Promise<void>
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export function TodoProvider({
    children,
    initialData
}: {
    children: React.ReactNode
    initialData?: TodosResponse
}) {
    const [tasks, setTasks] = useState<Task[]>(initialData?.tasks || [])
    const [projects, setProjects] = useState<Project[]>(initialData?.projects || [])
    const [isLoading, setIsLoading] = useState(!initialData)

    const refreshTasks = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await getTasks()
            setTasks(response.tasks || [])
            setProjects(response.projects || [])
        } catch (error) {
            console.error("Failed to refresh tasks:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Initial fetch if no data provided
    useEffect(() => {
        if (!initialData) {
            refreshTasks()
        }
    }, [initialData, refreshTasks])

    return (
        <TodoContext.Provider value={{ tasks, projects, isLoading, refreshTasks }}>
            {children}
        </TodoContext.Provider>
    )
}

export function useTodoContext() {
    const context = useContext(TodoContext)
    if (context === undefined) {
        throw new Error("useTodoContext must be used within a TodoProvider")
    }
    return context
}
