"use client"

import * as React from "react"
import { Button } from "@aliveui"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@aliveui"
import { Repeat, X, Check } from "lucide-react"
import { Recurrence } from "@/types/todo"
import { cn } from "@aliveui"
import { CustomRecurrenceDialog } from "./custom-recurrence-dialog"

interface TaskRecurrencePickerProps {
    recurrence?: Recurrence
    onRecurrenceChange: (recurrence?: Recurrence) => void
}

export function TaskRecurrencePicker({ recurrence, onRecurrenceChange }: TaskRecurrencePickerProps) {
    const [customOpen, setCustomOpen] = React.useState(false)

    const getLabel = () => {
        if (!recurrence) return "Repeat"

        if (recurrence.type === 'custom') {
            const unit = recurrence.unit || 'day'
            const interval = recurrence.interval || 1
            const unitStr = interval === 1 ? unit : `${unit}s`
            let label = `Every ${interval === 1 ? '' : interval + ' '}${unitStr}`

            if (unit === 'week' && recurrence.days && recurrence.days.length > 0) {
                const days = recurrence.days.map(d => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]).join(", ")
                label += ` on ${days}`
            }

            if (recurrence.basis === 'completed') {
                label += " (after completion)"
            }

            return label
        }

        switch (recurrence.type) {
            case 'daily': return "Every day"
            case 'weekly': return "Every week"
            case 'weekdays': return "Every weekday"
            case 'monthly': return "Every month"
            case 'yearly': return "Every year"
            default: return "Repeat"
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className={cn("justify-start text-left font-normal", !recurrence && "text-muted-foreground")} icon={<Repeat className="h-4 w-4" />}>
                        <span className="truncate max-w-[150px]">{getLabel()}</span>
                        {recurrence && (
                            <span
                                className="ml-2 hover:bg-muted rounded-full p-0.5"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onRecurrenceChange(undefined)
                                }}
                            >
                                <X className="h-3 w-3" />
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuItem onClick={() => onRecurrenceChange({ type: 'daily' })}>
                        <span>Every day</span>
                        {recurrence?.type === 'daily' && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onRecurrenceChange({ type: 'weekly' })}>
                        <span>Every week</span>
                        {recurrence?.type === 'weekly' && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onRecurrenceChange({ type: 'weekdays' })}>
                        <span>Every weekday (Mon - Fri)</span>
                        {recurrence?.type === 'weekdays' && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onRecurrenceChange({ type: 'monthly' })}>
                        <span>Every month</span>
                        {recurrence?.type === 'monthly' && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onRecurrenceChange({ type: 'yearly' })}>
                        <span>Every year</span>
                        {recurrence?.type === 'yearly' && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setCustomOpen(true)}>
                        <span>Custom...</span>
                        {recurrence?.type === 'custom' && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    {recurrence && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onRecurrenceChange(undefined)}
                                className="text-destructive focus:text-destructive"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Clear
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <CustomRecurrenceDialog
                open={customOpen}
                onOpenChange={setCustomOpen}
                onSave={onRecurrenceChange}
                defaultRecurrence={recurrence?.type === 'custom' ? recurrence : undefined}
            />
        </>
    )
}
