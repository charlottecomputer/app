import { Recurrence } from "@/types/key-results"

export function getRecurrenceLabel(recurrence?: Recurrence): string {
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
