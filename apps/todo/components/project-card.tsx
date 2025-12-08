"use client"

import { useState } from "react"
import { Todo, Project } from "@/types/todo"
import { TodoSquare } from "./todo-square"
import { Text } from "@aliveui"
import { Plus, MoreHorizontal, Settings } from "lucide-react"
import { AddTaskForm } from "./add-task-form"
import { EditProjectDialog } from "./edit-project-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Button
} from "@aliveui"

interface ProjectCardProps {
    project: Project
    todos: Todo[]
    projects?: Project[]
}

export function ProjectCard({ project, todos, projects = [] }: ProjectCardProps) {
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [isEditingProject, setIsEditingProject] = useState(false)
    const totalTodos = todos.length
    const completedTodos = todos.filter(t => t.completed).length

    // Calculate total progress based on touches if we want to be precise, 
    // but for now simple task completion ratio is a good start.
    const progress = totalTodos === 0 ? 0 : (completedTodos / totalTodos) * 100

    return (
        <>
            <div className="flex flex-col gap-4 p-6 rounded-3xl bg-card border shadow-sm group relative">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                            {project.emoji || "📁"}
                        </div>
                        <div>
                            <Text variant="medium" className="text-lg">{project.name}</Text>
                            <Text variant="regular" className="text-xs text-muted-foreground">
                                {completedTodos}/{totalTodos} tasks completed
                            </Text>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-12 text-right font-mono text-sm text-muted-foreground">
                            {Math.round(progress)}%
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsEditingProject(true)}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Edit Project
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Todos Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                    {todos.map(todo => (
                        <TodoSquare
                            key={todo.todoId}
                            {...todo}
                            projects={projects}
                        />
                    ))}

                    {/* Add Task Placeholder */}
                    {isAddingTask ? (
                        <div className="col-span-full">
                            <AddTaskForm
                                projects={projects}
                                defaultProjectId={project.projectId}
                                onCancel={() => setIsAddingTask(false)}
                                onSuccess={() => setIsAddingTask(false)}
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAddingTask(true)}
                            className="w-24 h-24 rounded-2xl border-2 border-dashed border-muted hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Plus className="w-6 h-6" />
                            <span className="text-xs font-medium">Add Task</span>
                        </button>
                    )}
                </div>
            </div>

            <EditProjectDialog
                project={project}
                open={isEditingProject}
                onOpenChange={setIsEditingProject}
            />
        </>
    )
}
