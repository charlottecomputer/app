// "use client"

// import { useState, useEffect } from "react"
// import { updateSubtask, deleteSubtask } from "@/actions/key-results-actions"
// import { Subtask } from "@/types/todo"
// import {
//     Drawer,
//     DrawerContent,
//     DrawerHeader,
//     DrawerTitle,
//     DrawerDescription,
//     DrawerFooter,
//     DrawerClose,
//     Button,
//     Input,
//     Label,
//     cn
// } from "@aliveui"
// import { Trash } from "lucide-react"

// const COLORS = [
//     "#FF6B6B", "#FF9F43", "#FDCB6E", "#2ECC71", "#1ABC9C",
//     "#3498DB", "#9B59B6", "#E74C3C", "#FF8A65", "#F4D03F",
//     "#A2D9CE", "#82E0AA", "#85C1E9", "#D7BDE2", "#A04000"
// ]

// const EMOJIS = ["🍎", "💧", "📚", "🏃", "🧘", "💊", "💻", "🧹", "🏋️", "🎨", "🎸", "📝"]

// interface EditHabitDrawerProps {
//     habit: Subtask | null
//     open: boolean
//     onOpenChange: (open: boolean) => void
//     onSuccess?: () => void
// }

// export function EditHabitDrawer({ habit, open, onOpenChange, onSuccess }: EditHabitDrawerProps) {
//     const [content, setContent] = useState("")
//     const [emoji, setEmoji] = useState("🍎")
//     const [color, setColor] = useState(COLORS[0])
//     const [mode, setMode] = useState<'single' | 'count'>('single')
//     const [target, setTarget] = useState(1)
//     const [unit, setUnit] = useState("times")
//     const [frequency, setFrequency] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])
//     const [isLoading, setIsLoading] = useState(false)

//     useEffect(() => {
//         if (habit) {
//             setContent(habit.content)
//             setEmoji(habit.emoji || "🍎")
//             setColor(habit.color || COLORS[0])
//             setTarget(habit.requiredTouches || 1)
//             setUnit(habit.unit || "times")
//             setMode(habit.requiredTouches > 1 ? 'count' : 'single')
//             setFrequency(habit.frequency || [0, 1, 2, 3, 4, 5, 6])
//         }
//     }, [habit])

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
//         if (!habit || !content.trim()) return

