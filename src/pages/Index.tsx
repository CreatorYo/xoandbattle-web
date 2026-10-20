import { lazy, Suspense, useState, useSyncExternalStore } from "react";
import { GameLayout } from "@/components/GameLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { isAppPromptDismissed } from "@/lib/app-prompt";
import { hasSeenOnboarding, subscribeToOnboarding } from "@/lib/onboarding";

const MobileAppPrompt = lazy(async () => ({ default: (await import("@/components/MobileAppPrompt")).MobileAppPrompt }));

const Index = () => {
  const isMobile = useIsMobile();
  const onboardingSeen = useSyncExternalStore(subscribeToOnboarding, hasSeenOnboarding);
  const [promptDismissed] = useState(isAppPromptDismissed);

  return (
    <>
      <GameLayout />
      {isMobile && onboardingSeen && !promptDismissed && (
        <Suspense fallback={null}>
          <MobileAppPrompt />
        </Suspense>
      )}
    </>
  );
};

export default Index;
