"use client"

import { useState, useEffect } from "react"
import { Task, Subtask } from "@/types/todo"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
    Button,
    Input,
    Label
} from "@aliveui"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash, X } from "lucide-react"
import { updateTask, updateSubtask, createSubtask, deleteTask, deleteSubtask } from "@/actions/key-results-actions"
import { cn } from "@aliveui"

interface TaskDrawerProps {
    task: Task | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

function SortableSubtaskItem({ subtask, onDelete }: { subtask: Subtask; onDelete: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: subtask.subtaskId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-2 bg-muted/30 p-2 rounded-md mb-2">
            <div {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
                <GripVertical className="h-4 w-4" />
            </div>
            <div className="flex-1 flex items-center gap-2">
                <span>{subtask.emoji}</span>
                <span className="text-sm font-medium">{subtask.content}</span>
                <span className="text-xs text-muted-foreground">({subtask.requiredTouches} clicks)</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={onDelete}>
                <X className="h-3 w-3" />
            </Button>
        </div>
    );
}

export function TaskDrawer({ task, open, onOpenChange }: TaskDrawerProps) {
    const [title, setTitle] = useState("")
    const [subtasks, setSubtasks] = useState<Subtask[]>([])
    const [newSubtask, setNewSubtask] = useState("")
    const [newSubtaskTouches, setNewSubtaskTouches] = useState(1)

    useEffect(() => {
        if (task) {
            setTitle(task.content)
            setSubtasks(task.subtasks || [])
        }
    }, [task])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setSubtasks((items) => {
                const oldIndex = items.findIndex((item) => item.subtaskId === active.id);
                const newIndex = items.findIndex((item) => item.subtaskId === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
            // TODO: Persist order to backend if we add an 'order' field to Subtask
        }
    };

    const handleUpdateTitle = async () => {
        if (!task || !title.trim() || title === task.content) return
        try {
            await updateTask({ taskId: task.taskId, content: title })
        } catch (error) {
            console.error("Failed to update task title", error)
        }
    }

    const handleAddSubtask = async () => {
        if (!task || !newSubtask.trim()) return

        const emojis = ["🍎", "💧", "📚", "🏃", "🧘", "💊", "💻", "🧹"]
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]

        // Optimistic add
        const tempSub: Subtask = {
            subtaskId: `temp-${Date.now()}`,
            taskId: task.taskId,
            content: newSubtask,
            completed: false,
            requiredTouches: newSubtaskTouches,
            currentTouches: 0,
            createdAt: new Date().toISOString(),
            emoji: randomEmoji
        }
        setSubtasks([...subtasks, tempSub])
        setNewSubtask("")
        setNewSubtaskTouches(1)

        try {
            await createSubtask(task.taskId, newSubtask, newSubtaskTouches, randomEmoji)
            // Revalidation will update the list with real ID
        } catch (error) {
            console.error("Failed to create subtask", error)
            // Revert optimistic update?
        }
    }

    const handleDeleteSubtask = async (subtaskId: string) => {
        // Optimistic delete
        setSubtasks(subtasks.filter(s => s.subtaskId !== subtaskId))

        try {
            await deleteSubtask(subtaskId)
        } catch (error) {
            console.error("Failed to delete subtask", error)
            // Revert optimistic delete?
        }
    }

    if (!task) return null

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Edit Task</DrawerTitle>
                        <DrawerDescription>Make changes to your task here.</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Task Title</Label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={handleUpdateTitle}
                                className="text-lg font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Subtasks</Label>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={subtasks.map(s => s.subtaskId)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-2">
                                        {subtasks.map((sub) => (
                                            <SortableSubtaskItem
                                                key={sub.subtaskId}
                                                subtask={sub}
                                                onDelete={() => handleDeleteSubtask(sub.subtaskId)}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>

                            <div className="flex gap-2 mt-2">
                                <Input
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                    placeholder="Add subtask..."
                                    className="flex-1"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAddSubtask()
                                        }
                                    }}
                                />
                                <Input
                                    type="number"
                                    value={newSubtaskTouches}
                                    onChange={(e) => setNewSubtaskTouches(parseInt(e.target.value) || 1)}
                                    className="w-16"
                                    min={1}
                                />
                                <Button size="icon" onClick={handleAddSubtask}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
