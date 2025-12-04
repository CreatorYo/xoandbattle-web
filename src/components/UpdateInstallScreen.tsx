import { Loader2, Download } from 'lucide-react';

export function UpdateInstallScreen() {
  return (
    <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-md flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Download className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Installing update...</h2>
          <p className="text-sm text-muted-foreground max-w-sm">Please wait while we update the app to the latest version</p>
        </div>
      </div>
    </div>
  );
}

