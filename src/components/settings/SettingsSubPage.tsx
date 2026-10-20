import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Checkmark } from '@/components/ui/checkmark';
import { SettingsActionRow, SettingsGroup, SettingsPage } from '@/components/ui/settings';
import { pressableRowClassName } from '@/components/ui/row-styles';
import { cn } from '@/lib/utils';
import { useSettingsNav } from './settings-nav';

interface SettingsSubPageProps {
  settingId: string;
  label: string;
  value?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  iconColor?: string;
  pageDescription?: ReactNode;
  children: ReactNode;
}

export function SettingsSubPage({
  settingId,
  label,
  value,
  description,
  icon,
  iconColor,
  pageDescription,
  children,
}: SettingsSubPageProps) {
  const { subPageId, subPageContainer, openSubPage } = useSettingsNav();

  return (
    <>
      <SettingsActionRow
        settingId={settingId}
        icon={icon}
        iconColor={iconColor}
        label={label}
        description={description}
        value={value}
        onClick={() => openSubPage(settingId, label)}
      />
      {subPageId === settingId &&
        subPageContainer &&
        createPortal(
          <SettingsPage title={label} description={pageDescription}>
            {children}
          </SettingsPage>,
          subPageContainer
        )}
    </>
  );
}

interface PickerOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  preview?: ReactNode;
}

interface SettingsPickerProps<T extends string> extends Omit<SettingsSubPageProps, 'value' | 'children'> {
  value: T;
  onValueChange: (value: T) => void;
  options: PickerOption<T>[];
  footer?: ReactNode;
  children?: ReactNode;
}

const ARROW_STEPS: Record<string, number> = {
  ArrowUp: -1,
  ArrowLeft: -1,
  ArrowDown: 1,
  ArrowRight: 1,
};

export function SettingsPicker<T extends string>({
  value,
  onValueChange,
  options,
  footer,
  children,
  ...row
}: SettingsPickerProps<T>) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const focusIndex = Math.max(selectedIndex, 0);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = ARROW_STEPS[event.key];
    if (!step) return;
    event.preventDefault();
    const index = (focusIndex + step + options.length) % options.length;
    onValueChange(options[index].value);
    itemRefs.current[index]?.focus();
  };

  return (
    <SettingsSubPage {...row} value={options[selectedIndex]?.label}>
      <SettingsGroup footer={footer} bare>
        <div role="radiogroup" aria-label={row.label} onKeyDown={handleKeyDown} className="grouped-list">
          {options.map((option, index) => {
            const checked = index === selectedIndex;
            return (
              <button
                key={option.value}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                type="button"
                role="radio"
                aria-checked={checked}
                tabIndex={index === focusIndex ? 0 : -1}
                onClick={() => onValueChange(option.value)}
                className={cn(
                  'flex min-h-[3.25rem] w-full items-center gap-3 px-4 py-2.5 text-left',
                  pressableRowClassName,
                  option.preview !== undefined && '[--separator-inset:4.25rem]'
                )}
              >
                {option.preview !== undefined && (
                  <span aria-hidden className="flex w-10 shrink-0 items-center justify-center">
                    {option.preview}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-base leading-5 text-foreground">{option.label}</span>
                  {option.description && (
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">
                      {option.description}
                    </span>
                  )}
                </span>
                <Checkmark className={cn('text-brand', !checked && 'invisible')} />
              </button>
            );
          })}
        </div>
      </SettingsGroup>
      {children}
    </SettingsSubPage>
  );
}
