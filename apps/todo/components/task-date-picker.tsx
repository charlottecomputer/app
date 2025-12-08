"use client"

import * as React from "react"
import { Calendar } from "@aliveui"
import { Button } from "@aliveui"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@aliveui"
import { Calendar as CalendarIcon, Sun, Armchair, ArrowRightCircle, Ban, X } from "lucide-react"
import { addDays, format, nextMonday, nextSaturday, startOfToday } from "date-fns"
import { cn } from "@aliveui"

interface TaskDatePickerProps {
    date?: Date
    onDateChange: (date?: Date) => void
}

export function TaskDatePicker({ date, onDateChange }: TaskDatePickerProps) {
    const today = startOfToday()

    const handleSelect = (newDate?: Date) => {
        onDateChange(newDate)
        // We don't close automatically to allow further interaction if needed, 
        // but typically selecting a date closes the dropdown. 
        // Radix DropdownMenuItem closes by default.
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MMM d") : "Date"}
                    {date && (
                        <span
                            className="ml-2 hover:bg-muted rounded-full p-0.5"
                            onClick={(e) => {
                                e.stopPropagation()
                                onDateChange(undefined)
                            }}
                        >
                            <X className="h-3 w-3" />
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto p-0" align="start">
                <div className="p-2 grid gap-1">
                    <DropdownMenuItem onClick={() => handleSelect(today)}>
                        <CalendarIcon className="mr-2 h-4 w-4 text-green-500" />
                        <span>Today</span>
                        <span className="ml-auto text-xs text-muted-foreground">{format(today, "E")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSelect(addDays(today, 1))}>
                        <Sun className="mr-2 h-4 w-4 text-orange-500" />
                        <span>Tomorrow</span>
                        <span className="ml-auto text-xs text-muted-foreground">{format(addDays(today, 1), "E")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSelect(nextSaturday(today))}>
                        <Armchair className="mr-2 h-4 w-4 text-blue-500" />
                        <span>This weekend</span>
                        <span className="ml-auto text-xs text-muted-foreground">{format(nextSaturday(today), "E")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSelect(nextMonday(today))}>
                        <ArrowRightCircle className="mr-2 h-4 w-4 text-purple-500" />
                        <span>Next week</span>
                        <span className="ml-auto text-xs text-muted-foreground">{format(nextMonday(today), "MMM d")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSelect(undefined)}>
                        <Ban className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>No Date</span>
                    </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                        initialFocus
                    />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
