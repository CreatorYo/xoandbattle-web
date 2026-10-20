export const menuContentClassName = [
  "z-50 min-w-52 overflow-hidden rounded-[1.25rem] p-1.5 text-foreground glass-sheet",
  "data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out",
].join(" ")

export const menuItemClassName = [
  "relative flex cursor-default select-none items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] outline-none",
  "transition-colors data-[highlighted]:bg-foreground/8",
  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
  "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
  "data-[variant=destructive]:text-destructive data-[variant=destructive]:data-[highlighted]:bg-destructive/10 data-[variant=destructive]:[&_svg]:text-destructive",
].join(" ")

export const menuSeparatorClassName = "mx-2 my-1 h-px bg-foreground/10"
