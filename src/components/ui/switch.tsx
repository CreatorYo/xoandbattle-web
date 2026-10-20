import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const TRAVEL = 22
const DRAG_THRESHOLD = 3

function Switch({
  className,
  checked,
  onCheckedChange,
  disabled,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const drag = React.useRef<{ startX: number; moved: boolean } | null>(null)
  const [offset, setOffset] = React.useState<number | null>(null)
  const restingOffset = checked ? TRAVEL : 0
  const isOn = offset === null ? !!checked : offset > TRAVEL / 2

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      {...props}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      onClick={(event) => {
        if (event.detail > 0) event.preventDefault()
      }}
      onPointerDown={(event) => {
        if (disabled || event.button !== 0) return
        event.currentTarget.setPointerCapture(event.pointerId)
        drag.current = { startX: event.clientX, moved: false }
      }}
      onPointerMove={(event) => {
        if (!drag.current) return
        const distance = event.clientX - drag.current.startX
        if (!drag.current.moved && Math.abs(distance) < DRAG_THRESHOLD) return
        drag.current.moved = true
        setOffset(Math.min(TRAVEL, Math.max(0, restingOffset + distance)))
      }}
      onPointerUp={() => {
        if (!drag.current) return
        const next = drag.current.moved ? isOn : !checked
        if (next !== checked) onCheckedChange?.(next)
      }}
      onLostPointerCapture={() => {
        drag.current = null
        setOffset(null)
      }}
      data-on={isOn || undefined}
      className={cn(
        "group relative inline-flex h-7 w-16 shrink-0 touch-pan-y items-center rounded-full p-0.5",
        "bg-[rgb(120_120_128/0.16)] dark:bg-[rgb(120_120_128/0.36)] data-on:bg-brand",
        "transition-[background-color] duration-200 ease-out",
        "outline-2 outline-offset-2 outline-transparent focus-visible:outline-brand",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      <SwitchPrimitive.Thumb
        data-dragging={offset !== null || undefined}
        style={offset === null ? undefined : { translate: `${offset}px 0` }}
        className={cn(
          "pointer-events-none block h-6 w-[38px] rounded-full bg-white",
          "shadow-[0_2px_6px_rgb(0_0_0/0.16),0_0_0_0.5px_rgb(0_0_0/0.04)]",
          "transition-[translate,scale,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.3,1.3,0.5,1)]",
          "data-dragging:transition-[scale,background-color,box-shadow]",
          "data-[state=checked]:translate-x-[22px]",
          "group-active:scale-x-[1.16] group-active:scale-y-[1.12] group-active:glass-lens"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
