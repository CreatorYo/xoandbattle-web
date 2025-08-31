import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title?: string
  showCloseButton?: boolean
  className?: string
  contentClassName?: string
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onOpenChange,
  children,
  title,
  showCloseButton = true,
  className,
  contentClassName
}) => {
  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50">
        <div 
          className={cn(
            "mx-auto w-full max-w-lg transform transition-all duration-300 ease-out",
            open ? "translate-y-0" : "translate-y-full",
            className
          )}
        >
          {/* Content */}
          <div 
            className={cn(
              "bg-background border-t-2 border-primary/20 rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto",
              contentClassName
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                {title && (
                  <h2 className="text-lg font-semibold">{title}</h2>
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full hover:bg-muted"
                    onClick={() => onOpenChange(false)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                )}
              </div>
            )}
            
            {/* Body */}
            <div className="p-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Simple bottom sheet without header
export const SimpleBottomSheet: React.FC<Omit<BottomSheetProps, 'title' | 'showCloseButton'>> = ({
  open,
  onOpenChange,
  children,
  className,
  contentClassName
}) => (
  <BottomSheet
    open={open}
    onOpenChange={onOpenChange}
    showCloseButton={false}
    className={className}
    contentClassName={contentClassName}
  >
    {children}
  </BottomSheet>
)
