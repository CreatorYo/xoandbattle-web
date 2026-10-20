import type { RefObject } from "react"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  inputRef?: RefObject<HTMLInputElement | null>
  placeholder?: string
  label: string
  className?: string
}

export function SearchField({
  value,
  onChange,
  onSubmit,
  inputRef,
  placeholder = "Search",
  label,
  className,
}: SearchFieldProps) {
  return (
    <div role="search" className={cn("relative isolate", className)}>
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && onSubmit) {
            event.preventDefault()
            onSubmit()
          }
        }}
        placeholder={placeholder}
        aria-label={label}
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        className={cn(
          "h-10 w-full rounded-full pl-10 pr-10 text-base text-foreground glass-flat placeholder:text-muted-foreground",
          "outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-foreground/15"
        )}
      />
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-[17px] -translate-y-1/2 text-muted-foreground"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("")
            inputRef?.current?.focus()
          }}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 z-10 flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-muted-foreground/60 text-background transition-colors hover:bg-muted-foreground"
        >
          <X className="size-3" strokeWidth={3} />
        </button>
      )}
    </div>
  )
}
