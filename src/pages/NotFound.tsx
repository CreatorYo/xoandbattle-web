import { House } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MiniBoard } from "@/components/MiniBoard";

const NotFound = () => (
  <main className="flex min-h-dvh items-center justify-center bg-background p-6">
    <div className="flex w-full max-w-sm flex-col items-center text-center">
      <div className="rounded-2xl bg-surface p-5">
        <MiniBoard
          size="md"
          xColor="var(--muted-foreground)"
          oColor="var(--muted-foreground)"
          pattern={["X", "O", "X", "O", null, "O", "X", "O", "X"]}
        />
      </div>
      <p className="mt-6 font-mono text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">This square is empty</h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Button variant="primary" size="lg" className="mt-8 w-full" asChild>
        <a href={import.meta.env.BASE_URL}>
          <House />
          Back to the game
        </a>
      </Button>
    </div>
  </main>
);

export default NotFound;
