import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronRight, ChevronDown } from "lucide-react"

interface SettingsSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: string
  footer?: string
}

const SettingsSection = React.forwardRef<HTMLDivElement, SettingsSectionProps>(
  ({ className, header, footer, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {header && (
          <div className="px-4 pt-2 pb-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {header}
            </p>
          </div>
        )}
        <div className="bg-card rounded-xl overflow-hidden border border-border/50">
          {children}
        </div>
        {footer && (
          <div className="px-4 pt-1 pb-2">
            <p className="text-xs text-muted-foreground">{footer}</p>
          </div>
        )}
      </div>
    )
  }
)
SettingsSection.displayName = "SettingsSection"

interface SettingsRowProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  iconColor?: string
  title: string
  subtitle?: string
  rightElement?: React.ReactNode
  onClick?: () => void
  showChevron?: boolean
  showDropdown?: boolean
  isFirst?: boolean
  isLast?: boolean
}

const SettingsRow = React.forwardRef<HTMLDivElement, SettingsRowProps>(
  ({ 
    className, 
    icon, 
    iconColor = "bg-blue-500", 
    title, 
    subtitle, 
    rightElement, 
    onClick,
    showChevron = false,
    showDropdown = false,
    isFirst = false,
    isLast = false,
    ...props 
  }, ref) => {
    const content = (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3 px-4 min-h-[44px]",
          !isLast && "border-b border-border/30",
          onClick && "cursor-pointer hover:bg-muted/30 active:bg-muted/50 transition-colors",
          className
        )}
        onClick={onClick}
        {...props}
      >
        {icon && (
          iconColor ? (
            <div className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
              iconColor
            )}>
              <div className="text-white text-sm flex items-center justify-center [&>svg]:text-white [&>svg]:w-4 [&>svg]:h-4">
                {typeof icon === 'string' ? <span>{icon}</span> : icon}
              </div>
            </div>
          ) : (
            <div className="flex-shrink-0">
              {typeof icon === 'string' ? <span>{icon}</span> : icon}
            </div>
          )
        )}
        <div className="flex-1 min-w-0 py-2.5">
          <div className="text-[15px] font-normal text-foreground leading-tight">
            {title}
          </div>
          {subtitle && (
            <div className="text-[13px] text-muted-foreground leading-tight mt-0.5">
              {subtitle}
            </div>
          )}
        </div>
        {rightElement && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {rightElement}
            {showChevron && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            {showDropdown && (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        )}
        {!rightElement && showChevron && (
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
        {!rightElement && showDropdown && (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </div>
    )

    return content
  }
)
SettingsRow.displayName = "SettingsRow"

export { SettingsSection, SettingsRow }

