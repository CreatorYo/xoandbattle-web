import { Toaster as Sonner } from "sonner"
import { useTheme } from "@/contexts/ThemeContext"

export function Toaster() {
  const { resolvedTheme } = useTheme()

  return (
    <Sonner
      theme={resolvedTheme}
      position="bottom-center"
      gap={8}
      offset={20}
      mobileOffset={16}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "glass-sheet flex w-full items-start gap-3 rounded-[1.375rem] px-4 py-3.5 text-foreground",
          title: "text-[15px] font-semibold leading-snug",
          description: "mt-0.5 text-[13px] leading-snug text-muted-foreground",
          icon: "mt-0.5 shrink-0 [&_svg]:size-5",
          success: "[&_[data-icon]]:text-success",
          error: "[&_[data-icon]]:text-destructive",
          info: "[&_[data-icon]]:text-brand",
        },
      }}
    />
  )
}
