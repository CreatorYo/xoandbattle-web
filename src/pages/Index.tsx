import { useState } from 'react';
import { GameLayout } from "@/components/GameLayout";
import { MobileAppPrompt } from "@/components/MobileAppPrompt";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  const [showMobilePrompt, setShowMobilePrompt] = useState(isMobile);

  const handleContinueOnWeb = () => {
    setShowMobilePrompt(false);
  };

  if (showMobilePrompt && isMobile) {
    return <MobileAppPrompt onContinue={handleContinueOnWeb} />;
  }

  return <GameLayout />;
};

export default Index;
