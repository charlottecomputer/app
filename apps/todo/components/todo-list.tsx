"use client"

import { useState } from "react"
import { toggleTodo } from "@/actions/todo-actions"
import { Button, Checkbox } from "@aliveui"
import { Icon } from "@aliveui"
import type { Todo } from "@/types/todo"

interface TodoItemProps {
  todo: Todo
  onToggle?: () => void
}

export function TodoItem({ todo, onToggle }: TodoItemProps) {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      await toggleTodo(todo.todoId, !todo.completed)
      onToggle?.()
    } catch (error) {
      console.error("Failed to toggle todo:", error)
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <div className="group flex items-start gap-3 py-2 px-0.5 hover:bg-accent/50 rounded-md transition-colors">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={handleToggle}
        disabled={isToggling}
        className="mt-0.5"
      />
      <div className="flex-1 flex flex-col gap-1">
        <span className={`text-sm ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
          {todo.content}
        </span>
        <div className="flex items-center gap-1">
          <Icon icon="calendar" className="w-3 h-3 text-green-600" />
          <span className="text-xs text-green-600">Today</span>
        </div>
      </div>
    </div>
  )
}

interface TodoListProps {
  todos: Todo[]
  onToggle?: () => void
}

export function TodoList({ todos, onToggle }: TodoListProps) {
  if (todos.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col">
      {todos.map((todo) => (
        <TodoItem key={todo.todoId} todo={todo} onToggle={onToggle} />
      ))}
    </div>
  )
}
