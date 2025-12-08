import { BentoCard } from "@aliveui/ui/bento-card"
import { Avatar, AvatarFallback, AvatarImage, Button, Text, Checkbox } from "@aliveui"
import { Icon } from "@aliveui/ui/icon"
import { AppIcon } from "@aliveui/ui/app-icon"
import { ChevronRight, Plus } from "lucide-react"

interface UserProfileCardProps {
    user: {
        name: string
        email: string
        avatar: string
    }
}

export function UserProfileCard({ user }: UserProfileCardProps) {
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()

    return (
        <BentoCard className="col-span-1">
            <div className="flex flex-col items-start gap-4 py-4">
                <div className=" grayscale shadow-inset shadow-[inset_0px_4px_18px_10px_var(--muted)]   border-0 rounded-[3px] p-1">
                    <Avatar className="h-40 w-40">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="text-center flex flex-col text-left">
                    <Text size="4xl" variant="ultralight">{user.name}</Text>
                    <Text size="sm" variant="light" className="text-muted-foreground">{user.email}</Text>
                    <Text size="xs" variant="light" className="text-muted-foreground mt-1">Artist</Text>
                </div>
            </div>
        </BentoCard>
    )
}

// Import from todo app - these will need to be exposed as shared types
type Todo = {
    userId: string
    todoId: string
    content: string
    completed: boolean
    createdAt: string
}

// Mock function for now - will be replaced with actual API call
function getTodayTodos(limit: number = 3): Todo[] {
    // This will need to fetch from the todo app's API or database
    // For now, return empty array
    return []
}

function TodoPreviewItem({ todo }: { todo: Todo }) {
    return (
        <div className="flex items-start gap-3 py-2">
            <Checkbox checked={todo.completed} disabled className="mt-0.5" />
            <div className="flex-1">
                <span className={`text-sm ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                    {todo.content}
                </span>
            </div>
        </div>
    )
}

export function TodoPreviewCard() {
    const todos = getTodayTodos(3)

    return (
        <BentoCard
            title="Todo"
            icon="todo"
            action={
                <Button variant="ghost" size="icon" asChild>
                    <a href="http://localhost:3001">
                        <ChevronRight className="h-4 w-4" />
                    </a>
                </Button>
            }
            className="col-span-1 md:col-span-2"
        >
            {todos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                        <Icon icon="calendar" className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <Text variant="medium" className="text-sm">No tasks for today</Text>
                    <Text variant="regular" className="text-xs text-muted-foreground mt-1">
                        Add your first task to get started
                    </Text>
                    <Button variant="outline" size="sm" className="mt-4" asChild>
                        <a href="http://localhost:3001">
                            <Plus className="h-4 w-4 mr-2" />
                            Add task
                        </a>
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {todos.map((todo) => (
                        <TodoPreviewItem key={todo.todoId} todo={todo} />
                    ))}
                    {todos.length === 3 && (
                        <Button variant="ghost" size="sm" className="mt-2 justify-start" asChild>
                            <a href="http://localhost:3001">
                                View all tasks
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </a>
                        </Button>
                    )}
                </div>
            )}
        </BentoCard>
    )
}

type Event = {
    id: string
    title: string
    time: string
    date: string
    color?: string
}

const upcomingEvents: Event[] = [
    {
        id: "1",
        title: "Team Sync",
        time: "10:00 AM",
        date: "Today",
        color: "bg-chart-2",
    },
    {
        id: "2",
        title: "Design Review",
        time: "2:00 PM",
        date: "Today",
        color: "bg-chart-1",
    },
    {
        id: "3",
        title: "Project Planning",
        time: "11:00 AM",
        date: "Tomorrow",
        color: "bg-chart-3",
    },
]

function EventItem({ event }: { event: Event }) {
    return (
        <div className="flex items-center gap-3 py-2">
            <div className={`w-1 h-8 rounded-full ${event.color || "bg-gray-400"}`} />
            <div className="flex-1">
                <Text variant="medium" className="text-sm line-clamp-1">{event.title}</Text>
                <Text variant="regular" className="text-xs text-muted-foreground">
                    {event.time} • {event.date}
                </Text>
            </div>
        </div>
    )
}

export function CalendarPreviewCard() {
    return (
        <BentoCard
            title="Calendar"
            icon="calendar"
            noBackground
            action={
                <Button variant="ghost" size="icon" asChild>
                    <a href="http://localhost:3002">
                        <ChevronRight className="h-4 w-4" />
                    </a>
                </Button>
            }
            className="col-span-1 md:col-span-1"
        >
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                    {upcomingEvents.map((event) => (
                        <EventItem key={event.id} event={event} />
                    ))}
                </div>
                <Button variant="ghost" size="sm" className="mt-2 justify-start" asChild>
                    <a href="http://localhost:3002">
                        View schedule
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </a>
                </Button>
            </div>
        </BentoCard>
    )
}

export const mockapps = [
    {
        name: "Todo",
        icon: "todo" as const,
        color: "bg-chart-1",
        url: "http://localhost:3001"
    },
    {
        name: "Calendar",
        icon: "calendar" as const,
        color: "bg-chart-2",
        url: "http://localhost:3002"
    },
    {
        name: "Mad Cooking",
        icon: "chef",
        color: "bg-chart-3",
        url: "http://localhost:3002"
    },
    {
        name: "Quiz Creator",
        icon: "quiz",
        color: "bg-chart-4",
        url: "http://localhost:3002"
    },
    {
        name: "Aspie Chat",
        icon: "chat",
        color: "bg-chart-5",
        url: "http://localhost:3002"
    },
    {
        name: "Tea Creations",
        icon: "tea",
        color: "bg-chart-2",
        url: "http://localhost:3002"
    },
    {
        name: "Journal",
        icon: "journal",
        color: "bg-chart-3",
        url: "http://localhost:3002"
    },
    {
        name: "Hypertrophy",
        icon: "weight",
        color: "bg-chart-1",
        url: "http://localhost:3002"
    },
    // Future apps can be added here
]

export function AppsGridCard() {
    return (
        <BentoCard
            title="Apps"
            className="col-span-1 md:col-span-2"
        >
            <div className="grid grid-cols-5 gap-4 py-4">
                {mockapps.map((app) => (
                    <a key={app.name} href={app.url}>
                        <AppIcon
                            icon={app.icon as any}
                            label={app.name}
                            color={app.color}
                            size="lg"
                        />
                    </a>
                ))}
            </div>
        </BentoCard>
    )
}

export function BentoGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 max-w-5xl mx-auto">
            <UserProfileCard user={{ name: "Charlotte", email: "hey.charlotte@icloud.com", avatar: "https://github.com/shadcn.png" }} />
            <AppsGridCard />
            <TodoPreviewCard />
            <CalendarPreviewCard />
        </div>
    )
}
