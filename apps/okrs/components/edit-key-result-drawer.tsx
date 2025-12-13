"use client"

import { useState } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from "@aliveui"
import { AddKeyResultForm } from "@/components/add-key-result-form"
import { KeyResult } from "@/types/key-results"

interface EditKeyResultDrawerProps {
  keyResult: KeyResult
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditKeyResultDrawer({ keyResult, open, onOpenChange, onSuccess }: EditKeyResultDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm h-[85vh] flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Edit Key Result</DrawerTitle>
            <DrawerDescription>Update your key result details.</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4 pb-8">
            <AddKeyResultForm
              initialData={keyResult}
              defaultProjectId={keyResult.projectId}
              onCancel={() => onOpenChange(false)}
              onSuccess={() => {
                onOpenChange(false)
                onSuccess?.()
              }}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
