import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Input } from '@/components/ui/input';

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
}

export function ColorInput({ value, onChange, label }: ColorInputProps) {
  const colorInputRef = React.useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const isTransparent = value === 'transparent' || !value || value === '';

  const getActualBackgroundColor = () => {
    if (!isTransparent) return value;
    return theme === 'dark' ? '#000000' : '#ffffff';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className="w-8 h-8 rounded-lg border border-border/50 cursor-pointer hover:border-primary/50 transition-[background-color,border-color] duration-200 relative overflow-hidden"
          style={{ backgroundColor: getActualBackgroundColor() }}
          onClick={() => colorInputRef.current?.click()}
        >
          {isTransparent && (
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc),linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc)] bg-[length:8px_8px] [background-position:0_0,4px_4px] opacity-30" />
          )}
        </div>
        <input
          ref={colorInputRef}
          type="color"
          value={isTransparent ? getActualBackgroundColor() : value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute top-0 left-0 w-8 h-8 opacity-0 cursor-pointer"
        />
      </div>
      {!isTransparent && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#FF0000"
          className="h-8 text-xs font-mono bg-background/50 border-border/50 focus-visible:ring-0 focus-visible:border-2 focus-visible:border-primary/50"
        />
      )}
    </div>
  );
}