//         setIsLoading(true)
//         try {
//             await updateSubtask({
//                 subtaskId: habit.subtaskId,
//                 taskId: habit.taskId,
//                 content,
//                 requiredTouches: mode === 'single' ? 1 : target,
//                 emoji,
//                 unit,
//                 color,
//                 frequency
//             })
//             onOpenChange(false)
//             onSuccess?.()
//         } catch (error) {
//             console.error("Failed to update habit:", error)
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     const handleDelete = async () => {
//         if (!habit) return
//         if (!confirm("Are you sure you want to delete this habit?")) return

//         setIsLoading(true)
//         try {
//             await deleteSubtask(habit.subtaskId)
//             onOpenChange(false)
//             onSuccess?.()
//         } catch (error) {
//             console.error("Failed to delete habit:", error)
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     const toggleDay = (dayIndex: number) => {
//         setFrequency(prev =>
//             prev.includes(dayIndex)
//                 ? prev.filter(d => d !== dayIndex)
//                 : [...prev, dayIndex]
//         )
//     }

//     const toggleAllDays = () => {
//         if (frequency.length === 7) {
//             setFrequency([])
//         } else {
//             setFrequency([0, 1, 2, 3, 4, 5, 6])
//         }
//     }

//     if (!habit) return null

//     return (
//         <Drawer open={open} onOpenChange={onOpenChange}>
//             <DrawerContent>
//                 <div className="mx-auto w-full max-w-sm h-[85vh] flex flex-col">
//                     <DrawerHeader>
//                         <DrawerTitle>Edit Habit</DrawerTitle>
//                         <DrawerDescription>Modify your habit details.</DrawerDescription>
//                     </DrawerHeader>

//                     <div className="flex-1 overflow-y-auto p-4 pb-8">
//                         <form onSubmit={handleSubmit} className="space-y-6">
//                             {/* Name & Emoji */}
//                             <div className="space-y-2">
//                                 <Label className="text-base font-semibold">What you want to do</Label>
//                                 <div
//                                     className="flex items-center gap-3 p-4 rounded-2xl transition-colors"
//                                     style={{ backgroundColor: color + "40" }}
//                                 >
//                                     <div className="relative group">
//                                         <Button
//                                             type="button"
//                                             variant="ghost"
//                                             size="icon"
//                                             className="h-12 w-12 rounded-xl bg-white/50 hover:bg-white/80 shrink-0"
//                                             onClick={() => {
//                                                 const current = EMOJIS.indexOf(emoji)
//                                                 setEmoji(EMOJIS[(current + 1) % EMOJIS.length])
//                                             }}
//                                         >
//                                             <span className="text-2xl">{emoji}</span>
//                                         </Button>
//                                     </div>
//                                     <Input
//                                         value={content}
//                                         onChange={(e) => setContent(e.target.value)}
//                                         className="flex-1 bg-transparent border-none text-lg font-medium placeholder:text-foreground/50 focus-visible:ring-0 px-0 h-auto"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Color Picker */}
//                             <div className="space-y-2">
//                                 <div className="grid grid-cols-8 gap-3">
//                                     {COLORS.map((c) => (
//                                         <button
//                                             key={c}
//                                             type="button"
//                                             className={cn(
//                                                 "w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2",
//                                                 color === c && "ring-2 ring-offset-2 ring-black dark:ring-white scale-110"
//                                             )}
//                                             style={{ backgroundColor: c }}
//                                             onClick={() => setColor(c)}
//                                         />
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Target */}
//                             <div className="space-y-3">
//                                 <div className="flex items-center justify-between">
//                                     <Label className="text-base font-semibold">Target</Label>
//                                     <div className="flex bg-muted rounded-lg p-1">
//                                         <button
//                                             type="button"
//                                             className={cn(
//                                                 "px-3 py-1 text-xs font-medium rounded-md transition-all",
//                                                 mode === 'single' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
//                                             )}
//                                             onClick={() => setMode('single')}
//                                         >
//                                             Single Punch
//                                         </button>
//                                         <button
//                                             type="button"
//                                             className={cn(
//                                                 "px-3 py-1 text-xs font-medium rounded-md transition-all",
//                                                 mode === 'count' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
//                                             )}
//                                             onClick={() => setMode('count')}
//                                         >
//                                             Count Times
//                                         </button>
//                                     </div>
//                                 </div>

//                                 {mode === 'count' && (
//                                     <div className="p-4 bg-muted/30 rounded-xl space-y-3">
//                                         <div className="flex items-center justify-between">
//                                             <Label className="text-sm">Set Target</Label>
//                                             <div className="flex items-center gap-2">
//                                                 <span className="text-2xl font-bold text-primary">{target}</span>
//                                                 <span className="text-sm text-muted-foreground">{unit}</span>
//                                             </div>
//                                         </div>
//                                         <div className="flex gap-2">
//                                             <Input
//                                                 type="number"
//                                                 value={target}
//                                                 onChange={(e) => setTarget(parseInt(e.target.value) || 1)}
//                                                 className="flex-1"
//                                                 min={1}
//                                             />
//                                             <Input
//                                                 value={unit}
//                                                 onChange={(e) => setUnit(e.target.value)}
//                                                 placeholder="Unit"
//                                                 className="w-24"
//                                             />
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Frequency */}
//                             <div className="space-y-2">
//                                 <div className="flex items-center justify-between">
//                                     <Label className="text-base font-semibold">Frequency</Label>
//                                     <div className="flex bg-muted rounded-lg p-1">
//                                         <button
//                                             type="button"
//                                             onClick={toggleAllDays}
//                                             className={cn(
//                                                 "px-3 py-1 text-xs font-medium rounded-md transition-all",
//                                                 frequency.length === 7 ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
//                                             )}
//                                         >
//                                             Every Day
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <div className="flex justify-between gap-1">
//                                     {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
//                                         const jsDayIndex = i === 6 ? 0 : i + 1
//                                         const isSelected = frequency.includes(jsDayIndex)

//                                         return (
//                                             <button
//                                                 key={day}
//                                                 type="button"
//                                                 onClick={() => toggleDay(jsDayIndex)}
//                                                 className={cn(
//                                                     "flex-1 h-10 rounded-lg flex items-center justify-center text-xs font-medium border-2 transition-all",
//                                                     isSelected
//                                                         ? "border-black bg-primary/20"
//                                                         : "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
//                                                 )}
//                                             >
//                                                 {day}
//                                             </button>
//                                         )
//                                     })}
//                                 </div>
//                             </div>

//                             <div className="pt-4 flex gap-2">
//                                 <Button type="submit" className="flex-1 h-12 text-lg font-medium" disabled={isLoading || !content.trim()}>
//                                     Save Changes
//                                 </Button>
//                                 <Button type="button" variant="destructive" size="icon" className="h-12 w-12" onClick={handleDelete}>
//                                     <Trash className="h-5 w-5" />
//                                 </Button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </DrawerContent>
//         </Drawer>
//     )
// }
