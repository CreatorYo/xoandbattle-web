import type { ReactNode } from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { HexColorInput, HexColorPicker } from "react-colorful"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label: string
  disabled?: boolean
  children: ReactNode
}

export function ColorPicker({ value, onChange, label, disabled, children }: ColorPickerProps) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        {children}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          aria-label={label}
          sideOffset={8}
          collisionPadding={12}
          className="color-picker z-50 w-60 rounded-[1.25rem] p-3 text-foreground glass-sheet outline-none origin-(--radix-popover-content-transform-origin) data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out"
        >
          <HexColorPicker color={value} onChange={onChange} />
          <label className="mt-3 flex h-10 items-center gap-2 rounded-xl bg-foreground/6 px-3 text-sm focus-within:ring-2 focus-within:ring-foreground/15">
            <span className="text-muted-foreground">Hex</span>
            <HexColorInput
              color={value}
              onChange={onChange}
              prefixed
              spellCheck={false}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent font-mono uppercase outline-none"
            />
          </label>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
