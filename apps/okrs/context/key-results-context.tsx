"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getKeyResults } from "@/actions/key-results-actions"
import type { KeyResult, Objective, KeyResultResponse } from "@/types/key-results"

interface KeyResultsContextType {
    keyResults: KeyResult[]
    objectives: Objective[]
    isLoading: boolean
    refreshKeyResults: () => Promise<void>
}

const KeyResultsContext = createContext<KeyResultsContextType | undefined>(undefined)

export function KeyResultsProvider({
    children,
    initialData
}: {
    children: React.ReactNode
    initialData?: KeyResultResponse
}) {
    const [keyResults, setKeyResults] = useState<KeyResult[]>(initialData?.keyResults || [])
    const [objectives, setObjectives] = useState<Objective[]>(initialData?.objectives || [])
    const [isLoading, setIsLoading] = useState(!initialData)

    const refreshKeyResults = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await getKeyResults()
            setKeyResults(response.keyResults || [])
            setObjectives(response.objectives || [])
        } catch (error) {
            console.error("Failed to refresh key results:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Initial fetch if no data provided
    useEffect(() => {
        if (!initialData) {
            refreshKeyResults()
        }
    }, [initialData, refreshKeyResults])

    return (
        <KeyResultsContext.Provider value={{ keyResults, objectives, isLoading, refreshKeyResults }}>
            {children}
        </KeyResultsContext.Provider>
    )
}

export function useKeyResultsContext() {
    const context = useContext(KeyResultsContext)
    if (context === undefined) {
        throw new Error("useKeyResultsContext must be used within a KeyResultsProvider")
    }
    return context
}
