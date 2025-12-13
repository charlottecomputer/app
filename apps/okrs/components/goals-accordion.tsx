"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    cn,
    Icon,
    Text
} from "@aliveui"
import { Project, Task } from "@/types/todo"
import { TodoSquare } from "./key-result-square"
import { TaskDrawer } from "./task-drawer"
import { useState } from "react"

interface GoalsAccordionProps {
    projects: Project[]
    tasksByProject: Record<string, Task[]>
}

export function GoalsAccordion({ projects, tasksByProject }: GoalsAccordionProps) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    if (projects.length === 0) {
        return (
            <div className="p-8 text-center border border-dashed rounded-3xl text-muted-foreground">
                No goals yet. Create one to get started!
            </div>
        )
    }

    return (
        <Accordion type="single" collapsible className="w-full space-y-4">
            {projects.map((project) => {
                const projectTasks = tasksByProject[project.projectId] || []
                const completedTasks = projectTasks.filter(t => t.completed).length
                const totalTasks = projectTasks.length
                const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

                return (
                    <AccordionItem key={project.projectId} value={project.projectId} className="border-none">
                        <AccordionTrigger className="hover:no-underline py-0 group">
                            <div className="grid grid-cols-[auto_1fr] gap-4 w-full bg-sidebar p-4 rounded-2xl border transition-all group-data-[state=open]:rounded-b-none group-data-[state=open]:border-b-0">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                                    {project.emoji || "📁"}
                                </div>
                                <div className="flex flex-col gap-2 min-w-0">
                                    <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                                        <Text variant="bold" size="lg" className="truncate">
                                            {project.name}
                                        </Text>
                                        <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                                            {completedTasks}/{totalTasks} done
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                                            style={{ width: `${progress}%`, backgroundColor: project.color }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-0 pb-0">
                            <div className="bg-sidebar border border-t-0 rounded-b-2xl p-4 pt-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {projectTasks.map(task => (
                                        <TodoSquare
                                            key={task.taskId}
                                            {...task}
                                            projects={projects}
                                            hideSubtasks={false}
                                            onClick={() => {
                                                setSelectedTask(task)
                                                setIsDrawerOpen(true)
                                            }}
                                        />
                                    ))}
                                </div>
                                {projectTasks.length === 0 && (
                                    <div className="text-center py-4 text-muted-foreground text-sm">
                                        No tasks in this goal yet.
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
            <TaskDrawer
                task={selectedTask}
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
            />
        </Accordion>
    )
}
