import * as React from "react"

import { cn } from "@/lib/utils"

function ScrollEdge({ edge }: { edge: "top" | "bottom" }) {
  return (
    <div aria-hidden data-edge={edge} className="scroll-edge">
      <span />
      <span />
      <span />
      <span />
    </div>
  )
}

interface ScrollAreaProps extends React.ComponentProps<"div"> {
  rootClassName?: string
}

export function ScrollArea({ className, rootClassName, children, ...props }: ScrollAreaProps) {
  return (
    <div className={cn("scroll-area", rootClassName)}>
      <div className={cn("scroll-area-viewport", className)} {...props}>
        {children}
      </div>
      <ScrollEdge edge="top" />
      <ScrollEdge edge="bottom" />
    </div>
  )
}
