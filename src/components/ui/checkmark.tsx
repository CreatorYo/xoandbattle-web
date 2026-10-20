import type { SVGProps } from "react"

import { cn } from "@/lib/utils"

function Checkmark({ className, strokeWidth = 2.5, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("size-5 shrink-0", className)}
      {...props}
    >
      <path d="M5 12.75 9.5 17.25 19 6.75" />
    </svg>
  )
}

export { Checkmark }
