import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium",
    "transition-[background-color,color,filter,opacity] duration-150 ease-out",
    "not-disabled:active:opacity-60",
    "outline-2 outline-offset-2 outline-transparent focus-visible:outline-brand",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary: "bg-brand text-brand-foreground glass-tinted not-disabled:hover:brightness-[1.06]",
        destructive: "bg-destructive text-destructive-foreground glass-tinted not-disabled:hover:brightness-[1.06]",
        secondary: "bg-surface-sunken text-foreground not-disabled:hover:bg-muted",
        glass: "glass text-foreground not-disabled:hover:brightness-[1.03]",
        tinted: "bg-brand/15 text-brand not-disabled:hover:bg-brand/20",
        "destructive-tinted": "bg-destructive/12 text-destructive not-disabled:hover:bg-destructive/18",
        "ghost-muted": "text-muted-foreground not-disabled:hover:bg-muted not-disabled:hover:text-foreground",
      },
      size: {
        sm: "h-8 px-3.5 text-[13px]",
        md: "h-10 px-5 text-[15px]",
        lg: "h-12 px-6 text-base font-semibold",
        pill: "h-9 px-4 text-[15px] font-semibold",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="button"
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button }
