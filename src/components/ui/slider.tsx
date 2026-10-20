import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Slider({
  className,
  thumbLabel,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & { thumbLabel?: string }) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex h-7 w-full touch-none select-none items-center data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-surface-sunken">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-brand" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={thumbLabel}
        className={cn(
          "block h-6 w-[2.375rem] rounded-full bg-white",
          "shadow-[0_2px_6px_rgb(0_0_0/0.18),0_0_0_0.5px_rgb(0_0_0/0.06)]",
          "transition-[scale,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.3,1.3,0.5,1)]",
          "not-data-disabled:active:scale-[1.15] not-data-disabled:active:glass-lens",
          "outline-2 outline-offset-2 outline-transparent focus-visible:outline-brand"
        )}
      />
    </SliderPrimitive.Root>
  )
}

export { Slider }
