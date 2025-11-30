import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const textVariants = cva(
  "inline-block",
  {
    variants: {
      variant: {
        ultralight: "font-ultralight",
        light: "font-light",
        regular: "font-regular",
        medium: "font-medium",
        bold: "font-bold",
        black: "font-black",
      },
      size: {
        xs: "text-xs leading-4",
        sm: "text-sm leading-5",
        base: "text-base leading-6",
        lg: "text-lg leading-7",
        xl: "text-xl leading-7",
        "2xl": "text-2xl leading-8",
        "3xl": "text-3xl leading-9",
        "4xl": "text-4xl leading-10",
        "5xl": "text-5xl leading-none",
        "6xl": "text-6xl leading-none",
        "7xl": "text-7xl leading-none",
        "8xl": "text-8xl leading-none",
        "9xl": "text-9xl leading-none",
      },
      italic: {
        true: "italic",
        false: "not-italic",
      },
    },
    defaultVariants: {
      variant: "regular",
      size: "base",
      italic: false,
    },
  }
)

function Text({
  className,
  variant,
  size,
  italic,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof textVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="text"
      className={cn(textVariants({ variant, size, italic, className }))}
      {...props}
    />
  )
}

export { Text, textVariants }
