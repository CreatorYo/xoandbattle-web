import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface SegmentedOption<T extends string> {
  value: T
  label: ReactNode
  icon?: ReactNode
  ariaLabel?: string
  disabled?: boolean
}

interface SegmentedControlProps<T extends string> {
  value: T
  onValueChange: (value: T) => void
  options: SegmentedOption<T>[]
  size?: "sm" | "md"
  className?: string
  disabled?: boolean
  "aria-label"?: string
}

const INSET = 3

const ARROW_STEPS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowUp: -1,
  ArrowRight: 1,
  ArrowDown: 1,
}

export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  size = "md",
  className,
  disabled,
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const selectedIndex = options.findIndex((option) => option.value === value)
  const thumbIndex = dragIndex ?? selectedIndex
  const isDragging = dragIndex !== null
  const isEnabled = (index: number) => !disabled && !options[index].disabled

  const select = (index: number) => {
    if (isEnabled(index) && index !== selectedIndex) onValueChange(options[index].value)
  }

  const indexAt = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const segment = (rect.width - INSET * 2) / options.length
    const index = Math.floor((event.clientX - rect.left - INSET) / segment)
    return Math.min(options.length - 1, Math.max(0, index))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = ARROW_STEPS[event.key]
    if (!step) return
    event.preventDefault()
    for (let offset = 1; offset < options.length; offset++) {
      const index = (selectedIndex + step * offset + options.length) % options.length
      if (isEnabled(index)) {
        select(index)
        itemRefs.current[index]?.focus()
        return
      }
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => {
        if (event.button !== 0) return
        const index = indexAt(event)
        if (!isEnabled(index)) return
        event.currentTarget.setPointerCapture(event.pointerId)
        setDragIndex(index)
      }}
      onPointerMove={(event) => {
        if (!isDragging) return
        const index = indexAt(event)
        if (index !== dragIndex && isEnabled(index)) setDragIndex(index)
      }}
      onPointerUp={() => {
        if (isDragging) select(dragIndex)
      }}
      onLostPointerCapture={() => setDragIndex(null)}
      className={cn(
        "relative isolate flex w-full touch-pan-y select-none rounded-full bg-surface-sunken p-[3px]",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {thumbIndex !== -1 && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-[3px] left-[3px] -z-10 rounded-full",
            "transition-[translate,scale,background-color,box-shadow] duration-[380ms] ease-[cubic-bezier(0.3,1.3,0.5,1)]",
            isDragging ? "glass-lens scale-x-[1.05] scale-y-[1.12]" : "bg-thumb elev-raised"
          )}
          style={{
            width: `calc((100% - ${INSET * 2}px) / ${options.length})`,
            translate: `${thumbIndex * 100}% 0`,
          }}
        />
      )}
      {options.map((option, index) => (
        <button
          key={option.value}
          ref={(element) => {
            itemRefs.current[index] = element
          }}
          type="button"
          role="radio"
          aria-checked={index === selectedIndex}
          aria-label={option.ariaLabel}
          tabIndex={index === Math.max(selectedIndex, 0) ? 0 : -1}
          disabled={!isEnabled(index)}
          data-active={index === thumbIndex || undefined}
          onClick={(event) => {
            if (event.detail === 0) select(index)
          }}
          className={cn(
            "flex min-w-0 flex-1 basis-0 items-center justify-center gap-1.5 rounded-full px-2.5 font-medium",
            "text-foreground/75 transition-[color,opacity] duration-200 not-disabled:hover:text-foreground",
            "data-active:font-semibold data-active:text-foreground",
            "disabled:cursor-not-allowed",
            "outline-2 -outline-offset-2 outline-transparent focus-visible:outline-brand",
            "[&_svg]:size-4 [&_svg]:shrink-0",
            option.disabled && "opacity-50",
            size === "sm" ? "h-7 text-xs" : "h-8 text-[13px]"
          )}
        >
          {option.icon}
          <span className="truncate">{option.label}</span>
        </button>
      ))}
    </div>
  )
}
