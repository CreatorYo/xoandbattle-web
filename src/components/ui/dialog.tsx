import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { useSheetDrag } from "@/hooks/use-sheet-drag"
import { ScrollArea } from "@/components/ui/scroll-area"

const Dialog = DialogPrimitive.Root
const DialogClose = DialogPrimitive.Close

const contentSizes = {
  sm: "sm:max-w-[400px]",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
} as const

const presentations = {
  card: {
    overlay: "p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]",
    content: "max-h-[92dvh] rounded-[2rem] glass-sheet sm:max-h-[min(88dvh,820px)]",
    grabber: true,
  },
  page: {
    overlay: "pt-[calc(var(--safe-top)+0.625rem)]",
    content: "h-full rounded-t-[2rem] bg-background elev-panel sm:h-[min(700px,calc(100dvh-6rem))] sm:rounded-b-[2rem]",
    grabber: false,
  },
} as const

type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  size?: keyof typeof contentSizes
  presentation?: keyof typeof presentations
}

function chain<E>(theirs: ((event: E) => void) | undefined, ours: (event: E) => void) {
  return (event: E) => {
    theirs?.(event)
    ours(event)
  }
}

function DialogContent({ className, children, size = "md", presentation = "card", ...props }: DialogContentProps) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const sheetDrag = useSheetDrag(contentRef, () => closeRef.current?.click())
  const style = presentations[presentation]

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 flex items-end justify-center overflow-y-auto scrim sm:items-center sm:p-6",
          "data-[state=open]:before:animate-scrim-in",
          style.overlay
        )}
      >
        <DialogPrimitive.Content
          {...props}
          ref={contentRef}
          onPointerDown={chain(props.onPointerDown, sheetDrag.onPointerDown)}
          onPointerMove={chain(props.onPointerMove, sheetDrag.onPointerMove)}
          onPointerUp={chain(props.onPointerUp, sheetDrag.onPointerUp)}
          onPointerCancel={chain(props.onPointerCancel, sheetDrag.onPointerCancel)}
          onLostPointerCapture={chain(props.onLostPointerCapture, sheetDrag.onLostPointerCapture)}
          className={cn(
            "relative flex w-full flex-col overflow-hidden text-foreground outline-none sm:origin-center",
            "max-sm:data-[state=open]:animate-sheet-in max-sm:data-[state=closed]:animate-sheet-out",
            "sm:data-[state=open]:animate-dialog-in sm:data-[state=closed]:animate-dialog-out",
            style.content,
            contentSizes[size],
            className
          )}
        >
          {style.grabber && (
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-2 sm:hidden">
              <span className="h-[5px] w-9 rounded-full bg-foreground/20" />
            </div>
          )}
          {children}
          <DialogPrimitive.Close ref={closeRef} tabIndex={-1} aria-hidden hidden />
        </DialogPrimitive.Content>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-sheet-handle
      className={cn(
        "flex flex-col items-center gap-1.5 px-6 pt-7 text-center max-sm:touch-none max-sm:select-none",
        className
      )}
      {...props}
    />
  )
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return <ScrollArea className={cn("px-5 py-5 sm:px-6", className)} {...props} />
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 px-5 pb-5 pt-1 sm:flex-row sm:px-6 sm:pb-6",
        "*:h-12 *:w-full *:text-base *:font-semibold sm:*:w-auto sm:*:flex-1",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-xl font-bold leading-snug tracking-tight text-foreground", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-[15px] leading-snug text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
