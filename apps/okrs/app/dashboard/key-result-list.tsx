"use client";

import { useRef, useState } from "react";
import { createKeyResult, toggleKeyResult, deleteKeyResult } from "@/actions/key-results-actions";
import { Button, Input, Card, CardContent } from "@aliveui";
import type { KeyResult } from "@/types/key-results";

interface KeyResultListProps {
  initialKeyResults: KeyResult[];
}

export function KeyResultList({ initialKeyResults }: KeyResultListProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <form
        action={async (formData) => {
          const content = formData.get("content") as string;
          if (!content) return;

          const result = await createKeyResult(content);
          if (result.success) {
            formRef.current?.reset();
            setError(null);
          } else {
            setError(result.error || "Failed to create keyResult");
          }
        }}
        ref={formRef}
        className="flex flex-col gap-2"
      >
        <div className="flex gap-2">
          <Input name="content" placeholder="Add a new keyResult..." required />
          <Button type="submit">Add</Button>
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </form>

      <div className="space-y-2">
        {initialTodos.map((keyResult) => (
          <Card key={keyResult.todoId}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={keyResult.completed}
                  onChange={async () => {
                    const result = await toggleKeyResult(keyResult.todoId, !keyResult.completed);
                    if (!result.success) {
                      setError(result.error || "Failed to update keyResult");
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-400 text-primary focus:ring-primary"
                />
                <span className={keyResult.completed ? "line-through text-muted-foreground" : ""}>
                  {keyResult.content}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  const result = await deleteKeyResult(keyResult.todoId);
                  if (!result.success) {
                    setError(result.error || "Failed to delete keyResult");
                  }
                }}
                className="text-destructive hover:text-destructive/90"
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
        {initialKeyResults.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No keyResults yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}
