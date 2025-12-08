"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Monoco } from "@monokai/monoco-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

import { motion } from "motion/react"
import { Text } from "./text"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all disabled:pointer-events-none disabled:bg-white/50 disabled:text-black/25 disabled:shadow-[var(--shadow-button-disabled)] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary bg-[linear-gradient(180deg,rgba(255,255,255,0.17)_0%,rgba(255,255,255,0)_100%)] shadow-[var(--shadow-button-primary)] text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-background shadow-[var(--shadow-button-sm)] text-[#FF3B30] hover:bg-accent focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary shadow-[var(--shadow-button-sm)] text-secondary-foreground hover:bg-secondary/80",
        accent:
          "bg-accent shadow-[var(--shadow-button-sm)] text-accent-foreground hover:bg-accent/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[22px] px-[7px] py-[3px] has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-14 [&>svg]:!h-7 [&>svg]:!w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const MotionSlot = motion.create(Slot)

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? MotionSlot : motion.button

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      whileTap={{ scale: 0.95, rotateX: 10 }}
      transition={{ type: "spring", stiffness: 1000, damping: 20 }}
      {...(props as any)}
    >
      <Monoco
        borderRadius={8} // Should be dynamic based on size?
        smoothing={1}
        clip={true}
        className="w-full h-full flex items-center justify-center gap-2"
      >
        {asChild ? (
          children
        ) : (
          <Text variant="regular" className="text-[13px] leading-[16px]">
            {children}
          </Text>
        )}
      </Monoco>
    </Comp>
  )
}

export { Button, buttonVariants }
