import * as React from "react"

import { cn } from "@/lib/utils"

const fieldClassName = cn(
  "w-full min-w-0 rounded-xl border border-transparent bg-surface-sunken px-3.5 text-base text-foreground",
  "placeholder:text-muted-foreground/80",
  "transition-[border-color,box-shadow] duration-150",
  "outline-none focus-visible:border-foreground/20 focus-visible:ring-3 focus-visible:ring-foreground/8",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
  "disabled:cursor-not-allowed disabled:opacity-50"
)

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(fieldClassName, "h-11", className)}
      {...props}
    />
  )
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldClassName, "min-h-20 resize-none py-2.5 leading-relaxed", className)}
      {...props}
    />
  )
}

export { Input, Textarea }
