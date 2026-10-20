export const DEFAULT_X_SYMBOL = 'X';
export const DEFAULT_O_SYMBOL = 'O';

export function getSymbols(theme: { xSymbol?: string; oSymbol?: string }) {
  return {
    x: theme.xSymbol?.trim() || DEFAULT_X_SYMBOL,
    o: theme.oSymbol?.trim() || DEFAULT_O_SYMBOL,
  };
}
