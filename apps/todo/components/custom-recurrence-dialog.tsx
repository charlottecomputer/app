"use client"

import { useState, useEffect } from "react"
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@aliveui"
import { Icon } from "@aliveui"
import { Recurrence, RecurrenceUnit, RecurrenceBasis } from "@/types/todo"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@aliveui"
import { Circle, CircleDot, ChevronDown, X } from "lucide-react"
import { format, addDays, addWeeks, addMonths, addYears } from "date-fns"
import { TaskDatePicker } from "./task-date-picker"

interface CustomRecurrenceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (recurrence: Recurrence) => void
    defaultRecurrence?: Recurrence
}

const UNITS: { label: string; value: RecurrenceUnit }[] = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" },
]

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"]

export function CustomRecurrenceDialog({ open, onOpenChange, onSave, defaultRecurrence }: CustomRecurrenceDialogProps) {
    const [basis, setBasis] = useState<RecurrenceBasis>(defaultRecurrence?.basis || "scheduled")
    const [interval, setInterval] = useState(defaultRecurrence?.interval || 1)
    const [unit, setUnit] = useState<RecurrenceUnit>(defaultRecurrence?.unit || "week")
    const [selectedDays, setSelectedDays] = useState<number[]>(defaultRecurrence?.days || [])
    const [ends, setEnds] = useState<"never" | "date">(defaultRecurrence?.endDate ? "date" : "never")
    const [endDate, setEndDate] = useState<Date | undefined>(defaultRecurrence?.endDate ? new Date(defaultRecurrence.endDate) : undefined)

    // Reset state when dialog opens
    useEffect(() => {
        if (open) {
            setBasis(defaultRecurrence?.basis || "scheduled")
            setInterval(defaultRecurrence?.interval || 1)
            setUnit(defaultRecurrence?.unit || "week")
            setSelectedDays(defaultRecurrence?.days || [])
            setEnds(defaultRecurrence?.endDate ? "date" : "never")
            setEndDate(defaultRecurrence?.endDate ? new Date(defaultRecurrence.endDate) : undefined)
        }
    }, [open, defaultRecurrence])

    const handleSave = () => {
        const recurrence: Recurrence = {
            type: 'custom',
            interval,
            unit,
            basis,
            days: unit === 'week' ? selectedDays : undefined,
            endDate: ends === 'date' ? endDate?.toISOString() : undefined
        }
        onSave(recurrence)
        onOpenChange(false)
    }

    const toggleDay = (dayIndex: number) => {
        if (selectedDays.includes(dayIndex)) {
            setSelectedDays(selectedDays.filter(d => d !== dayIndex))
        } else {
            setSelectedDays([...selectedDays, dayIndex].sort())
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Custom repeat</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-6 py-4">
                    {/* Based on */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-sm">Based on</h4>
                        <div className="space-y-2">
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setBasis("scheduled")}
                            >
                                {basis === "scheduled" ? <CircleDot className="w-4 h-4 text-primary" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                                <span className="text-sm">Scheduled date</span>
                            </div>
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setBasis("completed")}
                            >
                                {basis === "completed" ? <CircleDot className="w-4 h-4 text-primary" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                                <span className="text-sm">Completed date</span>
                            </div>
                        </div>
                    </div>

                    {/* Every */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-sm">Every</h4>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                min="1"
                                value={interval}
                                onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                                className="w-20"
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex-1 justify-between">
                                        {UNITS.find(u => u.value === unit)?.label + (interval > 1 ? "s" : "")}
                                        <ChevronDown className="w-4 h-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[200px]">
                                    {UNITS.map(u => (
                                        <DropdownMenuItem key={u.value} onClick={() => setUnit(u.value)}>
                                            {u.label + (interval > 1 ? "s" : "")}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* On (Weekly only for now) */}
                    {unit === 'week' && (
                        <div className="space-y-3">
                            <h4 className="font-medium text-sm">On</h4>
                            <div className="flex gap-1 justify-between">
                                {WEEKDAYS.map((day, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => toggleDay(index)}
                                        className={`w-8 h-8 rounded-full text-xs font-medium transition-colors flex items-center justify-center
                                            ${selectedDays.includes(index)
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Ends */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-sm">Ends</h4>
                        <div className="space-y-2">
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setEnds("never")}
                            >
                                {ends === "never" ? <CircleDot className="w-4 h-4 text-primary" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                                <span className="text-sm">Never</span>
                            </div>
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setEnds("date")}
                            >
                                {ends === "date" ? <CircleDot className="w-4 h-4 text-primary" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                                <span className="text-sm">On date (inclusive)</span>
                            </div>
                            {ends === "date" && (
                                <div className="pl-6">
                                    <TaskDatePicker date={endDate} onDateChange={setEndDate} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
