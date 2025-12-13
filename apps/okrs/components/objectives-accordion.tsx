"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Text
} from "@aliveui"
import { Objective, KeyResult } from "@/types/key-results"
import { KeyResultSquare } from "./key-result-square"

interface ObjectivesAccordionProps {
    objectives: Objective[]
    keyResultsByObjective: Record<string, KeyResult[]>
}

export function ObjectivesAccordion({ objectives, keyResultsByObjective }: ObjectivesAccordionProps) {
    if (objectives.length === 0) {
        return (
            <div className="p-8 text-center border border-dashed rounded-3xl text-muted-foreground">
                No objectives yet. Create one to get started!
            </div>
        )
    }

    return (
        <Accordion type="single" collapsible className="w-full space-y-4">
            {objectives.map((objective) => {
                const projectKeyResults = keyResultsByObjective[objective.projectId] || []
                const completedKeyResults = projectKeyResults.filter(t => t.completed).length
                const totalKeyResults = projectKeyResults.length
                const progress = totalKeyResults > 0 ? (completedKeyResults / totalKeyResults) * 100 : 0

                return (
                    <AccordionItem key={objective.projectId} value={objective.projectId} className="border-none">
                        <AccordionTrigger className="hover:no-underline py-0 group">
                            <div className="grid grid-cols-[auto_1fr] gap-4 w-full bg-sidebar p-4 rounded-2xl border transition-all group-data-[state=open]:rounded-b-none group-data-[state=open]:border-b-0">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                                    {objective.icon || "🎯"}
                                </div>
                                <div className="flex flex-col gap-2 min-w-0">
                                    <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                                        <Text variant="bold" size="lg" className="truncate">
                                            {objective.name}
                                        </Text>
                                        <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                                            {completedKeyResults}/{totalKeyResults} done
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                                            style={{ width: `${progress}%`, backgroundColor: objective.color }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-0 pb-0">
                            <div className="bg-sidebar border border-t-0 rounded-b-2xl p-4 pt-0">
                                <div className="flex flex-wrap gap-3">
                                    {projectKeyResults.map(keyResult => (
                                        <KeyResultSquare
                                            key={keyResult.keyResultId}
                                            {...keyResult}
                                            objectives={objectives}
                                        />
                                    ))}
                                </div>
                                {projectKeyResults.length === 0 && (
                                    <div className="text-center py-4 text-muted-foreground text-sm">
                                        No key results in this objective yet.
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    )
}
