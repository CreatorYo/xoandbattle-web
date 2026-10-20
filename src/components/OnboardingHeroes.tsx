import type { ReactNode } from 'react';
import { Accessibility, Cpu, SunMoon, Users, Volume2 } from 'lucide-react';
import { defaultThemes } from '@/contexts/GameContext';
import { SettingsIcon } from '@/components/ui/settings';
import { Switch } from '@/components/ui/switch';
import { MiniBoard } from '@/components/MiniBoard';
import { cn } from '@/lib/utils';

const CARD_SHADOW = 'shadow-[0_12px_32px_-14px_rgb(0_0_0/0.35),0_0_0_0.5px_rgb(0_0_0/0.06)]';

const WELCOME_TILES = [
  { mark: 'X', color: defaultThemes[0].xColor, offset: '' },
  { mark: 'O', color: defaultThemes[0].oColor, offset: '-ml-3 mt-10' },
];

export function WelcomeHero() {
  return (
    <div className="flex items-start">
      {WELCOME_TILES.map((tile) => (
        <span
          key={tile.mark}
          className={cn(
            'flex size-24 items-center justify-center rounded-[1.75rem] bg-surface text-6xl font-bold leading-none',
            CARD_SHADOW,
            tile.offset
          )}
          style={{ color: tile.color }}
        >
          {tile.mark}
        </span>
      ))}
    </div>
  );
}

const MODE_CARDS = [
  { title: 'Two Player', subtitle: 'Play a friend', icon: Users, color: '#3b82f6', offset: '', levels: false },
  { title: 'AI Mode', subtitle: 'Four levels', icon: Cpu, color: '#22c55e', offset: 'mt-5', levels: true },
];

const DIFFICULTY_DOTS = ['bg-emerald-500', 'bg-sky-500', 'bg-orange-500', 'bg-rose-500'];

export function ModesHero() {
  return (
    <div className="flex items-start gap-3">
      {MODE_CARDS.map((card) => (
        <div
          key={card.title}
          className={cn('flex w-36 flex-col gap-4 rounded-[1.5rem] bg-surface p-4 text-left', CARD_SHADOW, card.offset)}
        >
          <span
            className="flex size-10 items-center justify-center rounded-full"
            style={{ backgroundColor: `${card.color}26`, color: card.color }}
          >
            <card.icon className="size-5" />
          </span>
          <div>
            <p className="text-[15px] font-semibold">{card.title}</p>
            <p className="text-[13px] text-muted-foreground">{card.subtitle}</p>
          </div>
          {card.levels && (
            <div className="flex gap-1.5">
              {DIFFICULTY_DOTS.map((dot) => (
                <span key={dot} className={cn('size-2 rounded-full', dot)} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const HERO_THEMES = [
  { theme: defaultThemes[2], position: '-translate-x-24 translate-y-3' },
  { theme: defaultThemes[0], position: 'z-10 -translate-y-2' },
  { theme: defaultThemes[4], position: 'translate-x-24 translate-y-3' },
];

export function ThemesHero() {
  return (
    <div className="relative flex h-44 w-80 items-center justify-center">
      {HERO_THEMES.map(({ theme, position }) => (
        <div
          key={theme.id}
          className={cn('absolute flex flex-col items-center gap-2 rounded-[1.25rem] bg-surface p-3', CARD_SHADOW, position)}
        >
          <MiniBoard size="md" xColor={theme.xColor} oColor={theme.oColor} />
          <span className="text-[11px] font-semibold text-muted-foreground">{theme.name}</span>
        </div>
      ))}
    </div>
  );
}

function HeroRow({ icon, color, label, children }: { icon: ReactNode; color: string; label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-12 items-center gap-3 px-4 py-2 [--separator-inset:3.625rem]">
      <SettingsIcon color={color}>{icon}</SettingsIcon>
      <span className="flex-1 text-[15px]">{label}</span>
      {children}
    </div>
  );
}

export function SettingsHero() {
  return (
    <div className={cn('grouped-list w-72 text-left', CARD_SHADOW)}>
      <HeroRow icon={<Volume2 />} color="#ff2d55" label="Sound Effects">
        <Switch checked />
      </HeroRow>
      <HeroRow icon={<Accessibility />} color="#0a84ff" label="Reduce Motion">
        <Switch checked={false} />
      </HeroRow>
      <HeroRow icon={<SunMoon />} color="#007aff" label="Appearance">
        <span className="text-[15px] text-muted-foreground">Auto</span>
      </HeroRow>
    </div>
  );
}
