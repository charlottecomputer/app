// "use client"

// import { useState, useRef } from "react"
// import { motion } from "motion/react"
// import confetti from "canvas-confetti"
// import { cn, Popover, PopoverContent, PopoverTrigger, Button } from "@aliveui"
// import { updateSubtask, deleteSubtask } from "@/actions/key-results-actions"
// import { Subtask } from "@/types/todo"

// import { EditHabitDrawer } from "@/components/edit-habit-drawer"
// import { Trash, RefreshCw, PenLine, FileText } from "lucide-react"

// interface SubtaskCubeProps {
//     subtask: Subtask
//     onUpdate: () => void
// }

// export function SubtaskCube({ subtask, onUpdate }: SubtaskCubeProps) {
//     const [isCompleted, setIsCompleted] = useState(subtask.currentTouches >= subtask.requiredTouches)
//     const [currentTouches, setCurrentTouches] = useState(subtask.currentTouches)
//     const [isEditOpen, setIsEditOpen] = useState(false)
//     const [isPopoverOpen, setIsPopoverOpen] = useState(false)
//     const longPressTimer = useRef<NodeJS.Timeout | null>(null)
//     const isLongPress = useRef(false)

//     const requiredTouches = subtask.requiredTouches || 1
//     const progress = Math.min(currentTouches / requiredTouches, 1)

//     const handleTouchStart = () => {
//         isLongPress.current = false
//         longPressTimer.current = setTimeout(() => {
//             isLongPress.current = true
//             setIsPopoverOpen(true)
//         }, 500)
//     }

//     const handleTouchEnd = () => {
//         if (longPressTimer.current) {
//             clearTimeout(longPressTimer.current)
//             longPressTimer.current = null
//         }
//     }

//     const handleClick = async (e: React.MouseEvent | React.TouchEvent) => {
//         if (isLongPress.current) return
//         if (isPopoverOpen) { // Close popover if it's open and a click occurs
//             setIsPopoverOpen(false)
//             return
//         }

//         // Prevent default to stop double-firing on some devices
//         // e.preventDefault() 

//         // Optimistic update
//         const newTouches = currentTouches + 1
//         setCurrentTouches(newTouches)

//         // Show floating +1
//         const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
//         const x = rect.left + rect.width / 2
//         const y = rect.top

//         const floatingEl = document.createElement('div')
//         floatingEl.textContent = '+1'
//         floatingEl.className = 'fixed text-primary font-bold text-xl pointer-events-none z-50 animate-out fade-out slide-out-to-top-8 duration-1000'
//         floatingEl.style.left = `${x} px`
//         floatingEl.style.top = `${y} px`
//         document.body.appendChild(floatingEl)
//         setTimeout(() => floatingEl.remove(), 1000)

//         // Check completion
//         if (newTouches >= requiredTouches && !isCompleted) {
//             setIsCompleted(true)
//             confetti({
//                 particleCount: 100,
//                 spread: 70,
//                 origin: { y: 0.6 },
//                 colors: subtask.color ? [subtask.color] : undefined
//             })
//         }

//         // Server update
//         try {
//             await updateSubtask({
//                 subtaskId: subtask.subtaskId,
//                 taskId: subtask.taskId,
//                 currentTouches: newTouches,
//                 completed: newTouches >= requiredTouches
//             })
//             onUpdate()
//         } catch (error) {
//             console.error("Failed to update subtask:", error)
//             setCurrentTouches(currentTouches) // Revert on error
//         }
//     }

//     const handleReset = async () => {
//         setIsPopoverOpen(false)
//         setCurrentTouches(0)
//         setIsCompleted(false)
//         await updateSubtask({
//             subtaskId: subtask.subtaskId,
//             taskId: subtask.taskId,
//             currentTouches: 0,
//             completed: false
//         })
//         onUpdate()
//     }

//     const handleDelete = async () => {
//         if (!confirm("Are you sure you want to delete this habit?")) return
//         setIsPopoverOpen(false)
//         await deleteSubtask(subtask.subtaskId)
//         onUpdate()
//     }

//     return (
//         <>
//             <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
//                 <PopoverTrigger asChild>
//                     <motion.div
//                         layoutId={subtask.subtaskId}
//                         className={cn(
//                             "aspect-square rounded-3xl relative overflow-hidden cursor-pointer group select-none touch-none",
//                             "bg-muted/30 border-2 border-transparent hover:border-primary/10 transition-colors"
//                         )}
//                         style={{
//                             backgroundColor: subtask.color ? subtask.color + "20" : undefined,
//                             borderColor: subtask.color ? subtask.color + "40" : undefined
//                         }}
//                         onMouseDown={handleTouchStart}
//                         onMouseUp={(e) => {
//                             handleTouchEnd()
//                             handleClick(e)
//                         }}
//                         onMouseLeave={handleTouchEnd}
//                         onTouchStart={handleTouchStart}
//                         onTouchEnd={(e) => {
//                             handleTouchEnd()
//                         }}
//                         onClick={(e) => {
//                             handleClick(e)
//                         }}
//                         whileTap={{ scale: 0.95 }}
//                     >
//                         {/* Liquid Fill Background */}
//                         <div
//                             className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all duration-500 ease-out"
//                             style={{
//                                 height: `${progress * 100}%`,
//                                 backgroundColor: subtask.color ? subtask.color + "40" : undefined
//                             }}
//                         />

//                         {/* Content */}
//                         <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center z-10">
//                             <span className="text-2xl mb-1">{subtask.emoji || "🍎"}</span>
//                             <span className="text-xs font-medium leading-tight line-clamp-2 px-1">
//                                 {subtask.content}
//                             </span>
//                             {!isCompleted && (
//                                 <div className="text-[10px] text-muted-foreground/50 font-mono mt-1">
//                                     {currentTouches}/{requiredTouches} {subtask.unit}
//                                 </div>
//                             )}
//                             {isCompleted && (
//                                 <motion.div
//                                     initial={{ scale: 0 }}
//                                     animate={{ scale: 1 }}
//                                     className="absolute top-2 right-2 text-primary"
//                                 >
//                                     <div className="bg-background rounded-full p-0.5 shadow-sm">
//                                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
//                                             <polyline points="20 6 9 17 4 12" />
//                                         </svg>
//                                     </div>
//                                 </motion.div>
//                             )}
//                         </div>
//                     </motion.div>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-48 p-1">
//                     <div className="flex flex-col gap-1 ">
//                         <Button
//                             variant="ghost"
//                             className="justify-start h-9 px-2 font-normal text-destructive hover:text-destructive hover:bg-destructive/10"
//                             onClick={handleDelete}
//                         >
//                             <Trash className="mr-2 h-4 w-4" />
//                             Delete
//                         </Button>
//                         <Button
//                             variant="ghost"
//                             className="justify-start h-9 px-2 font-normal"
//                             onClick={handleReset}
//                         >
//                             <RefreshCw className="mr-2 h-4 w-4" />
//                             Reset
//                         </Button>
//                         <Button
//                             variant="ghost"
//                             className="justify-start h-9 px-2 font-normal"
//                             onClick={() => {
//                                 setIsPopoverOpen(false)
//                                 setIsEditOpen(true)
//                             }}
//                         >
//                             <PenLine className="mr-2 h-4 w-4" />
//                             Edit
//                         </Button>

//                     </div>
//                 </PopoverContent>
//             </Popover>

//             <EditHabitDrawer
//                 habit={subtask}
//                 open={isEditOpen}
//                 onOpenChange={setIsEditOpen}
//                 onSuccess={onUpdate}
//             />
//         </>
//     )
// }
