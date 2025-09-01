import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-2xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl border-border/50",
        className
      )}
      style={{ boxShadow: 'none', outline: 'none' }}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1.5 opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-accent hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive' | 'warning' | 'info' | 'success'
  onConfirm: () => void
  onCancel?: () => void
  icon?: React.ReactNode
  className?: string
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = 'default',
  onConfirm,
  onCancel,
  icon,
  className
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
          confirmClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          borderClass: "border-destructive/20"
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
          confirmClass: "bg-yellow-500 text-white hover:bg-yellow-600",
          borderClass: "border-yellow-500/20"
        }
      case 'info':
        return {
          icon: <Info className="h-6 w-6 text-blue-500" />,
          confirmClass: "bg-blue-500 text-white hover:bg-blue-600",
          borderClass: "border-blue-500/20"
        }
      case 'success':
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-500" />,
          confirmClass: "bg-green-500 text-white hover:bg-green-600",
          borderClass: "border-green-500/20"
        }
      default:
        return {
          icon: <AlertCircle className="h-6 w-6 text-primary" />,
          confirmClass: "bg-primary text-primary-foreground hover:bg-primary/90",
          borderClass: "border-primary/20"
        }
    }
  }

  const variantStyles = getVariantStyles()

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-md", className)}>
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-center sm:justify-start">
            {icon || variantStyles.icon}
          </div>
          <DialogTitle className="text-center sm:text-left">{title}</DialogTitle>
          <DialogDescription className="text-center sm:text-left">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            onClick={handleCancel}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            {cancelText}
          </DialogClose>
          <button
            onClick={handleConfirm}
            className={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2",
              variantStyles.confirmClass
            )}
          >
            {confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const SimpleConfirmDialog: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: string
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
}> = ({ open, onOpenChange, title, message, onConfirm, confirmText = "Yes", cancelText = "No" }) => (
  <ConfirmationDialog
    open={open}
    onOpenChange={onOpenChange}
    title={title}
    description={message}
    confirmText={confirmText}
    cancelText={cancelText}
    onConfirm={onConfirm}
    variant="default"
  />
)

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  ConfirmationDialog,
  SimpleConfirmDialog,
}