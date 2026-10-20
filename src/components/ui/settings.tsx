import * as React from "react"
import { ChevronRight, ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"
import { pressableRowClassName } from "@/components/ui/row-styles"
import { Switch } from "@/components/ui/switch"

interface SettingsPageProps {
  title?: string
  description?: React.ReactNode
  children: React.ReactNode
}

export function SettingsPage({ title, description, children }: SettingsPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-7">
      {(title || description) && (
        <header className={cn("px-1 md:px-0", !description && "max-md:hidden")}>
          {title && (
            <h2 className="text-[30px] font-bold leading-tight tracking-tight text-foreground max-md:sr-only">{title}</h2>
          )}
          {description && <p className="mt-1 text-[15px] text-muted-foreground max-md:mt-0">{description}</p>}
        </header>
      )}
      {children}
    </div>
  )
}

interface SettingsGroupProps {
  title?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  settingId?: string
  bare?: boolean
  children: React.ReactNode
}

export function SettingsGroup({ title, footer, className, settingId, bare, children }: SettingsGroupProps) {
  return (
    <section data-setting-id={settingId} className={cn("flex scroll-mt-6 flex-col gap-2 rounded-[1.25rem]", className)}>
      {title && (
        <h3 className="px-4 text-[13px] uppercase tracking-[0.02em] text-muted-foreground">{title}</h3>
      )}
      {bare ? children : <div className="grouped-list">{children}</div>}
      {footer && <p className="px-4 text-[13px] leading-snug text-muted-foreground">{footer}</p>}
    </section>
  )
}

export function SettingsIcon({
  children,
  color = "#8e8e93",
  size = "md",
  plain,
  className,
}: {
  children: React.ReactNode
  color?: string
  size?: "sm" | "md"
  plain?: boolean
  className?: string
}) {
  if (plain) {
    return (
      <span
        aria-hidden
        className={cn("flex size-[30px] shrink-0 items-center justify-center [&_svg]:size-[22px]", className)}
        style={{ color }}
      >
        {children}
      </span>
    )
  }

  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center text-white",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_-1px_0_rgb(0_0_0/0.08)]",
        size === "sm" ? "size-6 rounded-[7px] [&_svg]:size-3.5" : "size-[30px] rounded-[8px] [&_svg]:size-[18px]",
        className
      )}
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  )
}

const iconRowInset = "[--separator-inset:3.625rem]"
const rowBase = "flex min-h-[3.25rem] items-center gap-3 px-4 py-2.5"

interface RowTextProps {
  label: React.ReactNode
  description?: React.ReactNode
  textId?: string
  tone?: "default" | "destructive"
  dimmed?: boolean
}

function RowText({ label, description, textId, tone = "default", dimmed }: RowTextProps) {
  return (
    <div className={cn("min-w-0 flex-1", dimmed && "opacity-50")}>
      <div
        id={textId && `${textId}-label`}
        className={cn("text-base leading-5", tone === "destructive" ? "text-destructive" : "text-foreground")}
      >
        {label}
      </div>
      {description && (
        <p id={textId && `${textId}-description`} className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}

interface SettingsRowProps {
  label: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  iconColor?: string
  plainIcon?: boolean
  settingId?: string
  control?: React.ReactNode
  stack?: boolean
  textId?: string
  disabled?: boolean
}

export function SettingsRow({
  label,
  description,
  icon,
  iconColor,
  plainIcon,
  settingId,
  control,
  stack,
  textId,
  disabled,
}: SettingsRowProps) {
  const iconTile = icon ? (
    <SettingsIcon color={iconColor} plain={plainIcon} className={cn(disabled && "opacity-50")}>
      {icon}
    </SettingsIcon>
  ) : null
  const text = <RowText label={label} description={description} textId={textId} dimmed={disabled} />

  if (stack) {
    return (
      <div data-setting-id={settingId} className={cn("flex flex-col gap-3 px-4 py-3.5", icon && iconRowInset)}>
        <div className="flex items-center gap-3">
          {iconTile}
          {text}
        </div>
        {control}
      </div>
    )
  }

  return (
    <div data-setting-id={settingId} className={cn(rowBase, icon && iconRowInset)}>
      {iconTile}
      {text}
      {control && <div className="flex shrink-0 items-center gap-2">{control}</div>}
    </div>
  )
}

interface SettingsSwitchRowProps {
  label: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  iconColor?: string
  settingId?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function SettingsSwitchRow({
  label,
  description,
  icon,
  iconColor,
  settingId,
  checked,
  onCheckedChange,
  disabled,
}: SettingsSwitchRowProps) {
  const textId = React.useId()
  return (
    <SettingsRow
      label={label}
      description={description}
      icon={icon}
      iconColor={iconColor}
      settingId={settingId}
      textId={textId}
      disabled={disabled}
      control={
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-labelledby={`${textId}-label`}
          aria-describedby={description ? `${textId}-description` : undefined}
        />
      }
    />
  )
}

type SettingsActionRowProps = {
  label: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  iconColor?: string
  plainIcon?: boolean
  settingId?: string
  value?: React.ReactNode
  tone?: "default" | "destructive"
  disabled?: boolean
} & ({ onClick: () => void; href?: never } | { href: string; onClick?: never })

export function SettingsActionRow({
  label,
  description,
  icon,
  iconColor,
  plainIcon,
  settingId,
  value,
  tone,
  disabled,
  onClick,
  href,
}: SettingsActionRowProps) {
  const className = cn(rowBase, "w-full text-left", pressableRowClassName, icon && iconRowInset)
  const content = (
    <>
      {icon && (
        <SettingsIcon color={iconColor} plain={plainIcon}>
          {icon}
        </SettingsIcon>
      )}
      <RowText label={label} description={description} tone={tone} />
      {value !== undefined && <span className="shrink-0 text-base tabular-nums text-muted-foreground">{value}</span>}
      {href ? (
        <ExternalLink className="size-4 shrink-0 text-muted-foreground/60" />
      ) : tone !== "destructive" ? (
        <ChevronRight className="size-[18px] shrink-0 text-muted-foreground/50" strokeWidth={2.5} />
      ) : null}
    </>
  )

  if (href) {
    return (
      <a data-setting-id={settingId} href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    )
  }

  return (
    <button data-setting-id={settingId} type="button" onClick={onClick} disabled={disabled} className={className}>
      {content}
    </button>
  )
}
