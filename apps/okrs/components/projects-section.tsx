"use client"

import { useState } from "react"
import { Project, Task } from "@/types/todo"
import { ProjectCard } from "./project-card"
import { CreateProjectForm } from "./create-project-form"
import { Button, Text, Icon } from "@aliveui"
import { Plus } from "lucide-react"

interface ProjectsSectionProps {
    projects: Project[]
    tasksByProject: Record<string, Task[]>
    title?: string
}

export function ProjectsSection({ projects, tasksByProject, title = "Projects" }: ProjectsSectionProps) {
    const [showCreateForm, setShowCreateForm] = useState(false)

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <Text variant="bold" className="text-2xl font-bold">{title}</Text>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    icon={<Plus className="w-4 h-4" />}
                >
                    New Project
                </Button>
            </div>

            {showCreateForm && (
                <div className="mb-6">
                    <CreateProjectForm
                        onCancel={() => setShowCreateForm(false)}
                        onSuccess={() => setShowCreateForm(false)}
                    />
                </div>
            )}

            {projects.length === 0 && !showCreateForm ? (
                <div className="p-8 text-center border border-dashed rounded-3xl text-muted-foreground">
                    No projects yet. Create one to get started!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map(project => (
                        <ProjectCard
                            key={project.projectId}
                            project={project}
                            tasks={tasksByProject[project.projectId] || []}
                            projects={projects}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
