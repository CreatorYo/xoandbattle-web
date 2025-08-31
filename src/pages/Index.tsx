import { useState } from 'react';
import { GameLayout } from "@/components/GameLayout";
import { MobileAppPrompt } from "@/components/MobileAppPrompt";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  const [showMobilePrompt, setShowMobilePrompt] = useState(true);

  const handleContinueOnWeb = () => {
    setShowMobilePrompt(false);
  };

  return (
    <>
      {/* Always show the game */}
      <GameLayout />
      
      {/* Show mobile prompt as overlay if on mobile and not dismissed */}
      {isMobile && showMobilePrompt && (
        <MobileAppPrompt onContinue={handleContinueOnWeb} />
      )}
    </>
  );
};

export default Index;
