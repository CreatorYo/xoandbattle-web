import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  htmlFor: string
  optional?: boolean
  counter?: ReactNode
  children: ReactNode
}

export function FormField({ label, htmlFor, optional, counter, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
          {optional && <span className="ml-1.5 font-normal text-muted-foreground">Optional</span>}
        </label>
        {counter}
      </div>
      {children}
    </div>
  )
}

export function CharacterCounter({ value, limit }: { value: number; limit: number }) {
  const ratio = value / limit
  return (
    <span
      className={cn(
        "font-mono text-xs tabular-nums",
        ratio >= 1 ? "text-destructive" : ratio >= 0.8 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
      )}
    >
      {value}/{limit}
    </span>
  )
}
