import { lazy, Suspense, useEffect, useState } from "react";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { PreferencesProvider } from "@/contexts/PreferencesProvider";
import { GameProvider } from "@/contexts/GameProvider";
import { Onboarding } from "@/components/Onboarding";
import { PWALaunchScreen } from "@/components/PWALaunchScreen";
import { whenIdle } from "@/lib/lazy";
import Index from "./pages/Index";

const NotFound = lazy(() => import("./pages/NotFound"));
const Toaster = lazy(async () => ({ default: (await import("@/components/ui/sonner")).Toaster }));

function isHomePath() {
  const base = import.meta.env.BASE_URL;
  const path = window.location.pathname;
  return path === base || path === `${base}index.html`;
}

const App = () => {
  const [idle, setIdle] = useState(false);

  useEffect(() => whenIdle(() => setIdle(true)), []);

  return (
    <ThemeProvider>
      <PreferencesProvider>
        <GameProvider>
          <PWALaunchScreen />
          <Onboarding />
          {isHomePath() ? (
            <Index />
          ) : (
            <Suspense fallback={null}>
              <NotFound />
            </Suspense>
          )}
          {idle && (
            <Suspense fallback={null}>
              <Toaster />
            </Suspense>
          )}
        </GameProvider>
      </PreferencesProvider>
    </ThemeProvider>
  );
};

export default App;
