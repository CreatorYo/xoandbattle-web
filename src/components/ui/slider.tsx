import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  color?: 'purple' | 'orange' | 'blue' | 'default';
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, color = 'default', ...props }, ref) => {
  const getColorClasses = () => {
    switch (color) {
      case 'purple':
        return {
          range: "bg-gradient-to-r from-[#a514c9]/80 via-[#b91cff]/80 to-[#a514c9]/80 backdrop-blur-md rounded-full transition-all duration-300 ease-out shadow-[0_0_20px_rgba(165,20,201,0.4)]",
          thumb: "border-[#a514c9]/50 bg-gradient-to-br from-[#a514c9]/90 to-[#b91cff]/90 backdrop-blur-xl shadow-[0_0_15px_rgba(165,20,201,0.6),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(165,20,201,0.8)] focus-visible:ring-[#a514c9]/50",
        };
      case 'orange':
        return {
          range: "bg-gradient-to-r from-orange-500/80 via-orange-600/80 to-orange-500/80 backdrop-blur-md rounded-full transition-all duration-300 ease-out shadow-[0_0_20px_rgba(249,115,22,0.4)]",
          thumb: "border-orange-400/50 bg-gradient-to-br from-orange-400/90 to-orange-600/90 backdrop-blur-xl shadow-[0_0_15px_rgba(249,115,22,0.6),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(249,115,22,0.8)] focus-visible:ring-orange-500/50",
        };
      case 'blue':
        return {
          range: "bg-gradient-to-r from-blue-500/80 via-blue-600/80 to-blue-500/80 backdrop-blur-md rounded-full transition-all duration-300 ease-out shadow-[0_0_20px_rgba(59,130,246,0.4)]",
          thumb: "border-blue-400/50 bg-gradient-to-br from-blue-400/90 to-blue-600/90 backdrop-blur-xl shadow-[0_0_15px_rgba(59,130,246,0.6),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] focus-visible:ring-blue-500/50",
        };
      default:
        return {
          range: "bg-gradient-to-r from-purple-500/80 via-purple-600/80 to-purple-500/80 backdrop-blur-md rounded-full transition-all duration-300 ease-out shadow-[0_0_20px_rgba(168,85,247,0.4)]",
          thumb: "border-purple-400/50 bg-gradient-to-br from-purple-400/90 to-purple-600/90 backdrop-blur-xl shadow-[0_0_15px_rgba(168,85,247,0.6),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.8)] focus-visible:ring-purple-500/50",
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
      <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-secondary/30 backdrop-blur-sm">
        <SliderPrimitive.Range className={cn("absolute h-full", colorClasses.range)} />
    </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className={cn(
        "block h-6 w-6 rounded-full border-2 backdrop-blur-xl ring-offset-background transition-all duration-200 ease-out hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        colorClasses.thumb
      )} />
  </SliderPrimitive.Root>
  );
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
